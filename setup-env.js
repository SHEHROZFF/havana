#!/usr/bin/env node

/**
 * Environment Setup Helper for Plesk Deployment
 * Run this script to generate secure secrets for your .env file
 */

const crypto = require('crypto');

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

console.log('🔧 Havana Booking System - Environment Setup Helper\n');
console.log('Copy these values to your .env file:\n');

console.log('# Authentication Secrets');
console.log(`NEXTAUTH_SECRET=${generateSecret(32)}`);
console.log(`JWT_SECRET=${generateSecret(32)}\n`);

console.log('# Replace these with your actual values:');
console.log('PAYPAL_CLIENT_ID=your_paypal_client_id_here');
console.log('PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here');
console.log('NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_here');
console.log('NEXTAUTH_URL=https://yourdomain.com');
console.log('ADMIN_EMAIL=admin@yourdomain.com');
console.log('ADMIN_PASSWORD=your_secure_password_here\n');

console.log('✅ Secrets generated! Copy the NEXTAUTH_SECRET and JWT_SECRET values above.');
console.log('🔑 Remember to replace the placeholder values with your actual credentials.');




