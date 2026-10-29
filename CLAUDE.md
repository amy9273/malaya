# Application Building Context — Malaya (Mobile-First Webtoon & Manhwa Reader OS)

Read the following files in order before implementing or making any architectural decision:

1. `context/project-overview.md` — Product definition, mobile webtoon reading behavior, core user flows, feature scope, and success criteria.
2. `context/architecture.md` — System structure, boundaries (Next.js 15 PWA, MangaDex API, Image Proxy, Supabase), storage model, and invariants.
3. `context/security-best-practices.md` — Mandatory security rules, secrets management, SSRF proxy hardening, CSP, and repository hygiene.
4. `context/engineering-best-practices.md` — Master coding, architecture, performance, debounced scroll persistence, memory limits, and database best practices.
5. `context/ui-context.md` — Dark webtoon aesthetic, semantic status colors, mobile touch ergonomics, zero-gap continuous strip rules, and 4-state UI consistency.
6. `context/code-standards.md` — Implementation rules for Next.js 15 (App Router), TypeScript 5.7+, Tailwind CSS + CI/CD quality gates.
7. `context/ai-workflow-rules.md` — Development workflow, spec adherence, and verification rules.
8. `context/progress-tracker.md` — Current phase, completed work, open questions, and next steps.

---

### Operating Rules

- Update `context/progress-tracker.md` after each meaningful implementation change.
- Work strictly against the current unit spec in `context/specs/`.
- If implementation changes architecture, scope, or standards, update the relevant context file before continuing.
- Never violate the architectural invariants in `context/architecture.md` or security rules in `context/security-best-practices.md`.
- Never commit secrets, keys, or `.env` files into source control.
- Never proceed to the next unit without explicit user consent.
