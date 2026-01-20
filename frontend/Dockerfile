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

FROM dhi.io/caddy:2-debian13

ENV API_URL="http://backend:8080" \
    GRAFANA_FARO_URL="http://grafana-agent:12345"

WORKDIR /app
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /app/

EXPOSE 8080