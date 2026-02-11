FROM mcr.microsoft.com/devcontainers/base:trixie

RUN apt-get update && apt-get install -y --no-install-recommends nodejs 

USER vscode

RUN curl https://mise.run/zsh | sh
ENV PATH="/home/vscode/.local/bin:${PATH}"

RUN mise exec bun@latest -- bunx playwright install --with-deps chromium

RUN mise use -g claude@latest codex@latest opencode@latest
COPY mise.toml /tmp/mise.toml
RUN cd /tmp && mise trust && mise install