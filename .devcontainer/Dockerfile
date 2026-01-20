FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

COPY --from=oven/bun /usr/local/bin/bun /usr/local/bin/bun

COPY --from=caddy:latest /usr/bin/caddy /usr/local/bin/caddy

RUN wget https://packages.microsoft.com/config/debian/12/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    rm packages-microsoft-prod.deb && \
    apt-get update && \
    apt-get install -y dotnet-sdk-10.0
