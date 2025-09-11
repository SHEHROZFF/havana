require('dotenv').config();

console.log("Loaded ENV Variables:\n");

console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET);
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("PAYPAL_ENVIRONMENT:", process.env.PAYPAL_ENVIRONMENT);
console.log("PAYPAL_CLIENT_ID:", process.env.PAYPAL_CLIENT_ID);
console.log("NEXT_PUBLIC_PAYPAL_CLIENT_ID:", process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
console.log("ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD);
console.log("UPLOAD_DIR:", process.env.UPLOAD_DIR);
console.log("MAX_FILE_SIZE:", process.env.MAX_FILE_SIZE);
