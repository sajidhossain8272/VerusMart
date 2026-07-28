'use server'

import { prisma } from '@/lib/prisma'

export async function submitContactMessage(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string

    if (!name || !email || !message) {
      return { success: false, error: 'Name, email, and message are required.' }
    }

    await prisma.contact_messages.create({
      data: {
        name,
        email,
        subject: subject || null,
        message
      }
    })

    return { success: true }
  } catch (error: any) {
    console.error('Contact submit error:', error)
    return { success: false, error: error.message || 'Failed to submit message.' }
  }
}
