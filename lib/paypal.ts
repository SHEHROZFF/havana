const paypal = require('@paypal/checkout-server-sdk')

// NOTE: Credentials can be overridden at runtime by admin via DB-stored config.
let RESOLVED_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || ''
let RESOLVED_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || ''
let RESOLVED_ENV: 'live' | 'sandbox' = 'live'

try {
  // Lazy require to avoid circulars
  const { prisma } = require('@/lib/prisma')
  // This is synchronous looking but prisma call is async; we cannot await here.
  // So we keep env defaults; API routes that need the client will refetch DB config when executing.
} catch {}

// Build environment using current resolved values; API routes can construct fresh clients when needed.
const environment = new paypal.core.LiveEnvironment(RESOLVED_CLIENT_ID, RESOLVED_CLIENT_SECRET)

const client = new paypal.core.PayPalHttpClient(environment)

// Diagnostics
const environmentName = RESOLVED_ENV

export { client, paypal, environmentName }

// PayPal configuration for client-side (React SDK reads clientId)
export const PAYPAL_CLIENT_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  currency: 'USD',
  intent: 'capture'
}