-- CreateEnum
CREATE TYPE "banners_position" AS ENUM ('main', 'side_top', 'side_bottom');

-- CreateEnum
CREATE TYPE "brands_status" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "categories_status" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "banners_status" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "payment_methods_status" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "vendors_status" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "refund_requests_status" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "image" VARCHAR(255),
    "role" VARCHAR(50) DEFAULT 'admin',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "image" VARCHAR(255) NOT NULL,
    "position" "banners_position" DEFAULT 'main',
    "status" "banners_status" DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "logo" VARCHAR(255),
    "priority" INTEGER DEFAULT 1,
    "status" "brands_status" DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_settings" (
    "id" SERIAL NOT NULL,
    "company_name" VARCHAR(255),
    "logo" VARCHAR(255),
    "phone" VARCHAR(50),
    "email" VARCHAR(100),
    "address" TEXT,
    "footer_about" TEXT,
    "facebook" VARCHAR(255),
    "instagram" VARCHAR(255),
    "twitter" VARCHAR(255),
    "youtube" VARCHAR(255),
    "currency" VARCHAR(10) DEFAULT '$',
    "tiktok" VARCHAR(255),
    "shipping_inside" DECIMAL(10,2) DEFAULT 60.00,
    "shipping_outside" DECIMAL(10,2) DEFAULT 120.00,

    CONSTRAINT "business_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "priority" INTEGER DEFAULT 0,
    "image" VARCHAR(255),
    "status" "categories_status" DEFAULT 'active',
    "banner" VARCHAR(255),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colors" (
    "id" SERIAL NOT NULL,
    "color_name" VARCHAR(50) NOT NULL,
    "color_code" VARCHAR(20),

    CONSTRAINT "colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(255),
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "email" VARCHAR(255),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER,
    "product_name" VARCHAR(255),
    "price" DECIMAL(10,2),
    "quantity" INTEGER,
    "image" VARCHAR(255),

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "customer_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100),
    "phone" VARCHAR(20),
    "address" TEXT,
    "order_note" TEXT,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(50) DEFAULT 'pending',
    "order_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(20) DEFAULT 'active',

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "logo" VARCHAR(255),
    "account_details" TEXT,
    "status" "payment_methods_status" DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phone_sell_requests" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "full_name" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "brand" VARCHAR(100) NOT NULL,
    "model" VARCHAR(255) NOT NULL,
    "phone_condition" VARCHAR(100) NOT NULL,
    "expected_price" DECIMAL(10,2) NOT NULL,
    "original_price" DECIMAL(10,2),
    "details" TEXT,
    "image_1" VARCHAR(255),
    "image_2" VARCHAR(255),
    "image_3" VARCHAR(255),
    "status" VARCHAR(50) DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "otp_code" VARCHAR(4),
    "is_verified" BOOLEAN DEFAULT false,

    CONSTRAINT "phone_sell_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_colors" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "color_id" INTEGER NOT NULL,

    CONSTRAINT "product_colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_gallery" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "image" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_sizes" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "size_id" INTEGER NOT NULL,

    CONSTRAINT "product_sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "variant_name" VARCHAR(100) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "old_price" DECIMAL(10,2) DEFAULT 0.00,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category_id" INTEGER,
    "brand_id" INTEGER DEFAULT 0,
    "price" DECIMAL(10,2),
    "stock" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(20) DEFAULT 'active',
    "is_recommended" BOOLEAN DEFAULT false,
    "is_featured" BOOLEAN DEFAULT false,
    "image" VARCHAR(255),
    "image_2" VARCHAR(255),
    "image_3" VARCHAR(255),
    "old_price" DECIMAL(10,2) DEFAULT 0.00,
    "discount_percent" INTEGER DEFAULT 0,
    "rating" INTEGER DEFAULT 5,
    "unit" VARCHAR(50) DEFAULT 'per lb',
    "total_reviews" INTEGER DEFAULT 0,
    "is_trending" BOOLEAN DEFAULT false,
    "is_best_seller" BOOLEAN DEFAULT false,
    "is_weekday_deal" BOOLEAN DEFAULT false,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refund_requests" (
    "id" SERIAL NOT NULL,
    "order_id" VARCHAR(50) NOT NULL,
    "customer_name" VARCHAR(100),
    "amount" DECIMAL(10,2),
    "reason" TEXT,
    "status" "refund_requests_status" DEFAULT 'pending',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refund_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section_labels" (
    "id" SERIAL NOT NULL,
    "section_key" VARCHAR(50),
    "label_text" VARCHAR(255),
    "banner_image" VARCHAR(255),

    CONSTRAINT "section_labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "serving_areas" (
    "id" SERIAL NOT NULL,
    "zone_name" VARCHAR(255) NOT NULL,
    "delivery_time" VARCHAR(100),
    "areas" TEXT,
    "delivery_charge" VARCHAR(50),
    "free_delivery_limit" INTEGER,
    "status" VARCHAR(20) DEFAULT 'active',

    CONSTRAINT "serving_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sizes" (
    "id" SERIAL NOT NULL,
    "size_name" VARCHAR(50) NOT NULL,

    CONSTRAINT "sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_categories" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "priority" INTEGER DEFAULT 1,
    "status" VARCHAR(50) DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sub_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "status" VARCHAR(20) DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "shop_name" VARCHAR(150),
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "status" "vendors_status" DEFAULT 'active',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlist" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_key" ON "pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "section_labels_section_key_key" ON "section_labels"("section_key");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "vendors_email_key" ON "vendors"("email");
