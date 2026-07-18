-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 29, 2026 at 03:09 PM
-- Server version: 11.4.12-MariaDB
-- PHP Version: 8.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mobileh1_verusmart`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `image`, `role`, `created_at`) VALUES
(1, 'Super Admin', 'admin@gmail.com', 'admin123', NULL, 'admin', '2026-01-30 20:30:11');

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `position` enum('main','side_top','side_bottom') DEFAULT 'main',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `title`, `image`, `position`, `status`, `created_at`) VALUES
(22, 'Perfume', '1777918949_IMG_20260505_001814.png', 'main', 'active', '2026-05-04 18:22:29'),
(23, '', '1777919006_IMG_20260505_002006.png', 'main', 'active', '2026-05-04 18:23:26'),
(24, '', '1777919048_IMG_20260505_001937.png', 'main', 'active', '2026-05-04 18:24:08');

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `priority` int(11) DEFAULT 1,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `business_settings`
--

CREATE TABLE `business_settings` (
  `id` int(11) NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `footer_about` text DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `youtube` varchar(255) DEFAULT NULL,
  `currency` varchar(10) DEFAULT '$',
  `tiktok` varchar(255) DEFAULT NULL,
  `shipping_inside` decimal(10,2) DEFAULT 60.00,
  `shipping_outside` decimal(10,2) DEFAULT 120.00
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `business_settings`
--

INSERT INTO `business_settings` (`id`, `company_name`, `logo`, `phone`, `email`, `address`, `footer_about`, `facebook`, `instagram`, `twitter`, `youtube`, `currency`, `tiktok`, `shipping_inside`, `shipping_outside`) VALUES
(1, 'VerusMart', 'logo_1777616159_ffffff.png', '+880 1628083370', 'verusmart4@gmail.com', 'Kawla, Dhaka - 1229', '', 'https://www.facebook.com/verusmart', 'https://www.facebook.com/verusmart', 'https://www.facebook.com/verusmart', 'https://www.facebook.com/verusmart', '', 'https://www.facebook.com/verusmart', 80.00, 120.00);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `priority` int(11) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `banner` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `priority`, `image`, `status`, `banner`) VALUES
(13, 'Electronics', 1, 'icon_1775642949_257.jfif', 'active', 'banner_1775214843_991.png'),
(14, 'Perfume', 5000, 'icon_1777582072_345.png', 'active', 'banner_1777582072_438.webp'),
(15, 'Home & Living', 1, 'icon_1775639123_556.png', 'active', 'banner_1774381983_499.jpg'),
(16, 'Toys & Games', 1, 'icon_1775639143_695.png', 'active', ''),
(17, 'Mega Sale', 1, 'icon_1775643250_155.png', 'active', 'banner_1775643250_485.png'),
(18, 'TRENDING PRODUCTS', 1, 'icon_1775639241_559.png', 'active', 'banner_1775641492_396.png'),
(19, 'TRENDING PRODUCTS', 1, 'icon_1775639258_806.png', 'active', 'banner_1775641504_971.png'),
(20, 'SUPER DEALS', 1, 'icon_1775643186_459.png', 'active', 'banner_1775641513_950.png');

-- --------------------------------------------------------

--
-- Table structure for table `colors`
--

CREATE TABLE `colors` (
  `id` int(11) NOT NULL,
  `color_name` varchar(50) NOT NULL,
  `color_code` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `colors`
--

INSERT INTO `colors` (`id`, `color_name`, `color_code`) VALUES
(1, 'RED', '#ff0000'),
(2, 'blue', '#0033ff'),
(3, 'Green', '#04f000'),
(4, 'Black', '#000000'),
(5, 'Yellow', '#ffd500');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `subject`, `message`, `created_at`) VALUES
(23, 'Olivier G Balzac', 'oliviergabriel618@gmail.com', 'Please Kindly response to this important massage urgently', 'Good day, \r\n \r\nMy name is Olivier G Balzac. I previously sent you a letter regarding a transaction involving 13.5 million US dollars, which was left by my deceased client. As I have not received a response from you, I have chosen to reach out again through this platform. After reviewing your profile, I am firmly convinced that you are capable of managing this transaction alongside me very effectively. \r\n \r\nI would like to highlight that upon the successful completion of the transaction, 10% of the funds will be donated to charitable organizations, while the remaining 90% will be divided between us, resulting in an equal distribution of 45% each. \r\n \r\nPlease respond at your earliest convenience to obtain further details about the transaction. \r\n \r\nSincerely, \r\n \r\nOlivier G Balzac, \r\nAttorney. \r\nE-mail: info@balzacavocate.com \r\nWebsite: http://www.balzacavocate.com/', '2026-06-10 19:39:20');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `email`, `created_at`) VALUES
(1, 'al-amin', NULL, '2026-01-10 14:25:01'),
(2, 'User 2', NULL, '2026-01-10 14:25:01');

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` int(11) NOT NULL,
  `question` text NOT NULL,
  `answer` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `order_note` text DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `order_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `customer_name`, `email`, `phone`, `address`, `order_note`, `total_amount`, `status`, `order_date`) VALUES
(26, 0, 'Sajid Hossain', 'sajidhossain8272@gmail.com', '01392530468', '94, Kawla, Ronyr bashar sathe', 'Testing for Fb ads and pixel', 359.00, 'canceled', '2026-06-12 14:35:08'),
(27, 13, 'Sajid Hossain', 'sajidhossain8272@gmail.com', '01329', '94, Kawla, Ronyr bashar sathe', 'Testing', 2880.00, 'canceled', '2026-06-12 14:53:17'),
(28, 13, 'Sajid Hossain', 'sajidhossain8272@gmail.com', '01329', '94, Kawla, Ronyr bashar sathe', 'Testing', 2880.00, 'canceled', '2026-06-12 14:53:19'),
(29, 13, 'Sajids Hossain', 'sajidhossain8272@gmail.com', '01392530468', '94, Kawla, Ronyr bashar sathe', 'Test', 2910.00, 'canceled', '2026-06-12 14:53:54');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_name`, `price`, `quantity`, `image`) VALUES
(51, 26, 'Dior Sauvage Inspired Perfume for Men – Long Lasting Fresh & Spicy Luxury Fragrance', 279.00, 1, 'prod_1781110934_535_0.webp'),
(52, 27, 'Pink Chiffon Inspired Perfume for Women – Long Lasting Sweet & Floral Luxury Fragrance', 230.00, 12, 'prod_1781110442_192_0.webp'),
(53, 28, 'Pink Chiffon Inspired Perfume for Women – Long Lasting Sweet & Floral Luxury Fragrance', 230.00, 12, 'prod_1781110442_192_0.webp'),
(54, 29, 'Bleu de Chanel Inspired Perfume for Men – Long Lasting Fresh & Woody Luxury Fragrance', 279.00, 10, 'prod_1781109811_695_0.webp');

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` int(11) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` varchar(20) DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `pages`
--

INSERT INTO `pages` (`id`, `slug`, `title`, `content`, `updated_at`, `status`) VALUES
(6, 'privacy-policy', 'Privacy Policy', '<h3>Privacy Policy for VerusMart</h3><p>Your privacy is important to us. Here we describe how we collect and use your data...</p>', '2026-05-02 09:25:27', 'active'),
(7, 'terms', 'Terms & Conditions', '<h3>Terms and Conditions</h3><p>By using VerusMart, you agree to follow these rules and regulations...</p>', '2026-05-02 09:25:27', 'active'),
(8, 'mlk', 'hjh', 'hj', '2026-05-02 09:26:51', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `account_details` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phone_sell_requests`
--

CREATE TABLE `phone_sell_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `model` varchar(255) NOT NULL,
  `phone_condition` varchar(100) NOT NULL,
  `expected_price` decimal(10,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `image_1` varchar(255) DEFAULT NULL,
  `image_2` varchar(255) DEFAULT NULL,
  `image_3` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `otp_code` varchar(4) DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` mediumtext DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `brand_id` int(11) DEFAULT 0,
  `price` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT 'active',
  `is_recommended` tinyint(1) DEFAULT 0,
  `is_featured` tinyint(1) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `image_2` varchar(255) DEFAULT NULL,
  `image_3` varchar(255) DEFAULT NULL,
  `old_price` decimal(10,2) DEFAULT 0.00,
  `discount_percent` int(11) DEFAULT 0,
  `rating` int(11) DEFAULT 5,
  `unit` varchar(50) DEFAULT 'per lb',
  `total_reviews` int(11) DEFAULT 0,
  `is_trending` tinyint(1) DEFAULT 0,
  `is_best_seller` tinyint(1) DEFAULT 0,
  `is_weekday_deal` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `category_id`, `brand_id`, `price`, `stock`, `created_at`, `status`, `is_recommended`, `is_featured`, `image`, `image_2`, `image_3`, `old_price`, `discount_percent`, `rating`, `unit`, `total_reviews`, `is_trending`, `is_best_seller`, `is_weekday_deal`) VALUES
(82, 'Inspired By Black Opium – Long Lasting Coffee & Vanilla Luxury Perfume for Women', 'Inspired By Black Opium – Long Lasting Coffee & Vanilla Luxury Perfume for Women\r\n\r\nExperience a bold and captivating fragrance inspired by the iconic Black Opium. This elegant scent opens with rich coffee accords, blended beautifully with sweet vanilla and delicate white floral notes. Perfect for women who love a warm, sensual, and long-lasting fragrance that leaves a memorable impression.\r\n\r\n✨ Long-lasting fragrance\r\n✨ Premium inspired scent\r\n✨ Rich coffee & creamy vanilla notes\r\n✨ Feminine, elegant & seductive aroma\r\n✨ Ideal for daily wear and special occasions\r\n\r\nFragrance Notes:\r\n• Top Notes: Pink Pepper, Orange Blossom\r\n• Heart Notes: Coffee, Jasmine\r\n• Base Notes: Vanilla, Patchouli, Cedarwood\r\n\r\nType: Inspired Perfume\r\nGender: Women\r\nLongevity: 6–10 Hours (depending on skin type and environment)\r\n\r\nInspired by the scent profile of Black Opium. This product is not affiliated with or manufactured by the original brand.', 14, 0, 230.00, 37, '2026-06-10 15:34:33', 'active', 0, 0, 'prod_1781105673_279_0.webp', '', '', 289.00, 0, 5, '', 87, 0, 0, 0),
(83, 'Inspired By Gucci Flora – Long Lasting Floral Luxury Perfume for Women', 'Inspired By Gucci Flora is a graceful and feminine fragrance crafted for women who love fresh floral scents with a touch of elegance. A beautiful blend of blooming flowers, citrus freshness, and warm woody notes creates a sophisticated aroma that is perfect for both everyday wear and special occasions.\r\n\r\nThis fragrance delivers a soft, romantic, and long-lasting scent that enhances your confidence and leaves a memorable impression wherever you go.\r\n\r\n✨ Long-lasting fragrance\r\n✨ Premium inspired perfume\r\n✨ Fresh floral & feminine scent\r\n✨ Perfect for daily wear and special occasions\r\n✨ Elegant, romantic & sophisticated aroma\r\n\r\nFragrance Notes:\r\n• Top Notes: Pear, Red Berries, Italian Mandarin\r\n• Heart Notes: Gardenia, Jasmine, Frangipani\r\n• Base Notes: Brown Sugar, Patchouli\r\n\r\nType: Inspired Perfume\r\nGender: Women\r\nLongevity: 6–10 Hours (depending on skin type and environment)\r\n\r\nInspired by the scent profile of Gucci Flora. This product is not affiliated with or manufactured by the original brand.\r\n\r\nসংক্ষিপ্ত SEO Title (বেশি বিক্রির জন্য):\r\nGucci Flora Inspired Perfume for Women – Long Lasting Floral Fragrance 🌸', 14, 0, 160.00, 39, '2026-06-10 15:40:15', 'active', 0, 0, 'prod_1781106015_705_0.webp', '', '', 199.00, 0, 5, '', 64, 0, 0, 0),
(84, 'Magical Charlie – Long Lasting Premium Luxury Perfume', 'Magical Charlie is a captivating fragrance designed for those who appreciate elegance, confidence, and lasting freshness. With a perfect balance of fruity, floral, and warm woody notes, this perfume creates a charming and memorable scent experience suitable for any occasion.\r\n\r\nWhether you\'re heading to work, a special event, or a casual outing, Magical Charlie adds a touch of sophistication to your presence and keeps you feeling fresh throughout the day.\r\n\r\n✨ Long-lasting fragrance\r\n✨ Premium quality perfume\r\n✨ Fresh, elegant & attractive scent\r\n✨ Suitable for everyday wear\r\n✨ Perfect for both day and evening use\r\n\r\nFragrance Profile:\r\n• Top Notes: Fresh Fruits & Citrus Accords\r\n• Heart Notes: Floral Bouquet\r\n• Base Notes: Musk, Vanilla & Woody Notes\r\n\r\nType: Premium Perfume\r\nLongevity: 6–10 Hours (depending on skin type and environment)', 14, 0, 180.00, 74, '2026-06-10 15:46:03', 'active', 0, 0, 'prod_1781106363_800_0.webp', '', '', 219.00, 0, 5, '', 43, 0, 0, 0),
(85, 'Inspired By Good Girl – Long Lasting Sweet & Sensual Luxury Perfume for Women', 'Step into confidence and elegance with Inspired By Good Girl, a captivating fragrance created for modern women who embrace both their bold and feminine sides. This luxurious scent blends sweet floral notes with warm vanilla and rich tonka bean, creating an irresistible and sophisticated aroma that lasts all day.\r\n\r\nPerfect for parties, evening wear, special occasions, or everyday elegance, this fragrance leaves a memorable impression wherever you go.\r\n\r\n✨ Long-lasting fragrance\r\n✨ Premium inspired perfume\r\n✨ Sweet, sensual & feminine scent\r\n✨ Perfect for daily wear and special occasions\r\n✨ Elegant and confidence-boosting aroma\r\n\r\nFragrance Notes:\r\n• Top Notes: Almond, Coffee, Bergamot\r\n• Heart Notes: Jasmine Sambac, Tuberose, Orange Blossom\r\n• Base Notes: Tonka Bean, Vanilla, Cocoa, Sandalwood\r\n\r\nType: Inspired Perfume\r\nGender: Women\r\nLongevity: 6–10 Hours (depending on skin type and environment)\r\n\r\nTagline:\r\n\"Bold, Elegant & Unforgettable.\"\r\n\r\nInspired by the scent profile of Good Girl. This product is not affiliated with or manufactured by the original brand. 💖👠', 14, 0, 160.00, 28, '2026-06-10 15:52:38', 'active', 0, 0, 'prod_1781106758_510_0.webp', '', '', 199.00, 0, 5, '', 67, 0, 0, 0),
(86, 'Club de Nuit Intense Man Inspired By Creed Aventus – Long Lasting Fresh & Woody Luxury Perfume for Men', 'Experience the power of confidence and sophistication with Club de Nuit Intense Man Inspired By Creed Aventus. This premium fragrance opens with a vibrant blend of fresh citrus and juicy pineapple, followed by smoky woody accords that create a bold, masculine, and unforgettable scent.\r\n\r\nPerfect for modern men who appreciate elegance and style, this fragrance is suitable for daily wear, office use, special occasions, and evening outings. Its fresh, fruity, and woody composition ensures a lasting impression wherever you go.\r\n\r\n✨ Long-lasting fragrance\r\n✨ Premium inspired perfume\r\n✨ Fresh, fruity & woody scent\r\n✨ Ideal for office, casual & formal wear\r\n✨ Bold, masculine & sophisticated aroma\r\n\r\nFragrance Notes\r\n\r\nTop Notes: Pineapple, Bergamot, Lemon, Black Currant, Apple\r\nHeart Notes: Birch, Jasmine, Rose\r\nBase Notes: Musk, Ambergris, Patchouli, Vanilla\r\n\r\nProduct Details\r\nType: Inspired Perfume\r\nGender: Men\r\nFragrance Family: Fresh Fruity Woody\r\nLongevity: 8–12 Hours (depending on skin type and environment)\r\nWhy You\'ll Love It\r\n\r\nDesigned for men who want a powerful yet refined fragrance, this scent delivers the perfect balance of freshness, smokiness, and woody depth, making it an excellent choice for any season and occasion.\r\n\r\nTagline:\r\n\"Inspired by Greatness. Crafted for Confidence.\"\r\n\r\nInspired by the scent profile of Creed Aventus. This product is not affiliated with or manufactured by the original brand. 🖤✨🍍', 14, 0, 199.00, 52, '2026-06-10 16:05:29', 'active', 0, 0, 'prod_1781107529_719_0.webp', '', '', 249.00, 0, 5, '', 26, 0, 0, 0),
(87, 'Coffee Perfume – Long Lasting Rich & Warm Luxury Fragrance', 'Awaken your senses with Coffee Perfume, a bold and captivating fragrance inspired by the rich aroma of freshly brewed coffee. Blended with warm vanilla, soft amber, and sensual woody notes, this perfume creates a deep, comforting, and luxurious scent that stands out throughout the day.\r\n\r\nPerfect for coffee lovers, this fragrance delivers a unique balance of warmth, sweetness, and sophistication, making it ideal for daily wear, evening outings, and special occasions.\r\n\r\n✨ Long-lasting fragrance\r\n✨ Rich coffee-inspired aroma\r\n✨ Warm, sweet & sophisticated scent\r\n✨ Perfect for everyday wear and special occasions\r\n✨ Premium quality perfume\r\n\r\nFragrance Notes\r\n\r\nTop Notes: Roasted Coffee Beans, Caramel\r\nHeart Notes: Vanilla, Cocoa, Floral Accords\r\nBase Notes: Amber, Musk, Sandalwood\r\n\r\nProduct Details\r\nType: Premium Perfume\r\nGender: Unisex\r\nFragrance Family: Gourmand Coffee\r\nLongevity: 6–10 Hours (depending on skin type and environment)\r\nWhy You\'ll Love It\r\n\r\nA rich and addictive fragrance that combines the boldness of coffee with the sweetness of vanilla and the warmth of amber, creating a scent that is both comforting and unforgettable.\r\n\r\nTagline:\r\n☕ \"Brew Confidence. Wear Elegance.\"\r\n\r\nSEO Short Title\r\n\r\nCoffee Perfume – Long Lasting Warm & Rich Luxury Fragrance ☕✨', 14, 0, 160.00, 87, '2026-06-10 16:11:20', 'active', 0, 0, 'prod_1781107880_955_0.webp', '', '', 199.00, 0, 5, '', 178, 0, 0, 0),
(88, 'Creed Aventus Inspired Perfume for Men – Long Lasting Fresh & Woody Luxury Fragrance', 'Experience the scent of success with Creed Aventus Inspired Perfume, a bold and sophisticated fragrance crafted for modern men. This iconic scent combines vibrant fruity notes with smoky woods and rich musk, creating a powerful and confident aroma that leaves a lasting impression.\r\n\r\nPerfect for daily wear, office use, business meetings, and special occasions, this fragrance delivers a refined balance of freshness, elegance, and masculinity.\r\n\r\n✨ Long-lasting fragrance\r\n✨ Premium inspired perfume\r\n✨ Fresh, fruity & woody scent\r\n✨ Perfect for office, casual & formal wear\r\n✨ Bold, confident & sophisticated aroma\r\n\r\nFragrance Notes\r\n\r\nTop Notes: Pineapple, Bergamot, Black Currant, Apple\r\nHeart Notes: Birch, Patchouli, Jasmine, Rose\r\nBase Notes: Musk, Oakmoss, Ambergris, Vanilla\r\n\r\nProduct Details\r\nType: Inspired Perfume\r\nGender: Men\r\nFragrance Family: Fresh Fruity Woody\r\nLongevity: 8–12 Hours (depending on skin type and environment)\r\nWhy You\'ll Love It\r\n\r\nA powerful fragrance that blends fresh pineapple, smoky birch, and rich musk to create an elegant and masculine scent suitable for any occasion.\r\n\r\nTagline:\r\n👑 \"Inspired by Greatness. Crafted for Success.\"', 14, 0, 199.00, 99, '2026-06-10 16:30:18', 'active', 0, 0, 'prod_1781109018_981_0.webp', '', '', 249.00, 0, 5, '', 143, 0, 0, 0),
(89, 'Hudson Valley – Long Lasting Fresh & Elegant Luxury Perfume', 'Discover the timeless charm of Hudson Valley, a refreshing and sophisticated fragrance designed for those who appreciate elegance and confidence. This captivating scent blends fresh citrus notes with aromatic accords and warm woody undertones, creating a clean, refined, and long-lasting fragrance experience.\r\n\r\nPerfect for daily wear, office use, casual outings, and special occasions, Hudson Valley offers a balanced scent profile that feels both modern and timeless.\r\n\r\n✨ Long-lasting fragrance\r\n✨ Fresh, clean & elegant aroma\r\n✨ Premium quality perfume\r\n✨ Perfect for everyday wear\r\n✨ Sophisticated and refreshing scent\r\n\r\nFragrance Notes\r\n\r\nTop Notes: Bergamot, Lemon, Fresh Citrus\r\nHeart Notes: Lavender, Aromatic Herbs, Floral Accords\r\nBase Notes: Cedarwood, Musk, Amber\r\n\r\nProduct Details\r\nType: Premium Perfume\r\nGender: Unisex\r\nFragrance Family: Fresh Woody Aromatic\r\nLongevity: 6–10 Hours (depending on skin type and environment)\r\nWhy You\'ll Love It\r\n\r\nA versatile fragrance that combines freshness, elegance, and warmth, making it suitable for every season and every occasion.\r\n\r\nTagline:\r\n🌿 \"Freshness Inspired by Nature, Elegance Defined by You.\"\r\n\r\nSEO Short Title\r\n\r\nHudson Valley Perfume – Long Lasting Fresh & Elegant Luxury Fragrance ✨🌿', 14, 0, 349.00, 17, '2026-06-10 16:37:24', 'active', 0, 0, 'prod_1781109444_825_0.webp', '', '', 0.00, 0, 5, '', 237, 0, 0, 0),
(90, 'Bleu de Chanel Inspired Perfume for Men – Long Lasting Fresh & Woody Luxury Fragrance', 'Bleu de Chanel Inspired Perfume for Men – Long Lasting Fresh & Woody Luxury Fragrance\r\n\r\nDescription\r\n\r\nExperience timeless elegance with Bleu de Chanel Inspired Perfume, a sophisticated fragrance crafted for men who value confidence, style, and refinement. This premium scent opens with a burst of fresh citrus notes, followed by aromatic accords and rich woody undertones, creating a clean, masculine, and long-lasting fragrance.\r\n\r\nPerfect for daily wear, office use, evening events, and special occasions, this versatile scent leaves a memorable impression wherever you go.\r\n\r\n✨ Long-lasting fragrance\r\n✨ Premium inspired perfume\r\n✨ Fresh, woody & aromatic scent\r\n✨ Perfect for office, casual & formal wear\r\n✨ Elegant, confident & masculine aroma\r\n\r\nFragrance Notes\r\n\r\nTop Notes: Grapefruit, Lemon, Mint, Pink Pepper\r\nHeart Notes: Ginger, Jasmine, Nutmeg\r\nBase Notes: Sandalwood, Cedarwood, Incense, Patchouli\r\n\r\nProduct Details\r\nType: Inspired Perfume\r\nGender: Men\r\nFragrance Family: Fresh Woody Aromatic\r\nLongevity: 8–12 Hours (depending on skin type and environment)\r\nWhy You\'ll Love It\r\n\r\nA modern and versatile fragrance that perfectly balances freshness, woody depth, and aromatic sophistication, making it suitable for every season and occasion.', 14, 0, 279.00, 77, '2026-06-10 16:43:31', 'active', 0, 0, 'prod_1781109811_695_0.webp', '', '', 299.00, 0, 5, '', 188, 0, 0, 0),
(91, 'Dior Sauvage Inspired Perfume for Men – Long Lasting Fresh & Spicy Luxury Fragrance', 'Unleash your confidence with Dior Sauvage Inspired Perfume, a bold and modern fragrance crafted for men who embrace strength, freedom, and sophistication. This powerful scent opens with a burst of fresh bergamot, blended with spicy pepper and deep woody notes to create an energetic and masculine aroma that lasts all day.\r\n\r\nPerfect for daily wear, office use, evening outings, and special occasions, this fragrance offers a versatile and captivating scent that leaves a lasting impression wherever you go.\r\n\r\n✨ Long-lasting fragrance\r\n✨ Premium inspired perfume\r\n✨ Fresh, spicy & woody scent\r\n✨ Perfect for office, casual & formal wear\r\n✨ Bold, masculine & sophisticated aroma\r\n\r\nFragrance Notes\r\n\r\nTop Notes: Bergamot, Pepper\r\nHeart Notes: Lavender, Sichuan Pepper, Geranium\r\nBase Notes: Ambroxan, Cedarwood, Labdanum\r\n\r\nProduct Details\r\nType: Inspired Perfume\r\nGender: Men\r\nFragrance Family: Fresh Spicy Woody\r\nLongevity: 8–12 Hours (depending on skin type and environment)\r\nWhy You\'ll Love It\r\n\r\nA powerful blend of fresh citrus, spicy accords, and woody depth that creates a clean, masculine, and highly versatile fragrance suitable for every occasion.\r\n\r\nTagline:\r\n⚡ \"Wild Spirit. Timeless Confidence.\"\r\n\r\nSEO Short Title\r\n\r\nDior Sauvage Inspired Perfume for Men – Long Lasting Fresh & Spicy Fragrance 🖤✨🔥', 13, 0, 279.00, 46, '2026-06-10 16:49:10', 'active', 0, 0, 'prod_1781110150_693_0.webp', '', '', 299.00, 0, 5, '', 221, 0, 0, 0),
(92, 'Pink Chiffon Inspired Perfume for Women – Long Lasting Sweet & Floral Luxury Fragrance', 'Wrap yourself in the soft and romantic charm of Pink Chiffon Inspired Perfume. This delightful fragrance combines sweet fruity notes, delicate florals, and creamy vanilla to create a feminine and elegant scent that feels light, playful, and unforgettable.\r\n\r\nPerfect for everyday wear, casual outings, dates, and special occasions, this fragrance leaves a sweet and graceful impression wherever you go.\r\n\r\n✨ Long-lasting fragrance\r\n✨ Premium inspired perfume\r\n✨ Sweet, floral & feminine scent\r\n✨ Perfect for daily wear and special occasions\r\n✨ Soft, romantic & elegant aroma\r\n\r\nFragrance Notes\r\n\r\nTop Notes: Red Pear, Mandarin Orange, Sparkling Fruits\r\nHeart Notes: Jasmine Petals, Tiare Flower, Pink Peony\r\nBase Notes: Vanilla, Coconut, Musk, Sandalwood\r\n\r\nProduct Details\r\nType: Inspired Perfume\r\nGender: Women\r\nFragrance Family: Sweet Floral Fruity\r\nLongevity: 6–10 Hours (depending on skin type and environment)\r\nWhy You\'ll Love It\r\n\r\nA beautifully balanced fragrance that blends sweet fruits, delicate flowers, and creamy vanilla for a soft, youthful, and irresistibly feminine scent.\r\n\r\nTagline:\r\n🌸 \"Soft, Sweet & Beautifully Feminine.\"\r\n\r\nSEO Short Title\r\n\r\nPink Chiffon Inspired Perfume for Women – Long Lasting Sweet Floral Fragrance 💖✨🌸', 14, 0, 230.00, 66, '2026-06-10 16:54:02', 'active', 0, 0, 'prod_1781110442_192_0.webp', '', '', 299.00, 0, 5, '', 198, 0, 0, 0),
(94, 'Dior Sauvage Inspired Perfume for Men – Long Lasting Fresh & Spicy Luxury Fragrance', 'Unleash your confidence with Dior Sauvage Inspired Perfume, a bold and modern fragrance crafted for men who embrace strength, freedom, and sophistication. This powerful scent opens with a burst of fresh bergamot, blended with spicy pepper and deep woody notes to create an energetic and masculine aroma that lasts all day.\r\n\r\nPerfect for daily wear, office use, evening outings, and special occasions, this fragrance offers a versatile and captivating scent that leaves a lasting impression wherever you go.\r\n\r\n✨ Long-lasting fragrance\r\n✨ Premium inspired perfume\r\n✨ Fresh, spicy & woody scent\r\n✨ Perfect for office, casual & formal wear\r\n✨ Bold, masculine & sophisticated aroma\r\n\r\nFragrance Notes\r\n\r\nTop Notes: Bergamot, Pepper\r\nHeart Notes: Lavender, Sichuan Pepper, Geranium\r\nBase Notes: Ambroxan, Cedarwood, Labdanum\r\n\r\nProduct Details\r\nType: Inspired Perfume\r\nGender: Men\r\nFragrance Family: Fresh Spicy Woody\r\nLongevity: 8–12 Hours (depending on skin type and environment)\r\nWhy You\'ll Love It\r\n\r\nA powerful blend of fresh citrus, spicy accords, and woody depth that creates a clean, masculine, and highly versatile fragrance suitable for every occasion.\r\n\r\nTagline:\r\n⚡ \"Wild Spirit. Timeless Confidence.\"\r\n\r\nSEO Short Title\r\n\r\nDior Sauvage Inspired Perfume for Men – Long Lasting Fresh & Spicy Fragrance 🖤✨🔥', 14, 0, 279.00, 47, '2026-06-10 17:02:14', 'active', 0, 0, 'prod_1781110934_535_0.webp', '', '', 299.00, 0, 5, '', 231, 0, 0, 0),
(95, 'Vampire Blood Perfume – Long Lasting Sweet Fruity Luxury Fragrance', 'Step into a world of mystery and attraction with Vampire Blood Perfume. This enchanting fragrance blends juicy red fruits, wild berries, and soft floral notes with a warm, sensual base, creating a bold and unforgettable scent experience.\r\n\r\nPerfect for those who love sweet, playful, and captivating fragrances, Vampire Blood delivers a unique aroma that stands out both day and night.\r\n\r\n✨ Long-lasting fragrance\r\n✨ Rich fruity & berry aroma\r\n✨ Sweet, bold & captivating scent\r\n✨ Perfect for daily wear and special occasions\r\n✨ Premium quality perfume\r\n\r\nFragrance Notes\r\n\r\nTop Notes: Red Berries, Plum, Citrus Accords\r\nHeart Notes: Jasmine, Wild Blooms\r\nBase Notes: Musk, Amber, Soft Woods\r\n\r\nProduct Details\r\nType: Premium Perfume\r\nGender: Women\r\nFragrance Family: Fruity Floral\r\nLongevity: 6–10 Hours (depending on skin type and environment)\r\nWhy You\'ll Love It\r\n\r\nA seductive blend of juicy berries, delicate florals, and warm musk that creates a sweet yet mysterious fragrance perfect for making a lasting impression.\r\n\r\nTagline:\r\n🩸 \"Mysterious, Sweet & Irresistibly Captivating.\"\r\n\r\nSEO Short Title\r\n\r\nVampire Blood Perfume – Long Lasting Sweet Fruity Fragrance for Women ❤️🩸✨', 14, 0, 160.00, 145, '2026-06-10 17:11:53', 'active', 0, 0, 'prod_1781111513_298_0.webp', '', '', 199.00, 0, 5, '', 289, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `product_colors`
--

CREATE TABLE `product_colors` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `color_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_colors`
--

INSERT INTO `product_colors` (`id`, `product_id`, `color_id`) VALUES
(1, 59, 1),
(2, 59, 2),
(3, 59, 3),
(4, 59, 4),
(5, 59, 5),
(6, 60, 1),
(7, 60, 2),
(8, 60, 3),
(9, 64, 1),
(10, 64, 2),
(11, 81, 1),
(12, 81, 2),
(13, 81, 3);

-- --------------------------------------------------------

--
-- Table structure for table `product_gallery`
--

CREATE TABLE `product_gallery` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_sizes`
--

CREATE TABLE `product_sizes` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_sizes`
--

INSERT INTO `product_sizes` (`id`, `product_id`, `size_id`) VALUES
(1, 59, 1),
(2, 59, 2),
(3, 59, 3),
(4, 59, 4),
(5, 59, 5),
(6, 60, 1),
(7, 60, 2),
(8, 60, 3),
(9, 64, 1),
(10, 64, 2),
(11, 81, 2),
(12, 81, 3),
(13, 81, 4);

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `variant_name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `old_price` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `variant_name`, `price`, `old_price`) VALUES
(1, 57, '6ml', 550.00, 0.00),
(2, 57, '10ml', 790.00, 0.00),
(3, 57, '15ml', 1089.00, 0.00),
(4, 58, '6ml', 550.00, 0.00),
(5, 58, '10ml', 790.00, 0.00),
(6, 61, '6ml', 500.00, 0.00),
(7, 61, '10ml', 800.00, 0.00),
(8, 62, '6 ml', 159.00, 200.00),
(9, 62, '10 ml', 249.00, 290.00),
(10, 62, '15 ml', 349.00, 380.00),
(11, 62, '30 ml', 499.00, 699.00),
(12, 62, '50 ml', 899.00, 1199.00),
(13, 63, '6ml', 590.00, 600.00),
(14, 63, '10ml', 800.00, 900.00),
(25, 65, '6 ml', 159.00, 200.00),
(26, 65, '10 ml', 249.00, 290.00),
(27, 65, '15 ml', 349.00, 380.00),
(28, 65, '30 ml', 499.00, 699.00),
(29, 65, '50 ml', 899.00, 1199.00),
(35, 66, '6 ml', 159.00, 200.00),
(36, 66, '10 ml', 249.00, 290.00),
(37, 66, '15 ml', 349.00, 380.00),
(38, 66, '30 ml', 499.00, 699.00),
(39, 66, '50 ml', 899.00, 1199.00),
(40, 67, '6 ml', 159.00, 200.00),
(41, 67, '10 ml', 249.00, 290.00),
(42, 67, '15 ml', 349.00, 380.00),
(43, 67, '30 ml', 499.00, 699.00),
(44, 67, '50 ml', 899.00, 1199.00),
(50, 68, '6 ml', 159.00, 200.00),
(51, 68, '10 ml', 249.00, 290.00),
(52, 68, '15 ml', 349.00, 380.00),
(53, 68, '30 ml', 499.00, 699.00),
(54, 68, '50 ml', 899.00, 1199.00),
(60, 69, '6 ml', 159.00, 200.00),
(61, 69, '10 ml', 249.00, 290.00),
(62, 69, '15 ml', 249.00, 380.00),
(63, 69, '30 ml', 499.00, 699.00),
(64, 69, '50 ml', 899.00, 1199.00),
(65, 70, '6 ml', 299.00, 349.00),
(66, 70, '15 ml', 649.00, 799.00),
(67, 70, '30 ml', 1199.00, 1299.00),
(71, 72, '6 ml', 160.00, 199.00),
(72, 72, '15 ml', 380.00, 449.00),
(73, 72, '30 ml', 499.00, 549.00),
(74, 71, '6 ml', 349.00, 399.00),
(75, 71, '15 ml', 749.00, 799.00),
(76, 71, '30 ml ', 1399.00, 1449.00),
(80, 74, '6 ml', 160.00, 199.00),
(81, 74, '15 ml', 380.00, 449.00),
(82, 74, '30 ml', 499.00, 549.00),
(83, 75, '6 ml', 160.00, 199.00),
(84, 75, '15 ml', 380.00, 449.00),
(85, 75, '30 ml ', 499.00, 549.00),
(86, 76, '6 ml', 180.00, 220.00),
(87, 76, '15 ml', 380.00, 449.00),
(88, 76, '30 ml', 549.00, 699.00),
(89, 77, '6 ml', 180.00, 199.00),
(90, 77, '15 ml', 380.00, 449.00),
(91, 77, '30 ml', 549.00, 699.00),
(92, 78, '6 ml', 160.00, 449.00),
(93, 78, '15 ml', 380.00, 399.00),
(94, 78, '30 ml', 499.00, 449.00),
(98, 73, '6 ml', 349.00, 399.00),
(99, 73, '15 ml', 749.00, 799.00),
(100, 73, '30 ml', 1399.00, 1449.00),
(125, 79, '6 ml', 180.00, 199.00),
(126, 79, '15 ml', 399.00, 449.00),
(127, 79, '30 ml', 599.00, 649.00),
(128, 82, '6 ML', 230.00, 289.00),
(129, 82, '15 ML', 449.00, 499.00),
(130, 82, '30 ML', 899.00, 949.00),
(131, 82, '50 ML', 1299.00, 1349.00),
(132, 83, '6 ML', 160.00, 199.00),
(133, 83, '15 ML', 380.00, 419.00),
(134, 83, '30 ML', 499.00, 449.00),
(135, 83, '50 ML', 899.00, 949.00),
(136, 84, '6 ML', 180.00, 219.00),
(137, 84, '15 ML', 399.00, 449.00),
(138, 84, '30 ML', 699.00, 749.00),
(139, 84, '50 ML', 1099.00, 1149.00),
(140, 85, '6 ML', 160.00, 199.00),
(141, 85, '15 ML', 380.00, 419.00),
(142, 85, '30 ML', 499.00, 549.00),
(143, 85, '50 ML', 899.00, 949.00),
(144, 86, '6 ML', 199.00, 249.00),
(145, 86, '15 ML', 449.00, 499.00),
(146, 86, '30 ML', 1049.00, 1099.00),
(147, 86, '50 ML', 1499.00, 1549.00),
(148, 87, '6 ML', 160.00, 199.00),
(149, 87, '15 ML', 380.00, 449.00),
(150, 87, '30 ML', 499.00, 549.00),
(151, 87, '50 ML', 899.00, 949.00),
(152, 88, '6 ML', 199.00, 249.00),
(153, 88, '15 ML', 449.00, 549.00),
(154, 88, '30 ML', 1049.00, 1099.00),
(155, 88, '50 ML', 1499.00, 1549.00),
(156, 89, '6 ML', 349.00, 0.00),
(157, 89, '15 ML', 748.99, 0.00),
(158, 89, '30 ML', 1399.00, 0.00),
(159, 89, '50 ML', 1999.00, 0.00),
(160, 90, '6 ML', 279.00, 299.00),
(161, 90, '15 ML', 699.00, 749.00),
(162, 90, '30 ML', 1299.00, 1349.00),
(163, 90, '50 ML', 1999.00, 2299.00),
(168, 92, '6 ML', 230.00, 299.00),
(169, 92, '15 ML', 449.00, 499.00),
(170, 92, '30 ML', 899.00, 949.00),
(171, 92, '50 ML', 1299.00, 1349.00),
(172, 91, '6 ML', 279.00, 299.00),
(173, 91, '15 ML', 699.00, 749.00),
(174, 91, '30 ML', 1299.00, 1349.00),
(175, 91, '50 ML', 1999.00, 2299.00),
(176, 93, '6 ML', 160.00, 199.00),
(177, 93, '6 ML', 380.00, 449.00),
(178, 93, '6 ML', 499.00, 549.00),
(179, 93, '6 ML', 899.00, 949.00),
(180, 94, '6 ML', 279.00, 299.00),
(181, 94, '15 ML', 699.00, 749.00),
(182, 94, '30 ML', 1299.00, 1349.00),
(183, 94, '50 ML', 1999.00, 2299.00),
(184, 95, '6 ML', 160.00, 199.00),
(185, 95, '15 ML', 380.00, 449.00),
(186, 95, '30 ML', 499.00, 549.00),
(187, 95, '50 ML', 899.00, 949.00);

-- --------------------------------------------------------

--
-- Table structure for table `refund_requests`
--

CREATE TABLE `refund_requests` (
  `id` int(11) NOT NULL,
  `order_id` varchar(50) NOT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `section_labels`
--

CREATE TABLE `section_labels` (
  `id` int(11) NOT NULL,
  `section_key` varchar(50) DEFAULT NULL,
  `label_text` varchar(255) DEFAULT NULL,
  `banner_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `section_labels`
--

INSERT INTO `section_labels` (`id`, `section_key`, `label_text`, `banner_image`) VALUES
(1, 'is_recommended', 'RECOMMENDED FOR YOU', 'sec_1770012535_bazar.jpg'),
(2, 'is_trending', 'HOT & TRENDING NOW', 'sec_1770012535_product-2-20220322215415.jpg'),
(3, 'is_best_seller', 'BEST SELLERS ON FIRE', 'sec_1770012535_bazar.jpg'),
(4, 'is_weekday_deal', 'WEEKDAY DEALS (TIMER)', 'sec_1770012535_voktovogi.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `serving_areas`
--

CREATE TABLE `serving_areas` (
  `id` int(11) NOT NULL,
  `zone_name` varchar(255) NOT NULL,
  `delivery_time` varchar(100) DEFAULT NULL,
  `areas` text DEFAULT NULL,
  `delivery_charge` varchar(50) DEFAULT NULL,
  `free_delivery_limit` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `serving_areas`
--

INSERT INTO `serving_areas` (`id`, `zone_name`, `delivery_time`, `areas`, `delivery_charge`, `free_delivery_limit`, `status`) VALUES
(6, 'Kawla Dakhil Madrasha Pailot school opposite, Dhaka- 1230', '1-3 Days', '1230', '120', 0, 'active');

-- --------------------------------------------------------

--
-- Table structure for table `sizes`
--

CREATE TABLE `sizes` (
  `id` int(11) NOT NULL,
  `size_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sizes`
--

INSERT INTO `sizes` (`id`, `size_name`) VALUES
(1, 'S'),
(2, 'M'),
(3, 'L'),
(4, 'XL'),
(5, 'XXL'),
(8, '28'),
(9, '30'),
(10, '32'),
(11, '34'),
(12, '36'),
(13, '38'),
(14, '40');

-- --------------------------------------------------------

--
-- Table structure for table `sub_categories`
--

CREATE TABLE `sub_categories` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `priority` int(11) DEFAULT 1,
  `status` varchar(50) DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` varchar(20) DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `status`, `created_at`) VALUES
(13, 'Sajids', 'sajidhossain8272@gmail.com', '01392530468', '$2y$10$gMNf1/LmM0X5Pd0WCkfojO1AcENNzug9kd04rAQd5pr9xOoqWskSm', 'active', '2026-06-12 14:48:08');

-- --------------------------------------------------------

--
-- Table structure for table `vendors`
--

CREATE TABLE `vendors` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `shop_name` varchar(150) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `wishlist`
--

INSERT INTO `wishlist` (`id`, `user_id`, `product_id`, `created_at`) VALUES
(2, 3, 15, '2026-02-18 19:46:13'),
(3, 3, 16, '2026-02-18 19:46:28'),
(4, 3, 8, '2026-02-18 19:53:28'),
(5, 3, 31, '2026-02-18 19:53:56'),
(7, 12, 95, '2026-06-10 17:21:56'),
(8, 12, 92, '2026-06-10 17:22:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `business_settings`
--
ALTER TABLE `business_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `colors`
--
ALTER TABLE `colors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pages`
--
ALTER TABLE `pages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `phone_sell_requests`
--
ALTER TABLE `phone_sell_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_colors`
--
ALTER TABLE `product_colors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_gallery`
--
ALTER TABLE `product_gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_sizes`
--
ALTER TABLE `product_sizes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `refund_requests`
--
ALTER TABLE `refund_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `section_labels`
--
ALTER TABLE `section_labels`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `section_key` (`section_key`);

--
-- Indexes for table `serving_areas`
--
ALTER TABLE `serving_areas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sizes`
--
ALTER TABLE `sizes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `vendors`
--
ALTER TABLE `vendors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `business_settings`
--
ALTER TABLE `business_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `colors`
--
ALTER TABLE `colors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `pages`
--
ALTER TABLE `pages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `phone_sell_requests`
--
ALTER TABLE `phone_sell_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `product_colors`
--
ALTER TABLE `product_colors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `product_gallery`
--
ALTER TABLE `product_gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_sizes`
--
ALTER TABLE `product_sizes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=188;

--
-- AUTO_INCREMENT for table `refund_requests`
--
ALTER TABLE `refund_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `section_labels`
--
ALTER TABLE `section_labels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `serving_areas`
--
ALTER TABLE `serving_areas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sizes`
--
ALTER TABLE `sizes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `sub_categories`
--
ALTER TABLE `sub_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `vendors`
--
ALTER TABLE `vendors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
