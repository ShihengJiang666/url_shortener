#!/bin/bash
PROJECT_ID="unified-skein-453820-a1"
ARTIFACT_REGISTRY="us-central1-docker.pkg.dev"
DOCKER_REPO="cisc-594"
DOCKER_IMAGE="url-shortener"
IMAGE="$ARTIFACT_REGISTRY/$PROJECT_ID/$DOCKER_REPO/$DOCKER_IMAGE:latest"
SERVICE_ACCOUNT="url-shortener@$PROJECT_ID.iam.gserviceaccount.com"
PROJECT_NUMBER="199604812910"
gcloud run deploy "$DOCKER_IMAGE" --async --service-account="$SERVICE_ACCOUNT" \
    --min-instances=0 --max-instances=10 --cpu=1 --memory=1024Mi \
    --concurrency=100 --allow-unauthenticated --project="$PROJECT_ID" \
    --region="us-central1" --image="$IMAGE" \
    --set-env-vars=PROJECT_ID="$PROJECT_ID",PROJECT_NUMBER="$PROJECT_NUMBER",REDIS_HOST="10.123.198.51",REDIS_PORT="6379",NODE_ENV="production"
