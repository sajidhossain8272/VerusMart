<?php 
// 1. Session and Database Connection
if (session_status() === PHP_SESSION_NONE) { session_start(); }
include('db.php'); 
include('header.php'); 

// If user is already logged in, redirect to home
if (isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit;
}

// 2. Fetch Company Settings
$settings_query = mysqli_query($conn, "SELECT company_name, logo FROM business_settings LIMIT 1");
$settings = mysqli_fetch_assoc($settings_query);
$company_name = isset($settings['company_name']) ? $settings['company_name'] : "Verus Mart";

// Set logo path
$logo_path = (!empty($settings['logo'])) ? "admin/uploads/business/" . $settings['logo'] : "assets/images/logo.png";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - <?php echo $company_name; ?></title>
    <!-- Font Awesome & Google Fonts -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    
    <style>
        :root {
            --bg-cyan: #00bcd4;
            --btn-maroon: #ac3255;
            --text-dark: #1e293b;
            --input-border: #e2e8f0;
        }

        .register-wrapper {
            background-color: var(--bg-cyan);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', sans-serif;
            padding: 40px 20px;
        }

        /* Center card styling */
        .register-card {
            background: white;
            width: 100%;
            max-width: 500px; 
            border-radius: 25px;
            padding: 40px 35px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            text-align: center;
        }

        /* লোগো এরিয়া ফিক্স - সেন্টারিং এবং সাইজ */
        .logo-area { 
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 25px;
            width: 100%;
        }
        .logo-area img { 
            max-height: 55px; /* লোগোর উচ্চতা আপনার লগইন পেজের মত রাখা হয়েছে */
            width: auto; 
            display: block;
            object-fit: contain;
        }
        
        .register-card h2 { font-size: 26px; font-weight: 800; color: var(--text-dark); margin-bottom: 25px; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        
        .form-group { margin-bottom: 18px; position: relative; text-align: left; }
        .form-group label { display: block; font-size: 13px; color: #64748b; margin-bottom: 6px; font-weight: 600; }
        .form-group input {
            width: 100%;
            padding: 12px 20px;
            border: 1.5px solid var(--input-border);
            border-radius: 50px;
            outline: none;
            transition: 0.3s;
            font-size: 14px;
            box-sizing: border-box;
        }
        .form-group input:focus { border-color: var(--bg-cyan); }

        .btn-register {
            width: 100%;
            background: var(--btn-maroon);
            color: white;
            padding: 15px;
            border: none;
            border-radius: 50px;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            margin-top: 10px;
            margin-bottom: 25px;
            transition: 0.3s;
        }
        .btn-register:hover { background: #8e2845; transform: translateY(-2px); }

        .login-text { font-size: 13px; color: #64748b; }
        .login-text a { color: #5261ab; text-decoration: none; font-weight: 700; }

        /* মোবাইল রেসপন্সিভ */
        @media (max-width: 600px) {
            .register-card { padding: 30px 20px; border-radius: 20px; }
            .form-grid { grid-template-columns: 1fr; }
            .logo-area img { max-height: 45px; }
            .register-card h2 { font-size: 22px; }
        }
    </style>
</head>
<body>

<div class="register-wrapper">
    <div class="register-card">
        
        <!-- Logo Area Centered -->
        <div class="logo-area">
            <img src="<?php echo $logo_path; ?>" alt="<?php echo $company_name; ?>" onerror="this.style.display='none'">
            <?php if(!file_exists($logo_path) && empty($settings['logo'])): ?>
                <h1 style="font-size: 24px; color: #5261ab; margin: 0;"><?php echo $company_name; ?></h1>
            <?php endif; ?>
        </div>

        <h2>Create Account</h2>

        <form action="register_process.php" method="POST">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" name="full_name" placeholder="Enter your full name" required>
            </div>

            <div class="form-grid">
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" placeholder="email@example.com" required>
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="text" name="phone" placeholder="017XXXXXXXX" required>
                </div>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" placeholder="••••••••" required>
                </div>
                <div class="form-group">
                    <label>Confirm Password</label>
                    <input type="password" name="confirm_password" placeholder="••••••••" required>
                </div>
            </div>

            <div style="margin-bottom: 20px; display: flex; align-items: flex-start; gap: 8px; text-align: left;">
                <input type="checkbox" id="terms" required style="width: auto; cursor: pointer; margin-top: 3px;">
                <label for="terms" style="font-size: 12px; color: #64748b; cursor: pointer;">
                    I agree to the <a href="terms.php" style="color:var(--bg-cyan); text-decoration: none; font-weight: 600;">Terms & Conditions</a>
                </label>
            </div>

            <button type="submit" class="btn-register">Register Now</button>

            <div class="login-text">
                Already have an account? <a href="login.php">Login here</a>
            </div>
        </form>
    </div>
</div>

<?php include('footer.php'); ?>

</body>
</html>