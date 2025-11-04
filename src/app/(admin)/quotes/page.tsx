'use client'

import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { QuoteTable } from '@/components/admin/QuoteTable'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'

export default function AdminQuotesPage() {
  const { data: quotes, isLoading } = useQuery({
    queryKey: ['admin-quotes'],
    queryFn: async () => {
      const response = await fetch('/api/admin/quotes')
      if (!response.ok) throw new Error('Failed to fetch quotes')
      const data = await response.json()
      return data.quotes || []
    },
  })

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Quote Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and manage customer quote requests
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Quotes</CardTitle>
            <CardDescription>
              {quotes?.length || 0} total quote{quotes?.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading quotes...</div>
            ) : (
              <QuoteTable quotes={quotes || []} />
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
