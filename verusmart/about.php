<?php 
// ১. সেশন এবং কানেকশন নিশ্চিত করা
if (session_status() === PHP_SESSION_NONE) { session_start(); }
include('db.php'); 
include('header.php'); 

// বিজনেস সেটিংস থেকে কোম্পানির নাম আনা
$settings_query = mysqli_query($conn, "SELECT company_name FROM business_settings LIMIT 1");
$settings = mysqli_fetch_assoc($settings_query);
$company_name = isset($settings['company_name']) ? $settings['company_name'] : "VerusMart";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About Us - <?php echo $company_name; ?></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --daraz-orange: #f85606;
            --text-dark: #212121;
            --text-gray: #757575;
            --bg-gray: #eff0f5;
        }

        body { background-color: var(--bg-gray); font-family: 'Roboto', sans-serif; margin: 0; color: var(--text-dark); }
        .container { width: 90%; max-width: 1200px; margin: 0 auto; padding: 40px 0; }

        /* --- Hero Section --- */
        .about-hero {
            background: linear-gradient(rgba(248, 86, 6, 0.9), rgba(212, 73, 5, 0.8)), 
                        url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
            background-size: cover;
            background-position: center;
            padding: 80px 0;
            text-align: center;
            color: white;
            border-bottom-left-radius: 30px;
            border-bottom-right-radius: 30px;
            box-shadow: 0 10px 20px rgba(248, 86, 6, 0.1);
        }
        .about-hero h1 { font-size: 42px; font-weight: 900; margin-bottom: 10px; text-transform: uppercase; }
        .about-hero p { font-size: 16px; opacity: 0.9; letter-spacing: 1px; }

        /* --- Main Content --- */
        .about-content { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 50px; 
            align-items: center; 
            margin-top: 50px; 
            background: #fff;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .about-img img { 
            width: 100%; 
            border-radius: 15px; 
            box-shadow: 0 15px 30px rgba(0,0,0,0.1); 
            border: 5px solid var(--bg-gray);
        }
        
        .about-text h2 { font-size: 28px; color: var(--daraz-orange); margin-bottom: 20px; font-weight: 700; }
        .about-text p { line-height: 1.7; color: var(--text-gray); font-size: 15px; margin-bottom: 20px; }

        .stat-box { display: flex; gap: 30px; margin-top: 25px; }
        .stat-item h3 { color: var(--daraz-orange); font-size: 24px; margin: 0; font-weight: 900; }
        .stat-item small { color: var(--text-gray); font-weight: 500; }

        /* --- Features/Values --- */
        .values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 40px; }
        .value-card { 
            background: white; padding: 35px 25px; border-radius: 15px; text-align: center; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.03); transition: 0.3s; border: 1px solid #f1f1f1;
        }
        .value-card:hover { transform: translateY(-8px); border-color: var(--daraz-orange); }
        .value-card i { font-size: 36px; color: var(--daraz-orange); margin-bottom: 15px; }
        .value-card h4 { font-size: 18px; font-weight: 700; margin-bottom: 10px; color: var(--text-dark); }
        .value-card p { font-size: 13px; color: var(--text-gray); line-height: 1.6; }

        /* --- Mission Section --- */
        .mission-box { 
            background: #fff4ef; padding: 50px; border-radius: 25px; margin-top: 50px; 
            text-align: center; border: 2px dashed var(--daraz-orange);
        }
        .mission-box h2 { font-size: 26px; color: var(--daraz-orange); margin-bottom: 15px; font-weight: 800; }
        .mission-box p { max-width: 800px; margin: 0 auto; color: var(--text-dark); font-size: 16px; font-style: italic; line-height: 1.6; }

        /* রেসপনসিভ */
        @media (max-width: 992px) {
            .about-content { grid-template-columns: 1fr; padding: 25px; }
            .values-grid { grid-template-columns: 1fr; }
            .about-hero h1 { font-size: 30px; }
            .stat-box { justify-content: center; }
        }
    </style>
</head>
<body>

    <!-- Hero Section -->
    <div class="about-hero">
        <div class="container">
            <h1>Our Journey</h1>
            <p>Trusted Online Shopping Experience in Bangladesh</p>
        </div>
    </div>

    <div class="container">
        <!-- Story Section -->
        <div class="about-content">
            <div class="about-img">
                <img src="https://images.unsplash.com/photo-1556742049-13ad733d0111?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="About <?php echo $company_name; ?>">
            </div>
            <div class="about-text">
                <h2>Welcome to <?php echo $company_name; ?></h2>
                <p>At <?php echo $company_name; ?>, our mission is to provide you with a seamless and premium shopping experience. We understand the importance of quality, authenticity, and speed in today's fast-paced world.</p>
                <p>Started with a vision to redefine e-commerce in Bangladesh, we bring you a vast collection of products ranging from electronics and fashion to daily essentials, ensuring each item meets our high standards.</p>
                
                <div class="stat-box">
                    <div class="stat-item">
                        <h3>10k+</h3>
                        <small>Active Users</small>
                    </div>
                    <div class="stat-item" style="border-left: 2px solid #eee; padding-left: 25px;">
                        <h3>500+</h3>
                        <small>Quality Brands</small>
                    </div>
                </div>
            </div>
        </div>

        <!-- Values Section -->
        <div class="values-grid">
            <div class="value-card">
                <i class="fas fa-check-circle"></i>
                <h4>Authentic Products</h4>
                <p>We guarantee 100% genuine products sourced directly from trusted suppliers and manufacturers.</p>
            </div>
            <div class="value-card">
                <i class="fas fa-bolt"></i>
                <h4>Express Delivery</h4>
                <p>Enjoy lightning-fast delivery across the country with our dedicated logistics partners.</p>
            </div>
            <div class="value-card">
                <i class="fas fa-shield-alt"></i>
                <h4>Secure Payments</h4>
                <p>Your security is our priority. We offer multiple safe payment options including Bkash, Nagad, and Cards.</p>
            </div>
        </div>

        <!-- Mission & Vision -->
        <div class="mission-box">
            <h2>Our Mission</h2>
            <p>"To empower every customer in Bangladesh with the convenience of digital shopping by offering top-tier products, competitive pricing, and unparalleled customer service."</p>
        </div>
    </div>

    <?php include('footer.php'); ?>

</body>
</html>