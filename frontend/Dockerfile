FROM node:25-alpine AS build

ARG APP_ENVIRONMENT="development"
ARG HYPERDX_API_KEY=""
ARG HYPERDX_API_URL="https://otel.wsiwiec.com"

ENV API_URL="/api" \
    APP_ENVIRONMENT=$APP_ENVIRONMENT \
    HYPERDX_API_KEY=$HYPERDX_API_KEY \
    HYPERDX_API_URL=$HYPERDX_API_URL

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

ENV API_URL=$API_URL

WORKDIR /app
COPY frontend/nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build --chown=nginx:nginx /app/frontend/dist /app/

EXPOSE 8080
