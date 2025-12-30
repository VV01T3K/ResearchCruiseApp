FROM node:22-alpine AS build

ENV API_URL="/api"
ENV GRAFANA_FARO_URL="/faro/collect"
ENV BUN_INSTALL="/bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"
ARG APP_ENVIRONMENT="development"
ARG OTEL_SERVICE_NAME="research-cruise-app-frontend"
ENV APP_ENVIRONMENT=$APP_ENVIRONMENT
ENV OTEL_SERVICE_NAME=$OTEL_SERVICE_NAME

RUN apk add --no-cache bash curl unzip
RUN curl -fsSL https://bun.sh/install | bash
WORKDIR /app
COPY . .

RUN --mount=type=cache,id=bun,target=/root/.bun/install/cache bun install --frozen-lockfile
RUN bun run build

FROM nginxinc/nginx-unprivileged:1.27-alpine
USER root

WORKDIR /app
ARG API_URL="http://backend:8080/"
ARG GRAFANA_FARO_URL="http://0.0.0.0:12347/"
ENV API_URL=$API_URL
ENV GRAFANA_FARO_URL=$GRAFANA_FARO_URL

COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build --chown=nginx:nginx /app/dist /app/

USER nginx
EXPOSE 8080
