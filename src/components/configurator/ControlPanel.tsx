'use client'

import { TextInput } from './TextInput'
import { ColorPicker } from './ColorPicker'
import { SizeSelector } from './SizeSelector'
import { MaterialSelector } from './MaterialSelector'
import { PriceDisplay } from './PriceDisplay'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ControlPanel() {
  return (
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] pr-2">
      <Card>
        <CardHeader>
          <CardTitle>Customize Your Sign</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <TextInput />
          <ColorPicker />
          <SizeSelector />
          <MaterialSelector />
        </CardContent>
      </Card>

      <PriceDisplay />
    </div>
  )
}
