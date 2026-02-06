# Local Development Setup

This guide explains how to run the Django project locally using Docker on Windows.

## Prerequisites

- **Docker Desktop for Windows** installed and running
- **Git** (optional, for version control)
- At least **4GB RAM** available for Docker

## Quick Start

### 1. Copy Environment File

```powershell
Copy-Item .env.local .env
```

Or manually copy `.env.local` to `.env` and adjust values if needed.

### 2. Build and Start Services

```powershell
# Build the Docker images
docker-compose -f docker-compose.local.yml build

# Start all services in detached mode
docker-compose -f docker-compose.local.yml up -d
```

### 3. Check Service Status

```powershell
# View running containers
docker-compose -f docker-compose.local.yml ps

# View logs
docker-compose -f docker-compose.local.yml logs -f web
```

### 4. Access the Application

- **Django Application**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin
- **PostgreSQL**: `localhost:5432` (use DB GUI tools like DBeaver, pgAdmin)
- **Redis**: `localhost:6379` (use Redis Desktop Manager)

## Common Commands

### Start/Stop Services

```powershell
# Start services
docker-compose -f docker-compose.local.yml up -d

# Stop services
docker-compose -f docker-compose.local.yml down

# Stop and remove volumes (WARNING: deletes database data)
docker-compose -f docker-compose.local.yml down -v
```

### View Logs

```powershell
# All services
docker-compose -f docker-compose.local.yml logs -f

# Specific service
docker-compose -f docker-compose.local.yml logs -f web
docker-compose -f docker-compose.local.yml logs -f celery_worker
```

### Database Management

```powershell
# Run migrations
docker-compose -f docker-compose.local.yml exec web python manage.py migrate

# Create superuser
docker-compose -f docker-compose.local.yml exec web python manage.py createsuperuser

# Access Django shell
docker-compose -f docker-compose.local.yml exec web python manage.py shell

# Access database shell
docker-compose -f docker-compose.local.yml exec web python manage.py dbshell

# Or connect directly to PostgreSQL
docker-compose -f docker-compose.local.yml exec postgres psql -U django_user -d django_db
```

### Static Files

```powershell
# Collect static files
docker-compose -f docker-compose.local.yml exec web python manage.py collectstatic --noinput
```

### Rebuild After Code Changes

```powershell
# Rebuild and restart specific service
docker-compose -f docker-compose.local.yml up -d --build web

# Rebuild all services
docker-compose -f docker-compose.local.yml up -d --build
```

## Optional: Run with Nginx

By default, nginx is disabled for local development. To enable it:

```powershell
docker-compose -f docker-compose.local.yml --profile with-nginx up -d
```

Then access the application via nginx at http://localhost

## Troubleshooting

### Port Already in Use

If you get "port already allocated" errors:

1. Check what's using the port:
   ```powershell
   netstat -ano | findstr :8000
   netstat -ano | findstr :5432
   netstat -ano | findstr :6379
   ```

2. Stop the conflicting service or change the port in `docker-compose.local.yml`

### Database Connection Issues

```powershell
# Check if PostgreSQL is healthy
docker-compose -f docker-compose.local.yml ps postgres

# View PostgreSQL logs
docker-compose -f docker-compose.local.yml logs postgres

# Restart PostgreSQL
docker-compose -f docker-compose.local.yml restart postgres
```

### Permission Issues on Windows

If you encounter permission issues with volumes:

1. Ensure Docker Desktop has access to your drive (Settings → Resources → File Sharing)
2. Try running Docker Desktop as Administrator

### Clear Everything and Start Fresh

```powershell
# Stop all containers
docker-compose -f docker-compose.local.yml down

# Remove volumes (WARNING: deletes all data)
docker-compose -f docker-compose.local.yml down -v

# Remove images
docker-compose -f docker-compose.local.yml down --rmi all

# Rebuild from scratch
docker-compose -f docker-compose.local.yml build --no-cache
docker-compose -f docker-compose.local.yml up -d
```

### View Container Resource Usage

```powershell
docker stats
```

## Development Workflow

### Making Code Changes

1. Edit your Python files in your IDE
2. The Django development server will automatically reload
3. Refresh your browser to see changes

### Installing New Python Packages

1. Add package to `requirements.txt`
2. Rebuild the web service:
   ```powershell
   docker-compose -f docker-compose.local.yml up -d --build web
   ```

### Database Migrations

```powershell
# Create new migration
docker-compose -f docker-compose.local.yml exec web python manage.py makemigrations

# Apply migrations
docker-compose -f docker-compose.local.yml exec web python manage.py migrate
```

## Switching Between Local and Production

### Local Development
```powershell
docker-compose -f docker-compose.local.yml up -d
```

### Production
```powershell
docker-compose -f docker-compose.yml up -d
```

## Database Connection Details

Use these credentials to connect with database GUI tools:

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `django_db`
- **Username**: `django_user`
- **Password**: `devpassword` (or check your `.env` file)

## Redis Connection Details

- **Host**: `localhost`
- **Port**: `6379`
- **Database**: `0`
- **Password**: None

## Useful Docker Commands

```powershell
# Execute command in running container
docker-compose -f docker-compose.local.yml exec web <command>

# Run one-off command
docker-compose -f docker-compose.local.yml run --rm web <command>

# Access container shell
docker-compose -f docker-compose.local.yml exec web bash

# Copy files from container
docker cp yarko_web_local:/app/some-file.txt ./

# Copy files to container
docker cp ./some-file.txt yarko_web_local:/app/
```

## Performance Tips

1. **Allocate more resources to Docker Desktop**:
   - Settings → Resources → Advanced
   - Increase CPUs and Memory

2. **Use WSL 2 backend** (if on Windows 10/11):
   - Settings → General → Use WSL 2 based engine

3. **Disable unnecessary services**:
   - Comment out services you don't need in `docker-compose.local.yml`

## Getting Help

- Check logs: `docker-compose -f docker-compose.local.yml logs -f`
- Inspect container: `docker-compose -f docker-compose.local.yml exec web bash`
- Check Django settings: `docker-compose -f docker-compose.local.yml exec web python manage.py diffsettings`
