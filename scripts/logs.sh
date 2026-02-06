#!/bin/bash
# Log Viewer Script for Django Docker Services
# Usage: ./logs.sh [service_name] [options]

set -e

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Show usage
show_usage() {
    echo -e "${BLUE}=== Docker Logs Viewer ===${NC}"
    echo "Usage: $0 [service_name] [options]"
    echo ""
    echo "Available services:"
    echo "  web           - Django application logs"
    echo "  postgres      - PostgreSQL database logs"
    echo "  redis         - Redis cache logs"
    echo "  celery_worker - Celery worker logs"
    echo "  celery_beat   - Celery beat scheduler logs"
    echo "  nginx         - Nginx web server logs"
    echo "  certbot       - SSL certificate logs"
    echo "  all           - All services logs"
    echo ""
    echo "Options:"
    echo "  -f, --follow  - Follow log output (live tail)"
    echo "  -n NUMBER     - Number of lines to show (default: 100)"
    echo ""
    echo "Examples:"
    echo "  $0 web -f              # Follow Django logs"
    echo "  $0 nginx -n 200        # Show last 200 nginx log lines"
    echo "  $0 all --follow        # Follow all service logs"
}

# Default values
SERVICE=""
FOLLOW=false
LINES=100

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_usage
            exit 0
            ;;
        -f|--follow)
            FOLLOW=true
            shift
            ;;
        -n)
            LINES="$2"
            shift 2
            ;;
        web|postgres|redis|celery_worker|celery_beat|nginx|certbot|all)
            SERVICE="$1"
            shift
            ;;
        *)
            echo -e "${YELLOW}Unknown option: $1${NC}"
            show_usage
            exit 1
            ;;
    esac
done

# If no service specified, show usage
if [ -z "$SERVICE" ]; then
    show_usage
    exit 1
fi

# Build docker compose logs command
CMD="docker compose logs"

if [ "$SERVICE" != "all" ]; then
    CMD="$CMD $SERVICE"
fi

if [ "$FOLLOW" = true ]; then
    CMD="$CMD -f"
else
    CMD="$CMD --tail=$LINES"
fi

# Execute command
echo -e "${GREEN}Viewing logs for: $SERVICE${NC}"
echo -e "${BLUE}===============================================${NC}"
eval $CMD
