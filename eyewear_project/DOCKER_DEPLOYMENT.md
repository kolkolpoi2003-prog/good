# Docker Deployment Guide

## Prerequisites

1. **Docker and Docker Compose** installed on your server
2. **SSL Certificates** from Let's Encrypt at `/etc/letsencrypt/live/yourdomain.com/`
3. **Domain name** configured and pointing to your server

## Setup Instructions

### 1. Configure Environment Variables

Copy the example environment file and edit it with your actual values:

```bash
cp .env.example .env
nano .env
```

Update the following values:
- `SECRET_KEY`: Generate a new Django secret key
- `ALLOWED_HOSTS`: Your domain name(s)
- `DB_PASSWORD`: Strong database password
- Replace `yourdomain.com` in nginx.conf with your actual domain

### 2. Update Nginx Configuration

Edit `nginx.conf` and replace all instances of `yourdomain.com` with your actual domain name.

### 3. Build and Start Containers

```bash
# Build the Docker images
docker-compose build

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f
```

### 4. Run Database Migrations

```bash
docker-compose exec web python manage.py migrate
```

### 5. Create Superuser

```bash
docker-compose exec web python manage.py createsuperuser
```

### 6. Collect Static Files

```bash
docker-compose exec web python manage.py collectstatic --noinput
```

## Container Architecture

- **nginx**: Reverse proxy, HTTPS termination, static file serving (Port 443 exposed)
- **web**: Django application with Gunicorn (Internal port 8000)
- **db**: PostgreSQL database (Internal port 5432)
- **redis**: Cache and Celery broker (Internal port 6379)
- **celery**: Background task worker (No exposed ports)

## Useful Commands

```bash
# View logs
docker-compose logs -f [service_name]

# Restart a service
docker-compose restart [service_name]

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database)
docker-compose down -v

# Access Django shell
docker-compose exec web python manage.py shell

# Run Django management commands
docker-compose exec web python manage.py [command]

# Monitor Celery tasks
docker-compose exec celery celery -A config inspect active
```

## SSL Certificate Renewal

Let's Encrypt certificates expire every 90 days. To renew:

```bash
# On the host machine
certbot renew

# Reload Nginx
docker-compose exec nginx nginx -s reload
```

## Security Notes

- All containers except Nginx run on an internal Docker network
- Database and Redis are not accessible from outside
- HTTPS is enforced (HTTP redirects to HTTPS)
- Security headers are configured in Nginx
- Non-root user runs the Django application

## Troubleshooting

### Container won't start
```bash
docker-compose logs [service_name]
```

### Database connection issues
Check that `DB_HOST=db` in your `.env` file

### Static files not loading
```bash
docker-compose exec web python manage.py collectstatic --noinput
docker-compose restart nginx
```

### Celery not processing tasks
```bash
docker-compose logs celery
docker-compose restart celery
```
