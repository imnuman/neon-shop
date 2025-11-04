# Neon Shop - Premium Neon Sign Configurator

A premium neon sign configurator platform with B2B/B2C support, featuring real-time 3D customization, instant pricing, and full quote-to-order workflow management.

## 🚀 Features

### ✅ Completed
- **Base UI Components**: Button, Card, Input, Modal, Label
- **Landing Page**: Beautiful hero section with feature highlights
- **3D Configurator**: 
  - Three.js canvas with React Three Fiber
  - Real-time text customization
  - Color picker with presets
  - Size and material selectors
  - Live 3D preview with neon glow effects
- **Live Pricing Calculator**: Automatic price calculation based on configuration
- **Quote System**:
  - Quote submission form with validation (Zod)
  - Customer dashboard to view quotes
  - Admin quote management interface
  - Quote approval/rejection workflow
- **Database**: Prisma schema with PostgreSQL
- **API Routes**: 
  - `/api/quotes` - Create and list quotes
  - `/api/admin/quotes` - Admin quote management
  - `/api/admin/quotes/[id]` - Quote details and updates

### 🚧 In Progress / TODO
- **Email Notifications**: 
  - Quote confirmation emails
  - Quote approval/rejection emails
  - Order status updates
- **Order Management**:
  - Convert approved quotes to orders
  - Payment integration (Stripe)
  - Order tracking for customers
  - Admin order Kanban board
- **Production Management**:
  - Production queue
  - Status updates
  - Worker assignment
- **Product Catalog**:
  - Pre-made design gallery
  - Product management (admin)
- **Authentication**: 
  - Admin login
  - Customer authentication
- **3D Fonts**: Add proper Text3D fonts (currently using placeholder)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Database**: PostgreSQL + Prisma
- **UI Components**: Radix UI
- **Data Fetching**: TanStack Query (React Query)

## 📦 Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create `.env.local`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/neon_shop"
   ```

3. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── app/
│   ├── (admin)/          # Admin routes
│   │   └── quotes/       # Admin quote management
│   ├── (customer)/       # Customer routes
│   │   ├── page.tsx      # Landing page
│   │   ├── configurator/ # 3D configurator
│   │   └── dashboard/    # Customer dashboard
│   ├── api/              # API routes
│   │   ├── quotes/       # Quote CRUD
│   │   └── admin/        # Admin APIs
│   ├── layout.tsx        # Root layout
│   ├── providers.tsx     # React Query provider
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # Base UI components
│   ├── shared/           # Shared components (Header, Footer)
│   ├── configurator/     # 3D configurator components
│   └── admin/            # Admin components
├── lib/
│   ├── db.ts             # Prisma client
│   ├── pricing.ts        # Pricing calculation
│   └── utils.ts          # Utility functions
├── stores/
│   └── configuratorStore.ts  # Zustand store
└── types/
    └── quote.ts          # TypeScript types
```

## 🎨 Key Components

### Configurator Store (`stores/configuratorStore.ts`)
Central state management for the 3D configurator:
- Text, color, size, material, and other design options
- Calculated price
- Actions to update each property

### Pricing Logic (`lib/pricing.ts`)
Calculates price based on:
- Base price
- Text length
- Size multiplier
- Material tier
- Additional options (backing, mounting, power)

### 3D Canvas (`components/configurator/Canvas3D.tsx`)
- Three.js scene setup
- Orbit controls for interaction
- Lighting with neon effects
- Real-time preview updates

## 🧪 Testing

The project includes manual testing checklists in the original project plan. Key flows to test:

1. **Customer Flow**: 
   - Access landing page
   - Customize design in configurator
   - Submit quote
   - View quote in dashboard

2. **Admin Flow**:
   - View quotes list
   - Review quote details with 3D preview
   - Approve/reject quotes

## 📝 Development Notes

- **3D Text Rendering**: Currently using placeholder boxes. To add real 3D text:
  - Add font files to `/public/fonts/`
  - Update `NeonText3D.tsx` to use Text3D with font files
  - Recommended: Use typeface.json format fonts

- **Email Service**: TODO - Integrate Resend or similar service
  - Add `RESEND_API_KEY` to `.env.local`
  - Implement email templates
  - Connect to quote/order workflows

- **Authentication**: TODO - Add NextAuth or similar
  - Admin login
  - Customer authentication
  - Protected routes

## 🚀 Next Steps

1. Set up database and run migrations
2. Test the configurator and quote flow
3. Add email service integration
4. Implement order creation from approved quotes
5. Add payment integration (Stripe)
6. Build admin order management
7. Add production management features

## 📄 License

[Your License Here]
