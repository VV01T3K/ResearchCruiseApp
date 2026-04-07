FROM mcr.microsoft.com/devcontainers/base:trixie

RUN apt-get update && apt-get install -y --no-install-recommends xdg-utils
USER vscode

RUN curl -fsSL https://vite.plus | bash
RUN curl -fsSL https://mise.run | sh \
    && echo 'eval "$(mise activate bash)"' >> ~/.bashrc \
    && echo 'eval "$(mise activate zsh)"' >> "${ZDOTDIR-$HOME}/.zshrc"
ENV PATH="/home/vscode/.vite-plus/bin:/home/vscode/.local/bin:${PATH}"
COPY frontend/.node-version /tmp/.node-version
RUN cd /tmp && vp env install
RUN vp dlx playwright@1.59.1 install --with-deps chromium
RUN mise use -g claude@latest codex@latest opencode@latest "npm:btca@latest"
COPY mise.toml /tmp/mise.toml
RUN cd /tmp && mise trust && mise install -y
