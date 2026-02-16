FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

# Fix expired Yarn GPG key that breaks docker-in-docker feature
# See: https://github.com/devcontainers/features/issues/1543
RUN rm -f /etc/apt/sources.list.d/yarn.list

COPY --from=oven/bun /usr/local/bin/bun /usr/local/bin/bun
RUN ln -s /usr/local/bin/bun /usr/local/bin/bunx

RUN wget https://packages.microsoft.com/config/debian/12/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    rm packages-microsoft-prod.deb && \
    apt-get update && \
    apt-get install -y dotnet-sdk-10.0 && \
    dotnet tool install --tool-path /usr/local/bin dotnet-ef --version 10.0.3

