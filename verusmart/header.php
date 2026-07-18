<?php 
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include('db.php'); 

// বিজনেস সেটিংস এবং ক্যাটাগরি ডাটা ফেচ
$settings_res = mysqli_query($conn, "SELECT * FROM business_settings WHERE id=1");
$site = mysqli_fetch_assoc($settings_res);
$header_cats = mysqli_query($conn, "SELECT id, name, image FROM categories WHERE status='active' ORDER BY priority ASC");

$logo_path = "admin/uploads/business/";
$final_logo = (!empty($site['logo'])) ? $logo_path . $site['logo'] : "assets/images/logo.png";
$cart_count = isset($_SESSION['cart']) ? count($_SESSION['cart']) : 0;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($site['company_name'] ?? 'Verus Mart'); ?></title>
    
    <!-- FAVICON -->
    <link rel="icon" type="image/png" href="assets/images/logo.png">
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Roboto', sans-serif; }
        
        :root { 
            --daraz-orange: #f85606; 
            --daraz-bg: #eff0f5;
            --white: #ffffff;
            --text-dark: #212121;
        }

        /* =========================================
           PROFESSIONAL PRELOADER CSS (CLEAR LOGO)
        ========================================= */
        #preloader {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: #ffffff; display: flex; justify-content: center;
            align-items: center; z-index: 999999; flex-direction: column;
        }
        .loader-content { text-align: center; }
        .loader-logo {
            max-height: 80px; width: auto; margin-bottom: 20px;
            animation: floatPulse 2.5s infinite ease-in-out; /* হালকা ও পরিষ্কার এনিমেশন */
        }
        @keyframes floatPulse {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.9; }
            50% { transform: translateY(-15px) scale(1.05); opacity: 1; }
        }
        .loader-bar {
            width: 140px; height: 3px; background: #f1f1f1; border-radius: 10px;
            margin: 0 auto; overflow: hidden; position: relative;
        }
        .loader-bar::after {
            content: ''; position: absolute; left: -100%; width: 100%; height: 100%;
            background: var(--daraz-orange); animation: loadLine 1.5s infinite linear;
        }
        @keyframes loadLine {
            0% { left: -100%; }
            100% { left: 100%; }
        }

        /* =========================================
           HEADER & NAVIGATION STYLES
        ========================================= */
        .animated-logo-area { 
            display: flex; align-items: center; justify-content: flex-start; 
            text-decoration: none; position: relative; width: 220px;
            height: 50px; overflow: hidden;
        }
        .banner-item { position: absolute; width: 100%; height: 100%; display: flex; align-items: center; opacity: 0; }
        .logo-box img { max-width: 100%; max-height: 100%; object-fit: contain; }
        .logo-box { animation: slideRightToLeft 6s infinite; }
        .name-box { animation: slideRightToLeft 6s infinite; animation-delay: 3s; }
        
        @keyframes slideRightToLeft {
            0% { transform: translateX(100%); opacity: 0; }
            10% { transform: translateX(0); opacity: 1; }
            45% { transform: translateX(0); opacity: 1; }
            50% { transform: translateX(-100%); opacity: 0; }
            100% { opacity: 0; }
        }

        /* Desktop Header */
        .top-nav { background: #f7f7f7; padding: 5px 8%; display: flex; justify-content: flex-end; gap: 20px; font-size: 12px; color: #666; }
        .top-nav a { text-decoration: none; color: inherit; }
        .main-header { background: var(--white); padding: 15px 8%; display: flex; align-items: center; justify-content: space-between; gap: 30px; position: sticky; top: 0; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .search-box { flex: 1; position: relative; display: flex; }
        .search-box input { width: 100%; padding: 12px 20px; background: #eff0f5; border: none; border-radius: 8px; outline: none; font-size: 14px; }
        .search-box button { position: absolute; right: 0; top: 0; height: 100%; width: 50px; background: #ffe1d2; border: none; border-radius: 0 8px 8px 0; color: var(--daraz-orange); cursor: pointer; }

        .header-actions { display: flex; align-items: center; gap: 20px; }
        .action-link { text-decoration: none; color: #444; font-size: 22px; position: relative; }
        .badge { position: absolute; top: -8px; right: -10px; background: var(--daraz-orange); color: white; font-size: 10px; padding: 2px 6px; border-radius: 50%; font-weight: bold; }

        .nav-bar { background: var(--white); padding: 0 8%; border-bottom: 1px solid #eee; display: flex; align-items: center; }
        .cat-dropdown { position: relative; padding: 12px 0; cursor: pointer; color: var(--text-dark); font-weight: 500; font-size: 14px; display: flex; align-items: center; gap: 8px; }
        .dropdown-content { position: absolute; top: 100%; left: 0; width: 240px; background: white; box-shadow: 0 5px 15px rgba(0,0,0,0.1); display: none; list-style: none; z-index: 999; border-radius: 0 0 8px 8px; }
        .cat-dropdown:hover .dropdown-content { display: block; }
        .dropdown-content li a { display: block; padding: 12px 20px; text-decoration: none; color: #333; font-size: 13px; border-bottom: 1px solid #f5f5f5; }
        .dropdown-content li a:hover { background: #fafafa; color: var(--daraz-orange); }

        .nav-links { display: flex; list-style: none; margin-left: 40px; }
        .nav-links li a { text-decoration: none; color: #444; padding: 12px 15px; font-size: 13px; font-weight: 500; }

        /* Mobile View Header */
        .mobile-header-wrap { display: none; background: var(--white); padding: 10px 15px; align-items: center; justify-content: space-between; border-bottom: 1px solid #eee; position: sticky; top: 0; z-index: 1001; }
        
        /* সেন্টার এলাইনমেন্ট ফিক্স */
        .mobile-header-wrap .m-left, .mobile-header-wrap .m-right { width: 50px; display: flex; align-items: center; }
        .mobile-header-wrap .m-right { justify-content: flex-end; }
        .mobile-header-wrap .m-center { flex: 1; display: flex; justify-content: center; align-items: center; }
        
        .mobile-header-wrap .animated-logo-area { 
            width: auto; min-width: 150px; justify-content: center; 
        }
        .mobile-header-wrap .banner-item { justify-content: center; width: 100%; }
        .mobile-header-wrap .name-box h2 { font-size: 24px !important; font-weight: 900; color: var(--daraz-orange) !important; white-space: nowrap; }

        .side-menu { position: fixed; top: 0; left: -300px; width: 280px; height: 100%; background: white; z-index: 2000; transition: 0.3s; padding: 20px; }
        .side-menu.open { left: 0; }
        .menu-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1999; display: none; }

        @media (max-width: 992px) {
            .top-nav, .main-header, .nav-bar { display: none; }
            .mobile-header-wrap { display: flex; }
        }
    </style>
</head>
<body>

    <!-- Professional Preloader Section -->
    <div id="preloader">
        <div class="loader-content">
            <!-- আপনার লোগোটি এখানে স্পষ্টভাবে দেখা যাবে -->
            <img src="assets/images/logo.png" alt="Verus Mart" class="loader-logo">
            <div class="loader-bar"></div>
        </div>
    </div>

    <!-- Desktop View Header -->
    <div class="top-nav">
        <a href="#">SAVE MORE ON APP</a>
        <a href="#">CUSTOMER CARE</a>
        <a href="#">TRACK MY ORDER</a>
        <?php if(!isset($_SESSION['user_id'])): ?>
            <a href="login.php">LOGIN</a> <a href="login.php">SIGNUP</a>
        <?php else: ?>
            <a href="profile.php">MY ACCOUNT</a> <a href="logout.php">LOGOUT</a>
        <?php endif; ?>
    </div>

    <header class="main-header">
        <a href="index.php" class="animated-logo-area">
            <div class="banner-item logo-box"><img src="<?php echo $final_logo; ?>" alt="Logo"></div>
            <div class="banner-item name-box"><h2 style="color:var(--daraz-orange); font-size:18px; font-weight:900; white-space: nowrap;"><?php echo htmlspecialchars($site['company_name'] ?? 'Verus Mart'); ?></h2></div>
        </a>

        <div class="search-box">
            <form action="products.php" method="GET" style="width: 100%; display: flex;">
                <input type="text" name="search" placeholder="Search in Verus Mart..." required>
                <button type="submit"><i class="fa fa-search"></i></button>
            </form>
        </div>

        <div class="header-actions">
            <a href="wishlist.php" class="action-link"><i class="fa-regular fa-heart"></i></a>
            <a href="cart.php" class="action-link">
                <i class="fa-solid fa-cart-shopping"></i>
                <span class="badge"><?php echo $cart_count; ?></span>
            </a>
            <?php if(isset($_SESSION['user_id'])): ?>
                <a href="profile.php" class="action-link"><i class="fa-regular fa-user"></i></a>
            <?php endif; ?>
        </div>
    </header>

    <nav class="nav-bar">
        <div class="cat-dropdown">
            <i class="fa-solid fa-list-ul"></i> Categories <i class="fa-solid fa-chevron-down" style="font-size:10px; color:#888;"></i>
            <ul class="dropdown-content">
                <?php mysqli_data_seek($header_cats, 0); while($cat = mysqli_fetch_assoc($header_cats)) { ?>
                    <li><a href="products.php?category=<?php echo $cat['id']; ?>"><?php echo $cat['name']; ?></a></li>
                <?php } ?>
            </ul>
        </div>
        <ul class="nav-links">
            <li><a href="index.php">Home</a></li>
            <li><a href="products.php">Collections</a></li>
            <li><a href="products.php?type=hot">Hot Deals</a></li>
            <li><a href="products.php?type=weekly">Weekly Deals</a></li>
            <li><a href="serving-area.php">Serving Area</a></li>
        </ul>
    </nav>

    <!-- Mobile Header -->
    <div class="mobile-header-wrap">
        <div class="m-left"><i class="fa-solid fa-bars" onclick="toggleMenu()" style="font-size:22px; color:#444; cursor:pointer;"></i></div>
        <div class="m-center">
            <a href="index.php" class="animated-logo-area" style="width:auto; justify-content:center;">
                <div class="banner-item logo-box"><img src="<?php echo $final_logo; ?>" alt="Logo"></div>
                <div class="banner-item name-box"><h2><?php echo htmlspecialchars($site['company_name'] ?? 'VerusMart'); ?></h2></div>
            </a>
        </div>
        <div class="m-right">
            <a href="cart.php" class="action-link" style="font-size: 20px; color:#444;">
                <i class="fa-solid fa-cart-shopping"></i>
                <span class="badge" style="top:-5px; right:-8px;"><?php echo $cart_count; ?></span>
            </a>
        </div>
    </div>

    <!-- Mobile Sidebar -->
    <div class="menu-overlay" id="menuOverlay" onclick="toggleMenu()"></div>
    <div class="side-menu" id="sideMenu">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
            <h3 style="color:var(--daraz-orange);">Menu</h3>
            <i class="fa-solid fa-xmark" onclick="toggleMenu()" style="font-size:20px;"></i>
        </div>
        <ul style="list-style:none;">
            <li style="padding:12px 0; border-bottom:1px solid #f5f5f5;"><a href="index.php" style="text-decoration:none; color:#333;"><i class="fa fa-home" style="width:25px;"></i> Home</a></li>
            <li style="padding:12px 0; border-bottom:1px solid #f5f5f5;"><a href="products.php" style="text-decoration:none; color:#333;"><i class="fa fa-th-large" style="width:25px;"></i> All Collections</a></li>
            <li style="padding:12px 0; border-bottom:1px solid #f5f5f5;"><a href="wishlist.php" style="text-decoration:none; color:#333;"><i class="fa fa-heart" style="width:25px;"></i> Wishlist</a></li>
            <?php if(!isset($_SESSION['user_id'])): ?>
                <li style="padding:12px 0;"><a href="login.php" style="text-decoration:none; color:var(--daraz-orange); font-weight:700;">Login / Register</a></li>
            <?php else: ?>
                <li style="padding:12px 0; border-bottom:1px solid #f5f5f5;"><a href="profile.php" style="text-decoration:none; color:#333;"><i class="fa fa-user" style="width:25px;"></i> My Profile</a></li>
                <li style="padding:12px 0; border-bottom:1px solid #f5f5f5;"><a href="logout.php" style="text-decoration:none; color:red;">Logout</a></li>
            <?php endif; ?>
        </ul>
    </div>

    <script>
        // লোডার কন্ট্রোল
        window.addEventListener("load", function() {
            const preloader = document.getElementById("preloader");
            preloader.style.transition = "opacity 0.6s ease";
            preloader.style.opacity = "0";
            setTimeout(() => { preloader.style.display = "none"; }, 600);
        });

        function toggleMenu() {
            const menu = document.getElementById('sideMenu');
            const overlay = document.getElementById('menuOverlay');
            if(menu.classList.contains('open')) {
                menu.classList.remove('open');
                overlay.style.display = 'none';
            } else {
                menu.classList.add('open');
                overlay.style.display = 'block';
            }
        }
    </script>
</body>
</html>