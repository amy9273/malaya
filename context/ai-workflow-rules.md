# AI Workflow Rules — Malaya

These rules govern how AI coding agents must operate while building and maintaining the Malaya platform. They are imperative rules, not suggestions.

---

## 1. Spec-Driven Discipline

- **Never code without a spec**: Before writing or modifying any implementation code, read the active unit spec in `context/specs/NN-[feature-name].md`.
- **Stay in scope**: Implement only what the spec demands. Do not add speculative "nice-to-have" features or install unapproved packages.
- **Consult invariants**: Check every change against `context/architecture.md` and `context/security-best-practices.md` invariants before concluding a unit.

---

## 2. Scoping & Execution Discipline

- **One Unit at a Time**: Work on a single, isolated unit per cycle. Complete and verify it before moving to the next.
- **Explicit Consent Before Proceeding**: Never automatically proceed to the next unit without explicit user consent. Complete, test, and present the current unit's deliverables, and wait for the user to approve moving forward.
- **Always Sync Upstream First**:
  - Before starting any new unit, ensure local `main` matches `origin/main` (`git fetch origin main && git pull origin main`).
  - Branch from updated `main` (`git checkout -b feat/unit-NN-description origin/main`).
- **Never commit to `main`**: AI agents must **NEVER** commit or push directly to `main`. All work must be isolated on a feature branch.
- **Never bypass errors**: If a TypeScript or compilation error occurs, fix the root cause. Never cast to `any` or suppress linter errors with `@ts-ignore`.
- **Keep Documentation in Sync**:
  - Update `context/progress-tracker.md` when starting and finishing a unit.
  - If a technical or architectural decision evolves during implementation, update the relevant context files immediately.

---

## 3. Background Task & Process Management

- **No Orphaned Background Tasks**: Track all running background processes (dev servers, tests, simulators).
- **Mandatory Kill on Completion**: When a test or verification command completes or times out, immediately kill it to prevent orphaned processes or port collisions.
- **Active Verification**: Before concluding any turn, verify that no stray background tasks remain active.
