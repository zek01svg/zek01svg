#!/usr/bin/env bash
# Run once after deploying to set up all Cloud Scheduler jobs.
# Usage: PROJECT_ID=your-project REGION=asia-southeast1 WORKERS_URL=https://hq-workers-xxx-as.a.run.app bash cloud-scheduler.sh

set -euo pipefail

PROJECT_ID=${PROJECT_ID:?}
REGION=${REGION:-asia-southeast1}
WORKERS_URL=${WORKERS_URL:?}
SA="${PROJECT_ID}@${PROJECT_ID}.iam.gserviceaccount.com"  # Adjust to your service account

gcloud config set project "$PROJECT_ID"

create_job() {
  local name="$1"
  local schedule="$2"
  local path="$3"
  echo "Creating $name ..."
  gcloud scheduler jobs create http "$name" \
    --location="$REGION" \
    --schedule="$schedule" \
    --uri="${WORKERS_URL}${path}" \
    --http-method=POST \
    --oidc-service-account-email="$SA" \
    --oidc-token-audience="${WORKERS_URL}" \
    --time-zone="Asia/Singapore" \
    --attempt-deadline=600s \
    || gcloud scheduler jobs update http "$name" \
      --location="$REGION" \
      --schedule="$schedule" \
      --uri="${WORKERS_URL}${path}" \
      --http-method=POST
}

# SGT = UTC+8, so 6am SGT = 22:00 UTC prev day

create_job "hq-bible"           "45 21 * * *"  "/agents/bible"           # 05:45 SGT daily
create_job "hq-daily-brief"     "0 22 * * *"   "/agents/daily-brief"     # 06:00 SGT daily
create_job "hq-weather"         "0 22 * * *"   "/agents/weather"         # 06:00 SGT daily
create_job "hq-calendar"        "0 22 * * *"   "/agents/calendar"        # 06:00 SGT daily
create_job "hq-notion"          "0 22 * * *"   "/agents/notion"          # 06:00 SGT daily
create_job "hq-research"        "0 23 * * *"   "/agents/research"        # 07:00 SGT daily
create_job "hq-releases"        "0 0 * * *"    "/agents/releases"        # 08:00 SGT daily
create_job "hq-hackathons"      "0 0 * * *"    "/agents/hackathons"      # 08:00 SGT daily
create_job "hq-gov"             "0 0 * * *"    "/agents/gov"             # 08:00 SGT daily
create_job "hq-sea-startups"    "0 0 * * *"    "/agents/sea-startups"    # 08:00 SGT daily
create_job "hq-jobs"            "0 1 * * *"    "/agents/jobs"            # 09:00 SGT daily
create_job "hq-email-1"        "*/30 * * * *"  "/agents/email"           # every 30 min
create_job "hq-finance-1"      "*/30 * * * *"  "/agents/finance"         # every 30 min
create_job "hq-news-1"         "0 */2 * * *"   "/agents/news"            # every 2 hours
create_job "hq-hn-1"           "0 */4 * * *"   "/agents/hn"              # every 4 hours
create_job "hq-github-trending" "0 */6 * * *"  "/agents/github-trending" # every 6 hours
create_job "hq-prices"         "0 14 * * 0"    "/agents/prices"          # Sunday 22:00 UTC = Mon 06:00 SGT
create_job "hq-flights"        "0 0 * * 1"     "/agents/flights"         # Monday 08:00 SGT

echo "All Cloud Scheduler jobs created/updated."
