#!/bin/bash
set -e

echo "🚀 Starting deployment..."

echo "📥 Pulling latest changes from GitHub..."
git pull origin main

echo "🔨 Rebuilding containers..."
docker-compose build

echo "🔄 Restarting services..."
docker-compose down
docker-compose up -d

echo "📊 Collecting static files..."
docker-compose exec -T web python manage.py collectstatic --noinput

echo "💾 Running migrations..."
docker-compose exec -T web python manage.py migrate --noinput

echo "✅ Deployment complete!"
docker-compose ps
