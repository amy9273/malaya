# Security Best Practices — Malaya

This document defines the mandatory security rules, code hygiene standards, repository safeguards, and infrastructure protections for the Malaya platform. All AI agents and human contributors must adhere strictly to these practices.

---

## 1. Secrets & Repository Management Discipline

### 1.1 The Golden Rule: Zero Secrets in Source Control

- **Never commit credentials**: Under no circumstances should an API key, database connection string, service role secret, private key, JWT secret, or authentication token be committed into Git history.
- **No secrets in comments or tests**: Never write mock secrets that resemble live tokens or commit real production/development keys inside unit tests, seeds, or documentation.
- **History is permanent**: Simply deleting a secret in a subsequent commit does **NOT** secure it; Git history retains every byte. If a key is committed, it must be considered **compromised immediately**, invalidated, and rotated in the provider dashboard (Supabase, Vercel, Cloudflare, GitHub).

### 1.2 Environment Variable Isolation (`NEXT_PUBLIC_` Boundary)

Next.js statically inlines any environment variable starting with `NEXT_PUBLIC_` directly into the client-side JavaScript bundle visible to any user who inspects the browser source code:

| Variable Type                | Allowed Prefix | Example Usage                                                   | Permitted in Client Bundle? |
| :--------------------------- | :------------- | :-------------------------------------------------------------- | :-------------------------- |
| **Public Config**            | `NEXT_PUBLIC_` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_APP_URL`               | ✅ YES (Public by design)   |
| **Sensitive Server Secrets** | **NO PREFIX**  | `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `REDIS_REST_TOKEN` | ❌ NEVER (Server-only)      |

- **Invariant**: Never prefix database connection credentials or administrative service role keys with `NEXT_PUBLIC_`.
- **Runtime Verification**: In Server Components, Server Actions, and Route Handlers, access server secrets via `process.env.SECRET_NAME` and verify they are never passed down as props to Client Components (`"use client"`).

### 1.3 Repository Safeguards & Secret Leak Prevention

1. **Hardened `.gitignore`**: All `.env*` files (except `.env.example`), `*.key`, `*.pem`, `service-account*.json`, and credential artifacts are excluded from tracking.
2. **GitHub Push Protection & Secret Scanning**:
   - Enable GitHub Secret Scanning and Push Protection on the `amy9273/malaya` repository settings to automatically reject pushes containing detected token patterns.
3. **Pre-Commit Secret Scanning**:
   - Implement automated pre-commit scanning (via `husky` + `lint-staged` with `gitleaks` or custom regex scanners) to block accidental commits before they leave the developer machine.
4. **Triage for Accidental Exposure**:
   - If a secret is ever pushed, immediately rotate the credential at the source.
   - Purge the commit using `git-filter-repo` or BFG Repo-Cleaner before force-pushing, and report the rotation in `context/progress-tracker.md`.

---

## 2. Image Proxy & SSRF (Server-Side Request Forgery) Hardening

Because Malaya operates an Image Proxy (`/api/proxy-image`) to fetch webtoon chapter panels and bypass scanlator hotlink restrictions, the proxy endpoint is an **SSRF attack vector** if not strictly guarded.

### 2.1 Attack Surface

Without validation, an attacker could supply `url=http://169.254.169.254/latest/meta-data/` to extract cloud instance credentials, or `url=http://localhost:5432/` to probe internal database ports.

### 2.2 Mandatory Proxy Invariants

The proxy implementation must enforce all 5 layers of defense:

1. **Protocol Restriction**:
   - Only `https:` protocols are permitted. Reject `http:`, `file:`, `ftp:`, `javascript:`, or `data:`.
2. **Private Network & Metadata IP Blocking**:
   - Parse the hostname and resolve DNS before fetching.
   - Reject all loopback, local, and private address ranges:
     - `127.0.0.0/8` (Loopback)
     - `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` (RFC 1918 Private)
     - `169.254.169.254` (Cloud Metadata Endpoint)
     - `::1`, `fc00::/7`, `fe80::/10` (IPv6 local/private)
3. **Domain Whitelist / Source Validation**:
   - Validate target image hosts against trusted CDN patterns (e.g. `*.mangadex.org`, `uploads.mangadex.org`, and verified scan CDN origins). Reject arbitrary external hostnames.
4. **MIME-Type & Payload Validation**:
   - Verify the upstream `Content-Type` header matches standard image formats: `image/jpeg`, `image/png`, `image/webp`, `image/avif`.
   - **Reject `image/svg+xml`**: SVG images can contain embedded JavaScript `<script>` tags that execute in the user's browser, leading to Stored Cross-Site Scripting (XSS).
5. **Payload Size Bounds**:
   - Enforce a hard maximum content-length limit (e.g. 15MB per panel) to prevent decompression bombs and memory exhaustion attacks.
   - Disallow following arbitrary open redirects from third-party hosts.

---

## 3. Authentication & Session Security (Supabase Auth)

1. **Cookie Security**:
   - Store session tokens in `HttpOnly`, `Secure`, `SameSite=Lax` cookies managed by `@supabase/ssr`.
   - Never store JWT tokens in `localStorage` or `sessionStorage` where they are vulnerable to XSS exfiltration.
2. **Row-Level Security (RLS)**:
   - Every database table in PostgreSQL (`User`, `LibraryEntry`, `ReadingHistory`, `Bookmark`) must have RLS enabled:
     ```sql
     ALTER TABLE "LibraryEntry" ENABLE ROW LEVEL SECURITY;
     CREATE POLICY "Users can only access own library" ON "LibraryEntry"
       FOR ALL USING (auth.uid() = user_id);
     ```
3. **Session Verification in Middleware**:
   - Protect private routes (`/library`, `/settings`, `/profile`) via Next.js Edge Middleware verifying valid Supabase user sessions before rendering page trees.

---

## 4. API & Denial of Service (DoS) Defense

1. **Rate Limiting**:
   - Protect API endpoints (`/api/proxy-image`, search routes, library mutations) using a rate limiter (Upstash Redis Sliding Window) to prevent scraping, bot flooding, and bandwidth exhaustion.
2. **Query Input Sanitization**:
   - Validate all incoming query parameters and JSON payloads using **Zod** schemas before executing business logic.
   - Never pass unvalidated user strings into database queries or raw fetch calls.
3. **SQL Injection Prevention**:
   - Utilize Prisma ORM parameterized queries for all database interactions.
   - Disallow raw query string concatenation (`prisma.$queryRawUnsafe`). If raw SQL is ever necessary, use parameterized template literals (`prisma.$queryRaw\`SELECT * FROM users WHERE id = ${id}\``).

---

## 5. HTTP Security Headers (Next.js Config)

Configure standard security headers in `next.config.mjs` for all production traffic:

```javascript
// next.config.mjs
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Frame-Options', value: 'DENY' }, // Prevents clickjacking
  { key: 'X-Content-Type-Options', value: 'nosniff' }, // Blocks MIME-sniffing
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
];
```

---

## 6. Dependency & Supply Chain Integrity

1. **Automated Audits**:
   - Run `npm audit` on every build and CI cycle. Fix high and critical severity vulnerabilities promptly.
2. **Lockfile Enforcement**:
   - Always commit `package-lock.json`. In production and CI pipelines, install dependencies using `npm ci` rather than `npm install` to ensure byte-for-byte reproducible dependency trees.
3. **Minimal Dependencies**:
   - Avoid installing speculative or abandoned npm packages. Prioritize established, well-maintained libraries with active security advisories.
