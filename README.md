# VerusMart - Online Shopping Platform

A production-ready e-commerce platform built with Next.js 16, React 19, Prisma, and PostgreSQL.

## Features

- **Product Catalog** - Browse, search, filter, and sort products by category, price, and type
- **Product Details** - View product images, variants, pricing, and detailed descriptions
- **Shopping Cart** - Add/remove items, update quantities, persisted in localStorage
- **Checkout** - Place orders with delivery address, payment method, and order notes
- **Order Tracking** - Track order status by Order ID
- **User Authentication** - Register and login with bcrypt-hashed passwords
- **Admin Panel** - Manage products, categories, banners, orders, and store settings
- **Static Pages** - About, Contact, Help Center, How to Buy, Returns & Refunds, Privacy Policy, Terms & Conditions, Serving Area

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: bcrypt for password hashing, signed session cookies
- **Analytics**: Google Tag Manager, Meta Pixel, Google Analytics

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sajidhossain8272/VerusMart.git
   cd VerusMart
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and admin credentials
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

### Admin Panel

Access the admin panel at:
- `http://localhost:3000/admin` (main domain)
- `http://admin.localhost:3000` (admin subdomain)

Default admin credentials (development only):
- Email: `admin@verusmart.com`
- Password: `verusMartAdminSecurePass2026!`

**IMPORTANT**: In production, you MUST set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_JWT_SECRET` (min 32 chars) in your environment variables.

## Production Deployment

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PRISMA_DATABASE_URL` | Yes | PostgreSQL connection string |
| `ADMIN_EMAIL` | Yes (prod) | Admin panel email |
| `ADMIN_PASSWORD` | Yes (prod) | Admin panel password |
| `ADMIN_JWT_SECRET` | Yes (prod) | Min 32 chars, used for session signing |
| `SESSION_SECRET` | Yes (prod) | Min 32 chars, used for user session signing |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL |

### Build

```bash
npm run build
npm start
```

### Database Migrations

```bash
npx prisma migrate deploy
```

## Project Structure

```
app/
├── admin/          # Admin panel (dashboard, products, categories, banners, orders)
├── api/            # API routes (auth, checkout)
├── cart/           # Shopping cart page
├── checkout/       # Checkout page
├── components/     # Shared components (Header, Footer, MobileNav, etc.)
├── context/        # React context (CartContext)
├── product/        # Product detail pages
├── products/       # Product listing page
├── wishlist/       # Wishlist page
└── ...             # Static pages
lib/
├── prisma.ts       # Prisma client singleton
prisma/
├── schema.prisma   # Database schema
└── seed.js         # Database seeding script
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run generate` - Generate Prisma client

## License

Private project. All rights reserved.