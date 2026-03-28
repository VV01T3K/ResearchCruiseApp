FROM mcr.microsoft.com/devcontainers/base:trixie

RUN apt-get update && apt-get install -y --no-install-recommends xdg-utils
USER vscode

RUN curl -fsSL https://vite.plus | bash
RUN curl https://mise.run/zsh | sh
ENV PATH="/home/vscode/.vite-plus/bin:/home/vscode/.local/bin:${PATH}"
COPY frontend/.node-version /tmp/.node-version
RUN cd /tmp && vp env install
RUN vp dlx playwright install chromium
RUN mise use -g claude@latest codex@latest opencode@latest "npm:btca@latest"
COPY mise.toml /tmp/mise.toml
RUN cd /tmp && mise trust && mise install -y
