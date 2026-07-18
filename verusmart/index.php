<?php 
// ১. সেশন এবং ডাটাবেজ কানেকশন
if (session_status() === PHP_SESSION_NONE) { session_start(); }
include('db.php'); 

// ২. পাথ সেটিংস
$banner_path   = "admin/uploads/banners/";
$product_path  = "admin/uploads/products/";
$category_path = "admin/uploads/category/";

// ৩. স্লাইডারের জন্য ব্যানার ফেচ
$main_slides = mysqli_query($conn, "SELECT image FROM banners WHERE position='main' AND status='active' ORDER BY id DESC");

// ৪. ক্যাটাগরি ডাটা ফেচ (আইডি ১৩-১৬ এর জন্য আইকন)
$cat_icon_res = mysqli_query($conn, "SELECT * FROM categories WHERE id BETWEEN 13 AND 16 AND status='active' ORDER BY id ASC");

// ৫. স্পেশাল প্রোমো ব্যানার ফেচ (আইডি ১৭-২০)
$promo_res = mysqli_query($conn, "SELECT id, name, banner FROM categories WHERE id BETWEEN 17 AND 20 AND status='active' ORDER BY id ASC");
$promo_list = [];
while($pr = mysqli_fetch_assoc($promo_res)){ $promo_list[] = $pr; }

// ৬. দারাজ স্টাইল প্রোডাক্ট কার্ড ফাংশন
function renderProductCard($p, $product_path) {
    $p_id   = $p['id'];
    $p_name = htmlspecialchars($p['name'] ?? '');
    $p_img  = $p['image'];
    $price  = $p['price'] ?? 0;
    ?>
    <div class="daraz-card">
        <div class="d-img-box">
            <a href="product_details.php?id=<?php echo $p_id; ?>">
                <img src="<?php echo $product_path . $p_img; ?>" alt="product" onerror="this.src='https://placehold.jp/300x300.png?text=No+Image';">
            </a>
        </div>
        <div class="d-card-body">
            <h4 class="d-prod-title"><?php echo $p_name; ?></h4>
            <div class="d-price-now">৳<?php echo number_format($price); ?></div>
            <button class="d-add-btn" onclick="addToCart(<?php echo $p_id; ?>, '<?php echo addslashes($p_name); ?>', <?php echo $price; ?>, '<?php echo $p_img; ?>')">Add to Bag</button>
        </div>
    </div>
    <?php
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title> Verus - Mart </title>
        <!-- FAVICON যোগ করা হয়েছে -->
    <link rel="icon" type="image/png" href="assets/images/logo.png">
    
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        :root { --daraz-orange: #f85606; --daraz-bg: #eff0f5; --navy-blue: #002b5b; }
        body { background: var(--daraz-bg); font-family: 'Roboto', sans-serif; margin: 0; overflow-x: hidden; }
        .container { width: 92%; max-width: 1200px; margin: 0 auto; }
        
        /* Slider */
        .swiper { width: 100%; height: 350px; border-radius: 12px; margin-top: 15px; overflow: hidden; }
        .swiper-slide img { width: 100%; height: 100%; object-fit: cover; }

        /* Mega Sale Banner */
        .mega-offer-banner { background: linear-gradient(135deg, #f85606, #ff8c00); padding: 12px 25px; border-radius: 12px; margin-top: 10px; display: flex; justify-content: space-between; align-items: center; color: white; }
        .grab-btn { background: #fff; color: var(--daraz-orange); padding: 8px 25px; border-radius: 30px; font-weight: 900; font-size: 14px; text-decoration: none; }

        /* Welcome Voucher Section */
        .voucher-section { background: #fff; border-radius: 12px; padding: 15px 20px; margin-top: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .voucher-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .voucher-header h4 { margin: 0; font-size: 17px; font-weight: 900; }
        .voucher-body { display: flex; align-items: center; gap: 0; border: 1px solid #f1f1f1; border-radius: 8px; overflow: hidden; }
        .v-item { flex: 1; padding: 12px 15px; display: flex; flex-direction: column; }
        .v-item b { font-size: 20px; font-weight: 900; }
        .v-item span { font-size: 12px; font-weight: 500; }
        .v-pink { color: #f91d5a; }
        .v-teal { color: #0094b6; }
        .collect-btn { background: linear-gradient(90deg, #ff8c00, #f91d5a); color: white; border: none; padding: 10px 25px; border-radius: 8px; font-weight: 900; cursor: pointer; }

        /* SHOP BY CATEGORY DESIGN */
        .pic-cat-title { display: flex; align-items: center; text-align: center; margin: 30px 0 20px; }
        .pic-cat-title::before, .pic-cat-title::after { content: ''; flex: 1; border-bottom: 2px solid var(--navy-blue); }
        .pic-cat-title span { padding: 0 20px; font-weight: 900; color: var(--navy-blue); font-size: 18px; text-transform: uppercase; }

        .pic-cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
        .pic-cat-item { background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #ddd; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: 0.3s; display: flex; flex-direction: column; text-decoration: none; }
        .pic-cat-img-box { width: 100%; height: 180px; overflow: hidden; }
        .pic-cat-img-box img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .pic-cat-footer { color: white; padding: 12px 5px; font-size: 14px; font-weight: 900; text-transform: uppercase; text-align: center; }
        .pic-cat-item:nth-child(1) .pic-cat-footer { background: #0088cc; }
        .pic-cat-item:nth-child(2) .pic-cat-footer { background: #002b5b; }
        .pic-cat-item:nth-child(3) .pic-cat-footer { background: #333333; }
        .pic-cat-item:nth-child(4) .pic-cat-footer { background: #2e7d32; }

        /* =========================================
           SPECIAL OFFERS (PROMO BANNERS)
        ========================================= */
        .promo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 40px; }
        .promo-box { position: relative; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); height: 180px; display: block; }
        .promo-box img { width: 100%; height: 100%; object-fit: cover; display: block; transition: 0.3s; }
        .promo-box:hover img { transform: scale(1.05); }
        .promo-content { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to right, rgba(0,0,0,0.5), transparent); display: flex; flex-direction: column; justify-content: center; padding-left: 20px; color: white; }
        .promo-content h2 { margin: 0; font-size: 22px; font-weight: 900; text-transform: uppercase; line-height: 1.1; }
        .promo-sub { margin-top: 10px; font-size: 11px; font-weight: 700; background: #fff; color: #000; padding: 3px 10px; width: fit-content; border-radius: 4px; text-transform: uppercase; }

        /* Product Grid */
        .prod-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
        .daraz-card { background: #fff; border-radius: 4px; overflow: hidden; position: relative; border: 1px solid #f0f0f0; }
        .d-img-box { height: 160px; display: flex; align-items: center; justify-content: center; }
        .d-img-box img { max-height: 90%; max-width: 90%; object-fit: contain; }
        .d-card-body { padding: 10px; }
        .d-prod-title { font-size: 12px; color: #212121; height: 32px; overflow: hidden; }
        .d-price-now { font-size: 17px; color: var(--daraz-orange); font-weight: 500; display: block; }
        .d-add-btn { width: 100%; background: #ffe1d2; color: var(--daraz-orange); border: none; padding: 8px; font-size: 11px; font-weight: bold; cursor: pointer; border-radius: 4px; }

        @media (max-width: 768px) {
            .swiper { height: 180px; }
            .pic-cat-grid { grid-template-columns: repeat(2, 1fr); }
            .pic-cat-img-box { height: 120px; }
            .promo-grid { grid-template-columns: 1fr; }
            .promo-box { height: 140px; }
            .prod-grid { grid-template-columns: repeat(2, 1fr); }
        }
    </style>
</head>
<body>

    <?php include('header.php'); ?>

    <div class="container">
        <!-- Main Slider -->
        <div class="swiper mySwiper">
            <div class="swiper-wrapper">
                <?php while($slide = mysqli_fetch_assoc($main_slides)) { ?>
                    <div class="swiper-slide"><img src="<?php echo $banner_path . $slide['image']; ?>" alt="Banner"></div>
                <?php } ?>
            </div>
            <div class="swiper-pagination"></div>
        </div>

        <!-- Mega Offer Banner -->
        <div class="mega-offer-banner">
            <div style="font-weight:900; font-size:18px;">☀️ 4.4 MEGA SALE 🛍️</div>
            <a href="products.php" class="grab-btn">GRAB NOW ⚡</a>
        </div>



        <!-- SHOP BY CATEGORY -->
        <div class="pic-cat-title"><span>Shop By Category</span></div>
        <div class="pic-cat-grid">
            <?php mysqli_data_seek($cat_icon_res, 0); while($c = mysqli_fetch_assoc($cat_icon_res)) { ?>
            <a href="products.php?category=<?php echo $c['id']; ?>" class="pic-cat-item">
                <div class="pic-cat-img-box"><img src="<?php echo $category_path . $c['image']; ?>" alt="cat" onerror="this.src='https://placehold.jp/300x200.png';"></div>
                <div class="pic-cat-footer"><?php echo htmlspecialchars($c['name']); ?></div>
            </a>
            <?php } ?>
        </div>

        <!-- =========================================
             SPECIAL OFFERS (PROMO BANNERS SECTION)
        ========================================= -->
        <div class="pic-cat-title"><span>Special Offers</span></div>
        <div class="promo-grid">
            <?php 
            $subtexts = ["Up to 50% Off!", "Bestsellers", "Latest Collection", "Limited Time Offer"];
            for($i=0; $i<4; $i++) { 
                $name = isset($promo_list[$i]) ? $promo_list[$i]['name'] : "Offer Title";
                $img_src = (isset($promo_list[$i]) && !empty($promo_list[$i]['banner'])) ? $category_path . $promo_list[$i]['banner'] : "https://placehold.jp/600x250.png";
                $link_id = $promo_list[$i]['id'] ?? '#';
            ?>
                <a href="products.php?category=<?php echo $link_id; ?>" class="promo-box">
                    <img src="<?php echo $img_src; ?>" alt="Promo">
                    <div class="promo-content">
                        <h2><?php echo htmlspecialchars($name); ?></h2>
                        <span class="promo-sub"><?php echo $subtexts[$i]; ?></span>
                    </div>
                </a>
            <?php } ?>
        </div>

        <!-- Recommended Section -->
        <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin:0; font-size:18px; font-weight:700; color:var(--navy-blue);">Recommended For You 🎁</h3>
            <a href="products.php" style="color:var(--daraz-orange); text-decoration:none; font-size:12px; font-weight:700;">VIEW ALL →</a>
        </div>
        <div class="prod-grid">
            <?php 
            $rec_res = mysqli_query($conn, "SELECT p.*, c.name as cat_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.status='active' AND p.is_recommended = 1 LIMIT 6");
            while($p = mysqli_fetch_assoc($rec_res)) { renderProductCard($p, $product_path); } 
            ?>
        </div>
    </div>

    <?php include('footer.php'); ?>

    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <script>
        var swiper = new Swiper(".mySwiper", { loop: true, autoplay: { delay: 4000 }, pagination: { el: ".swiper-pagination", clickable: true } });
        function addToCart(id, name, price, image) {
            // আপনার আগের কার্ট লজিক এখানে
        }
    </script>
</body>
</html>