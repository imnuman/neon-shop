# Docker Setup Guide

This guide explains how to set up and run Neon Shop using Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd neon-shop
   ```

2. **Build and start containers**
   ```bash
   docker compose build
   docker compose up -d
   ```

3. **Run database migrations**
   ```bash
   docker compose exec app npx prisma migrate deploy
   ```

4. **Access the application**
   - App: http://localhost:3000
   - Database: localhost:5432

## Configuration

### Environment Variables

Create a `.env` file or set environment variables in `docker-compose.yml`:

```env
DATABASE_URL=postgresql://neonshop_user:neonshop_pass@postgres:5432/neonshop
NODE_ENV=production
```

### Database Credentials

Default credentials in `docker-compose.yml`:
- User: `neonshop_user`
- Password: `neonshop_pass`
- Database: `neonshop`

**⚠️ Change these in production!**

## Common Commands

```bash
# Build images
docker compose build

# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f app
docker compose logs -f postgres

# Execute commands in app container
docker compose exec app sh

# Run Prisma commands
docker compose exec app npx prisma migrate deploy
docker compose exec app npx prisma studio

# Rebuild after code changes
docker compose build app
docker compose up -d app
```

## Troubleshooting

### Build Fails

**Error: Cannot find module**
- Solution: Ensure `package.json` and `package-lock.json` are present
- Try: `docker compose build --no-cache`

**Error: Prisma generate fails**
- Solution: Check `prisma/schema.prisma` is valid
- Try: Verify schema syntax with `npx prisma validate`

**Error: Next.js build fails**
- Solution: Check for TypeScript errors
- Try: Build locally first with `npm run build`

### Runtime Issues

**App won't start**
```bash
# Check logs
docker compose logs app

# Check if container is running
docker compose ps

# Restart services
docker compose restart
```

**Database connection fails**
```bash
# Check database is healthy
docker compose ps postgres

# Check database logs
docker compose logs postgres

# Test connection
docker compose exec postgres psql -U neonshop_user -d neonshop
```

**Port already in use**
```bash
# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Use 3001 instead of 3000
```

### Migration Issues

**Migrations not running**
```bash
# Manually run migrations
docker compose exec app npx prisma migrate deploy

# Reset database (⚠️ deletes all data)
docker compose exec app npx prisma migrate reset
```

## Production Deployment

1. **Update environment variables**
   - Use secure passwords
   - Set proper `DATABASE_URL`
   - Configure domain/URL settings

2. **Use production build**
   ```bash
   docker compose -f docker-compose.yml build
   docker compose -f docker-compose.yml up -d
   ```

3. **Set up reverse proxy** (Nginx/Traefik)
   - Point to `localhost:3000`
   - Configure SSL certificates

4. **Set up backups**
   - Regular database backups
   - Volume backups

## Development Mode

For local development, use:

```bash
# Start only database
docker compose -f docker-compose.dev.yml up -d

# Run app locally
npm run dev
```

This keeps the database containerized but runs Next.js locally for hot reloading.

## Security Checklist

- [ ] Change default database passwords
- [ ] Use secrets management (Docker secrets, env files)
- [ ] Enable SSL/TLS
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Limit container resources
- [ ] Use non-root user (already configured)

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
- [Prisma Docker Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-docker)
