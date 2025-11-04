'use client'

import { useState } from 'react'
import { QuoteDetailModal } from './QuoteDetailModal'
import { Button } from '@/components/ui/button'
import { Eye, Check, X } from 'lucide-react'

interface Quote {
  id: string
  quoteNumber: string
  status: string
  customText: string
  fontStyle: string
  color: string
  size: string
  material: string
  calculatedPrice: number
  customer: {
    name: string | null
    email: string
  }
  createdAt: string
  customerNotes?: string
}

interface QuoteTableProps {
  quotes: Quote[]
}

export function QuoteTable({ quotes }: QuoteTableProps) {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'CUSTOMER_APPROVED':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No quotes found
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-medium">Quote #</th>
              <th className="text-left p-4 font-medium">Customer</th>
              <th className="text-left p-4 font-medium">Text</th>
              <th className="text-left p-4 font-medium">Price</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Date</th>
              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr
                key={quote.id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="p-4 font-mono text-sm">{quote.quoteNumber}</td>
                <td className="p-4">
                  <div>
                    <div className="font-medium">{quote.customer.name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{quote.customer.email}</div>
                  </div>
                </td>
                <td className="p-4">{quote.customText}</td>
                <td className="p-4">${quote.calculatedPrice.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(quote.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedQuote(quote)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedQuote && (
        <QuoteDetailModal
          quote={selectedQuote}
          open={!!selectedQuote}
          onClose={() => setSelectedQuote(null)}
        />
      )}
    </>
  )
}
