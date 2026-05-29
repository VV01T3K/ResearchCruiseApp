FROM node:25-alpine AS build

ARG APP_ENVIRONMENT="development"

ENV API_URL="/api" \
    APP_ENVIRONMENT=$APP_ENVIRONMENT

WORKDIR /app
RUN npm install --global vite-plus@0.1.14

ARG SENTRY_DSN=""
ARG SENTRY_ENVIRONMENT=""
ARG SENTRY_RELEASE=""
ARG SENTRY_TRACES_SAMPLE_RATE=""
ARG SENTRY_ORG=""
ARG SENTRY_PROJECT=""
ARG SENTRY_PROJECT_FRONTEND=""
ARG GITHUB_SHA=""

ENV SENTRY_DSN=$SENTRY_DSN \
    SENTRY_ENVIRONMENT=${SENTRY_ENVIRONMENT:-$APP_ENVIRONMENT} \
    SENTRY_RELEASE=${SENTRY_RELEASE:-$GITHUB_SHA} \
    SENTRY_TRACES_SAMPLE_RATE=$SENTRY_TRACES_SAMPLE_RATE \
    SENTRY_ORG=$SENTRY_ORG \
    SENTRY_PROJECT=${SENTRY_PROJECT_FRONTEND:-$SENTRY_PROJECT}

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/vp/store \
    vp install --frozen-lockfile

COPY frontend ./frontend
WORKDIR /app/frontend
RUN --mount=type=secret,id=sentry_auth_token,required=false \
    export SENTRY_AUTH_TOKEN=$(cat /run/secrets/sentry_auth_token 2>/dev/null || true) && \
    vp run build

FROM nginxinc/nginx-unprivileged:stable-alpine-slim

ARG API_URL="http://backend:8080/"

ENV API_URL=$API_URL

WORKDIR /app
COPY frontend/nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build --chown=nginx:nginx /app/frontend/dist /app/

EXPOSE 8080
