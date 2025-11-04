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

export default function DashboardPage() {
  const { data: quotes, isLoading } = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      const response = await fetch('/api/quotes')
      const data = await response.json()
      return data.quotes || []
    },
  })

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your quotes and orders
          </p>
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
              <div className="text-3xl font-bold">{quotes?.length || 0}</div>
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
            ) : quotes?.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No quotes yet</p>
                <Button asChild>
                  <Link href="/configurator">Create Your First Quote</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {quotes.map((quote: Quote) => (
                  <div
                    key={quote.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div>
                      <div className="font-medium">{quote.quoteNumber}</div>
                      <div className="text-sm text-gray-500">
                        ${quote.calculatedPrice.toFixed(2)} • {new Date(quote.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        quote.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : quote.status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {quote.status}
                      </span>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
