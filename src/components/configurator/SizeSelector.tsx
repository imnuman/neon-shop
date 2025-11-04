'use client'

import { Label } from '@/components/ui/label'
import { useConfiguratorStore } from '@/stores/configuratorStore'

const SIZES = [
  { value: 'small', label: 'Small', description: 'Up to 12" (30cm)' },
  { value: 'medium', label: 'Medium', description: '12"-24" (30-60cm)' },
  { value: 'large', label: 'Large', description: '24"-48" (60-120cm)' },
  { value: 'extra-large', label: 'Extra Large', description: '48"+" (120cm+)' },
]

export function SizeSelector() {
  const { size, setSize } = useConfiguratorStore()

  return (
    <div className="space-y-3">
      <Label>Size</Label>
      <div className="grid grid-cols-2 gap-3">
        {SIZES.map((sizeOption) => (
          <button
            key={sizeOption.value}
            type="button"
            onClick={() => setSize(sizeOption.value)}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              size === sizeOption.value
                ? 'border-neon-blue bg-neon-blue/10 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">{sizeOption.label}</div>
            <div className="text-sm text-gray-500 mt-1">
              {sizeOption.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
