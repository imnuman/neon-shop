'use client'

import { Label } from '@/components/ui/label'
import { useConfiguratorStore } from '@/stores/configuratorStore'

const MATERIALS = [
  { value: 'standard', label: 'Standard', description: 'Durable acrylic tube' },
  { value: 'premium', label: 'Premium', description: 'High-grade LED with enhanced glow' },
  { value: 'luxury', label: 'Luxury', description: 'Premium materials with warranty' },
]

export function MaterialSelector() {
  const { material, setMaterial } = useConfiguratorStore()

  return (
    <div className="space-y-3">
      <Label>Material</Label>
      <div className="space-y-2">
        {MATERIALS.map((materialOption) => (
          <button
            key={materialOption.value}
            type="button"
            onClick={() => setMaterial(materialOption.value)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              material === materialOption.value
                ? 'border-neon-blue bg-neon-blue/10 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">{materialOption.label}</div>
            <div className="text-sm text-gray-500 mt-1">
              {materialOption.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
