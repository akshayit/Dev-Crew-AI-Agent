---
description: Review the current diff for correctness, security and convention drift; return APPROVE or REQUEST CHANGES
hint: <optional: branch or task id>
---

Act as the **reviewer** role (see `AGENTS.md` and the reviewer agent file).

Scope: $ARGUMENTS

Review the whole diff against the acceptance criteria in `docs/sprint-plan.md`. Run lint, typecheck and tests if not already green. Reply with the verdict, blocking issues (file, line, why), non-blocking suggestions, and what you could and could not verify. Do not edit files.
