import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { name, phone, email, deliveryInfo, message, items, total } = data

    if (!name || !phone || !items || !items.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Build data object, carefully omitting empty email to avoid CMS validation errors
    const orderData: any = {
      name,
      phone,
      deliveryInfo,
      message: message || '',
      items,
      total: Number(total),
      status: 'new',
      source: 'checkout',
    }

    if (email && email.trim() !== '') {
      orderData.email = email.trim()
    }

    // Generate sequential order number starting from #1001
    const { totalDocs } = await payload.find({
      collection: 'orders',
      limit: 0,
    })
    const orderNumber = `#${1000 + (totalDocs + 1)}`

    // Create the order in Payload CMS
    const order = await payload.create({
      collection: 'orders',
      data: {
        ...orderData,
        orderNumber,
      },
    })

    return NextResponse.json({ success: true, orderId: order.id, orderNumber }, { status: 201 })
  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to process checkout' },
      { status: 500 }
    )
  }
}
