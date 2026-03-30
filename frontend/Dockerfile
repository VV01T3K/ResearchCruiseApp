FROM node:25-alpine AS build

ARG APP_ENVIRONMENT="development"
ARG OTEL_SERVICE_NAME="research-cruise-app-frontend"

ENV API_URL="/api" \
    GRAFANA_FARO_URL="/faro/collect" \
    APP_ENVIRONMENT=$APP_ENVIRONMENT \
    OTEL_SERVICE_NAME=$OTEL_SERVICE_NAME

WORKDIR /app
RUN npm install --global vite-plus@0.1.14
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/vp/store \
    vp install --frozen-lockfile

COPY frontend ./frontend
WORKDIR /app/frontend
RUN vp run build

FROM nginxinc/nginx-unprivileged:stable-alpine-slim

ARG API_URL="http://backend:8080/"
ARG GRAFANA_FARO_URL="http://0.0.0.0:12347/"

ENV API_URL=$API_URL \
    GRAFANA_FARO_URL=$GRAFANA_FARO_URL

WORKDIR /app
COPY frontend/nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build --chown=nginx:nginx /app/frontend/dist /app/

EXPOSE 8080
