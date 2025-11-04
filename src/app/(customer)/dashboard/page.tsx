'use client'

import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Package, FileText, Plus } from 'lucide-react'

interface Quote {
  id: string
  quoteNumber: string
  status: string
  calculatedPrice: number
  createdAt: string
}

// Disable static generation - this page requires database access
export const dynamic = 'force-dynamic'

// Dummy quotes for demonstration
const DUMMY_QUOTES: Quote[] = [
  {
    id: '1',
    quoteNumber: 'QT-2024-001',
    status: 'PENDING',
    calculatedPrice: 325.00,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    quoteNumber: 'QT-2024-002',
    status: 'APPROVED',
    calculatedPrice: 485.00,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

export default function DashboardPage() {
  const { data: quotes, isLoading, error } = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/quotes')
        const data = await response.json()
        return data.quotes || []
      } catch (err) {
        console.error('Error fetching quotes:', err)
        // Return dummy data if API fails
        return DUMMY_QUOTES
      }
    },
  })

  // Use dummy data if no quotes from API
  const displayQuotes = (quotes && quotes.length > 0) ? quotes : DUMMY_QUOTES

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your quotes and orders
          </p>
          {error && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg text-sm">
              Note: Showing demo data. API connection issue detected.
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-neon-blue" />
                Quotes
              </CardTitle>
              <CardDescription>Your quote requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{displayQuotes?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-neon-green" />
                Orders
              </CardTitle>
              <CardDescription>Your active orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/configurator">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Design
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Quotes</CardTitle>
            <CardDescription>View and track your quote requests</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : displayQuotes?.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No quotes yet</p>
                <Button asChild>
                  <Link href="/configurator">Create Your First Quote</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {displayQuotes.map((quote: Quote) => {
                  const statusColors: Record<string, string> = {
                    PENDING: 'bg-yellow-100 text-yellow-800',
                    APPROVED: 'bg-green-100 text-green-800',
                    REJECTED: 'bg-red-100 text-red-800',
                    CUSTOMER_APPROVED: 'bg-blue-100 text-blue-800',
                  }
                  
                  return (
                    <div
                      key={quote.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-semibold font-mono text-sm">{quote.quoteNumber}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(quote.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              statusColors[quote.status] || statusColors.PENDING
                            }`}>
                              {quote.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${quote.calculatedPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
