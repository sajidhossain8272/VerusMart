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

// 2. Fetch Company Name for alt text or fallback
$settings_query = mysqli_query($conn, "SELECT company_name, logo FROM business_settings LIMIT 1");
$settings = mysqli_fetch_assoc($settings_query);
$company_name = isset($settings['company_name']) ? $settings['company_name'] : "Verus Mart";

// Set logo path from database or default
$logo_path = (!empty($settings['logo'])) ? "admin/uploads/business/" . $settings['logo'] : "assets/images/logo.png";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - <?php echo $company_name; ?></title>
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

        .login-wrapper {
            background-color: var(--bg-cyan);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', sans-serif;
            padding: 20px;
        }

        /* Center card styling */
        .login-card {
            background: white;
            width: 100%;
            max-width: 420px; 
            border-radius: 25px;
            padding: 40px 35px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            text-align: center;
        }

        /* লোগো সাইজ ফিক্সড - ছোট করা হয়েছে */
        .logo-area { 
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 25px;
            width: 100%;
        }
        .logo-area img { 
            max-height: 55px; /* লোগোর উচ্চতা কমানো হয়েছে */
            max-width: 100%;
            object-fit: contain;
            display: block;
        }
        
        .login-card h2 { font-size: 26px; font-weight: 800; color: var(--text-dark); margin-bottom: 25px; }

        .form-group { margin-bottom: 20px; position: relative; text-align: left; }
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

        .forgot-pass { text-align: left; margin-bottom: 25px; }
        .forgot-pass a { font-size: 12px; color: #5261ab; text-decoration: none; font-weight: 600; }

        .btn-sign-in {
            width: 100%;
            background: var(--btn-maroon);
            color: white;
            padding: 14px;
            border: none;
            border-radius: 50px;
            font-weight: 700;
            font-size: 15px;
            cursor: pointer;
            margin-bottom: 25px;
            transition: 0.3s;
        }
        .btn-sign-in:hover { background: #8e2845; transform: translateY(-2px); }

        .register-text { font-size: 13px; color: #64748b; }
        .register-text a { color: #5261ab; text-decoration: none; font-weight: 700; }

        /* মোবাইল অপ্টিমাইজেশান */
        @media (max-width: 480px) {
            .login-card { padding: 30px 20px; border-radius: 20px; }
            .logo-area img { max-height: 45px; } /* মোবাইলে আরও ছোট যাতে বক্সের ভেতর সুন্দর দেখায় */
            .login-card h2 { font-size: 22px; }
        }
    </style>
</head>
<body>

<div class="login-wrapper">
    <div class="login-card">
        
        <div class="logo-area">
            <img src="<?php echo $logo_path; ?>" alt="<?php echo $company_name; ?>" onerror="this.style.display='none'">
            <?php if(!file_exists($logo_path) && empty($settings['logo'])): ?>
                <h1 style="font-size: 24px; color: #5261ab; margin: 0;"><?php echo $company_name; ?></h1>
            <?php endif; ?>
        </div>

        <h2>Login</h2>

        <form action="login_process.php" method="POST">
            <div class="form-group">
                <label>Email Address</label>
                <input type="email" name="email" placeholder="Enter your email" required>
            </div>
            
            <div class="form-group" style="position: relative;">
                <label>Password</label>
                <input type="password" name="password" placeholder="Enter password" required id="passInput">
                <i class="fa-regular fa-eye-slash" id="togglePass" style="position: absolute; right: 20px; bottom: 13px; color: #cbd5e1; cursor: pointer;"></i>
            </div>

            <div class="forgot-pass">
                <a href="forgot_password.php">Forgot Password?</a>
            </div>

            <button type="submit" class="btn-sign-in">Sign in</button>

            <div class="register-text">
                Don't have an account yet? <a href="register.php">Register for free</a>
            </div>
        </form>
    </div>
</div>

<script>
    // Password hide/show script
    const togglePass = document.querySelector('#togglePass');
    const passwordInput = document.querySelector('#passInput');

    togglePass.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
</script>

<?php include('footer.php'); ?>

</body>
</html>