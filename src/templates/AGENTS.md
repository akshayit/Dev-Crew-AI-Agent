# AGENTS.md

Shared instructions for every AI coding tool in this repo (Claude Code, GitHub Copilot, others).
This file is the source of truth. Keep it short and specific.

## Project
<!-- Fill in. One paragraph: what this product is and who it is for. -->

## Stack
<!-- Fill in. Example: Node.js/Express, Next.js, PostgreSQL, BullMQ. -->

## Commands
<!-- Replace with the real commands. Agents run these before saying "done". -->
- Install: `npm install`
- Dev: `npm run dev`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Test: `npm test`

## Conventions
<!-- Fill in or let the analyst agent draft it from the repo. Examples:
- API routes live in src/routes, validated with Zod
- Components in src/components, data fetching through src/lib/api
- Tests sit next to the code as *.test.ts -->

## Never
- Commit secrets or `.env` files.
- Build SQL from user input by string concatenation.
- Skip or weaken a failing test to get green.
- Change files unrelated to the current task.

## Crew roles
Each role has an agent file (`.claude/agents/` or `.github/agents/`) and a command.

| Role | Command | Does |
|---|---|---|
| analyst | `analyze` | Requirement to scope, risks, open questions in `docs/blueprint.md` |
| planner | `plan` | Weekly demo-able slices and tasks in `docs/sprint-plan.md`; waits for approval |
| backend | `build` | Implements an approved backend task |
| frontend | `build` | Implements an approved frontend task |
| tester | `test` | Unit, integration and end-to-end tests with the repo's own framework |
| reviewer | `review` | Reviews the whole diff; APPROVE or REQUEST CHANGES |
| (report) | `report` | Client-ready weekly update and demo steps |

## Workflow
1. `analyze`: understand the requirement; answer the open questions.
2. `plan`: review and approve the sprint plan. Nothing is built before approval.
3. `build` one task at a time, then `test`, then `review`.
4. `report` at the end of each week.

## Shared memory
Project knowledge lives in files, never only in chat, so any tool can pick up where another stopped:
- `docs/blueprint.md`: goal, scope, risks, questions
- `docs/sprint-plan.md`: weeks, tasks, status
- `docs/decisions.md`: architecture decisions

At the end of every session, update the status in `docs/sprint-plan.md`.
