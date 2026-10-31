# Devcrew

**A plug-and-play AI dev crew for Claude Code and GitHub Copilot.**
One command drops a planner, backend and frontend engineers, a tester and a reviewer into any repo, plus a file-based sprint workflow so you can deliver something demo-able every week.

```bash
npx github:<your-username>/devcrew init
```

No dependencies. Works on new projects and existing codebases.

## Why

AI coding tools are great at writing code and bad at project discipline: they guess requirements, ignore the repo's conventions, and forget everything between sessions. devcrew fixes that with three ideas:

1. **Plan first, approval gate.** The planner writes the sprint plan and stops. Nothing is built until you approve it.
2. **Follow the repo.** Every engineer agent must find the closest existing example and copy its conventions. Tests use the repo's own framework (Vitest/Jest, pytest, PHPUnit, ...).
3. **Memory in files, not chat.** Blueprint, sprint plan and decisions live in `docs/`. Claude Code and Copilot read the same files, so you can switch tools when one runs out of tokens.

## What gets installed

```
AGENTS.md                         shared rules, commands, conventions (edit this first)
CLAUDE.md                         points Claude Code at AGENTS.md
.github/copilot-instructions.md   points Copilot at AGENTS.md
.claude/agents/*.md               crew as Claude Code subagents
.claude/commands/*.md             /analyze /plan /build /test /review /report
.github/agents/*.agent.md         crew as Copilot custom agents
.github/prompts/*.prompt.md       same commands as Copilot prompt files
docs/blueprint.md                 goal, scope, risks, open questions
docs/sprint-plan.md               weeks, tasks, status
docs/decisions.md                 architecture decisions
```

Existing files are never overwritten unless you pass `--force`.

## The crew

| Role | Command | Does |
|---|---|---|
| analyst | `analyze` | Requirement to scope, assumptions, risks, open questions (read-only) |
| planner | `plan` | Weekly demo-able slices and tasks; waits for your approval |
| backend | `build` | Implements an approved backend task in the repo's style |
| frontend | `build` | Implements an approved frontend task in the repo's style |
| tester | `test` | Unit, integration and end-to-end tests; honest pass/fail |
| reviewer | `review` | Reviews the whole diff, returns APPROVE or REQUEST CHANGES |
| report | `report` | Client-ready weekly update with demo steps |

## Workflow

```
/analyze <requirement>   -> you answer the open questions
/plan <goal>             -> you approve docs/sprint-plan.md
/build T001              -> /test T001 -> /review
/report 1                -> send the weekly update
```

In Copilot, run the same prompts from the prompt picker (or chat with `#prompt` files) and select the matching agent.

## Options

```bash
devcrew init                 # install for both tools
devcrew init --claude        # Claude Code only
devcrew init --copilot       # Copilot only
devcrew init --force         # overwrite existing files
devcrew init --dir ../app    # install into another folder
```

## Customize

- Edit `AGENTS.md`: project description, stack, real lint/test commands, conventions, "never" rules.
- Edit any agent in `src/agents/` and re-run `devcrew init --force`, or edit the installed copies directly.
- Add your own role: create `src/agents/<name>.md` with `name`, `description` and optional `claude_tools` in the frontmatter.

## Notes

- Agent and prompt file formats of Claude Code and GitHub Copilot evolve. If a field is not recognised by your version, adjust the frontmatter in `bin/devcrew.mjs`; the instruction bodies are plain Markdown.
- devcrew does not call any model itself. It configures the tools you already have.
- Check your client's NDA before pointing AI tools at confidential code.

## Roadmap

- [ ] Auto-detect stack and write the Conventions section of `AGENTS.md`
- [ ] Per-stack test presets
- [ ] `devcrew doctor` to verify installed files and commands
- [ ] Headless runner that executes tasks from `sprint-plan.md` in git worktrees with a verify gate

## License

MIT
