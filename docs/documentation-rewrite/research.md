# Documentation research and repository audit

Prepared 2026-09-22 against commit `e841a4ebd618fee79d4ddc8b70332cb005aa5635`.
This records the initial research and audit, not current operating instructions.
The audit tables describe the repository before the rewrite. Use the root README
and linked guides for current instructions. Verification of the rewrite is
recorded below.

## Writing guidance used in the rewrite

- [ISO 24495-1:2023](https://www.iso.org/standard/78907.html) informed the focus on
  the reader's task and usable instructions. The public abstract was consulted;
  the full standard was not available for a conformity review.
- [ASD-STE100 guidance](https://www.asd-ste100.org/STE_faq.html) informed consistent
  terminology and direct technical instructions. The rewrite does not claim
  compliance with its full controlled dictionary and rules.
- [BLUF](https://en.wikipedia.org/wiki/BLUF_(communication)) informed the order:
  state the outcome or required action before its explanation.
- [Cursor's unslop skill](https://github.com/cursor/plugins/blob/main/pstack/skills/unslop/SKILL.md)
  informed the edit for plain words, complete sentences, and removal of filler.
- [Writing for agents](https://www.aihero.dev/skills-writing-for-agents) and its
  [source skill](https://github.com/mattpocock/skills/blob/main/skills/productivity/writing-for-agents/SKILL.md)
  informed conditional references and removal of duplicated instructions from
  AGENTS.md. Operational detail lives in the document for that task.

## Rewrite verification

The user selected Docker Compose on a server as the production path. The rewrite
includes an override example for the existing production file, with an external
SQL Server and a host HTTPS proxy. No production services were started.

- Built both images with the development Compose file successfully.
- Started an isolated copy of the development stack with unique container names,
  its own database volume, and alternate loopback ports. SQL Server and backend
  health checks passed.
- Verified HTTP 200 for the frontend, proxied health, seeded administrator login,
  and authenticated current-user endpoint.
- Requested password recovery through the API, read the fake email, completed
  the reset, and signed in with the new password. The changed password still
  worked after recreating both application containers.
- Parsed the production examples from the guide and validated them with Compose
  5.5.1 using dummy values. Asserted the secret/URL mappings, disabled password
  logging and seeding, empty backend published ports, frontend loopback binding,
  and read-only account list mount.
- Checked local Markdown links and anchors and Git whitespace errors.
- Ran `vp run test:unit` inside the frontend build container: 186 tests passed.
- Inspected installed TanStack packages from the frozen lockfile. Table 9.2.4
  includes six skills. Router 1.168.10, Query 5.96.2, Form 1.33.2, and Virtual
  3.14.13 did not have skills in their own package directories. This was not a
  scan of every transitive dependency. Intent itself remains unconfigured.

The clean-machine mise workflow, public TLS, real SMTP delivery, server resource
requirements, and production backup/restore have not been tested here. Backend
publication and frontend build passed in Linux containers. These results do not
establish production readiness for an unconfigured host.

## Recommendation

Use the README as the human entry point. Explain what the application does, show
one verified local setup, and link directly to production setup and configuration.
Keep deployment reasoning and recovery procedures in a dedicated guide. Agents
should use those same factual documents, with a small AGENTS.md for commands,
constraints, and mistakes that repository inspection alone is likely to miss.

Do not build a second documentation system for agents. The difference is what
gets loaded by default. Humans need explanations at the point of a decision;
agents need precise instructions and paths to retrieve details for their task.

## What the evidence supports

| Source | Finding | Implication here |
| --- | --- | --- |
| [GitHub: about READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) | A README introduces the project, usefulness, getting started, help, and maintainers. GitHub supports relative links and an automatic outline. | Put the first successful use and useful destinations before a configuration catalogue. Avoid a manually maintained contents list unless the page needs one. |
| [Diataxis](https://diataxis.fr/) | Learning, accomplishing a task, looking up a fact, and understanding a concept are different documentation needs. | Separate the setup sequence, configuration reference, and explanation. These can be sections in a few files; no documentation website is required. |
| [AGENTS.md format](https://agents.md/) | A predictable Markdown file provides agent instructions separately from the human README; nested files support local guidance. | Keep one root file initially. Add a nested file only for rules that actually differ by directory. Verify discovery behavior for the agent in use. |
| [Anthropic: effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | Context is finite. Lightweight references let agents retrieve relevant material when needed. | Link to deployment or test details conditionally instead of requiring every task to read every document. This is vendor engineering guidance, not a controlled README experiment. |
| [Gloaguen et al.: Evaluating AGENTS.md, v1](https://arxiv.org/html/2602.11988v1) | Across four agents, generated files reduced resolution in five of eight settings and increased average costs. Developer files improved resolution for three of four agents on AGENTbench, but also increased work and cost. Repository overviews did not meaningfully speed discovery. | Avoid generated repository summaries and blanket requirements. Preserve specific human constraints. The evaluation is heavily Python based and does not establish an optimal file length for this .NET/TypeScript project. |
| [Lulla et al.: impact on agent efficiency, v2](https://arxiv.org/abs/2601.20404v2) | In 10 repositories and 124 pull requests, AGENTS.md presence was associated with 28.64% lower median runtime and 16.58% lower output token use, with comparable completion behavior. | Instructions can help. This is a different sample and measurement from the resolution study, not evidence that adding any instruction file improves correctness. |
| [Chatlatanagulchai et al.: Agent READMEs, v2](https://arxiv.org/abs/2511.12884v2) | A descriptive study of 2,303 files from 1,925 repositories found frequent changes and a focus on functional instructions, with fewer security and performance requirements. | Treat instructions as maintained project configuration. Include concrete risks such as destructive seeding; the study does not prove that common instruction patterns are effective. |

The evidence is mixed, not a mandate to remove AGENTS.md. Our inference is to
include a rule when it prevents a specific likely error, and remove duplication
that only increases reading. None of these sources establishes a universal word
limit, section order, or guaranteed improvement for current agents.

## Patterns from established public READMEs

These are structural examples, not controlled evidence that popularity comes
from documentation quality. Upstream default branches can change.

| Example inspected | Pattern to reuse | Material to leave out here |
| --- | --- | --- |
| [Paperless-ngx](https://github.com/paperless-ngx/paperless-ngx/blob/dev/README.md) | Short purpose, a preferred installation route, direct links to detailed setup, and a concrete data handling warning. | Sponsor graphics, community recruitment, and a remote script installation pattern that this repository does not provide. |
| [Immich](https://github.com/immich-app/immich/blob/main/README.md) | Installation is easy to find; backup advice appears before people operate the service. | The long feature matrix, translations, activity graphics, and demo credentials. |
| [Full Stack FastAPI Template](https://github.com/fastapi/full-stack-fastapi-template/blob/master/README.md) | Development and deployment have separate destinations; component documentation is linked explicitly. | Its technology choices, cloud hosting assumptions, and screenshot gallery. |

The proposed template borrows routing and task separation, not the projects'
headings wholesale. An institutional application needs deployment and recovery
instructions more than badges or a marketing feature list.

## Repository findings to resolve first

Paths below are relative to the repository root. Confirmed means visible in the
checked-in files, not reproduced at runtime.

| Priority | Evidence | Consequence and rewrite action |
| --- | --- | --- |
| Critical | `frontend/README.md` calls `vp run seed` database setup. `backend/package.json` maps seed to mise; `mise.toml` makes `seed:credentials` depend on `db:del`, which removes the database volume. | A routine setup instruction can delete local data. Exclude reset from normal setup. Explain the exact target and data loss before any optional reset command. |
| Critical | `docker/docker-compose.prod.yml` hardcodes a sample database password, `Encrypt=False`, a localhost frontend URL, and untagged images. `appsettings.json` contains a sample JWT secret; production Compose does not override it. | This file is not a complete production recipe. Document an explicit verified override mechanism. Setting an arbitrary variable in an env file does not replace hardcoded Compose values. Do not publish a bare production `up` command as sufficient. |
| High | `kubernetes/base/backend/configmap.yaml` enables account seeding and password logging. The deployment expects an external Secret. The root README simply advertises Kubernetes deployment. | Do not present these manifests as ready for production. Establish whether this path is supported and document secret provisioning, database, ingress, and safe overrides before recommending it. |
| High | Root README describes frontend `API_URL` as a required backend address. `frontend/Dockerfile` builds with `/api` but sets a runtime Nginx upstream; `frontend/nginx.conf` proxies `/api/`. `frontend/vite.config.ts` injects the build value. | Explain browser API path versus container upstream and build versus runtime configuration. A single undifferentiated variable row is misleading. |
| High | Root README's database example lacks the `Server=` prefix used by actual configuration. Required SMTP rows omit the fake SMTP mode distinction. | Verify example syntax; make requiredness conditional on the deployment mode. Use placeholders for secrets instead of reusable example credentials. |
| High | Startup initializer calls `MigrateAsync`; reference seeding is separate from the account flag. `docs/email-delivery.md` describes persistent outbox and Data Protection keys. | Production instructions must explain startup schema changes, backups, key retention, and rollback compatibility. Verify those operations before claiming a recovery path works. |
| Medium | Root and backend package metadata select pnpm; frontend metadata selects Bun. Commands use `vp`; mise hooks require it before installation. Mise scripts contain POSIX shell commands. | Trace the actual supported bootstrap from CI and tool definitions. Document shell, working directory, tool installation, and versions. Do not claim native PowerShell setup works without testing it. |
| Medium | `frontend/README.md` lists commands without working directories; seed is not a frontend script. `frontend/TESTING.md` mixes command styles and records counts and timing. Backend test script uses `--no-restore --no-build`. | Give each command its directory and prerequisites. Remove counts and timings unless needed. Include backend restore/build before tests. |
| Medium | `docs/sentry/sentry-on-prem-migration.md` explicitly describes a plan. `.github/workflows/build-and-deploy.yaml` has deployment jobs commented out. | Keep plans separate from current operational instructions. Do not infer a deployed service from a workflow title or proposed infrastructure. |

## What to keep, check, or move

| Existing document | Treatment in the rewrite |
| --- | --- |
| `README.md` | Replace with the template after commands and supported paths are verified. Move the configuration catalogue to its canonical reference. |
| `AGENTS.md` | Preserve Conventional Commits and frontend organization rules. Add only verified operational guidance with demonstrated value. |
| `frontend/README.md` | Keep frontend-specific workflow information or reduce to links. Remove misleading seed guidance and duplicate setup. |
| `frontend/TESTING.md` | Retain the distinction between schema tests and mocked browser tests. Verify fixtures and commands; remove fragile statistics and repetition. |
| `docs/smtp-configuration.md` | Useful existing guide. Verify and link rather than rewrite its contents into several files. |
| `docs/email-delivery.md` | Useful operations detail. Verify against worker, persistence, and tests; retain delivery limitations and recovery instructions. |
| `docs/permissions.md` | Audit endpoint and role claims against authorization code and tests. No endpoint-by-endpoint verification was performed in this research. Do not label it authoritative yet. |
| `docs/sentry/sentry-on-prem-migration.md` | Keep explicitly a plan, outside the normal setup path, unless implementation and deployment evidence prove completion. |
| The two `WARNING.md` files under application form components | Check importers and consolidate overlapping usage notes. Preserve the non-obvious cross-route dependency close to the code. |
| `CHANGELOG.md`, `LICENSE` | Link where useful. Do not duplicate history or rewrite legal text. |

## TanStack Intent and dependency guidance

Added after reviewing the user-supplied [TanStack Intent](https://tanstack.com/intent/latest)
link. Intent is currently labelled alpha. It packages agent skills with library
releases, allowing guidance to follow the dependency version. Its source tracking
flags material for review; it does not prove advice is semantically correct.

This adds a third layer to the recommendation:

| Layer | Owns |
| --- | --- |
| README and operational docs | Product explanation, local setup, production configuration, and recovery. |
| Repository AGENTS.md | Local conventions, verified commands, generation workflow, and project-specific constraints. |
| Dependency skills | Library usage guidance supplied by maintainers for the installed version, loaded for relevant tasks. |

The [Intent overview](https://tanstack.com/intent/latest/docs/overview) describes
discovery from installed dependencies, lightweight agent configuration, and loading
individual skills. This is a good candidate for this application's TanStack usage.
It gives us a concrete way to avoid copying library tutorials into AGENTS.md.
It does not supply this application's deployment knowledge or replace local rules.

Evaluate the consumer workflow first. Inspect which exact locked versions of
Router, Query, Table, Form, and Virtual actually ship skills before claiming
coverage. Package declarations alone do not establish that. Do not upgrade runtime
dependencies just to acquire documentation or scaffold application skills by default.

The [trust model](https://tanstack.com/intent/latest/docs/concepts/trust-model)
requires attention during evaluation: discovery includes transitive dependencies;
without an effective allowlist, current discovery still surfaces all discovered
packages. Configure explicit sources before adopting automatic loading. Permission
to use a package is not review of every future instruction it ships. Source
allowlisting does not propagate to dependencies, and skill content can change on
updates without a change notification. Review content and use only relevant skills.

This repository already has `skills-lock.json` and an optional `skills:install`
script fetching GitHub skills, including Sentry and better-context guidance.
Intent was not found in the inspected root/frontend package declarations. Document
the distinct sources and avoid duplicate guidance if Intent is adopted. No Intent
CLI, hooks, dependency changes, or agent configuration changes were made here.

## Minimum useful documentation set

Keep `README.md`, `AGENTS.md`, the useful existing topic guides, and one new
`docs/deployment.md`. Add `docs/configuration.md` only if the reference makes the
deployment guide difficult to use. Keep local setup in the README until it needs
a separate guide. No docs framework, generated repository map, parallel AI manual,
custom skill authoring, or `llms.txt` is justified by this task. Evaluate Intent
for consuming existing dependency skills as described above.

For maintenance, update the owning document when a command, setting, or behavior
changes. Link to implementation paths rather than copying code. Keep temporary
research and this handoff out of required agent reading; archive or remove this
directory once the rewrite is accepted.
