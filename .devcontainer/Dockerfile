FROM mcr.microsoft.com/devcontainers/base:trixie

RUN apt-get update && apt-get install -y --no-install-recommends nodejs xdg-utils
USER vscode

RUN curl -fsSL https://vite.plus | bash
RUN curl https://mise.run/zsh | sh
ENV PATH="/home/vscode/.local/bin:${PATH}"
RUN mise exec bun -- bun x playwright install chromium
RUN mise use -g claude@latest codex@latest opencode@latest
COPY mise.toml /tmp/mise.toml
RUN cd /tmp && mise trust && mise install -y
