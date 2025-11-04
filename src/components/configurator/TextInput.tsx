'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useConfiguratorStore } from '@/stores/configuratorStore'

export function TextInput() {
  const { text, setText } = useConfiguratorStore()

  return (
    <div className="space-y-2">
      <Label htmlFor="text-input">Text</Label>
      <Input
        id="text-input"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text"
        maxLength={50}
      />
      <p className="text-xs text-gray-500">
        {text.length}/50 characters
      </p>
    </div>
  )
}
