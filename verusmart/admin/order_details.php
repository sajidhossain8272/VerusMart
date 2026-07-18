<?php 
ob_start(); 
if (session_status() === PHP_SESSION_NONE) { session_start(); }
include('../db.php'); 

// PHPMailer লাইব্রেরি লোড করা
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../phpmailer/Exception.php';
require '../phpmailer/PHPMailer.php';
require '../phpmailer/SMTP.php';

// বিজনেস সেটিংস থেকে লোগো এবং নাম আনা
$settings_res = mysqli_query($conn, "SELECT * FROM business_settings WHERE id=1");
$biz = mysqli_fetch_assoc($settings_res);
$logo_url = "https://" . $_SERVER['HTTP_HOST'] . "/admin/uploads/business/" . $biz['logo'];

// ১. স্ট্যাটাস আপডেট এবং ইমেইল পাঠানোর লজিক
if(isset($_POST['update_status']) && isset($_GET['id'])){
    $order_id_update = intval($_GET['id']);
    $new_status = mysqli_real_escape_string($conn, $_POST['status']);
    
    // ডাটাবেজ আপডেট
    $update_query = "UPDATE orders SET status='$new_status' WHERE id='$order_id_update'";
    
    if(mysqli_query($conn, $update_query)){
        
        // অর্ডারের বিস্তারিত তথ্য আনা (ইমেইলের জন্য)
        $order_info = mysqli_fetch_assoc(mysqli_query($conn, "SELECT * FROM orders WHERE id = '$order_id_update'"));
        $items_res = mysqli_query($conn, "SELECT * FROM order_items WHERE order_id = '$order_id_update'");
        
        $items_rows = "";
        while($it = mysqli_fetch_assoc($items_res)){
            $items_rows .= "<tr><td style='padding:8px; border:1px solid #eee;'>{$it['product_name']}</td><td style='text-align:center; padding:8px; border:1px solid #eee;'>{$it['quantity']}</td><td style='text-align:right; padding:8px; border:1px solid #eee;'>৳".number_format($it['price'])."</td></tr>";
        }

        // ইমেইল পাঠানোর প্রস্তুতি
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'verusmart4@gmail.com'; 
            $mail->Password   = 'dfou glui lljc uicd'; 
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port       = 465;
            $mail->setFrom('verusmart4@gmail.com', $biz['company_name']);

            if(!empty($order_info['email'])){
                $mail->addAddress($order_info['email']);
            }
            $mail->addBCC('verusmart4@gmail.com');

            $mail->isHTML(true);
            $mail->Subject = 'Order Update - #SB-' . $order_id_update;
            $mail->Body    = "
                <div style='font-family:Arial,sans-serif; max-width:600px; margin:auto; border:1px solid #eee; padding:20px; border-radius:10px;'>
                    <center><img src='{$logo_url}' style='height:50px; margin-bottom:20px;'></center>
                    <h2 style='color:#10b981; text-align:center;'>Order ".ucfirst($new_status)."</h2>
                    <p>Hello <b>{$order_info['customer_name']}</b>,</p>
                    <p>Your order status has been updated to: <b style='color:#f85606;'>".strtoupper($new_status)."</b></p>
                    <hr style='border:none; border-top:1px solid #eee;'>
                    <p><b>Order ID:</b> #SB-{$order_id_update}</p>
                    <table style='width:100%; border-collapse:collapse; margin-top:10px;'>
                        <tr style='background:#f8f8f8;'>
                            <th style='padding:8px; border:1px solid #eee; text-align:left;'>Item</th>
                            <th style='padding:8px; border:1px solid #eee;'>Qty</th>
                            <th style='padding:8px; border:1px solid #eee;'>Price</th>
                        </tr>
                        {$items_rows}
                        <tr>
                            <td colspan='2' style='text-align:right; padding:8px;'><b>Total:</b></td>
                            <td style='text-align:right; padding:8px; color:#10b981;'><b>৳".number_format($order_info['total_amount'])."</b></td>
                        </tr>
                    </table>
                    <p style='margin-top:20px; font-size:12px; color:#888;'>Thank you for shopping with {$biz['company_name']}!</p>
                </div>
            ";
            $mail->send();
        } catch (Exception $e) {}

        header("Location: order_details.php?id=" . $order_id_update . "&success=1");
        exit();
    }
}

include('header.php'); 
include('sidebar.php'); 

$order_id = intval($_GET['id']);
$order_query = mysqli_query($conn, "SELECT * FROM orders WHERE id = '$order_id'");
$order = mysqli_fetch_assoc($order_query);
$items_query = mysqli_query($conn, "SELECT * FROM order_items WHERE order_id = '$order_id'");

// ইমেজ পাথ ফিক্স - এটি আপনার এডমিন ফোল্ডারের ভেতরের আপলোড থেকে ছবি নিবে
$product_path = "uploads/products/"; 
?>

<style>
    .content-wrapper { margin-left: 260px; padding: 100px 30px 40px; background-color: #f8fafc; min-height: 100vh; font-family: 'Roboto', sans-serif; }
    .card { background: #fff; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eef2f6; margin-bottom: 25px; }
    .badge-status { padding: 6px 15px; border-radius: 50px; font-size: 11px; font-weight: 700; text-transform: uppercase; display: inline-block; }
    .status-pending { background: #fff7ed; color: #c2410c; }
    .status-delivered, .status-completed { background: #f0fdf4; color: #15803d; }
    .status-canceled { background: #fef2f2; color: #b91c1c; }
    .invoice-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    .invoice-table th { background: #f8fafc; padding: 12px; text-align: left; color: #64748b; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
    .invoice-table td { padding: 15px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #1e293b; vertical-align: middle; }
    .prod-img { width: 55px; height: 55px; object-fit: contain; border-radius: 8px; border: 1px solid #eee; background: #fff; padding: 2px; }
    .grand-total { display: flex; justify-content: flex-end; gap: 30px; margin-top: 20px; font-size: 26px; font-weight: 900; color: #10b981; }
    @media print { header, .sidebar, .no-print { display: none !important; } .content-wrapper { margin-left: 0 !important; padding: 0 !important; } }
</style>

<div class="content-wrapper">
    <div class="card">
        <div class="d-flex justify-content-between align-items-start">
            <div>
                <h3 class="fw-bold mb-1">INVOICE #SB-<?php echo $order['id']; ?></h3>
                <p class="text-muted small mb-0">Order Date: <?php echo date('d M, Y | h:i A', strtotime($order['order_date'])); ?></p>
            </div>
            <div class="text-end">
                <span class="badge-status status-<?php echo strtolower($order['status']); ?>">
                    <?php echo strtoupper($order['status'] ?: 'PENDING'); ?>
                </span>
            </div>
        </div>
    </div>

    <div style="display: grid; grid-template-columns: 2.2fr 1fr; gap: 25px;">
        <div class="details-left">
            <div class="card">
                <h5 class="fw-bold mb-4" style="color: #4b5563;">Ordered Items</h5>
                <div class="table-responsive">
                    <table class="invoice-table">
                        <thead>
                            <tr>
                                <th style="width: 80px;">Item</th>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th class="text-end">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php while($item = mysqli_fetch_assoc($items_query)){ ?>
                            <tr>
                                <td>
                                    <?php if(!empty($item['image'])): ?>
                                        <img src="<?php echo $product_path . $item['image']; ?>" class="prod-img" onerror="this.src='https://placehold.jp/100x100.png?text=No+Image';">
                                    <?php else: ?>
                                        <img src="https://placehold.jp/100x100.png?text=No+Image" class="prod-img">
                                    <?php endif; ?>
                                </td>
                                <td class="fw-bold"><?php echo $item['product_name']; ?></td>
                                <td>৳ <?php echo number_format($item['price']); ?></td>
                                <td>x <?php echo $item['quantity']; ?></td>
                                <td class="text-end fw-bold">৳ <?php echo number_format($item['price'] * $item['quantity']); ?></td>
                            </tr>
                            <?php } ?>
                        </tbody>
                    </table>
                </div>
                <div class="grand-total">
                    <span style="font-size: 16px; color: #64748b; font-weight: 500;">Grand Total:</span>
                    <span>৳ <?php echo number_format($order['total_amount']); ?></span>
                </div>
            </div>
        </div>

        <div class="details-right no-print">
            <div class="card" style="background: #f8fafc;">
                <h6 class="fw-bold mb-3">Update Status</h6>
                <form action="" method="POST">
                    <select name="status" class="form-select mb-3">
                        <option value="pending" <?php if($order['status']=='pending') echo 'selected'; ?>>Pending</option>
                        <option value="delivered" <?php if($order['status']=='delivered' || $order['status']=='completed') echo 'selected'; ?>>Delivered</option>
                        <option value="canceled" <?php if($order['status']=='canceled') echo 'selected'; ?>>Canceled</option>
                    </select>
                    <button type="submit" name="update_status" class="btn btn-success w-100 fw-bold">Update Now</button>
                </form>
            </div>

            <div class="card">
                <h6 class="fw-bold mb-3 border-bottom pb-2 text-primary">Customer Details</h6>
                <p class="mb-2"><b>Name:</b> <?php echo htmlspecialchars($order['customer_name']); ?></p>
                <p class="mb-2"><b>Phone:</b> <?php echo $order['phone']; ?></p>
                <p class="mb-2"><b>Address:</b> <br><small class="text-muted"><?php echo $order['address']; ?></small></p>
                <p class="mb-0"><b>Email:</b> <?php echo $order['email'] ?: 'N/A'; ?></p>
            </div>
            <button onclick="window.print()" class="btn btn-dark w-100 fw-bold"><i class="fas fa-print me-2"></i> Print Invoice</button>
        </div>
    </div>
</div>
<?php ob_end_flush(); ?>