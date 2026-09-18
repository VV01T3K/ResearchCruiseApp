# Durable email delivery

Email-producing requests now save a protected message to `EmailOutboxMessages` in
the application database. Successful requests mean the message is durably queued,
not that Gmail has delivered it. An SMTP outage no longer fails registration or
other requests after their database work succeeds.

Registration, account creation/acceptance/profile updates, seeded account repair,
application submission, and cruise confirmation commit their state changes and
email queue writes in the same transaction. A queue/database failure rolls back
those changes. Confirmation resend and password recovery also persist their
messages before returning. No SMTP network calls occur inside request transactions.

## Delivery and recovery

- The backend worker polls every five seconds, processing up to 20 messages per batch.
- Each message is claimed by an atomic conditional database update. A five-minute
  lease prevents another worker from taking it while delivery is in progress.
- Each attempt has a one-minute deadline. Failed attempts retry after 30 seconds,
  doubling up to an hour. The attempt count and next attempt time survive restart.
- There are at most 12 attempts; messages expire after 12 hours so stale password
  recovery and confirmation links are not delivered indefinitely.
- Success deletes the queued message. Exhaustion or expiry clears its protected
  contents, keeps only failure metadata for seven days, and emits an operator log.
- Shutdown leaves the lease in place; another worker can resume after it expires.
- Fake SMTP also goes through the queue. It writes one HTML file per message ID,
  replacing that same file if an attempt is repeated.

SMTP cannot participate in the database transaction. If the mail server accepts a
message and the process crashes before acknowledging it in the database, a retry
can deliver it again. Retries reuse the same Message-ID to help downstream clients,
but this is **at-least-once attempt semantics**, not an exactly-once guarantee.
There is also no automatic delivery guarantee for invalid recipients or messages
that exhaust their retry budget.

## Payload and key storage

The complete recipient/subject/body payload is protected with ASP.NET Core Data
Protection. The key ring is persisted in the `DataProtectionKeys` table and uses
the stable application name `ResearchCruiseApp`, allowing replacement containers
and replicas sharing the database to decrypt pending messages and identity tokens.

Keys and encrypted payloads are in the same database: this prevents plain message
content appearing in routine outbox queries, but does **not** protect against an
attacker with full database access. Restrict database and backup access and use
database/storage encryption appropriate to the deployment. Never log payloads or
key material. Old backups may retain payloads and keys after live rows are deleted.
An independent key-encryption mechanism can be configured with ASP.NET Data Protection
if the deployment requires protection against database readers.

The new key store/application discriminator may invalidate outstanding tokens
issued with the previous ephemeral key ring. Users can request new confirmation
or recovery links after rollout. Do not remove the key table on container restart.

## Rollout and operations

The EF migration adds the outbox and key-ring tables. Apply it before running this
version's worker; the normal application startup migration performs this step.
No separate broker, cron job, SMTP connection at startup, or worker deployment is
required. Preserve both tables and their contents across deployments.

The test suite defaults to isolated SQLite databases. To exercise the same outbox
tests against SQL Server, set `RESEARCHCRUISE_TEST_SQLSERVER` to a test-server
connection string and run `dotnet test --filter FullyQualifiedName~EmailOutboxTests`.
The fixture creates and deletes its own uniquely named `EmailOutboxTests_*`
databases; use a dedicated test server with database-creation permissions.

Monitor `EmailOutboxMessages` for old pending rows, rising `Attempts`, and non-null
`FailedAt`. Delivery failure logs identify the message ID, attempt, exception type,
and whether retries are exhausted, without printing SMTP responses or recipients.
Database/worker failures are logged and retried on the next poll. `/health` remains
a process health check and does not certify mail delivery.

Fix the credential/network problem and recreate the backend if its environment
changed; pending messages retry automatically. Terminal records have no payload
left to replay. Use the relevant business operation to create a fresh notification
(for example confirmation resend or password recovery); other notifications may
require operator follow-up with the recipient. Do not reset terminal rows to pending.

Before rolling back to a version without the worker, drain the queue or plan to
resume it later. Dropping the outbox/key tables loses queued mail and invalidates
data protected with those keys. Changing SMTP credentials requires no schema change.
