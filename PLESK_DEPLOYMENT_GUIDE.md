# Plesk Deployment Guide for Havana Booking System

## Prerequisites
- Plesk hosting with Node.js support (version 18 or higher)
- MySQL database (already configured)
- Domain name pointed to your Plesk server

## Step 1: Prepare Environment Variables

Create a `.env` file in your `havana` directory with the following content:

```env
# Database Configuration
DATABASE_URL="mysql://u648271573_havana:Simple@0320@srv1647.hstgr.io:3306/u648271573_booking"

# Environment
NODE_ENV=production

# PayPal Configuration (Replace with your actual PayPal credentials)
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here

# Authentication Secret (Generate a strong random string)
NEXTAUTH_SECRET=your_very_strong_secret_here_change_this
NEXTAUTH_URL=https://yourdomain.com

# Admin Configuration
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_admin_password_here

# File Upload Configuration
UPLOAD_DIR=/uploads
MAX_FILE_SIZE=10485760

# Security
JWT_SECRET=your_jwt_secret_here_change_this
```

## Step 2: Build Configuration

Your `package.json` already has the correct scripts. Update if needed:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate",
    "db:migrate": "prisma migrate dev"
  }
}
```

## Step 3: Plesk Deployment Steps

### A. Upload Files to Plesk

1. **Login to Plesk Control Panel**
2. **Go to your domain's File Manager**
3. **Navigate to `httpdocs` folder**
4. **Upload your entire `havana` project folder**
5. **Extract/unzip if uploaded as archive**

### B. Configure Node.js in Plesk

1. **Go to "Node.js" in your domain settings**
2. **Enable Node.js**
3. **Set Node.js version to 18 or higher**
4. **Set Document Root to**: `/httpdocs/havana`
5. **Set Startup file to**: `server.js` (we'll create this)
6. **Add Environment Variables** from your `.env` file

### C. Create Server File

Create `server.js` in your `havana` directory:

```javascript
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
  .once('error', (err) => {
    console.error(err)
    process.exit(1)
  })
  .listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
```

## Step 4: Install Dependencies and Build

In Plesk File Manager Terminal or SSH:

```bash
cd httpdocs/havana
npm install
npm run build
```

## Step 5: Database Migration

Run Prisma migrations:

```bash
npx prisma migrate deploy
npx prisma generate
```

## Step 6: Configure File Uploads

1. **Create uploads directory**:
   ```bash
   mkdir -p public/uploads/payment-slips
   chmod 755 public/uploads
   chmod 755 public/uploads/payment-slips
   ```

2. **Set proper permissions for file uploads**

## Step 7: Start the Application

1. **In Plesk Node.js settings, click "Enable Node.js"**
2. **Click "Restart App"**
3. **Your application should now be running**

## Step 8: Configure Domain and SSL

1. **Point your domain to the Plesk server**
2. **Enable SSL certificate in Plesk**
3. **Update NEXTAUTH_URL in environment variables to use https://yourdomain.com**

## Troubleshooting

### Common Issues:

1. **Database Connection**: Make sure your database credentials are correct
2. **Environment Variables**: Ensure all required env vars are set in Plesk
3. **File Permissions**: Check that upload directories have proper permissions
4. **Node.js Version**: Use Node.js 18+ for Next.js 15 compatibility

### Logs:

Check application logs in Plesk under "Node.js" > "Logs" section.

## Production Checklist

- [ ] Environment variables configured
- [ ] Database connected and migrated
- [ ] PayPal credentials added
- [ ] File upload directories created
- [ ] SSL certificate installed
- [ ] Domain pointing to server
- [ ] Application started successfully

## Security Notes

1. **Change default secrets** in environment variables
2. **Use strong passwords** for admin accounts
3. **Keep dependencies updated**
4. **Monitor upload directory** for security
5. **Enable HTTPS only**

Your booking system should now be live at your domain!




