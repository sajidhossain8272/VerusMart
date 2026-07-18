<?php
if (session_status() === PHP_SESSION_NONE) { session_start(); }
if(!isset($_SESSION['admin_id'])) {
    header('location: login.php');
    exit();
}
include('../db.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> VerusMart - Admin Panel</title>
    <!-- Google Fonts: Poppins -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <style>
        :root {
            --sidebar-width: 260px;
            --top-bg: #0f172a;
            --primary-blue: #3b82f6;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        body { background: #f8fafc; overflow-x: hidden; }

        header {
            height: 70px; background: var(--top-bg); display: flex; align-items: center;
            justify-content: space-between; padding: 0 25px; position: fixed;
            top: 0; left: 0; width: 100%; z-index: 1001; box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header-left { display: flex; align-items: center; gap: 15px; }
        .brand-text { color: #fff; font-weight: 700; font-size: 20px; letter-spacing: 1px; text-transform: uppercase; }
        .brand-text span { background: #10b981; color: #fff; padding: 2px 8px; border-radius: 5px; font-size: 12px; margin-left: 5px; vertical-align: middle; }
        
        .toggle-btn { color: #94a3b8; cursor: pointer; font-size: 20px; }
        .header-right { display: flex; align-items: center; gap: 20px; color: #fff; }
        
        .profile-btn { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 5px 12px; border-radius: 8px; transition: 0.3s; }
        .profile-btn:hover { background: rgba(255,255,255,0.1); }
        .admin-avater { width: 35px; height: 35px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; }
        
        .dropdown-custom { position: absolute; top: 60px; right: 20px; background: #fff; width: 200px; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); display: none; padding: 10px 0; }
        .dropdown-custom.show { display: block; animation: fadeIn 0.3s ease; }
        .dropdown-item-custom { padding: 10px 20px; color: #475569; text-decoration: none; display: flex; align-items: center; gap: 10px; font-size: 14px; }
        .dropdown-item-custom:hover { background: #f1f5f9; color: var(--primary-blue); }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body>
    <header>
        <div class="header-left">
            <div class="toggle-btn" id="sidebarToggle"><i class="fas fa-bars"></i></div>
            <div class="brand-text">Verus-Mart <span>Admin</span></div>
        </div>
        <div class="header-right">
            <div class="profile-btn" id="profileToggle">
                <div class="admin-avater"><?php echo substr($_SESSION['admin_name'], 0, 2); ?></div>
                <span class="d-none d-md-block"><?php echo $_SESSION['admin_name']; ?> <i class="fas fa-chevron-down ms-1" style="font-size: 10px;"></i></span>
            </div>
            <div class="dropdown-custom" id="profileDropdown">
                <a href="profile.php" class="dropdown-item-custom"><i class="fas fa-user-cog"></i> Profile</a>
                <a href="business_settings.php" class="dropdown-item-custom"><i class="fas fa-cog"></i> Settings</a>
                <hr class="my-1">
                <a href="logout.php" class="dropdown-item-custom text-danger"><i class="fas fa-power-off"></i> Logout</a>
            </div>
        </div>
    </header>

    <script>
        document.getElementById('profileToggle').onclick = function(e) {
            e.stopPropagation();
            document.getElementById('profileDropdown').classList.toggle('show');
        }
        document.onclick = function() { document.getElementById('profileDropdown').classList.remove('show'); }
    </script>