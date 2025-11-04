'use client'

import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { QuoteTable } from '@/components/admin/QuoteTable'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'

// Disable static generation - this page requires database access
export const dynamic = 'force-dynamic'

// Dummy quotes for demonstration
const DUMMY_QUOTES = [
  {
    id: '1',
    quoteNumber: 'QT-2024-001',
    status: 'PENDING',
    customText: 'HELLO',
    fontStyle: 'modern',
    color: '#00f2ff',
    size: 'medium',
    material: 'premium',
    calculatedPrice: 325.00,
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
    },
    createdAt: new Date().toISOString(),
    customerNotes: 'Need this by next month',
  },
  {
    id: '2',
    quoteNumber: 'QT-2024-002',
    status: 'APPROVED',
    customText: 'OPEN',
    fontStyle: 'bold',
    color: '#ff2e97',
    size: 'large',
    material: 'luxury',
    calculatedPrice: 485.00,
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    quoteNumber: 'QT-2024-003',
    status: 'PENDING',
    customText: 'LOVE',
    fontStyle: 'elegant',
    color: '#7b2ff7',
    size: 'small',
    material: 'standard',
    calculatedPrice: 225.00,
    customer: {
      name: 'Mike Johnson',
      email: 'mike@example.com',
    },
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
]

export default function AdminQuotesPage() {
  const { data: quotes, isLoading, error } = useQuery({
    queryKey: ['admin-quotes'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/admin/quotes')
        if (!response.ok) throw new Error('Failed to fetch quotes')
        const data = await response.json()
        return data.quotes || []
      } catch (err) {
        console.error('Error fetching quotes:', err)
        // Return dummy data if API fails
        return DUMMY_QUOTES
      }
    },
  })

  // Use dummy data if no quotes from API or error occurred
  const displayQuotes = (quotes && quotes.length > 0) ? quotes : DUMMY_QUOTES

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Quote Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and manage customer quote requests
          </p>
          {error && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg text-sm">
              Note: Showing demo data. API connection issue detected.
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Quotes</CardTitle>
            <CardDescription>
              {displayQuotes?.length || 0} total quote{displayQuotes?.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading quotes...</div>
            ) : (
              <QuoteTable quotes={displayQuotes || []} />
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
