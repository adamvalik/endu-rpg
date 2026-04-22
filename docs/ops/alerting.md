# Operational Alerting — Setup Guide

**Backlog item:** `OPS-002` — alert on Strava rate limits and other critical errors.
**Target project:** `endu-production` (prod). Same setup applies to `strava-rpg` (dev) if desired.

This doc is a runbook. Follow it to bring alerting online; it stays in the repo as the source of truth for how the alerts are configured.

## Rationale

> Unblocks the dormancy gate on `CORE-003` — we can't wait for rate limiting to appear if we're not watching.
> — `TODO-BACKLOG.md`, OPS-002 note

Two classes of error are worth paging someone for today:

1. **Strava rate-limit breaches** — `StravaRateLimitError`, emitted from [`packages/functions/src/strava/http.ts:27-38`](../../packages/functions/src/strava/http.ts#L27-L38) and logged in [`packages/functions/src/handleError.ts:18-19`](../../packages/functions/src/handleError.ts#L18-L19). The error message always contains the literal `Strava rate limit exceeded`, making text-match filtering reliable.
2. **Strava token-refresh failures** — logged in [`packages/functions/src/strava/strava.ts:80`](../../packages/functions/src/strava/strava.ts#L80) with the prefix `Error auto-refreshing token:`. A user in this state can't sync until they reconnect; we want to see this trending up.

More filters can be added later by following the same pattern.

## Prerequisites

- `gcloud` installed and authenticated: `gcloud auth login`.
- Default project set: `gcloud config set project endu-production`.
- Required APIs enabled (one-time):
  ```bash
  gcloud services enable logging.googleapis.com monitoring.googleapis.com
  ```
- An email notification channel exists in Cloud Monitoring. If not, create one in the console (Monitoring → Alerting → Notification channels → Add → Email), then capture its ID:
  ```bash
  gcloud alpha monitoring channels list \
    --filter="type='email' AND labels.email_address='YOUR_EMAIL'" \
    --format="value(name)"
  ```
  Copy the returned resource name (e.g. `projects/endu-production/notificationChannels/1234567890`) — you'll use it below as `$CHANNEL`.

## 1. Log-based metrics

Create two counter metrics. Both filter on `severity=ERROR` plus a distinctive substring from the log message.

### 1a. Strava rate-limit counter

```bash
gcloud logging metrics create strava_rate_limit_errors \
  --description="Count of StravaRateLimitError occurrences across all functions" \
  --log-filter='resource.type="cloud_run_revision"
    severity=ERROR
    textPayload=~"Strava rate limit exceeded" OR jsonPayload.message=~"Strava rate limit exceeded"'
```

Note: `firebase-functions/logger.error(msg, err.message, { snapshot })` currently writes to `textPayload` on Cloud Functions v2 (Cloud Run under the hood). The filter checks both `textPayload` and `jsonPayload.message` so it's robust if logging format changes.

### 1b. Token-refresh failure counter

```bash
gcloud logging metrics create strava_token_refresh_failures \
  --description="Count of Strava token auto-refresh failures" \
  --log-filter='resource.type="cloud_run_revision"
    severity=ERROR
    textPayload=~"Error auto-refreshing token" OR jsonPayload.message=~"Error auto-refreshing token"'
```

### Verify metrics exist

```bash
gcloud logging metrics list --filter="name ~ strava_"
```

## 2. Alert policies

Each policy: fire on **any occurrence** (threshold > 0) in a **5-minute window**, route to the email channel.

Save as a file, then apply. Below is a single combined policy file covering both metrics — two separate `conditions`, either one firing triggers the alert.

Create `alert-policy-strava.yaml`:

```yaml
displayName: 'Strava Errors (Prod)'
combiner: OR
conditions:
  - displayName: 'Strava rate limit hit'
    conditionThreshold:
      filter: >
        resource.type="cloud_run_revision"
        AND metric.type="logging.googleapis.com/user/strava_rate_limit_errors"
      comparison: COMPARISON_GT
      thresholdValue: 0
      duration: 0s
      aggregations:
        - alignmentPeriod: 300s
          perSeriesAligner: ALIGN_SUM
      trigger:
        count: 1
  - displayName: 'Strava token refresh failed'
    conditionThreshold:
      filter: >
        resource.type="cloud_run_revision"
        AND metric.type="logging.googleapis.com/user/strava_token_refresh_failures"
      comparison: COMPARISON_GT
      thresholdValue: 0
      duration: 0s
      aggregations:
        - alignmentPeriod: 300s
          perSeriesAligner: ALIGN_SUM
      trigger:
        count: 1
alertStrategy:
  autoClose: 86400s
documentation:
  content: |
    Strava error alert fired. Check logs:
      https://console.cloud.google.com/logs/query;query=severity%3DERROR%20%22Strava%22?project=endu-production

    Rate limit: see docs/ops/alerting.md for remediation.
    Token refresh: user must reconnect Strava; usually not fixable server-side.
  mimeType: text/markdown
notificationChannels:
  - $CHANNEL
```

Apply it (substitute `$CHANNEL` with the resource name from Prerequisites):

```bash
gcloud alpha monitoring policies create --policy-from-file=alert-policy-strava.yaml
```

### Verify policy exists

```bash
gcloud alpha monitoring policies list --filter="displayName:'Strava Errors (Prod)'"
```

## 3. End-to-end verification

**Option A — synthetic log (fastest):**

```bash
gcloud logging write strava-rate-limit-test \
  "Strava rate limit exceeded (short, overall): 100/100, resets at 2099-01-01T00:00:00.000Z" \
  --severity=ERROR \
  --payload-type=text
```

Wait ~2 minutes (metric ingest + alert evaluation). The alert should fire and email arrive.

**Option B — emulator:** force a `StravaRateLimitError` throw in a callable, run against the local emulator, confirm the log line. This validates the error path but not GCP delivery; use (A) to validate end-to-end.

## 4. Adding future filters

Repeat the pattern:

1. Add a log-based metric with a distinctive substring filter.
2. Add a condition to `alert-policy-strava.yaml` and re-apply, or create a new policy for independent tuning.
3. Document the source log line (file + line) in the Rationale section above so the filter doesn't rot silently when the log string changes.

## 5. Known gaps / follow-ups

- **No structured `errorName` field.** Today the filter matches on substring. A small code change to include `{ errorName: 'StravaRateLimitError' }` in the structured payload would let the filter key on `jsonPayload.errorName` instead of `textPayload`, which is more durable. Deferred — text-match is fine at current volume.
- **Dev project not alerted.** Only `endu-production` is wired up. If dev starts carrying real traffic, re-run this setup against `strava-rpg`.
- **No Slack channel.** Email only for now. To add Slack: create a Slack notification channel in the console, add its resource name to `notificationChannels` in the policy YAML, re-apply.

## Acceptance criteria (from `OPS-002`)

- [x] Log-based metric created filtering on `StravaRateLimitError` → `strava_rate_limit_errors` (§1a).
- [x] Alert policy fires on any occurrence (threshold > 0) routed to email → §2.
- [x] At least one additional critical-error filter added → `strava_token_refresh_failures` (§1b).
