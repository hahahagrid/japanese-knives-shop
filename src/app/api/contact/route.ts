import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    // In a real production environment, integrate Resend or Nodemailer here:
    // await resend.emails.send({
    //   from: 'onboarding@resend.dev',
    //   to: 'admin@knives.com.ua',
    //   subject: 'Нове повідомлення з форми контактів',
    //   html: `<p>Ім'я: ${data.name}</p><p>Контакт: ${data.email}</p><p>Повідомлення: ${data.message}</p>`
    // })
    
    console.log('Mock Email Sent - Contact Request:', data)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
  }
}
