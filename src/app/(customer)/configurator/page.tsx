'use client'

import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import nextDynamic from 'next/dynamic'
import { ControlPanel } from '@/components/configurator/ControlPanel'
import { Button } from '@/components/ui/button'
import { QuoteForm } from '@/components/configurator/QuoteForm'
import { useState } from 'react'

// Disable static generation - this page uses Three.js which requires client-side rendering
export const dynamic = 'force-dynamic'

// Dynamically import Canvas3D with SSR disabled to prevent build-time errors
const Canvas3D = nextDynamic(() => import('@/components/configurator/Canvas3D').then(mod => ({ default: mod.Canvas3D })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
      <div className="text-white">Loading 3D preview...</div>
    </div>
  ),
})

export default function ConfiguratorPage() {
  const [showQuoteForm, setShowQuoteForm] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Design Your Neon Sign</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your design in real-time and see instant pricing
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 3D Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="aspect-square bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-lg overflow-hidden shadow-2xl">
                <Canvas3D />
              </div>
              
              <div className="mt-4 flex gap-4">
                <Button 
                  onClick={() => setShowQuoteForm(true)}
                  className="flex-1"
                  size="lg"
                  variant="neon"
                >
                  Request Quote
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    // TODO: Save design functionality
                    console.log('Save design')
                  }}
                >
                  Save Design
                </Button>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="lg:col-span-1">
            <ControlPanel />
          </div>
        </div>
      </main>

      <Footer />

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <QuoteForm 
          open={showQuoteForm} 
          onClose={() => setShowQuoteForm(false)} 
        />
      )}
    </div>
  )
}
