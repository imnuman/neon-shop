import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { CreateQuoteRequest } from '@/types/quote'

// Disable static generation for API routes
export const dynamic = 'force-dynamic'

// Generate unique quote number
function generateQuoteNumber(): string {
  const prefix = 'QT'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateQuoteRequest = await request.json()
    
    // Validate required fields
    if (!body.email || !body.name || !body.shippingAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: body.email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: body.email,
          name: body.name,
          phone: body.phone,
          role: 'CUSTOMER',
        },
      })
    } else {
      // Update user info if provided
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: body.name || user.name,
          phone: body.phone || user.phone,
        },
      })
    }

    // Create quote
    const quote = await prisma.quote.create({
      data: {
        quoteNumber: generateQuoteNumber(),
        status: 'PENDING',
        customText: body.customText,
        fontStyle: body.fontStyle,
        color: body.color,
        size: body.size,
        material: body.material,
        backing: body.backing,
        mounting: body.mounting,
        powerOption: body.powerOption,
        calculatedPrice: body.calculatedPrice,
        customerId: user.id,
        customerNotes: body.customerNotes,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // TODO: Send confirmation email
    // await sendQuoteConfirmationEmail(user.email, quote)

    return NextResponse.json(
      { 
        success: true, 
        quote: {
          id: quote.id,
          quoteNumber: quote.quoteNumber,
          status: quote.status,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const customerId = searchParams.get('customerId')
    const status = searchParams.get('status')

    const where: any = {}
    if (customerId) where.customerId = customerId
    if (status) where.status = status

    const quotes = await prisma.quote.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ quotes }, { status: 200 })
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
}
