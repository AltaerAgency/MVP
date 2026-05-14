#!/bin/bash
set -e
echo "Running Prisma db push..."
npx prisma db push --accept-data-loss
echo "Starting Next.js..."
exec npx next start -p ${PORT:-3000}
