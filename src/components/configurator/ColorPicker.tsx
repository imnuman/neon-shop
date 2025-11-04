'use client'

import { HexColorPicker } from 'react-colorful'
import { Label } from '@/components/ui/label'
import { useConfiguratorStore } from '@/stores/configuratorStore'
import { Card, CardContent } from '@/components/ui/card'

const PRESET_COLORS = [
  '#00f2ff', // neon-blue
  '#ff2e97', // neon-pink
  '#7b2ff7', // neon-purple
  '#00ff94', // neon-green
  '#ff6b35', // neon-orange
  '#ffd700', // neon-yellow
  '#ff0000', // red
  '#00ff00', // green
  '#0000ff', // blue
  '#ffffff', // white
]

export function ColorPicker() {
  const { color, setColor } = useConfiguratorStore()

  return (
    <div className="space-y-4">
      <Label>Color</Label>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <HexColorPicker color={color} onChange={setColor} />
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Preset Colors</p>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((presetColor) => (
                  <button
                    key={presetColor}
                    type="button"
                    onClick={() => setColor(presetColor)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      color === presetColor
                        ? 'border-gray-900 scale-110 shadow-lg'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: presetColor }}
                    aria-label={`Select color ${presetColor}`}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Hex Code</p>
              <input
                type="text"
                value={color}
                onChange={(e) => {
                  const value = e.target.value
                  if (/^#[0-9A-F]{0,6}$/i.test(value) || value === '') {
                    setColor(value || '#000000')
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                placeholder="#000000"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
