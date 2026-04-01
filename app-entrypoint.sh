#!/bin/sh
set -e

cd /app/database

echo "Aguardando banco ficar disponível para rodar migrations..."
attempt=1
max_attempts=30

while [ "$attempt" -le "$max_attempts" ]; do
	if pnpm exec prisma migrate deploy; then
		echo "Migrations aplicadas com sucesso."

		echo "Gerando Prisma Client atualizado..."
		pnpm exec prisma generate
		
		break
	fi

	if [ "$attempt" -eq "$max_attempts" ]; then
		echo "Falha ao conectar no banco após $max_attempts tentativas."
		exit 1
	fi

	echo "Tentativa $attempt/$max_attempts falhou. Tentando novamente em 3s..."
	attempt=$((attempt + 1))
	sleep 3
done

echo "Iniciando aplicação..."
cd /app
exec pnpm run dev