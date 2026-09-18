# SMTP setup

Gmail delivery uses implicit TLS on port 465. Supply the full mailbox address and
a Gmail app password through the deployment environment; never commit credentials
to application settings or environment files.

| Hosting | Configuration |
| --- | --- |
| Staging (Komodo) and production Compose | Set `SMTP_USERNAME` and `SMTP_PASSWORD` in the deployment environment. Compose maps them to the backend settings and rejects missing or empty values. |
| Direct backend hosting | Set `SmtpSettings__SmtpUsername` and `SmtpSettings__SmtpPassword` in the backend process environment. The short `SMTP_*` names only work through Compose. |
| Local development | Fake SMTP writes HTML to `fake-emails/`; no Gmail credentials required. |
| Docker development | Fake SMTP writes HTML to `/tmp/fake-emails` in the backend container; files disappear when the container is replaced. |

For local deployment setup, copy `docker/.env.staging.template` to an untracked
file and supply it with `docker compose --env-file <path> ...`. Validate with
`config --quiet` to avoid printing credentials. To inspect Docker development
email, run `docker cp researchcruiseapp-backend:/tmp/fake-emails ./fake-emails`.

## Rollout and rotation

1. Create a fresh [Gmail app password](https://support.google.com/accounts/answer/185833?hl=en)
   and configure it in Komodo before merging to staging, which automatically deploys.
   GitHub Actions secrets alone do not populate the Komodo stack environment.
2. Deploy the updated image and Compose file, recreating the backend container so
   it receives the new environment. A plain restart does not update environment variables.
3. Verify confirmation/resend and password recovery with a controlled mailbox.
   `/health` and nonempty settings do not prove Gmail authentication or delivery works.
4. Revoke exposed app passwords. Removing them from tracked settings does not
   remove them from Git history or old images. Future rotations require updating
   deployment configuration and recreating the container, without rebuilding images.

## Delivery

Email is queued with its related database changes and delivered by a background
worker. SMTP failures retry; queue persistence failures roll back the related
changes. See [email delivery](email-delivery.md) for retry limits, monitoring,
key storage, and recovery.
