import { NextRequest, NextResponse } from 'next/server'
import { paypal } from '@/lib/paypal'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'EUR', description = 'Food Cart Booking' } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      )
    }

    // Derive origin for return/cancel URLs
    const origin = new URL(request.url).origin

    // Build a fresh client using latest admin-configured credentials (fallback to env)
    const config = await prisma.paymentConfig.findFirst({ orderBy: { updatedAt: 'desc' } })
    const envName = (config?.environment || 'live').toLowerCase()
    const clientId = config?.clientId || process.env.PAYPAL_CLIENT_ID!
    const clientSecret = config?.clientSecret || process.env.PAYPAL_CLIENT_SECRET!

    const env = envName === 'sandbox'
      ? new paypal.core.SandboxEnvironment(clientId, clientSecret)
      : new paypal.core.LiveEnvironment(clientId, clientSecret)
    const dynamicClient = new paypal.core.PayPalHttpClient(env)

    const orderRequest = new paypal.orders.OrdersCreateRequest()
    orderRequest.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toString()
          },
          description: description
        }
      ],
      application_context: {
        return_url: `${origin}/booking/success`,
        cancel_url: `${origin}/booking/cancelled`,
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING'
      }
    })

    const response = await dynamicClient.execute(orderRequest)

    if (!response.result.id) {
      throw new Error('Failed to create PayPal order')
    }

    return NextResponse.json({
      orderID: response.result.id,
      status: response.result.status
    })

  } catch (error) {
    console.error('PayPal Create Order Error:', error)
    return NextResponse.json(
      { error: 'Failed to create PayPal order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}