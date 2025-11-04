import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Disable static generation for API routes
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // const session = await getServerSession()
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const quotes = await prisma.quote.findMany({
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
    console.error('Error fetching admin quotes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
}
