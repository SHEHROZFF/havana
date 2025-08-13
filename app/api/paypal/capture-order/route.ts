import { NextRequest, NextResponse } from 'next/server'
import { paypal } from '@/lib/paypal'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { orderID } = await request.json()

    if (!orderID) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Build a fresh client using latest admin-configured credentials (fallback to env)
    const config = await prisma.paymentConfig.findFirst({ orderBy: { updatedAt: 'desc' } })
    const envName = (config?.environment || 'live').toLowerCase()
    const clientId = config?.clientId || process.env.PAYPAL_CLIENT_ID!
    const clientSecret = config?.clientSecret || process.env.PAYPAL_CLIENT_SECRET!

    const env = envName === 'sandbox'
      ? new paypal.core.SandboxEnvironment(clientId, clientSecret)
      : new paypal.core.LiveEnvironment(clientId, clientSecret)
    const dynamicClient = new paypal.core.PayPalHttpClient(env)

    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderID)
    captureRequest.requestBody({})

    const response = await dynamicClient.execute(captureRequest)

    if (response.result.status === 'COMPLETED') {
      const captureId = response.result.purchaseUnits?.[0]?.payments?.captures?.[0]?.id
      const amount = response.result.purchaseUnits?.[0]?.payments?.captures?.[0]?.amount?.value
      const currency = response.result.purchaseUnits?.[0]?.payments?.captures?.[0]?.amount?.currencyCode

      return NextResponse.json({
        success: true,
        orderID,
        captureId,
        amount,
        currency,
        status: response.result.status,
        transactionDetails: response.result
      })
    } else {
      throw new Error(`Payment capture failed with status: ${response.result.status}`)
    }

  } catch (error) {
    console.error('PayPal Capture Order Error:', error)
    return NextResponse.json(
      { error: 'Failed to capture PayPal payment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}