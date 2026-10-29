import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateProxyUrl, validateImageContentType } from '../ssrf-validator';

describe('SSRF Validator — Protocol & Format Enforcement', () => {
  it('rejects empty or null URLs', () => {
    assert.equal(validateProxyUrl(null).isValid, false);
    assert.equal(validateProxyUrl('').isValid, false);
    assert.equal(validateProxyUrl('   ').isValid, false);
  });

  it('rejects insecure http:// URLs', () => {
    const res = validateProxyUrl('http://uploads.mangadex.org/data/hash/page.jpg');
    assert.equal(res.isValid, false);
    assert.match(res.error || '', /insecure protocol/i);
  });

  it('rejects file://, ftp://, and data: schemes', () => {
    assert.equal(validateProxyUrl('file:///etc/passwd').isValid, false);
    assert.equal(validateProxyUrl('ftp://uploads.mangadex.org/data').isValid, false);
    assert.equal(validateProxyUrl('data:image/png;base64,xxxx').isValid, false);
  });

  it('rejects malformed URLs', () => {
    const res = validateProxyUrl('not-a-valid-url');
    assert.equal(res.isValid, false);
    assert.match(res.error || '', /malformed/i);
  });
});

describe('SSRF Validator — Private Network & Metadata Blocking', () => {
  it('blocks loopback IP addresses (127.0.0.1 and localhost)', () => {
    const localhostRes = validateProxyUrl('https://localhost/exploit.jpg');
    assert.equal(localhostRes.isValid, false);
    assert.match(localhostRes.error || '', /forbidden target host/i);

    const ipRes = validateProxyUrl('https://127.0.0.1:443/exploit.jpg');
    assert.equal(ipRes.isValid, false);
    assert.match(ipRes.error || '', /forbidden target host/i);
  });

  it('blocks cloud metadata endpoints (169.254.169.254)', () => {
    const metadataRes = validateProxyUrl('https://169.254.169.254/latest/meta-data/');
    assert.equal(metadataRes.isValid, false);
    assert.match(metadataRes.error || '', /forbidden target host/i);
  });

  it('blocks direct numeric IPv4 and IPv6 addresses', () => {
    const ipRes = validateProxyUrl('https://192.168.1.1/router.jpg');
    assert.equal(ipRes.isValid, false);
    assert.match(ipRes.error || '', /direct ip hostnames are forbidden/i);

    const privateRes = validateProxyUrl('https://10.0.0.1/internal.jpg');
    assert.equal(privateRes.isValid, false);
    assert.match(privateRes.error || '', /direct ip hostnames are forbidden/i);
  });

  it('rejects non-standard ports', () => {
    const res = validateProxyUrl('https://uploads.mangadex.org:8080/data/test.jpg');
    assert.equal(res.isValid, false);
    assert.match(res.error || '', /non-standard port/i);
  });
});

describe('SSRF Validator — Domain Whitelisting', () => {
  it('permits valid MangaDex upload CDN domains', () => {
    const res = validateProxyUrl('https://uploads.mangadex.org/data/a6b8/1-test.jpg');
    assert.equal(res.isValid, true);
    assert.equal(res.sanitizedUrl?.hostname, 'uploads.mangadex.org');
  });

  it('permits MangaDex subdomains and network nodes', () => {
    const res = validateProxyUrl('https://cmd.mangadex.org/data/test.png');
    assert.equal(res.isValid, true);

    const networkRes = validateProxyUrl('https://s2.mangadex.network/data/test.webp');
    assert.equal(networkRes.isValid, true);
  });

  it('rejects arbitrary external domains not on whitelist', () => {
    const res = validateProxyUrl('https://malicious-site.com/exploit.jpg');
    assert.equal(res.isValid, false);
    assert.match(res.error || '', /approved media source whitelist/i);

    const evilGoogle = validateProxyUrl('https://google.com/test.png');
    assert.equal(evilGoogle.isValid, false);
  });
});

describe('Content-Type Validator — MIME Type Hardening', () => {
  it('allows standard raster image types', () => {
    assert.equal(validateImageContentType('image/jpeg'), true);
    assert.equal(validateImageContentType('image/png'), true);
    assert.equal(validateImageContentType('image/webp'), true);
    assert.equal(validateImageContentType('image/avif'), true);
    assert.equal(validateImageContentType('image/jpeg; charset=utf-8'), true);
  });

  it('strictly rejects SVG images (XSS prevention)', () => {
    assert.equal(validateImageContentType('image/svg+xml'), false);
    assert.equal(validateImageContentType('image/svg+xml; charset=utf-8'), false);
  });

  it('rejects non-image MIME types', () => {
    assert.equal(validateImageContentType('text/html'), false);
    assert.equal(validateImageContentType('application/json'), false);
    assert.equal(validateImageContentType('application/javascript'), false);
    assert.equal(validateImageContentType(null), false);
    assert.equal(validateImageContentType(''), false);
  });
});
