FROM mcr.microsoft.com/devcontainers/base:trixie

RUN apt-get update && apt-get install -y --no-install-recommends xdg-utils python3 libicu76
USER vscode

RUN curl -fsSL https://vite.plus | bash && test -x ~/.vite-plus/bin/vp
RUN curl -fsSL https://mise.run | sh \
    && echo 'eval "$(mise activate bash)"' >> ~/.bashrc \
    && echo 'eval "$(mise activate zsh)"' >> "${ZDOTDIR-$HOME}/.zshrc"
ENV PATH="/home/vscode/.vite-plus/bin:/home/vscode/.local/bin:${PATH}"
COPY frontend/.node-version /tmp/.node-version
RUN cd /tmp && vp env install
# RUN vp dlx playwright@1.59.1 install --with-deps chromium
RUN mise use -g claude@latest codex@latest opencode@latest
# Install the pinned SDK without repository lifecycle hooks before sources exist.
COPY backend/global.json /tmp/backend/global.json
RUN cd /tmp/backend && mise settings add idiomatic_version_file_enable_tools dotnet && mise install dotnet
