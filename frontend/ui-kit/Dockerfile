FROM mcr.microsoft.com/playwright:v1.61.0-noble

WORKDIR /app

COPY package.json  ./

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm install --frozen-lockfile
RUN pnpm i -g http-server
RUN pnpm run build-storybook
CMD ["sh", "-c", "http-server storybook-static -p 6006 --silent & npx wait-on http://localhost:6006 && pnpm test-storybook"]
