# CLAUDE.md

Read `AGENTS.md` first. It holds the project's stack, commands, conventions and crew workflow.

Claude Code specifics:
- Crew roles are subagents in `.claude/agents/`. Slash commands are in `.claude/commands/`: `/analyze`, `/plan`, `/build`, `/test`, `/review`, `/report`.
- Use plan mode for `/plan`. Do not write source code until the plan is approved.
