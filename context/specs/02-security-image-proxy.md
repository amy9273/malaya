# Unit 02: Hardened Image Proxy & SSRF Defense — Malaya

This specification details the architecture, SSRF defense validator, route handler implementation, and security test suite for `/api/proxy-image`.

---

## 1. Scope & Objectives

1. **SSRF Validator Utility (`src/lib/security/ssrf-validator.ts`)**:
   - **Protocol Enforcement**: Strictly require `https:`. Reject `http:`, `file:`, `ftp:`, `javascript:`, or `data:`.
   - **IP Format Prohibition**: Reject direct numeric IP hostnames (e.g. `169.254.169.254`, `127.0.0.1`, `[::1]`).
   - **Private & Loopback Range Filtering**:
     - Loopback: `127.0.0.0/8`, `::1`
     - RFC 1918 Private: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`
     - Cloud Metadata & Link-Local: `169.254.169.254`, `169.254.0.0/16`, `fe80::/10`
   - **Domain Whitelisting**: Validate that the target hostname matches approved MangaDex and legitimate webtoon CDN origins (`uploads.mangadex.org`, `*.mangadex.org`, `*.mangadex.network`).
   - **MIME-Type & Payload Validation**: Allow only standard raster image types (`image/jpeg`, `image/png`, `image/webp`, `image/avif`). Strictly reject `image/svg+xml` (preventing Stored XSS) and non-image payloads.
   - **Size Bounds**: Enforce a 15MB maximum content-length cap to prevent decompression bombs.

2. **Secure Proxy Route Handler (`src/app/api/proxy-image/route.ts`)**:
   - Accepts `url` and optional `referer` search parameters.
   - Runs the target URL through `validateProxyUrl`.
   - Dispatches fetch with appropriate upstream headers (`User-Agent`, `Referer: https://mangadex.org/`).
   - Sets hardened response headers:
     - `Content-Type`: Upstream MIME type.
     - `Cache-Control`: `public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400` (browser and CDN edge caching).
     - `X-Content-Type-Options`: `nosniff`.

3. **Automated Unit & Security Tests (`src/lib/security/__tests__/ssrf-validator.test.ts`)**:
   - Verify rejection of `http://` unencrypted protocols.
   - Verify rejection of `http://169.254.169.254/latest/meta-data/`.
   - Verify rejection of `http://127.0.0.1:5432/` and `http://localhost/`.
   - Verify rejection of non-whitelisted arbitrary domains (`https://malicious-site.com/exploit.png`).
   - Verify acceptance of legitimate MangaDex image URLs (`https://uploads.mangadex.org/data/hash/page.jpg`).
   - Verify rejection of SVG payloads.

---

## 2. Invariants & Security Rules

1. **SSRF Invariant (`context/architecture.md` Invariant 1)**:
   - The proxy must never forward a request to internal loopback, private subnets, or cloud metadata endpoints.
2. **SVG Execution Invariant (`context/security-best-practices.md`)**:
   - The proxy must never serve `image/svg+xml` content types to prevent cross-site scripting.
3. **No Secret Invariant**:
   - The proxy operates as a pure stateless media relay and must never accept, forward, or expose internal server tokens or database credentials.

---

## 3. Verification & Acceptance Criteria

- `npm run format:check` runs cleanly with 0 formatting warnings.
- `npm run typecheck` passes with 0 TypeScript compiler errors.
- `npm run lint` passes with 0 ESLint warnings or errors.
- Automated security tests execute and pass 100%.
- `npm run build` succeeds cleanly.
