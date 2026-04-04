import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { name, phone, email, message, source = 'contact_form', honeypot } = data

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'Будь ласка, заповніть усі обов’язкові поля' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    // Build data object, omitting empty email
    const orderData: any = {
      name,
      phone,
      message,
      status: 'new',
      source,
      honeypot,
    }

    if (email && email.trim() !== '') {
      orderData.email = email.trim()
    }

    // Save to Payload Orders collection
    await payload.create({
      collection: 'orders',
      data: orderData,
      req, // Pass the Next.js request object for hooks to access headers
    })

    // In a real production environment, you could also send an email here using Resend/Nodemailer
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Order submission error:', error)
    return NextResponse.json(
      { error: 'Сталася помилка при відправці форми. Спробуйте пізніше.' },
      { status: 500 }
    )
  }
}
