#!/bin/bash
echo "Initializing git repository..."
git init
git add .
git commit -m "Initial commit: Research Paper and Grant Tracking System

- Node.js + Express backend with JWT auth
- MySQL database with full schema
- React + Vite frontend with Bootstrap 5
- Chart.js dashboards for admin
- Role-based access: researcher/admin/reviewer/funding_authority
- Postman collections (3 versions) with test scripts
- XML bookstore with DTD and XSD validation
- GitHub Actions CI pipeline"

echo ""
echo "Now run:"
echo "  git remote add origin https://github.com/YOUR_USERNAME/research-tracker.git"
echo "  git branch -M main"
echo "  git push -u origin main"
echo ""
echo "Done!"
