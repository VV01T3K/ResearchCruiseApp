FROM node:22-alpine AS build

ENV API_URL="/api"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm i -g corepack@latest
RUN corepack enable
WORKDIR /app
COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine
USER root

WORKDIR /app
ARG API_URL="http://backend:8080/"
ENV API_URL=$API_URL
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build --chown=nginx:nginx /app/dist /app/

USER nginx
EXPOSE 8080
