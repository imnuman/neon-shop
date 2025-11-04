'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useConfiguratorStore } from '@/stores/configuratorStore'
import { calculatePrice, formatPrice } from '@/lib/pricing'
import { useEffect } from 'react'

export function PriceDisplay() {
  const { text, fontStyle, color, size, material, backing, mounting, powerOption, price, setPrice } = useConfiguratorStore()

  useEffect(() => {
    const breakdown = calculatePrice({
      text,
      fontStyle,
      color,
      size,
      material,
      backing,
      mounting,
      powerOption,
    })
    setPrice(breakdown.total)
  }, [text, fontStyle, color, size, material, backing, mounting, powerOption, setPrice])

  const breakdown = calculatePrice({
    text,
    fontStyle,
    color,
    size,
    material,
    backing,
    mounting,
    powerOption,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-4xl font-bold text-neon-blue">
          {formatPrice(price)}
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Base Price</span>
            <span>{formatPrice(breakdown.basePrice)}</span>
          </div>
          {breakdown.textLengthCost > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Text ({text.length} chars)</span>
              <span>{formatPrice(breakdown.textLengthCost)}</span>
            </div>
          )}
          {breakdown.materialCost > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Material ({material})</span>
              <span>{formatPrice(breakdown.materialCost)}</span>
            </div>
          )}
          {breakdown.backingCost > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Backing</span>
              <span>{formatPrice(breakdown.backingCost)}</span>
            </div>
          )}
          {breakdown.mountingCost > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Mounting</span>
              <span>{formatPrice(breakdown.mountingCost)}</span>
            </div>
          )}
          {breakdown.powerCost > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Power Option</span>
              <span>{formatPrice(breakdown.powerCost)}</span>
            </div>
          )}
          {breakdown.sizeMultiplier !== 1 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Size Multiplier ({size})</span>
              <span>×{breakdown.sizeMultiplier.toFixed(1)}</span>
            </div>
          )}
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatPrice(breakdown.total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
