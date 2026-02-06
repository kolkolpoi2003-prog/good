#!/bin/bash
# Deployment Script for Django Application
# Usage: ./deploy.sh

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Django Application Deployment ===${NC}"

# Step 1: Pull latest code (if using git)
if [ -d .git ]; then
    echo -e "${YELLOW}Pulling latest code from repository...${NC}"
    git pull origin main
    echo -e "${GREEN}✓ Code updated${NC}"
fi

# Step 2: Backup database before deployment
echo -e "${YELLOW}Creating database backup...${NC}"
if [ -f ./scripts/backup.sh ]; then
    bash ./scripts/backup.sh
else
    echo -e "${YELLOW}⚠ Backup script not found, skipping backup${NC}"
fi

# Step 3: Build Docker images
echo -e "${YELLOW}Building Docker images...${NC}"
docker compose build --no-cache
echo -e "${GREEN}✓ Images built${NC}"

# Step 4: Stop containers gracefully
echo -e "${YELLOW}Stopping containers...${NC}"
docker compose down
echo -e "${GREEN}✓ Containers stopped${NC}"

# Step 5: Start containers
echo -e "${YELLOW}Starting containers...${NC}"
docker compose up -d
echo -e "${GREEN}✓ Containers started${NC}"

# Step 6: Wait for services to be healthy
echo -e "${YELLOW}Waiting for services to be healthy...${NC}"
sleep 10

# Check service health
RETRY_COUNT=0
MAX_RETRIES=30
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    HEALTHY_SERVICES=$(docker compose ps --format json | jq -r 'select(.Health == "healthy") | .Name' | wc -l)
    TOTAL_SERVICES=$(docker compose ps --format json | jq -r '.Name' | wc -l)
    
    if docker compose ps | grep -q "unhealthy"; then
        echo -e "${RED}✗ Some services are unhealthy${NC}"
        docker compose ps
        exit 1
    fi
    
    echo -e "${YELLOW}Services starting... ($RETRY_COUNT/$MAX_RETRIES)${NC}"
    sleep 2
    RETRY_COUNT=$((RETRY_COUNT + 1))
done

# Step 7: Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
docker compose exec -T web python manage.py migrate --noinput
echo -e "${GREEN}✓ Migrations complete${NC}"

# Step 8: Collect static files
echo -e "${YELLOW}Collecting static files...${NC}"
docker compose exec -T web python manage.py collectstatic --noinput --clear
echo -e "${GREEN}✓ Static files collected${NC}"

# Step 9: Display service status
echo -e "${BLUE}=== Service Status ===${NC}"
docker compose ps

echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo -e "${BLUE}Application is running at: https://yarko-solntse.ru${NC}"
