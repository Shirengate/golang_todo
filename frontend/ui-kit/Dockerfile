FROM node:22-slim AS builder

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY ui-kit/package.json ./ui-kit/

RUN pnpm install --frozen-lockfile

COPY ui-kit/ ./ui-kit/

RUN pnpm --filter ui-kit run build-storybook


FROM mcr.microsoft.com/playwright:v1.61.0-noble


WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY --from=builder /app /app

RUN pnpm add -g http-server

EXPOSE 6006

CMD ["sh", "-c", "http-server ui-kit/storybook-static -p 6006 --silent & npx wait-on http://localhost:6006 && pnpm --filter ui-kit run test-storybook --url http://localhost:6006"]
