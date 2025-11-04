import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-neon-blue" />
              <span className="text-xl font-bold bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue bg-clip-text text-transparent">
                Neon Shop
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Premium custom neon signs for your space. B2B & B2C solutions.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/configurator" className="text-gray-600 hover:text-neon-blue dark:text-gray-400">
                  Configurator
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-600 hover:text-neon-blue dark:text-gray-400">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-neon-blue dark:text-gray-400">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-neon-blue dark:text-gray-400">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-neon-blue dark:text-gray-400">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-neon-blue dark:text-gray-400">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-gray-600 hover:text-neon-blue dark:text-gray-400">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-neon-blue dark:text-gray-400">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-neon-blue dark:text-gray-400">
                  Returns
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Neon Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
