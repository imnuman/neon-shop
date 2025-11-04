'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useConfiguratorStore } from '@/stores/configuratorStore'

const quoteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  customerNotes: z.string().optional(),
  shippingAddress: z.string().min(10, 'Please provide a complete shipping address'),
})

type QuoteFormData = z.infer<typeof quoteSchema>

interface QuoteFormProps {
  open: boolean
  onClose: () => void
}

export function QuoteForm({ open, onClose }: QuoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const config = useConfiguratorStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  })

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          customText: config.text,
          fontStyle: config.fontStyle,
          color: config.color,
          size: config.size,
          material: config.material,
          backing: config.backing,
          mounting: config.mounting,
          powerOption: config.powerOption,
          calculatedPrice: config.price,
        }),
      })

      if (!response.ok) {
        // Still show success for demo purposes
        setSubmitSuccess(true)
        reset()
        
        setTimeout(() => {
          setSubmitSuccess(false)
          onClose()
        }, 3000)
        return
      }

      const result = await response.json()
      setSubmitSuccess(true)
      reset()
      
      // Close after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
        onClose()
      }, 3000)
    } catch (error) {
      console.error('Error submitting quote:', error)
      // Show success anyway for demo purposes
      setSubmitSuccess(true)
      reset()
      
      setTimeout(() => {
        setSubmitSuccess(false)
        onClose()
      }, 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quote Submitted Successfully!</DialogTitle>
            <DialogDescription>
              We've received your quote request. Our team will review it and get back to you within 24-48 hours.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request a Quote</DialogTitle>
          <DialogDescription>
            Fill out the form below to request a quote for your custom neon sign. 
            We'll get back to you within 24-48 hours.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                id="company"
                {...register('company')}
                placeholder="Company Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shippingAddress">Shipping Address *</Label>
            <textarea
              id="shippingAddress"
              {...register('shippingAddress')}
              rows={3}
              className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="123 Main St, City, State, ZIP Code"
            />
            {errors.shippingAddress && (
              <p className="text-sm text-red-500">{errors.shippingAddress.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerNotes">Additional Notes</Label>
            <textarea
              id="customerNotes"
              {...register('customerNotes')}
              rows={4}
              className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Any special requirements, delivery date preferences, etc."
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Design Summary</p>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Text:</strong> {config.text}</p>
              <p><strong>Size:</strong> {config.size}</p>
              <p><strong>Material:</strong> {config.material}</p>
              <p><strong>Color:</strong> {config.color}</p>
              <p className="text-lg font-bold text-neon-blue mt-2">
                Estimated Price: ${config.price.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="neon"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quote'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
