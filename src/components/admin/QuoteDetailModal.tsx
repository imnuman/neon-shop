'use client'

import { useState } from 'react'
import nextDynamic from 'next/dynamic'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useConfiguratorStore } from '@/stores/configuratorStore'
import { useEffect } from 'react'
import { Check, X } from 'lucide-react'

// Dynamically import Canvas3D with SSR disabled to prevent build-time errors
const Canvas3D = nextDynamic(() => import('@/components/configurator/Canvas3D').then(mod => ({ default: mod.Canvas3D })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
      <div className="text-white">Loading 3D preview...</div>
    </div>
  ),
})

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
  customerNotes?: string
}

interface QuoteDetailModalProps {
  quote: Quote
  open: boolean
  onClose: () => void
}

export function QuoteDetailModal({ quote, open, onClose }: QuoteDetailModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [approvedPrice, setApprovedPrice] = useState(quote.calculatedPrice.toString())
  const [businessNotes, setBusinessNotes] = useState('')
  const { setText, setColor, setSize, setMaterial, setFontStyle } = useConfiguratorStore()

  // Load quote config into store for 3D preview
  useEffect(() => {
    if (open && quote) {
      setText(quote.customText)
      setColor(quote.color)
      setSize(quote.size)
      setMaterial(quote.material)
      setFontStyle(quote.fontStyle)
    }
  }, [open, quote, setText, setColor, setSize, setMaterial, setFontStyle])

  const handleApprove = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'APPROVED',
          approvedPrice: parseFloat(approvedPrice),
          businessNotes,
        }),
      })

      if (!response.ok) throw new Error('Failed to approve quote')

      // TODO: Send approval email
      onClose()
      window.location.reload()
    } catch (error) {
      console.error('Error approving quote:', error)
      alert('Failed to approve quote')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/quotes/${quote.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'REJECTED',
          businessNotes,
        }),
      })

      if (!response.ok) throw new Error('Failed to reject quote')

      // TODO: Send rejection email
      onClose()
      window.location.reload()
    } catch (error) {
      console.error('Error rejecting quote:', error)
      alert('Failed to reject quote')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quote Details - {quote.quoteNumber}</DialogTitle>
          <DialogDescription>
            Review and approve or reject this quote request
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* 3D Preview */}
          <div>
            <h3 className="font-semibold mb-4">3D Preview</h3>
            <div className="aspect-square rounded-lg overflow-hidden">
              <Canvas3D />
            </div>
          </div>

          {/* Quote Details */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {quote.customer.name || 'N/A'}</p>
                <p><strong>Email:</strong> {quote.customer.email}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Design Configuration</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Text:</strong> {quote.customText}</p>
                <p><strong>Size:</strong> {quote.size}</p>
                <p><strong>Material:</strong> {quote.material}</p>
                <p><strong>Color:</strong> 
                  <span 
                    className="inline-block w-4 h-4 rounded ml-2 border" 
                    style={{ backgroundColor: quote.color }}
                  />
                </p>
                <p><strong>Font Style:</strong> {quote.fontStyle}</p>
              </div>
            </div>

            {quote.customerNotes && (
              <div>
                <h3 className="font-semibold mb-2">Customer Notes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded">
                  {quote.customerNotes}
                </p>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-4">Pricing</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="approvedPrice">Approved Price</Label>
                  <Input
                    id="approvedPrice"
                    type="number"
                    value={approvedPrice}
                    onChange={(e) => setApprovedPrice(e.target.value)}
                    min={0}
                    step={0.01}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Calculated: ${quote.calculatedPrice.toFixed(2)}
                  </p>
                </div>

                <div>
                  <Label htmlFor="businessNotes">Business Notes</Label>
                  <textarea
                    id="businessNotes"
                    value={businessNotes}
                    onChange={(e) => setBusinessNotes(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                    placeholder="Internal notes or messages for customer..."
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <Button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="flex-1"
                variant="default"
              >
                <Check className="h-4 w-4 mr-2" />
                Approve Quote
              </Button>
              <Button
                onClick={handleReject}
                disabled={isSubmitting}
                variant="destructive"
                className="flex-1"
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
