const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Updating business settings in database...')
  try {
    const updated = await prisma.business_settings.upsert({
      where: { id: 1 },
      update: {
        company_name: 'Verus Mart',
        phone: '+880 1628083370',
        email: 'verusmart4@gmail.com',
        address: 'Kawla, Dhaka - 1229',
        shipping_inside: 60.00,
        shipping_outside: 120.00,
      },
      create: {
        id: 1,
        company_name: 'Verus Mart',
        phone: '+880 1628083370',
        email: 'verusmart4@gmail.com',
        address: 'Kawla, Dhaka - 1229',
        shipping_inside: 60.00,
        shipping_outside: 120.00,
      }
    })
    console.log('Successfully updated business settings:', updated)
  } catch (err) {
    console.error('Error updating business settings:', err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
