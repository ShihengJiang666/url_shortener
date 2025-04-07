#!/bin/bash
PROJECT_ID="unified-skein-453820-a1"
ARTIFACT_REGISTRY="us-central1-docker.pkg.dev"
DOCKER_REPO="cisc-594"
DOCKER_IMAGE="url-shortener"

npm run build && \
docker build -t "$ARTIFACT_REGISTRY/$PROJECT_ID/$DOCKER_REPO/$DOCKER_IMAGE:latest" . && \
docker push "$ARTIFACT_REGISTRY/$PROJECT_ID/$DOCKER_REPO/$DOCKER_IMAGE:latest"
