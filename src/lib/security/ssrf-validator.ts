/**
 * SSRF and Security Validation Utilities for Malaya Image Proxy
 * Adheres strictly to context/security-best-practices.md
 */

// Permitted upstream CDN domains for MangaDex and verified media networks
const ALLOWED_HOSTNAME_PATTERNS: RegExp[] = [
  /^uploads\.mangadex\.org$/i,
  /^([a-z0-9-]+\.)?mangadex\.org$/i,
  /^([a-z0-9-]+\.)?mangadex\.network$/i,
];

// Disallowed internal and private IP ranges / hostnames
const DISALLOWED_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '169.254.169.254', // AWS/GCP/Azure instance metadata
  'metadata.google.internal',
]);

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]);

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedUrl?: URL;
}

/**
 * Validates a target URL against SSRF vulnerabilities before fetching upstream.
 */
export function validateProxyUrl(rawUrl: string | null | undefined): ValidationResult {
  if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '') {
    return { isValid: false, error: 'Target URL is required' };
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return { isValid: false, error: 'Malformed target URL' };
  }

  // 1. Protocol Restriction: Only HTTPS is permitted
  if (parsed.protocol !== 'https:') {
    return {
      isValid: false,
      error: `Insecure protocol "${parsed.protocol}". Only "https:" is allowed.`,
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // 2. Immediate Blocklist Check (Localhost & Metadata endpoints)
  if (DISALLOWED_HOSTNAMES.has(hostname)) {
    return {
      isValid: false,
      error: `Forbidden target host: "${hostname}". Access to private or local networks is denied.`,
    };
  }

  // 3. Reject Direct Numeric IPv4 / IPv6 Addresses (Anti-SSRF)
  const isIpv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  const isIpv6 = hostname.includes(':') || hostname.startsWith('[');
  if (isIpv4 || isIpv6) {
    return {
      isValid: false,
      error: 'Direct IP hostnames are forbidden. Domain name required.',
    };
  }

  // 4. Approved Domain Whitelist Check
  const isAllowedDomain = ALLOWED_HOSTNAME_PATTERNS.some((pattern) =>
    pattern.test(hostname),
  );

  if (!isAllowedDomain) {
    return {
      isValid: false,
      error: `Host "${hostname}" is not on the approved media source whitelist.`,
    };
  }

  // 5. Port Restriction (Only standard HTTPS port 443 permitted)
  if (parsed.port && parsed.port !== '443') {
    return {
      isValid: false,
      error: `Non-standard port "${parsed.port}" is not permitted.`,
    };
  }

  return {
    isValid: true,
    sanitizedUrl: parsed,
  };
}

/**
 * Validates that an upstream response's Content-Type header is a safe raster image.
 * Explicitly rejects SVG (to prevent XSS) and non-image payloads.
 */
export function validateImageContentType(contentTypeHeader: string | null): boolean {
  if (!contentTypeHeader) return false;

  // Extract base MIME type (e.g. "image/jpeg; charset=utf-8" -> "image/jpeg")
  const baseType = contentTypeHeader.split(';')[0]?.trim().toLowerCase();
  if (!baseType) return false;

  // Hard prohibition against SVG (Stored XSS vector)
  if (baseType === 'image/svg+xml') {
    return false;
  }

  return ALLOWED_MIME_TYPES.has(baseType);
}
