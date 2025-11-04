'use client'

import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

// Dummy products for demonstration
const DUMMY_PRODUCTS = [
  {
    id: '1',
    name: 'Welcome Sign',
    description: 'A classic welcome sign in neon blue',
    price: 299,
    preview: 'WELCOME',
    color: '#00f2ff',
  },
  {
    id: '2',
    name: 'Love Sign',
    description: 'Romantic neon love sign in pink',
    price: 249,
    preview: 'LOVE',
    color: '#ff2e97',
  },
  {
    id: '3',
    name: 'Open Sign',
    description: 'Business open sign in purple',
    price: 349,
    preview: 'OPEN',
    color: '#7b2ff7',
  },
  {
    id: '4',
    name: 'Bar Sign',
    description: 'Stylish bar sign in green',
    price: 399,
    preview: 'BAR',
    color: '#00ff94',
  },
]

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Pre-Made Designs</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse our collection of popular neon sign designs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DUMMY_PRODUCTS.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div 
                className="h-48 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center"
                style={{ backgroundColor: product.color + '20' }}
              >
                <div 
                  className="text-4xl font-bold"
                  style={{ 
                    color: product.color,
                    textShadow: `0 0 20px ${product.color}, 0 0 40px ${product.color}`,
                  }}
                >
                  {product.preview}
                </div>
              </div>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">${product.price}</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/configurator">
                      Customize
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-neon-purple mx-auto mb-4" />
              <CardTitle>Don't See What You're Looking For?</CardTitle>
              <CardDescription>
                Create a completely custom design with our 3D configurator
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" variant="neon" asChild>
                <Link href="/configurator">
                  Start Customizing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
