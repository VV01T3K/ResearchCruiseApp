# SMTP configuration and rollout

## Configuration

The backend sends email through Gmail using implicit TLS on port 465. The server,
port, and sender display name remain in `appsettings.json`; credentials are supplied
at runtime. Never commit an app password, including a replacement for an exposed one.

| Environment | Credential source / delivery |
| --- | --- |
| Local .NET Development | Fake SMTP writes HTML to `fake-emails/`; no credentials required. |
| Docker development | Fake SMTP writes HTML to `/tmp/fake-emails` inside the backend container; no credentials required. Files are ephemeral and disappear when the container is replaced. |
| Komodo staging | Stack environment: `SMTP_USERNAME`, `SMTP_PASSWORD`. |
| Production Compose | Deployment environment: `SMTP_USERNAME`, `SMTP_PASSWORD`. |
| Direct backend hosting with real SMTP | `SmtpSettings__SmtpUsername`, `SmtpSettings__SmtpPassword` supplied to the backend process. |

For Gmail, the username is the full mailbox address and the password is an app
password, not the normal account password. Google requires 2-Step Verification
for app passwords; account policies can restrict availability. Changing the Google
Account password revokes existing app passwords. See
[Google's app-password documentation](https://support.google.com/accounts/answer/185833?hl=en).

The short `SMTP_*` names are Compose inputs, not backend configuration keys.
Setting them only as container environment variables without the Compose mapping
does not configure the backend. Both deployment Compose files reject missing or
empty credentials using [required-value interpolation](https://docs.docker.com/reference/compose-file/interpolation/).
This checks presence, not whether Gmail accepts the password.

Docker's `APP_ENVIRONMENT` build argument controls Sentry's environment label; it
does not set the ASP.NET Core environment. Docker development therefore explicitly
enables fake SMTP. To inspect captured email, copy it from the running container:

```sh
docker cp researchcruiseapp-backend:/tmp/fake-emails ./fake-emails
```

For local deployment experiments, copy `docker/.env.staging.template` to an
untracked file and pass it explicitly with `docker compose --env-file <path> ...`.
Git and Docker ignore `.env` and `.env.*` files. Do not print rendered Compose
configuration with real credentials into logs; use `config --quiet` to validate it.

## Deployment and credential rotation

1. Create a fresh Gmail app password and place it, with the mailbox address, in the
   Komodo stack environment. Previously committed passwords must be revoked in
   Google's account settings; removing them from the current tree does not remove
   Git history or old image contents. Coordinate revocation and rollout to account
   for any mail interruption on old containers.
2. Configure the variables before merging to `staging`: that branch automatically
   builds images and triggers the Komodo deployment. GitHub Actions secrets alone
   do not populate the Komodo stack environment.
3. Validate the stack configuration, deploy the updated image and Compose file,
   and recreate the backend container so it receives the new environment. A plain
   container restart does not update its environment. With the Compose CLI, use
   `docker compose -f docker/compose.staging-app.yaml up -d --force-recreate backend`
   after pulling the new image and supplying the deployment environment.
4. Verify delivery to a controlled mailbox using confirmation/resend and password
   recovery, then exercise an application notification. Check inbox/spam and server
   logs. A healthy `/health` response does not verify SMTP authentication or delivery.
5. Confirm exposed app passwords have been revoked and keep the final credential
   solely in deployment configuration. Future rotations require changing the secret
   and recreating the backend, not committing a new password or rebuilding images.

Production Compose has the same credential requirements, but the production
deployment remains disabled in the workflow. Main still needs the code change
before production is revived. Kubernetes manifests are outside this Compose fix.

## Failure behavior and remaining limitations

Email is durably queued with the related database changes and delivered by a
background worker. SMTP failures retry without failing the original request;
queue/database failures still fail and roll back the transaction. See
[durable email delivery](email-delivery.md) for retry limits, failure monitoring,
key storage, migration, and the possibility of duplicate delivery after a crash.

Direct hosting does not have Compose's required-variable checks; missing settings
are currently detected when email is sent. There is no live Gmail check at startup.
Local fake-email tests and successful image builds cannot establish that a deployed
credential is valid.
