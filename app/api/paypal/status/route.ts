import { NextResponse } from 'next/server'
import { environmentName } from '@/lib/paypal'

export async function GET() {
  // Expose only non-sensitive diagnostics
  const serverEnv = {
    environment: environmentName,
    clientIdPrefix: (process.env.PAYPAL_CLIENT_ID || '').slice(0, 10),
    hasSecret: Boolean(process.env.PAYPAL_CLIENT_SECRET),
    nodeEnv: process.env.NODE_ENV,
    forcedEnv: (process.env.PAYPAL_ENVIRONMENT || '').toLowerCase() || null,
  }
  return NextResponse.json(serverEnv)
}

