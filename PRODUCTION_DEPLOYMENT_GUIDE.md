# 🚀 Production Deployment Guide

## Pre-Deployment Checklist

### ✅ Environment Variables
Ensure all required environment variables are set:

```bash
# Database Configuration
DB_HOST=your-database-host
DB_PORT=3306
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=your-database-name

# Security
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters-long
NODE_ENV=production

# Frontend URL
FRONTEND_URL=https://your-domain.com

# Optional AI Services
HUGGINGFACE_API_KEY=your-huggingface-key
```

### ✅ Database Setup
1. Create production database
2. Run migrations: `npm run migrate`
3. Create admin user: `npm run create-admin`

### ✅ SSL Certificate
Ensure SSL certificate is properly configured for HTTPS

## Deployment Steps

### 1. Backend Deployment (VPS/Server)

```bash
# Clone repository
git clone your-repo-url
cd vagus_update-new-main

# Install dependencies
cd backend
npm install --production

# Set environment variables
cp .env.example .env
# Edit .env with production values

# Start with PM2
npm install -g pm2
pm2 start server.js --name "vagus-backend"

# Enable PM2 startup
pm2 startup
pm2 save
```

### 2. Frontend Deployment (Vercel/Netlify)

```bash
# Build frontend
cd client
npm install
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod
```

### 3. Nginx Configuration (if using VPS)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

## Post-Deployment Verification

### 1. Health Checks
```bash
# Check backend health
curl https://your-domain.com/health

# Check database connection
curl https://your-domain.com/api/health
```

### 2. Security Scan
```bash
# Run security scan
npm audit --audit-level=high

# Check for vulnerabilities
npm outdated
```

### 3. Performance Test
```bash
# Test API response times
curl -w "@curl-format.txt" -o /dev/null -s "https://your-domain.com/api/health"
```

## Monitoring Setup

### 1. Log Monitoring
- Logs are automatically saved to `backend/logs/`
- Monitor `error.log` for critical issues
- Monitor `combined.log` for general activity

### 2. Process Monitoring
```bash
# Check PM2 status
pm2 status
pm2 logs vagus-backend

# Monitor system resources
htop
df -h
```

### 3. Database Monitoring
```bash
# Check database connections
mysql -u root -p -e "SHOW PROCESSLIST;"

# Monitor slow queries
mysql -u root -p -e "SHOW VARIABLES LIKE 'slow_query_log';"
```

## Backup Strategy

### 1. Database Backup
```bash
# Create daily backup
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > /backups/backup_$DATE.sql
find /backups -name "backup_*.sql" -mtime +7 -delete
```

### 2. File Backup
```bash
# Backup uploads directory
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check environment variables
   - Verify database server is running
   - Check firewall settings

2. **SSL Certificate Issues**
   - Verify certificate paths in nginx config
   - Check certificate expiration
   - Test with `openssl s_client`

3. **Memory Issues**
   - Monitor with `pm2 monit`
   - Increase Node.js memory limit: `node --max-old-space-size=4096`

4. **Rate Limiting**
   - Check rate limit configuration
   - Monitor for abuse patterns

### Emergency Procedures

1. **Rollback Deployment**
   ```bash
   pm2 restart vagus-backend
   # Or rollback to previous version
   git checkout previous-commit
   pm2 restart vagus-backend
   ```

2. **Database Recovery**
   ```bash
   mysql -u username -p database_name < backup_file.sql
   ```

3. **Emergency Maintenance Mode**
   - Create maintenance page
   - Redirect all traffic to maintenance page
   - Perform necessary fixes

## Security Checklist

- [ ] HTTPS enabled
- [ ] Strong JWT secret (32+ characters)
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Database credentials secured
- [ ] File upload restrictions
- [ ] Input validation enabled
- [ ] Error messages sanitized
- [ ] Logs don't contain sensitive data

## Performance Optimization

- [ ] Gzip compression enabled
- [ ] Static assets cached
- [ ] Database indexes optimized
- [ ] CDN configured (if applicable)
- [ ] Image optimization enabled
- [ ] Lazy loading implemented

## Support Contacts

- **Technical Issues**: [Your Contact]
- **Database Issues**: [DBA Contact]
- **Server Issues**: [Server Admin Contact]
- **Domain/SSL Issues**: [Domain Provider Contact] 