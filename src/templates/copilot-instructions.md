# Copilot instructions

Read `AGENTS.md` first. It holds the project's stack, commands, conventions and crew workflow.

GitHub Copilot specifics:
- Crew roles are custom agents in `.github/agents/`. Reusable prompts are in `.github/prompts/`: analyze, plan, build, test, review, report.
- For planning, do not edit source code until the plan in `docs/sprint-plan.md` is approved.
- Follow the existing code style; match the nearest similar file.
