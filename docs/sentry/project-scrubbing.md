# Sentry project data scrubbing

The app never sends passwords, one-time codes (`code`, `resetCode`, `supervisorCode`), tokens or
cookies to Sentry. The project scrubbing settings are a second layer in case a future change leaks
one. They run after delivery, so they don't replace the app's own scrubbing.

[`pii-rules.json`](pii-rules.json) holds the Advanced Data Scrubbing rules. It uses exact selectors
on purpose: don't add `code` to Additional Sensitive Fields, because that matches substrings and
would also remove `errorCode` and ordinary form fields named `code`. Personal data (names, emails,
form contents) stays collected.

Apply the same settings to every project: `frontend-staging` and `backend-staging` on Sentry Cloud
(`https://de.sentry.io`), and both production projects on the self-hosted instance. Use a user auth
token with `project:read` and `project:write` for the host you are changing.

```sh
HOST=https://de.sentry.io ORG=cruiseteam PROJECT=frontend-staging TOKEN=...

# 1. Read the current settings and keep them; the PUT replaces any existing advanced rules.
curl -sH "Authorization: Bearer $TOKEN" "$HOST/api/0/projects/$ORG/$PROJECT/" \
  | jq '{dataScrubber, dataScrubberDefaults, scrubIPAddresses, sensitiveFields, safeFields, relayPiiConfig}' \
  | tee "before-$PROJECT.json"

# 2. Apply.
jq -n --slurpfile rules docs/sentry/pii-rules.json \
  '{dataScrubber: true, dataScrubberDefaults: true, scrubIPAddresses: true,
    sensitiveFields: [], safeFields: [], relayPiiConfig: ($rules[0] | tojson)}' \
  | curl -sX PUT -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
      --data @- "$HOST/api/0/projects/$ORG/$PROJECT/" >/dev/null

# 3. Read back; this prints true when the stored rules match the file.
curl -sH "Authorization: Bearer $TOKEN" "$HOST/api/0/projects/$ORG/$PROJECT/" \
  | jq --slurpfile rules docs/sentry/pii-rules.json '(.relayPiiConfig | fromjson) == $rules[0]'
```

Check the organization's Security & Privacy settings too: organization rules apply on top of the
project rules.
