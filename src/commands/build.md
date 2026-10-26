---
description: Implement one approved task from docs/sprint-plan.md with the right engineer role, then verify
hint: <task id, e.g. T003>
---

Implement task: $ARGUMENTS

1. Open `docs/sprint-plan.md` and find the task. If it is missing or the plan is not approved, stop and tell me.
2. Pick the role by the task's area: **backend** or **frontend** (see `AGENTS.md` and the matching agent file) and follow its rules.
3. Find the closest existing example in the repo and follow its conventions.
4. Implement, then run the lint, typecheck and test commands listed in `AGENTS.md`. Fix failures you caused. If checks still fail after two honest attempts, stop and report.
5. Update the task status and add one line (what changed, how to verify) in `docs/sprint-plan.md`.

Finish with: files changed, commands run and their results, and anything not verified.
