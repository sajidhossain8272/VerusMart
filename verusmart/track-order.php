<?php 
include('db.php'); 
include('header.php'); 

$order_status = null;
$error = "";

if (isset($_POST['track_now'])) {
    $order_id = mysqli_real_escape_string($conn, $_POST['order_id']);
    $phone = mysqli_real_escape_string($conn, $_POST['phone']);

    // ডাটাবেজ থেকে অর্ডার খুঁজে বের করা
    $query = mysqli_query($conn, "SELECT * FROM orders WHERE id = '$order_id' AND phone = '$phone'");
    $order_status = mysqli_fetch_assoc($query);

    if (!$order_status) {
        $error = "No order found with this ID and Phone number.";
    }
}
?>

<div class="container" style="max-width: 600px; margin: 60px auto; padding: 0 20px;">
    <div style="background: #fff; padding: 40px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: center;">
        <h2 style="color: #017a0a; margin-bottom: 10px;">Track Your Order</h2>
        <p style="color: #64748b; margin-bottom: 30px;">Enter your Order ID and Phone number to see the status.</p>

        <?php if($error): ?>
            <div style="padding: 10px; background: #fee2e2; color: #991b1b; border-radius: 8px; margin-bottom: 20px; font-size: 14px;">
                <?php echo $error; ?>
            </div>
        <?php endif; ?>

        <form method="POST">
            <input type="text" name="order_id" placeholder="Order ID (Example: 12)" style="width:100%; padding:14px; margin-bottom:15px; border:1px solid #e2e8f0; border-radius:10px; font-size: 16px;" required>
            <input type="text" name="phone" placeholder="Phone Number" style="width:100%; padding:14px; margin-bottom:20px; border:1px solid #e2e8f0; border-radius:10px; font-size: 16px;" required>
            <button type="submit" name="track_now" style="background:#017a0a; color:#fff; border:none; width:100%; padding:15px; border-radius:10px; font-weight:bold; cursor:pointer; font-size: 16px;">Track Now</button>
        </form>

        <?php if($order_status): ?>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 2px dashed #f1f5f9;">
                <h3 style="margin-bottom: 15px;">Order Status: 
                    <span style="color: #017a0a; text-transform: uppercase;"><?php echo $order_status['status']; ?></span>
                </h3>
                <div style="display: flex; justify-content: space-between; font-size: 14px; color: #64748b;">
                    <span>Order Date: <?php echo date('d M Y', strtotime($order_status['order_date'])); ?></span>
                    <span>Total Amount: $<?php echo number_format($order_status['total_amount'], 2); ?></span>
                </div>
                
                <!-- Simple Status Visualizer -->
                <div style="margin-top: 25px; display: flex; justify-content: space-between; position: relative;">
                    <div style="text-align: center;">
                        <i class="fas fa-check-circle" style="color: #017a0a;"></i><br><small>Placed</small>
                    </div>
                    <div style="text-align: center; color: <?php echo ($order_status['status'] == 'processing' || $order_status['status'] == 'completed') ? '#017a0a' : '#cbd5e1'; ?>;">
                        <i class="fas fa-sync"></i><br><small>Processing</small>
                    </div>
                    <div style="text-align: center; color: <?php echo ($order_status['status'] == 'completed') ? '#017a0a' : '#cbd5e1'; ?>;">
                        <i class="fas fa-truck"></i><br><small>Completed</small>
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php include('footer.php'); ?>