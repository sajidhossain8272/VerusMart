<?php 
// ১. ডাটাবেজ কানেকশন এবং হেডার/সাইডবার ইনক্লুড
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

// ২. ইউজার আইডি চেক করা
if(!isset($_GET['id']) || empty($_GET['id'])){
    echo "<script>alert('Invalid User ID'); window.location='customer_list.php';</script>";
    exit;
}

$u_id = (int)$_GET['id'];

// ৩. ইউজারের প্রোফাইল ডাটা আনা
$user_res = mysqli_query($conn, "SELECT * FROM users WHERE id = $u_id");
$user = mysqli_fetch_assoc($user_res);

if(!$user){
    echo "<script>alert('User not found!'); window.location='customer_list.php';</script>";
    exit;
}

// ৪. ইউজারের অর্ডারের তথ্য আনা (ইমেইল অনুযায়ী)
$user_email = $user['email'];
// স্ক্রিনশট অনুযায়ী কলামের নাম order_date
$order_query = "SELECT * FROM orders WHERE email = '$user_email' ORDER BY id DESC";
$orders_result = mysqli_query($conn, $order_query);
$total_orders = mysqli_num_rows($orders_result);

// স্ক্রিনশট অনুযায়ী কলামের নাম total_amount
$total_spent_res = mysqli_query($conn, "SELECT SUM(total_amount) as total FROM orders WHERE email = '$user_email'");
$total_spent = mysqli_fetch_assoc($total_spent_res)['total'] ?? 0;
?>

<style>
    :root { 
        --primary: #3b82f6; 
        --bg: #f8fafc; 
        --card: #ffffff; 
        --sidebar-width: 260px;
    }

    .content-wrapper { 
        margin-left: var(--sidebar-width); 
        padding: 100px 30px 40px; 
        background: var(--bg); 
        min-height: 100vh; 
        width: calc(100% - var(--sidebar-width)); 
        box-sizing: border-box;
    }

    .back-btn { margin-bottom: 20px; display: inline-block; text-decoration: none; color: #64748b; font-weight: 600; font-size: 14px; }
    .back-btn:hover { color: var(--primary); }

    .profile-grid { display: grid; grid-template-columns: 350px 1fr; gap: 25px; }
    .card { background: white; border-radius: 15px; border: none; box-shadow: 0 4px 20px rgba(0,0,0,0.05); padding: 25px; }

    .user-profile-card { text-align: center; }
    .profile-avatar { width: 100px; height: 100px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; font-weight: 800; color: #475569; margin: 0 auto 15px; }
    
    .stat-box { display: flex; justify-content: space-around; margin-top: 25px; padding-top: 20px; border-top: 1px solid #f1f5f9; }
    .stat-item h4 { margin: 0; font-size: 18px; font-weight: 800; color: #1e293b; }
    .stat-item small { color: #64748b; font-size: 12px; }

    .info-list { margin-top: 25px; text-align: left; }
    .info-item { margin-bottom: 15px; }
    .info-item label { display: block; font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: 700; margin-bottom: 4px; }
    .info-item p { margin: 0; font-size: 15px; color: #1e293b; font-weight: 600; }

    .badge { padding: 6px 12px; border-radius: 50px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .status-active { background: #dcfce7; color: #166534; }
    .status-inactive { background: #fee2e2; color: #991b1b; }

    @media (max-width: 1100px) {
        .profile-grid { grid-template-columns: 1fr; }
        .content-wrapper { margin-left: 0; width: 100%; padding: 80px 15px; }
    }
</style>

<div class="content-wrapper">
    <a href="customer_list.php" class="back-btn"><i class="fa-solid fa-arrow-left"></i> Back to Customer List</a>

    <div class="profile-grid">
        <!-- প্রোফাইল ইনফো -->
        <div class="card user-profile-card">
            <div class="profile-avatar">
                <?php echo strtoupper(substr($user['full_name'], 0, 1)); ?>
            </div>
            <h3 style="margin:0;"><?php echo htmlspecialchars($user['full_name']); ?></h3>
            <span class="badge <?php echo ($user['status'] == 'active') ? 'status-active' : 'status-inactive'; ?>" style="margin-top:10px;">
                <?php echo strtoupper($user['status']); ?>
            </span>

            <div class="stat-box">
                <div class="stat-item">
                    <h4><?php echo $total_orders; ?></h4>
                    <small>Orders</small>
                </div>
                <div class="stat-item">
                    <h4>$<?php echo number_format($total_spent, 2); ?></h4>
                    <small>Spent</small>
                </div>
            </div>

            <div class="info-list">
                <div class="info-item">
                    <label>Email Address</label>
                    <p><?php echo htmlspecialchars($user['email']); ?></p>
                </div>
                <div class="info-item">
                    <label>Phone Number</label>
                    <p><?php echo htmlspecialchars($user['phone']); ?></p>
                </div>
                <div class="info-item">
                    <label>Join Date</label>
                    <p><?php echo date('d M, Y', strtotime($user['created_at'])); ?></p>
                </div>
            </div>
        </div>

        <!-- অর্ডার হিস্ট্রি -->
        <div class="card">
            <h4 style="margin-bottom: 20px;">Order History</h4>
            <div class="table-responsive">
                <table class="table align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php 
                        if(mysqli_num_rows($orders_result) > 0){
                            while($order = mysqli_fetch_assoc($orders_result)){
                        ?>
                        <tr>
                            <td class="fw-bold">#ORD-<?php echo $order['id']; ?></td>
                            <td><?php echo date('d M, Y', strtotime($order['order_date'])); ?></td>
                            <td class="fw-bold">$<?php echo number_format($order['total_amount'], 2); ?></td>
                            <td>
                                <span class="badge bg-secondary text-white"><?php echo strtoupper($order['status']); ?></span>
                            </td>
                            <td>
                                <a href="order_view.php?id=<?php echo $order['id']; ?>" class="btn btn-sm btn-outline-primary">View</a>
                            </td>
                        </tr>
                        <?php } 
                        } else {
                            echo "<tr><td colspan='5' class='text-center py-4 text-muted'>No orders found for this user.</td></tr>";
                        } ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

</body>
</html>