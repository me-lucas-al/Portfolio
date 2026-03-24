#!/bin/sh
set -e

echo "Rodando migrations do Prisma..."
cd /app/database
pnpm exec prisma migrate deploy

echo "Iniciando aplicação..."
cd /app
exec pnpm run dev