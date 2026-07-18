<?php 
// ১. ডাটাবেস থেকে বিজনেস সেটিংস লোড করা
if(!isset($biz) || empty($biz)) {
    $set_res = mysqli_query($conn, "SELECT * FROM business_settings LIMIT 1");
    if($set_res && mysqli_num_rows($set_res) > 0) {
        $biz = mysqli_fetch_assoc($set_res);
    } else {
        $biz = []; 
    }
}
?>

<style>
    /* --- ফুটার জেনারেল স্টাইল (Daraz Orange Theme) --- */
    :root {
        --footer-bg: #2e2e2e; 
        --daraz-orange: #f85606; 
        --text-gray: #ababab;
        --white: #ffffff;
    }

    .main-footer {
        background-color: var(--footer-bg);
        color: var(--white);
        padding: 60px 8% 40px 8%;
        font-family: 'Roboto', 'Poppins', sans-serif;
        margin-top: 50px;
    }

    .footer-container {
        display: grid;
        grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
        gap: 30px;
        margin-bottom: 40px;
    }

    /* লোগো ও বর্ণনা */
    .footer-logo { 
        height: 45px; 
        width: auto;
        object-fit: contain;
        margin-bottom: 20px;
    }
    
    .footer-about { 
        font-size: 13px; 
        line-height: 1.6; 
        color: var(--text-gray); 
        max-width: 300px; 
    }

    .footer-col h3 {
        color: var(--white);
        font-size: 18px;
        font-weight: 500;
        margin-bottom: 20px;
    }

    /* সোশ্যাল আইকন - এডমিন থেকে লিঙ্ক আসবে */
    .social-icons { display: flex; gap: 15px; margin-top: 20px; }
    .social-icons a {
        color: var(--white);
        font-size: 22px;
        text-decoration: none; transition: 0.3s;
    }
    .social-icons a:hover { color: var(--daraz-orange); transform: scale(1.1); }

    /* লিঙ্ক লিস্ট */
    .footer-col ul { list-style: none; padding: 0; }
    .footer-col ul li { margin-bottom: 10px; }
    .footer-col ul li a { color: var(--text-gray); text-decoration: none; font-size: 13px; transition: 0.2s; display: block; }
    .footer-col ul li a:hover { color: var(--daraz-orange); padding-left: 5px; }

    /* কন্টাক্ট ইনফো */
    .contact-info div { display: flex; align-items: center; gap: 12px; margin-bottom: 15px; font-size: 13px; color: var(--text-gray); }
    .contact-info i { color: var(--daraz-orange); font-size: 16px; }

    /* পেমেন্ট পার্টনার্স */
    .payment-methods { margin-top: 20px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;}
    .payment-methods img { height: 20px; filter: grayscale(100%); opacity: 0.7; transition: 0.3s; }
    .payment-methods img:hover { filter: grayscale(0%); opacity: 1; }

    /* ফুটার বটম */
    .footer-bottom {
        border-top: 1px solid #444;
        padding-top: 25px; display: flex; justify-content: space-between; align-items: center;
        font-size: 12px; color: var(--text-gray);
    }

    /* ডেভেলপার এবং কপিরাইট লিঙ্ক */
    .copyright-link { color: inherit; text-decoration: none; transition: 0.3s; font-weight: bold; }
    .copyright-link:hover { color: var(--daraz-orange); }

    /* --- মোবাইল বটম নেভিগেশন বার --- */
    .mobile-nav-bar {
        display: none; position: fixed; bottom: 0; left: 0; width: 100%;
        background: #ffffff; height: 60px; z-index: 10001;
        justify-content: space-around; align-items: center;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        border-top: 1px solid #eee;
    }
    .mobile-nav-item { text-decoration: none; color: #757575; display: flex; flex-direction: column; align-items: center; font-size: 10px; width: 20%; }
    .mobile-nav-item i { font-size: 18px; margin-bottom: 3px; }
    .mobile-nav-item.active { color: var(--daraz-orange); }

    .mobile-cart-circle {
        width: 55px; height: 55px; background: var(--daraz-orange); border-radius: 50%;
        display: flex; justify-content: center; align-items: center;
        border: 4px solid #fff; position: relative; top: -15px; box-shadow: 0 4px 12px rgba(248, 86, 6, 0.3);
        text-decoration: none;
    }
    .mobile-cart-circle i { color: #fff; font-size: 22px; }

    @media (max-width: 992px) { .footer-container { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 768px) {
        .footer-container { grid-template-columns: 1fr; gap: 30px; text-align: center; }
        .main-footer { padding: 50px 5% 90px 5%; }
        .footer-about { margin: 0 auto 20px auto; }
        .social-icons, .contact-info div, .payment-methods { justify-content: center; }
        .mobile-nav-bar { display: flex; }
        .footer-bottom { flex-direction: column; gap: 10px; }
    }
</style>

<footer class="main-footer">
    <div class="footer-container">
        <!-- কলাম ১: লোগো ও সোশ্যাল -->
        <div class="footer-col">
            <a href="index.php">
                <?php if(!empty($biz['logo'])): ?>
                    <img src="admin/uploads/business/<?php echo $biz['logo']; ?>" class="footer-logo" alt="Logo">
                <?php else: ?>
                    <h2 style="color:var(--daraz-orange); margin:0 0 15px 0; font-weight: 900;">VERUS MART</h2>
                <?php endif; ?>
            </a>
            <p class="footer-about">
                <?php echo htmlspecialchars($biz['footer_about'] ?? 'Your trusted destination for the best online shopping experience. We ensure fast delivery and quality products.'); ?>
            </p>
            <div class="social-icons">
                <?php if(!empty($biz['facebook'])): ?> <a href="<?php echo $biz['facebook']; ?>" target="_blank"><i class="fab fa-facebook"></i></a> <?php endif; ?>
                <?php if(!empty($biz['tiktok'])): ?> <a href="<?php echo $biz['tiktok']; ?>" target="_blank"><i class="fab fa-tiktok"></i></a> <?php endif; ?>
                <?php if(!empty($biz['instagram'])): ?> <a href="<?php echo $biz['instagram']; ?>" target="_blank"><i class="fab fa-instagram"></i></a> <?php endif; ?>
                <?php if(!empty($biz['youtube'])): ?> <a href="<?php echo $biz['youtube']; ?>" target="_blank"><i class="fab fa-youtube"></i></a> <?php endif; ?>
                <?php if(!empty($biz['twitter'])): ?> <a href="<?php echo $biz['twitter']; ?>" target="_blank"><i class="fab fa-twitter"></i></a> <?php endif; ?>
            </div>
        </div>

        <!-- কলাম ২: হেল্প ও সাপোর্ট -->
        <div class="footer-col">
            <h3>Customer Care</h3>
            <ul>
                <li><a href="page.php?slug=faq">Help Center</a></li>
                <li><a href="contact.php">Contact Us</a></li>
                <li><a href="page.php?slug=how-to-buy">How to Buy</a></li>
                <li><a href="page.php?slug=returns-policy">Returns & Refunds</a></li>
            </ul>
        </div>

        <!-- কলাম ৩: কোম্পানি -->
        <div class="footer-col">
            <h3>Company</h3>
            <ul>
                <li><a href="about.php">About Us</a></li>
                <li><a href="page.php?slug=privacy-policy">Privacy Policy</a></li>
                <li><a href="page.php?slug=terms">Terms & Conditions</a></li>
                <li><a href="admin/login.php">Merchant Login</a></li>
            </ul>
        </div>

        <!-- কলাম ৪: কন্টাক্ট ডিটেইলস -->
        <div class="footer-col">
            <h3>Contact Info</h3>
            <div class="contact-info">
                <div><i class="fas fa-map-marker-alt"></i> <span><?php echo $biz['address'] ?? 'Kawla, Dhaka - 1229'; ?></span></div>
                <div><i class="fas fa-phone-alt"></i> <span><?php echo $biz['phone'] ?? '+880 1628083370'; ?></span></div>
                <div><i class="fas fa-envelope"></i> <span><?php echo $biz['email'] ?? 'verusmart4@gmail.com'; ?></span></div>
            </div>
            
            <div class="payment-methods">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard">
                <span style="font-size: 10px; color: var(--daraz-orange); border: 1px solid var(--daraz-orange); padding: 1px 5px; border-radius: 3px;">Bkash/Nagad</span>
            </div>
        </div>
    </div>

    <!-- ফুটার বটম -->
    <div class="footer-bottom">
        <div>
            <a href="https://wa.me/8801912855989" target="_blank" class="copyright-link">
                &copy; <?php echo date("Y"); ?> <?php echo $biz['company_name'] ?? 'VerusMart'; ?>. All rights reserved.
            </a>
        </div>

        <div style="display: flex; gap: 15px;">
            <a href="page.php?slug=privacy-policy" style="color:var(--text-gray); text-decoration:none;">Privacy</a>
            <a href="page.php?slug=terms" style="color:var(--text-gray); text-decoration:none;">Terms</a>
        </div>
    </div>
</footer>

<!-- মোবাইল বটম নেভিগেশন বার -->
<div class="mobile-nav-bar">
    <a href="index.php" class="mobile-nav-item active"><i class="fas fa-home"></i><span>Home</span></a>
    <a href="products.php" class="mobile-nav-item"><i class="fas fa-th-large"></i><span>Shop</span></a>
    <a href="cart.php" class="mobile-cart-circle"><i class="fas fa-shopping-cart"></i></a>
    <a href="wishlist.php" class="mobile-nav-item"><i class="fas fa-heart"></i><span>Wishlist</span></a>
    <a href="profile.php" class="mobile-nav-item"><i class="fas fa-user"></i><span>Profile</span></a>
</div>