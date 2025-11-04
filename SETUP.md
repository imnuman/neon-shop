# Database Setup Guide

The project requires a PostgreSQL database. Choose one of the following options:

## Option 1: Neon (Recommended - Free Tier Available)

1. Sign up at [neon.tech](https://neon.tech) (free tier available)
2. Create a new project
3. Copy the connection string (it will look like: `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname`)
4. Update `.env.local`:
   ```env
   DATABASE_URL="your_neon_connection_string_here"
   ```

## Option 2: Supabase (Free Tier Available)

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string under "Connection string" > "URI"
5. Update `.env.local`:
   ```env
   DATABASE_URL="your_supabase_connection_string_here"
   ```

## Option 3: Local PostgreSQL with Docker

1. **Start PostgreSQL container:**
   ```bash
   docker run --name neon-shop-db \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=neonshop \
     -p 5432:5432 \
     -d postgres:15
   ```

2. **Update `.env.local`:**
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/neonshop"
   ```

## Option 4: Install PostgreSQL Locally

### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb neonshop
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
```

Then update `.env.local`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/neonshop"
```

## After Setting Up Database:

1. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Push Schema to Database:**
   ```bash
   npx prisma db push
   ```

3. **(Optional) Open Prisma Studio to view data:**
   ```bash
   npx prisma studio
   ```

## Quick Start with Neon (Recommended)

1. Visit: https://console.neon.tech
2. Sign up (free)
3. Create a project
4. Copy the connection string
5. Update `.env.local` with the connection string
6. Run:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## Troubleshooting

- **Connection refused**: Make sure your database server is running
- **Authentication failed**: Check your username/password in the connection string
- **Database does not exist**: Create the database first or use the default database from your provider
