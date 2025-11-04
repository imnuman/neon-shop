import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Sparkles, Wand2, Zap, Palette, Truck } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-20 px-4">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="container relative z-10 mx-auto text-center">
            <div className="mb-8 inline-flex items-center rounded-full border border-neon-blue/20 bg-neon-blue/10 px-4 py-2 text-sm">
              <Sparkles className="mr-2 h-4 w-4 text-neon-blue" />
              <span className="text-neon-blue">Custom Neon Signs Made Easy</span>
            </div>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
              Illuminate Your
              <span className="block bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue bg-clip-text text-transparent">
                Space with Style
              </span>
            </h1>
            
            <p className="mb-10 mx-auto max-w-2xl text-xl text-gray-300">
              Create stunning custom neon signs in 3D. Real-time preview, instant pricing, 
              and premium quality guaranteed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="neon" asChild>
                <Link href="/configurator">
                  <Wand2 className="mr-2 h-5 w-5" />
                  Start Designing
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20" asChild>
                <Link href="/shop">Browse Designs</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-white dark:bg-gray-950">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Everything you need to create the perfect neon sign
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <div className="mb-4 h-12 w-12 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                    <Wand2 className="h-6 w-6 text-neon-blue" />
                  </div>
                  <CardTitle>3D Configurator</CardTitle>
                  <CardDescription>
                    See your design come to life in real-time with our interactive 3D preview
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 h-12 w-12 rounded-lg bg-neon-pink/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-neon-pink" />
                  </div>
                  <CardTitle>Instant Pricing</CardTitle>
                  <CardDescription>
                    Get accurate pricing instantly as you customize your design
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 h-12 w-12 rounded-lg bg-neon-purple/10 flex items-center justify-center">
                    <Palette className="h-6 w-6 text-neon-purple" />
                  </div>
                  <CardTitle>Endless Options</CardTitle>
                  <CardDescription>
                    Choose from unlimited colors, fonts, sizes, and materials
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-4 h-12 w-12 rounded-lg bg-neon-green/10 flex items-center justify-center">
                    <Truck className="h-6 w-6 text-neon-green" />
                  </div>
                  <CardTitle>Fast Delivery</CardTitle>
                  <CardDescription>
                    Premium quality signs delivered to your door with tracking
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Create Your Sign?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have illuminated their spaces with our custom neon signs.
            </p>
            <Button size="lg" variant="outline" className="bg-white text-neon-purple border-white hover:bg-white/90" asChild>
              <Link href="/configurator">Get Started Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
