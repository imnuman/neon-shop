# Neon Shop - Development Workflow

This document outlines the development workflow, project structure, and guidelines for working on the Neon Shop platform.

## 📋 Project Overview

Neon Shop is a premium neon sign configurator platform with B2B/B2C support, featuring:
- Real-time 3D customization with Three.js
- Instant pricing calculator
- Quote-to-order workflow management
- Admin dashboard for order management
- Customer dashboard for quote tracking

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Database**: PostgreSQL + Prisma ORM
- **UI Components**: Radix UI primitives
- **Data Fetching**: TanStack Query (React Query)

## 📁 Project Structure

```
neon-shop/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (admin)/           # Admin routes group
│   │   │   └── quotes/        # Admin quote management
│   │   ├── (customer)/        # Customer routes group
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── configurator/  # 3D configurator page
│   │   │   └── dashboard/     # Customer dashboard
│   │   ├── api/               # API routes
│   │   │   ├── quotes/        # Quote CRUD endpoints
│   │   │   └── admin/         # Admin API endpoints
│   │   ├── layout.tsx         # Root layout
│   │   ├── providers.tsx      # React Query provider
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # Base UI components (shadcn/ui style)
│   │   ├── shared/            # Shared components (Header, Footer)
│   │   ├── configurator/      # 3D configurator components
│   │   └── admin/             # Admin-specific components
│   ├── lib/
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── pricing.ts         # Pricing calculation logic
│   │   └── utils.ts           # Utility functions (cn helper)
│   ├── stores/
│   │   └── configuratorStore.ts  # Zustand store for configurator state
│   └── types/
│       └── quote.ts           # TypeScript type definitions
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                     # Static assets
├── .env.local                  # Environment variables (gitignored)
└── package.json                # Dependencies and scripts

```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Initial Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repo-url>
   cd neon-shop
   npm install
   ```

2. **Set up environment variables**
   Create `.env.local`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/neon_shop"
   ```

3. **Set up database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to `http://localhost:3000`

## 📝 Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Development branch
- Feature branches: `feature/feature-name`
- Bug fixes: `fix/bug-description`

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow TypeScript strict mode
   - Use existing component patterns
   - Write descriptive commit messages

3. **Test locally**
   ```bash
   npm run dev
   # Test the feature thoroughly
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: description of your feature"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Add clear description
   - Reference related issues
   - Request review

### Commit Message Convention

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Example: `feat: add email notification for quote approval`

## 🎨 Code Style Guidelines

### TypeScript
- Use TypeScript strict mode
- Define types in `src/types/` directory
- Avoid `any` - use proper types or `unknown`
- Use interfaces for object shapes
- Use enums from Prisma schema when available

### React Components
- Use functional components with hooks
- Prefer server components (default) over client components
- Add `'use client'` only when necessary (interactivity, hooks)
- Use TypeScript for component props
- Extract reusable logic into custom hooks

### Component Structure
```tsx
// Server Component (default)
import { Component } from '@/components/Component'

export default function Page() {
  return <Component />
}

// Client Component (when needed)
'use client'

import { useState } from 'react'
import { Component } from '@/components/Component'

export function InteractiveComponent() {
  const [state, setState] = useState()
  return <Component />
}
```

### Styling
- Use Tailwind CSS utility classes
- Follow existing design patterns
- Use custom colors from `tailwind.config.ts` (neon-*)
- Keep components responsive (mobile-first)
- Use dark mode classes: `dark:bg-gray-950`

### State Management
- **Zustand**: For global UI state (configurator)
- **React Query**: For server state (API data)
- **Local State**: `useState` for component-specific state

### File Naming
- Components: PascalCase (`Button.tsx`, `QuoteForm.tsx`)
- Utilities: camelCase (`utils.ts`, `pricing.ts`)
- Pages: `page.tsx` (Next.js convention)
- Types: camelCase (`quote.ts`, `user.ts`)

## 🔌 API Routes

### Structure
All API routes are in `src/app/api/`

### Pattern
```typescript
// src/app/api/resource/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Fetch data
    const data = await prisma.resource.findMany()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Error message' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Validate with Zod if needed
    // Create resource
    const data = await prisma.resource.create({ data: body })
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error message' }, { status: 500 })
  }
}
```

### Existing API Endpoints

- `GET /api/quotes` - List user quotes
- `POST /api/quotes` - Create new quote
- `GET /api/admin/quotes` - List all quotes (admin)
- `GET /api/admin/quotes/[id]` - Get quote details
- `PATCH /api/admin/quotes/[id]` - Update quote status

## 💾 Database

### Schema Location
`prisma/schema.prisma`

### Models
- `User` - Customer and admin users
- `Quote` - Quote requests
- `Order` - Orders (from approved quotes)
- `Product` - Pre-made and custom products
- `SavedDesign` - User saved designs
- `Production` - Production tracking
- `Worker` - Production workers

### Migrations
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset
```

### Prisma Client Usage
```typescript
import { prisma } from '@/lib/db'

// Always use the singleton instance
const users = await prisma.user.findMany()
```

## 🧪 Testing Strategy

### Manual Testing Checklist

**Customer Flow:**
- [ ] Landing page loads correctly
- [ ] Can navigate to configurator
- [ ] 3D preview renders
- [ ] Can customize text, color, size
- [ ] Price updates in real-time
- [ ] Can submit quote form
- [ ] Quote appears in dashboard

**Admin Flow:**
- [ ] Can view all quotes
- [ ] Can view quote details
- [ ] Can approve/reject quotes
- [ ] 3D preview works in admin view

### Testing New Features
1. Test in development mode
2. Test different screen sizes (responsive)
3. Test in different browsers
4. Check console for errors
5. Verify database operations work

## 🚢 Deployment

### Environment Variables Needed
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_APP_URL` - Public app URL (if needed)
- Other service API keys as features are added

### Build Process
```bash
npm run build
npm start
```

### Deployment Platforms
- **Vercel** (Recommended for Next.js)
- **Railway**
- **Fly.io**
- Self-hosted with Node.js

## 🔧 Common Tasks

### Adding a New Page
1. Create file in `src/app/route-name/page.tsx`
2. Export default component
3. Add navigation links if needed

### Adding a New Component
1. Create file in appropriate `src/components/` directory
2. Use TypeScript
3. Add PropTypes or TypeScript interfaces
4. Use Tailwind for styling
5. Export component

### Adding a New API Endpoint
1. Create route file: `src/app/api/endpoint/route.ts`
2. Export GET, POST, PUT, DELETE functions
3. Use Prisma for database operations
4. Return NextResponse with JSON
5. Handle errors properly

### Updating Database Schema
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name descriptive_name`
3. Update TypeScript types as needed

### Adding New Dependencies
```bash
npm install package-name
# For dev dependencies
npm install -D package-name
```

## 📚 Key Libraries & Usage

### Zustand Store
```typescript
import { useConfiguratorStore } from '@/stores/configuratorStore'

// In component
const { text, color, setText, setColor } = useConfiguratorStore()
```

### React Query
```typescript
import { useQuery } from '@tanstack/react-query'

const { data, isLoading } = useQuery({
  queryKey: ['quotes'],
  queryFn: () => fetch('/api/quotes').then(res => res.json())
})
```

### React Hook Form + Zod
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1)
})

const form = useForm({
  resolver: zodResolver(schema)
})
```

## 🐛 Troubleshooting

### Database Connection Issues
- Check `.env.local` has correct `DATABASE_URL`
- Verify PostgreSQL is running
- Run `npx prisma generate` after schema changes

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npx tsc --noEmit`

### Port Already in Use
- Next.js will automatically try next port (3001, 3002, etc.)
- Or kill process: `lsof -ti:3000 | xargs kill`

## 📖 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [TanStack Query](https://tanstack.com/query/latest)

## 🔐 Security Notes

- Never commit `.env.local` or `.env` files
- Use environment variables for sensitive data
- Validate all user inputs with Zod
- Use Prisma's built-in SQL injection protection
- Implement proper authentication (TODO)

## 📝 TODO / Future Features

- [ ] Email notifications (Resend integration)
- [ ] Payment integration (Stripe)
- [ ] User authentication (NextAuth)
- [ ] Admin authentication
- [ ] Order management system
- [ ] Production queue tracking
- [ ] 3D font rendering (currently using placeholders)
- [ ] Pre-made design gallery
- [ ] Image upload for custom designs

---

**Last Updated**: January 2025
**Maintained By**: West Side Coding Agent
