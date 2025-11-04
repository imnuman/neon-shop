#!/bin/bash

echo "🔧 Neon Shop Database Setup"
echo "=========================="
echo ""

# Check if PostgreSQL is running
if ! ss -tuln | grep -q ":5432"; then
    echo "❌ PostgreSQL is not running on port 5432"
    echo "Please install and start PostgreSQL first:"
    echo "  sudo apt update"
    echo "  sudo apt install postgresql postgresql-contrib"
    echo "  sudo systemctl start postgresql"
    exit 1
fi

echo "✅ PostgreSQL is running"
echo ""

# Try to create database and user
echo "Creating database and user..."
echo ""
echo "You may need to enter your sudo password, or run PostgreSQL commands manually."
echo ""
echo "Run these commands as the postgres user:"
echo ""
echo "  sudo -u postgres psql -c \"CREATE DATABASE neonshop;\""
echo "  sudo -u postgres psql -c \"CREATE USER neonshop_user WITH PASSWORD 'neonshop_pass';\""
echo "  sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE neonshop TO neonshop_user;\""
echo "  sudo -u postgres psql -c \"ALTER USER neonshop_user CREATEDB;\""
echo ""
echo "Or use the default postgres user (if you know the password):"
echo "  sudo -u postgres psql -c \"ALTER USER postgres PASSWORD 'postgres';\""
echo ""
echo "After setting up, update .env with:"
echo "  DATABASE_URL=\"postgresql://neonshop_user:neonshop_pass@localhost:5432/neonshop\""
echo ""
echo "Or if using default postgres user:"
echo "  DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/neonshop\""
echo ""
