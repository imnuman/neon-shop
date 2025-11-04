'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-950/95">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-neon-blue" />
          <span className="text-xl font-bold bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue bg-clip-text text-transparent">
            Neon Shop
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/configurator"
            className="text-sm font-medium text-gray-700 hover:text-neon-blue transition-colors"
          >
            Configurator
          </Link>
          <Link
            href="/shop"
            className="text-sm font-medium text-gray-700 hover:text-neon-blue transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-700 hover:text-neon-blue transition-colors"
          >
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/configurator">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
