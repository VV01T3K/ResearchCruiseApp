FROM oven/bun:1-alpine AS build

ARG APP_ENVIRONMENT="development"
ARG OTEL_SERVICE_NAME="research-cruise-app-frontend"

ENV API_URL="/api" \
    GRAFANA_FARO_URL="/faro/collect" \
    APP_ENVIRONMENT=$APP_ENVIRONMENT \
    OTEL_SERVICE_NAME=$OTEL_SERVICE_NAME

WORKDIR /app
COPY package.json bun.lock ./
RUN --mount=type=cache,id=bun,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM dhi.io/nginx:1.29-alpine3.23

ARG API_URL="http://backend:8080/"
ARG GRAFANA_FARO_URL="http://0.0.0.0:12347/"

ENV API_URL=$API_URL \
    GRAFANA_FARO_URL=$GRAFANA_FARO_URL

WORKDIR /app
COPY --chown=nginx:nginx nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build --chown=nginx:nginx /app/dist /app/

EXPOSE 8080