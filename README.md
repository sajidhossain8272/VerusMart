# 🛒 VerusMart — Enterprise E-Commerce Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.10-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**VerusMart** is a commercial-grade, high-performance e-commerce platform built for online grocery, fresh produce, authentic fragrances, daily essentials, and consumer electronics in Bangladesh.

---

## 🌟 Visual Showcase & Key Sections

### 1. Modern E-Commerce Storefront
![VerusMart Storefront](public/docs/images/homepage.png)
*Dynamic banner slider, category grid, mega sale banners, and featured product catalog.*

---

### 2. Product Details & Interactive Variant Selector
![Product Details Page](public/docs/images/product_details.png)
*High-resolution product photo galleries, multi-variant pricing, star rating reviews, and single-click checkout.*

---

### 3. Atomic Order Placement & Receipt Confirmation
![Order Confirmation Receipt](public/docs/images/checkout_receipt.png)
*Itemized order receipts, real-time tracking numbers, automated stock deduction, and delivery details.*

---

### 4. Admin Management & Control Dashboard
![Admin Dashboard](public/docs/images/admin_dashboard.png)
*Complete store management: live order status updates, coupon code manager, review moderation, and official PDF invoice generation.*

---

## 🏗️ System Architecture & Checkout Pipeline

```mermaid
flowchart TD
    User([Customer]) -->|Browse & Add to Cart| Cart[Cart Context / localStorage]
    Cart -->|Submit JSON Payload| CheckoutAPI[/api/checkout]
    CheckoutAPI -->|Server-Side Price Lookup| DB[(PostgreSQL Database)]
    CheckoutAPI -->|Validate Coupon & Stock| CouponCheck{Valid & Stocked?}
    CouponCheck -- No --> Error[Return Validation Error]
    CouponCheck -- Yes --> Transaction[Atomic Prisma Transaction]
    Transaction -->|1. Create Order| OrderTable[orders & order_items]
    Transaction -->|2. Decrement Stock| StockUpdate[products.stock - qty]
    Transaction -->|3. Increment Coupon| CouponUpdate[coupons.used_count + 1]
    Transaction -->|4. Trigger Email| EmailService[Nodemailer / Gmail SMTP]
    EmailService -->|Send Notification| AdminEmail[verusmart4@gmail.com]
    Transaction -->|Redirect| ReceiptPage[/checkout/success/ID]
```

---

## 🔥 Key Technical Features

### 1. Atomic Order Processing & Price Integrity
- **Server-Side Price Verification**: Item prices and order totals are computed strictly from the PostgreSQL database, eliminating client-side price tampering vulnerabilities.
- **Atomic Transactions**: Order creation, line item insertion, stock decrementing (`stock: { decrement: qty }`), and coupon usage counter increments are wrapped in a single atomic `prisma.$transaction(...)`.

### 2. Stateless HMAC Session System
- Customer (`user_session`) and Admin (`admin_token`) authentication are powered by signed, stateless HMAC tokens stored in HTTP-only cookies (`lib/auth.ts`).
- Admin sessions persist across process restarts and serverless cloud invocations without memory leaks.

### 3. Complete E-Commerce SEO Engine
- **Dynamic XML Sitemap (`/sitemap.xml`)**: Generates real-time indexable sitemaps from active database products and categories (`app/sitemap.ts`).
- **Dynamic Crawling Directives (`/robots.txt`)**: Robots handler protecting transactional pages while allowing search engine bots (`app/robots.ts`).
- **Structured Data Schemas (JSON-LD)**: Injects `schema.org/Organization`, `schema.org/WebSite`, and `schema.org/Product` schemas into search engine rich snippets.
- **Geotargeted Keywords**: Optimized for hyper-local queries (*verusmart*, *verus mart*, *verus*, *best perfume shop in bd*, *dhaka airport*, *ashkona*, *kawla bazar*, *hazi camp*, *uttara*).

### 4. Automated Email Notifications (Google App Passwords)
- **Order Notifications**: Dispatches rich HTML order confirmation emails to store managers (`verusmart4@gmail.com`) and customers upon purchase (`lib/email.ts`).
- **Password Reset OTP**: Sends 6-digit verification codes valid for 10 minutes via Gmail SMTP (`/forgot-password`).

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Database**: PostgreSQL with Prisma ORM 5.22.0
- **Styling**: Tailwind CSS 4 & Custom Vanilla Utilities
- **Authentication**: Stateless HMAC Cookies & bcrypt (10 rounds)
- **Email Service**: Nodemailer with Google App Passwords
- **Analytics & Pixel**: Google Tag Manager (`GTM-M4WDWDWX`), Google Analytics (`G-01JZ2L20C3`), Meta Pixel (`1004819899041313`)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- npm or yarn

### Installation & Setup

1. **Clone repository**:
   ```bash
   git clone https://github.com/sajidhossain8272/VerusMart.git
   cd VerusMart
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgres://user:password@host:5432/postgres?sslmode=require"
   PRISMA_DATABASE_URL="postgres://user:password@host:5432/postgres?sslmode=require"

   ADMIN_EMAIL="admin@verusmart.com"
   ADMIN_PASSWORD="verusMartAdminSecurePass2026!"
   ADMIN_JWT_SECRET="5cb76e2bc6894086b976dc4c5a92a549d44e54cd79b76c8c4a01c349e5d470d0"

   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT=465
   SMTP_USER="verusmart4@gmail.com"
   SMTP_PASS="your-16-char-app-password"
   ADMIN_NOTIFY_EMAIL="verusmart4@gmail.com"
   ```

4. **Synchronize Database Schema**:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

6. **Run Production Build**:
   ```bash
   npm run build
   ```

---

## 🧪 Testing & Verification

Run the automated end-to-end test suite covering database integrity, coupon validation, atomic stock deduction, order tracking, and review moderation:

```bash
# Typecheck TypeScript
npx tsc --noEmit

# Run E2E Test Suite
npx tsx scripts/test_e2e.ts
```

```text
=============================================================
🎉 TEST SUMMARY: 12 PASSED, 0 FAILED
=============================================================
```

---

## 🔒 Security Best Practices

- Environment secrets (`.env`) are excluded from Git repository tracking (`.gitignore`).
- Password hashes use `bcrypt` with a cost factor of 10.
- Database connections use SSL enforced mode (`sslmode=require`).
- HTML outputs are sanitized against XSS attacks.

---

## 📜 License

Private commercial software. All rights reserved. &copy; 2026 Verus Mart Bangladesh.