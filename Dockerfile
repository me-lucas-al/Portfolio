FROM node:22-alpine

RUN npm install -g pnpm@10.26.1

WORKDIR /app

# Copia apenas os manifests primeiro (cache de dependências)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json .npmrc ./
COPY core/package.json ./core/
COPY database/package.json ./database/
COPY packages/package.json ./packages/
COPY web/package.json ./web/

RUN pnpm install

# Copia o restante do código
COPY core ./core
COPY database ./database
COPY packages ./packages
COPY web ./web

CMD ["pnpm", "run", "dev"]