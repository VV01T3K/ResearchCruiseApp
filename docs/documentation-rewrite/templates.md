# Templates for the documentation rewrite

Historical authoring templates. The actual rewrite is in the root README and its
linked guides; these templates are not application documentation.

These are authoring templates, not executable setup instructions. Replace every
`{{placeholder}}` with verified information or remove the optional section. The
paths in the fenced templates describe intended output locations and may not
exist yet. Do not publish placeholders or claim untested procedures work.

## Root README template

````markdown
# ResearchCruiseApp

ResearchCruiseApp manages research cruise applications and cruise organization
for the University of Gdansk's research vessel Oceanograf.

{{One short paragraph explaining the main workflow and intended users.
Verify product terminology. Avoid a complete feature or technology inventory.}}

- [Run locally](#run-locally)
- [Deploy and operate](docs/deployment.md)
- [Configuration]({{canonical configuration file or section}})
- [Work on the code](#work-on-the-code)

## Run locally

{{Name the verified OS/shell and prerequisites. Link version definitions and
give the tested versions where installation requires them. Explain how vp
becomes available before using it. State that this uses a local database.}}

From {{working directory}}, using {{shell}}:

```text
{{Verified commands to install dependencies, start the local database,
configure development settings, and start both applications. No database reset.}}
```

Open {{frontend URL}}. {{Expected screen and how to obtain the first local
account. State where fake email appears and how to inspect it.}}

{{One short explanation of browser, frontend, backend, and database connections.
Explain why local and container addresses differ if needed for these steps.}}

To stop: {{verified command and whether local data persists}}.

## Deploy and operate

{{Name the supported deployment route and its current limitations. Explain the
external services it requires and whether the repository supplies them.}}

Follow [the deployment guide](docs/deployment.md) for configuration, first
administrator access, HTTPS, deployment checks, backups, upgrades, and recovery.
{{Place any verified production blocker here before linking a launch command.}}

## Work on the code

{{Only the entry points needed to choose where to work. Avoid a directory tree.}}

| Task | Directory | Command | Prerequisites |
| --- | --- | --- | --- |
| {{Build/check/test relevant component}} | {{path}} | `{{command}}` | {{restore/build/browser needs}} |
| Regenerate the API client | {{path}} | `{{command}}` | {{backend OpenAPI generation step}} |

{{Explain which generated outputs must be committed and link the test guide.
State that mocked browser tests do not prove real backend integration.}}

Repository conventions are in [AGENTS.md](AGENTS.md).

## Troubleshooting

{{Include only a few observed onboarding failures. For each give symptom,
diagnostic, and non-destructive resolution. Move longer operations issues to
deployment or SMTP documentation. Delete this section if there are none.}}

## Help and license

{{Verified maintainer/help destination. Do not invent a support promise.}}
See [LICENSE](LICENSE).
````

## Production guide outline

Target `docs/deployment.md`. This is the detailed human procedure, also usable by
an agent tasked with deployment. Complete the steps for one supported route first.

1. **Scope and prerequisites.** Tested host/shell, deployment files, image tags
   or digests, database location, DNS/TLS owner, SMTP requirements, persistent
   storage, and network access. Label staging-specific Komodo/Caddy assumptions.
   Explain request routing and which ports must be reachable by whom.
2. **Configure.** Exact file locations and override mechanism. Distinguish Compose
   interpolation from backend environment settings and frontend build/runtime
   values. Provide placeholders and explain where secrets are supplied. Explicitly
   replace sample DB credentials and JWT secret; disable seed password logging.
3. **Validate and launch.** Working directory, exact Compose file order and env
   file selection, non-disclosing configuration validation, launch commands, and
   startup migration behavior. Do not imply that `config --quiet` proves runtime
   connectivity or complete production readiness.
4. **Obtain first administrator access.** Verified bootstrap procedure, required
   privileges, delivery/confirmation behavior, and removal of temporary settings.
   If the repository has no safe supported path, record that as a blocker.
5. **Verify.** Expected frontend/API behavior, health response and its limits,
   real login and email round trip using a controlled account, and relevant logs.
6. **Operate and recover.** What to back up, how to restore and check a disposable
   restore, retention of the outbox and Data Protection keys, secret rotation,
   and links to the existing SMTP and email delivery guides. Verify where uploads
   are stored before describing backup coverage.
7. **Upgrade and roll back.** Version selection, pre-upgrade backup, migration
   sequencing, compatibility limits, and verification. An older image alone is
   not a proven database rollback. Separate queue recovery from schema recovery.
8. **Troubleshoot.** Only observed deployment failures, with diagnostics that do
   not print credentials or erase data.

Avoid an exhaustive infrastructure textbook. Every explanation should help the
operator choose a value, understand a side effect, or recover from a failure.

### Configuration reference row format

Use two small tables rather than one unreadably wide table. Each setting needs a
real consumer, a default or explicit absence, requiredness by mode, and its effect.

| Setting | Consumer and phase | Default | Required when |
| --- | --- | --- | --- |
| `{{exact identifier}}` | {{backend runtime / frontend build / Nginx runtime / Compose input}} | {{verified value or none}} | {{condition}} |

| Setting | Meaning and safe example | How to apply a change |
| --- | --- | --- |
| `{{exact identifier}}` | {{units, allowed values, secret placeholder if applicable}} | {{rebuild / recreate / restart, verified}} |

Group connection/authentication, email, account initialization, and optional
observability settings. Explain actual naming mappings such as `SMTP_USERNAME`
to `SmtpSettings__SmtpUsername`. Never assume an unmapped Compose variable reaches
the application. Keep a source path beside each group for maintenance.

## Agent instructions template

Merge into the existing root `AGENTS.md`; do not replace its established rules
with this skeleton. The proposed additions below require verification.

````markdown
# Repository instructions

## Commands

{{One sentence naming the supported environment and canonical setup section.}}

| Change | Directory | Relevant validation |
| --- | --- | --- |
| {{frontend / backend / API contract}} | {{path}} | {{exact command and prerequisites}} |

{{List the generated OpenAPI and client outputs and their regeneration order.
Do not restate every package script.}}

## Constraints

{{Preserve existing commit and frontend organization instructions verbatim.}}

{{Add only confirmed repository traps, for example that the seed command deletes
the local database volume and is not a prerequisite for normal development.}}

## Task references

- For {{specific task}}, read {{canonical path and relevant section}}.
- For {{specific task}}, read {{canonical path and relevant section}}.

{{If Intent is adopted and verified, include its minimal dependency skill loading
guidance here. Resolve skills from installed package versions and load only those
relevant to the task. Keep library instructions in dependency skills and project
rules in this file. Do not invent skill names or assume every dependency has one.}}
````

Admit an instruction only if it changes a likely decision. Prefer a precise rule
such as preserving both generated API outputs over generic advice to write good
code. Do not copy formatter rules, list every directory, require all tests for
every change, or require reading every document. Do not turn speculative plans
into repository policy. Shortness is a review criterion, not an arbitrary limit.
