# Gmail / SMTP review — 2026-09-17

## Conclusion

The confirmed defect is credential storage and deployment configuration. Both remote
`main` and `staging` still contain a Gmail app password. The current acceptance of
that password by Google, and the live Komodo environment, were not verified.
Consequently, this review does not establish the cause of a current delivery outage.

[Issue #390](https://github.com/VV01T3K/ResearchCruiseApp/issues/390) tracks the problem.
July's merged password-rotation PRs #391 and #392 committed the replacement password
and did not resolve its exposure through Git history or built images.

## Existing solution

[PR #405](https://github.com/VV01T3K/ResearchCruiseApp/pull/405), on
`t3code/fix-email-secrets`, removes credentials from application settings and maps
required Komodo variables into staging. Its approach is appropriate and the branch
is not orphaned. At review time it is open and mergeable, one commit behind staging.
Its existing build and lint checks passed; its August 27 browser test run failed
three cruise-length tests. These checks need rerunning against the current base;
the old failures do not establish an SMTP regression.

## Improvements prepared in this worktree

The follow-up branch is stacked on PR #405 and contains the following additions
to its five-file fix:

| Finding | Change |
| --- | --- |
| Docker development never selected ASP.NET Development or enabled fake SMTP, so removing base credentials would break its mail flows. | Explicitly enable fake SMTP, writing to `/tmp/fake-emails` in the container. |
| The production Compose file would have no source of credentials after removing the defaults. Issue #390 deferred this work. | Add the same required credential mappings now, without enabling production deployment. |
| Ignoring secrets in Git does not exclude them from Docker contexts. The root context had no `.env` exclusions; the backend excluded `.env` but not `.env.*`. | Exclude both filename patterns and captured fake emails from both Docker build contexts. |
| The PR's instruction to restart after changing secrets is insufficient if the existing container retains its original environment. | Document container recreation, pre-merge Komodo setup, revocation, delivery verification, and rollback-related exposure in old images. |

See [SMTP configuration and rollout](smtp-configuration.md) for the operational steps.
No C# mail transport, authentication endpoint, database, or frontend behavior was changed.

## Validation

22 local checks passed using Docker Compose v5.5.1 and dummy credentials:

- Both deployment files reject missing username, missing password, and empty values.
- Both accept supplied values and map them to the exact backend configuration keys.
- Docker development renders without credentials and explicitly selects fake email.
- Base settings parse successfully and contain neither SMTP credential key.
- The previously committed password is absent from current tracked file contents.
- Git ignores representative root/nested environment files and captured email.

`git diff --check` passed. Docker builds and .NET tests were not run; these changes
are configuration/documentation only, and this shell has no .NET SDK. Docker-ignore
rules were reviewed, but build-context exclusion was not exercised by an image build.
No real credential was tested, and no email was sent.

## Remaining work and limitations

- Configure a fresh Gmail app password in Komodo, deploy/recreate, verify delivery,
  and revoke exposed passwords. Old commits and images still contain those passwords.
- Merge the follow-up through PR #405, or retarget it to staging after #405 merges,
  and rerun CI against the resulting staging base. Publishing this follow-up does
  not deploy the change or configure the live credentials.
- Apply the fix to main before reviving production. This local change does not
  sanitize either remote branch or rewrite history.
- Registration persists the user before email is sent; an SMTP failure can leave an
  account despite an error response. Resend can recover once SMTP works. Durable
  retries/outbox processing require a separate application design and tests.
- Compose checks only whether credentials are nonempty. Direct hosting has no
  equivalent preflight check, and `/health` does not test Gmail.

Google documents that changing the account password revokes app passwords; this is
one possible authentication-failure cause, not a diagnosis of the live system.
See [Google Account Help](https://support.google.com/accounts/answer/185833?hl=en).
