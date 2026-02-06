#!/bin/bash
# SSL Certificate Setup Script for Let's Encrypt
# Usage: ./ssl-setup.sh

set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

DOMAIN=${DOMAIN:-yarko-solntse.online}
EMAIL=${EMAIL:-admin@yarko-solntse.online}

echo -e "${BLUE}=== SSL Certificate Setup ===${NC}"
echo -e "${YELLOW}Domain: $DOMAIN${NC}"
echo -e "${YELLOW}Email: $EMAIL${NC}"

# Step 1: Create directories for certbot
echo -e "${YELLOW}Creating directories...${NC}"
mkdir -p ./certbot/conf
mkdir -p ./certbot/www
echo -e "${GREEN}✓ Directories created${NC}"

# Step 2: Start nginx in HTTP-only mode for ACME challenge
echo -e "${YELLOW}Starting nginx for ACME challenge...${NC}"
docker compose up -d nginx
sleep 5
echo -e "${GREEN}✓ Nginx started${NC}"

# Step 3: Generate certificates
echo -e "${YELLOW}Requesting SSL certificate from Let's Encrypt...${NC}"
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ SSL certificate obtained successfully${NC}"
else
    echo -e "${RED}✗ Failed to obtain SSL certificate${NC}"
    echo -e "${YELLOW}Please ensure:${NC}"
    echo -e "  1. DNS records for $DOMAIN point to this server"
    echo -e "  2. Port 80 is accessible from the internet"
    echo -e "  3. No firewall is blocking the connection"
    exit 1
fi

# Step 4: Reload nginx with SSL configuration
echo -e "${YELLOW}Reloading nginx with SSL configuration...${NC}"
docker compose restart nginx
echo -e "${GREEN}✓ Nginx restarted with SSL${NC}"

# Step 5: Set up automatic renewal
echo -e "${YELLOW}Setting up automatic certificate renewal...${NC}"
docker compose up -d certbot
echo -e "${GREEN}✓ Certbot renewal service started${NC}"

# Step 6: Test HTTPS connection
echo -e "${YELLOW}Testing HTTPS connection...${NC}"
sleep 5
if curl -sI "https://$DOMAIN" | grep -q "200 OK"; then
    echo -e "${GREEN}✓ HTTPS is working!${NC}"
else
    echo -e "${YELLOW}⚠ HTTPS test inconclusive, please verify manually${NC}"
fi

echo -e "${BLUE}=== SSL Setup Complete ===${NC}"
echo -e "${GREEN}Your site is now accessible at: https://$DOMAIN${NC}"
echo -e "${YELLOW}Certificate will auto-renew every 12 hours${NC}"
