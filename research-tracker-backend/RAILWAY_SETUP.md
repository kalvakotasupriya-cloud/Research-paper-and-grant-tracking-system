# Setting Up MySQL on Railway

## Steps
1. Go to https://railway.app and sign up free
2. Click New Project -> Provision MySQL
3. Click on the MySQL service -> Variables tab
4. Copy these values:
   - MYSQL_HOST -> use as DB_HOST in Render
   - MYSQL_USER -> use as DB_USER
   - MYSQL_PASSWORD -> use as DB_PASSWORD
   - MYSQL_DATABASE -> use as DB_NAME
   - Or copy MYSQL_URL -> use as DATABASE_URL

## Import Schema
1. In Railway MySQL service click "Connect"
2. Use the connection string to connect via TablePlus or DBeaver
3. Run the full db_setup.sql to create tables and seed data

## Alternative: PlanetScale (also free)
1. Go to https://planetscale.com
2. Create database: research-tracker
3. Get connection string
4. Set as DATABASE_URL in Render environment
