<?php
session_start();
include('db.php'); 

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$user_query = mysqli_query($conn, "SELECT * FROM users WHERE id = '$user_id'");
$user = mysqli_fetch_assoc($user_query);

// ইউজারের নামের কলাম চেক করা (যাতে এরর না আসে)
$display_name = $user['name'] ?? $user['username'] ?? $user['full_name'] ?? 'Dear Customer';
$user_phone = $user['phone'] ?? '';

// অর্ডার সংখ্যা চেক করা
$order_count_res = mysqli_query($conn, "SELECT COUNT(id) as total FROM orders WHERE phone = '$user_phone'");
$order_count = mysqli_fetch_assoc($order_count_res)['total'];

$order_query = mysqli_query($conn, "SELECT * FROM orders WHERE phone = '$user_phone' ORDER BY id DESC");

$msg = "";
if (isset($_POST['change_pass'])) {
    $new_pass = $_POST['new_password'];
    $confirm_pass = $_POST['confirm_password'];
    if ($new_pass === $confirm_pass) {
        $hashed_password = password_hash($new_pass, PASSWORD_DEFAULT);
        $update = mysqli_query($conn, "UPDATE users SET password = '$hashed_password' WHERE id = '$user_id'");
        if ($update) $msg = "<div class='alert success'>Password updated successfully!</div>";
    } else {
        $msg = "<div class='alert error'>Passwords do not match!</div>";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Dashboard - ShodaiBazaar</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        :root {
            --primary: #017a0a;
            --secondary: #fdcf00;
            --bg: #f8fafc;
            --text-main: #1e293b;
            --text-muted: #64748b;
        }

        body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text-main); margin: 0; }
        .dashboard-container { max-width: 1200px; margin: 40px auto; padding: 0 20px; }

        /* Header Card */
        .welcome-card {
            background: linear-gradient(135deg, var(--primary), #014d06);
            padding: 40px; border-radius: 20px; color: white;
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 30px; box-shadow: 0 10px 25px rgba(1, 122, 10, 0.2);
        }
        .user-meta h1 { margin: 0; font-size: 28px; font-weight: 700; }
        .user-meta p { opacity: 0.8; margin-top: 5px; }
        .stats-badge { background: rgba(255,255,255,0.2); padding: 15px 25px; border-radius: 15px; text-align: center; }
        .stats-badge span { display: block; font-size: 22px; font-weight: 700; }

        .main-layout { display: grid; grid-template-columns: 280px 1fr; gap: 30px; }

        /* Sidebar Nav */
        .side-nav { background: white; padding: 20px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); height: fit-content; }
        .nav-list { list-style: none; padding: 0; margin: 0; }
        .nav-item {
            padding: 14px 20px; border-radius: 12px; cursor: pointer;
            margin-bottom: 8px; font-weight: 500; display: flex; align-items: center; gap: 12px;
            color: var(--text-muted); transition: all 0.3s ease;
        }
        .nav-item i { font-size: 18px; }
        .nav-item:hover, .nav-item.active { background: #f0fff0; color: var(--primary); }
        .nav-item.logout { color: #ef4444; margin-top: 20px; border-top: 1px solid #f1f5f9; padding-top: 20px; border-radius: 0; }

        /* Content Area */
        .content-card { background: white; padding: 35px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); min-height: 400px; }
        .tab-content { display: none; animation: slideUp 0.4s ease; }
        .tab-content.active { display: block; }

        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* Order Table Design */
        .order-table { width: 100%; border-collapse: separate; border-spacing: 0 10px; }
        .order-table th { padding: 15px; text-align: left; color: var(--text-muted); font-weight: 500; }
        .order-table tr { background: #fbfcfd; transition: transform 0.2s; }
        .order-table tr:hover { transform: scale(1.01); }
        .order-table td { padding: 18px 15px; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; }
        .order-table td:first-child { border-left: 1px solid #f1f5f9; border-radius: 12px 0 0 12px; font-weight: 600; }
        .order-table td:last-child { border-right: 1px solid #f1f5f9; border-radius: 0 12px 12px 0; }

        .status-pill { padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 600; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-completed { background: #dcfce7; color: #166534; }

        /* Professional Forms */
        .form-control { margin-bottom: 20px; }
        .form-control label { display: block; margin-bottom: 8px; font-weight: 500; font-size: 14px; color: var(--text-muted); }
        .form-control input {
            width: 100%; padding: 12px 16px; border-radius: 12px; border: 1.5px solid #e2e8f0;
            font-size: 15px; transition: border-color 0.2s; box-sizing: border-box;
        }
        .form-control input:focus { border-color: var(--primary); outline: none; }
        .btn-primary {
            background: var(--primary); color: white; border: none; padding: 14px 28px;
            border-radius: 12px; font-weight: 600; cursor: pointer; width: 100%; font-size: 16px;
        }

        .alert { padding: 15px; border-radius: 12px; margin-bottom: 25px; font-weight: 500; }
        .success { background: #dcfce7; color: #166534; }
        .error { background: #fee2e2; color: #991b1b; }

        @media (max-width: 992px) {
            .main-layout { grid-template-columns: 1fr; }
            .welcome-card { flex-direction: column; text-align: center; gap: 20px; }
        }
    </style>
</head>
<body>

<div class="dashboard-container">
    <!-- Top Welcome Card -->
    <div class="welcome-card">
        <div class="user-meta">
            <h1>Welcome back, <?php echo htmlspecialchars($display_name); ?>!</h1>
            <p><i class="fa fa-envelope"></i> <?php echo htmlspecialchars($user['email']); ?></p>
        </div>
        <div class="stats-badge">
            <p>Total Orders</p>
            <span><?php echo $order_count; ?></span>
        </div>
    </div>

    <div class="main-layout">
        <!-- Sidebar Navigation -->
        <aside class="side-nav">
            <div class="nav-list">
                <div class="nav-item active" onclick="showTab('profile', this)"><i class="fa-solid fa-address-card"></i> Profile Overview</div>
                <div class="nav-item" onclick="showTab('orders', this)"><i class="fa-solid fa-box-open"></i> My Order History</div>
                <div class="nav-item" onclick="showTab('security', this)"><i class="fa-solid fa-shield-halved"></i> Security & Pass</div>
                <a href="index.php" style="text-decoration:none"><div class="nav-item"><i class="fa-solid fa-store"></i> Shop More</div></a>
                <a href="logout.php" style="text-decoration:none">
                    <div class="nav-item logout"><i class="fa-solid fa-right-from-bracket"></i> Logout Account</div>
                </a>
            </div>
        </aside>

        <!-- Main Content Area -->
        <main class="content-card">
            <?php echo $msg; ?>

            <!-- Tab 1: Profile Overview -->
            <div id="profile" class="tab-content active">
                <h2 style="margin-top:0">Profile Information</h2>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top:25px;">
                    <div style="padding:20px; background:#f8fafc; border-radius:15px">
                        <small style="color:var(--text-muted)">Full Name</small>
                        <p style="margin:5px 0 0; font-weight:600"><?php echo htmlspecialchars($display_name); ?></p>
                    </div>
                    <div style="padding:20px; background:#f8fafc; border-radius:15px">
                        <small style="color:var(--text-muted)">Phone Number</small>
                        <p style="margin:5px 0 0; font-weight:600"><?php echo htmlspecialchars($user['phone'] ?? 'Not Linked'); ?></p>
                    </div>
                    <div style="padding:20px; background:#f8fafc; border-radius:15px">
                        <small style="color:var(--text-muted)">Customer ID</small>
                        <p style="margin:5px 0 0; font-weight:600">#<?php echo $user['id']; ?></p>
                    </div>
                </div>
            </div>

            <!-- Tab 2: Order History -->
            <div id="orders" class="tab-content">
                <h2 style="margin-top:0">Your Orders</h2>
                <div style="overflow-x: auto;">
                    <table class="order-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if(mysqli_num_rows($order_query) > 0): ?>
                                <?php while($order = mysqli_fetch_assoc($order_query)): ?>
                                    <tr>
                                        <td>#<?php echo $order['id']; ?></td>
                                        <td><?php echo date('M d, Y', strtotime($order['order_date'])); ?></td>
                                        <td style="font-weight:700">$<?php echo number_format($order['total_amount'], 2); ?></td>
                                        <td><span class="status-pill status-<?php echo strtolower($order['status']); ?>"><?php echo ucfirst($order['status']); ?></span></td>
                                    </tr>
                                <?php endwhile; ?>
                            <?php else: ?>
                                <tr><td colspan="4" style="text-align:center; padding:50px; color:var(--text-muted)">No orders placed yet.</td></tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Tab 3: Security -->
            <div id="security" class="tab-content">
                <h2 style="margin-top:0">Update Security</h2>
                <form method="POST" style="margin-top:25px; max-width:400px">
                    <div class="form-control">
                        <label>New Secure Password</label>
                        <input type="password" name="new_password" required placeholder="••••••••">
                    </div>
                    <div class="form-control">
                        <label>Confirm Password</label>
                        <input type="password" name="confirm_password" required placeholder="••••••••">
                    </div>
                    <button type="submit" name="change_pass" class="btn-primary">Update Password</button>
                </form>
            </div>
        </main>
    </div>
</div>

<script>
    function showTab(tabId, el) {
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        el.classList.add('active');
    }
</script>

</body>
</html>