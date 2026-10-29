# Agent Operating Guidelines — Malaya

This file mirrors `CLAUDE.md` and provides instructions for all AI coding agents operating on the Malaya codebase.

Consult and adhere to the context documentation in the following sequence:

1. `context/project-overview.md` — Product definition, domain rules, mobile ergonomics.
2. `context/architecture.md` — System structure, boundaries, and architectural invariants.
3. `context/security-best-practices.md` — Secrets protection, SSRF prevention, security headers.
4. `context/engineering-best-practices.md` — Performance, debounced scroll tracking, memory limits.
5. `context/ui-context.md` — Obsidian dark theme, mobile touch ergonomics, 4-state UI rules.
6. `context/code-standards.md` — Next.js 15, TypeScript 5.7+, Tailwind CSS standards.
7. `context/ai-workflow-rules.md` — Spec-driven discipline, quality gates, upstream sync.
8. `context/progress-tracker.md` — Current milestone, completed units, test records.

### Imperative Directives
- **Zero Secrets**: Never stage, commit, or push `.env` files or hardcoded credentials.
- **Spec-Driven**: Never write code without reading the active unit specification in `context/specs/`.
- **One Unit at a Time**: Complete, verify, and await explicit user approval before advancing.
- **No Direct Push to Main**: Isolate all work on feature branches (`feat/unit-NN-...`).
