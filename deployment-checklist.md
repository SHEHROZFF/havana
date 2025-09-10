# Quick Deployment Checklist for Plesk

## Before Upload:
1. ✅ Create `.env` file with your actual credentials
2. ✅ Replace placeholder values in `.env`:
   - `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`
   - `NEXTAUTH_SECRET` (generate random string)
   - `JWT_SECRET` (generate random string)
   - `NEXTAUTH_URL` (your actual domain)
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD`

## Upload to Plesk:
1. 📁 Upload entire `havana` folder to `httpdocs`
2. 🔧 Configure Node.js in Plesk:
   - Document Root: `/httpdocs/havana`
   - Startup file: `server.js`
   - Node.js version: 18+

## In Plesk Terminal:
```bash
cd httpdocs/havana
npm install
npm run build
npx prisma migrate deploy
npx prisma generate
mkdir -p public/uploads/payment-slips
chmod 755 public/uploads/payment-slips
```

## Final Steps:
1. 🔒 Enable SSL certificate
2. 🚀 Start Node.js application in Plesk
3. 🌐 Test your domain

That's it! Your booking system should be live! 🎉




