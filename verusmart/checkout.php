<?php 
// ১. সেশন এবং ডাটাবেজ কানেকশন
if (session_status() === PHP_SESSION_NONE) { session_start(); }
include('db.php'); 

// ২. PHPMailer লোড করা
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/Exception.php';
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';

// বিজনেস সেটিংস থেকে লোগো ও নাম আনা
$set_res = mysqli_query($conn, "SELECT * FROM business_settings WHERE id=1");
$biz = mysqli_fetch_assoc($set_res);
$logo_url = "https://" . $_SERVER['HTTP_HOST'] . "/admin/uploads/business/" . $biz['logo'];

$show_popup = false;
$popup_msg = "";
$popup_type = "";

// --- ইউজার লগইন করা থাকলে তার তথ্য ফেচ করা ---
$f_name_val = ""; $l_name_val = ""; $email_val = ""; $phone_val = ""; $address_val = "";
if (isset($_SESSION['user_id'])) {
    $u_id = $_SESSION['user_id'];
    $u_query = mysqli_query($conn, "SELECT * FROM users WHERE id = '$u_id'");
    if ($u_info = mysqli_fetch_assoc($u_query)) {
        $name_parts = explode(' ', trim($u_info['name']), 2);
        $f_name_val = $name_parts[0] ?? '';
        $l_name_val = $name_parts[1] ?? '';
        $email_val = $u_info['email'] ?? '';
        $phone_val = $u_info['phone'] ?? '';
        $address_val = $u_info['address'] ?? ''; 
    }
}

// ৩. অর্ডার প্রসেসিং লজিক
if (isset($_POST['place_order'])) {
    $first_name = mysqli_real_escape_string($conn, $_POST['first_name']);
    $last_name = mysqli_real_escape_string($conn, $_POST['last_name']);
    $customer_name = $first_name . " " . $last_name;
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $phone = mysqli_real_escape_string($conn, $_POST['phone']);
    $address = mysqli_real_escape_string($conn, $_POST['address']);
    $order_note = mysqli_real_escape_string($conn, $_POST['order_note']); 
    
    $subtotal = 0;
    $items_html = ""; 
    if(!empty($_SESSION['cart'])){
        foreach ($_SESSION['cart'] as $item) {
            $subtotal += $item['price'] * $item['quantity'];
            $items_html .= "<tr><td style='padding:10px; border:1px solid #eee;'>{$item['name']}</td><td style='text-align:center; padding:10px; border:1px solid #eee;'>{$item['quantity']}</td><td style='text-align:right; padding:10px; border:1px solid #eee;'>৳" . number_format($item['price']) . "</td></tr>";
        }
    }
    
    $delivery_charge = 60.00;
    $total_amount = $subtotal + $delivery_charge;
    $order_date = date("Y-m-d H:i:s");

    $order_query = "INSERT INTO orders (customer_name, email, phone, address, order_note, total_amount, status, order_date) 
                    VALUES ('$customer_name', '$email', '$phone', '$address', '$order_note', '$total_amount', 'pending', '$order_date')";

    if (mysqli_query($conn, $order_query)) {
        $new_order_id = mysqli_insert_id($conn); 

        foreach ($_SESSION['cart'] as $item) {
            $p_name = mysqli_real_escape_string($conn, $item['name']);
            mysqli_query($conn, "INSERT INTO order_items (order_id, product_name, price, quantity, image) 
                                 VALUES ('$new_order_id', '$p_name', '{$item['price']}', '{$item['quantity']}', '{$item['image']}')");
        }

        // ই-মেইল নোটিফিকেশন পাঠানো
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'verusmart4@gmail.com'; 
            $mail->Password   = 'dfou glui lljc uicd'; 
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port       = 465;
            $mail->setFrom('verusmart4@gmail.com', 'VerusMart Orders');
            $mail->addAddress('verusmart4@gmail.com'); 

            $mail->isHTML(true);
            $mail->Subject = 'New Order Received - #SB-' . $new_order_id;
            $mail->Body    = "
                <div style='font-family:Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #eee; padding:20px;'>
                    <center><img src='{$logo_url}' style='height:50px; margin-bottom:20px;'></center>
                    <h2 style='color:#f85606; text-align:center;'>New Order Received!</h2>
                    <p><strong>Order ID:</strong> #SB-{$new_order_id}</p>
                    <p><strong>Customer:</strong> {$customer_name}</p>
                    <p><strong>Phone:</strong> {$phone}</p>
                    <p><strong>Address:</strong> {$address}</p>
                    <table style='width:100%; border-collapse:collapse; margin-top:20px;'>
                        <thead><tr style='background:#f85606; color:#fff;'><th>Product</th><th>Qty</th><th>Price</th></tr></thead>
                        <tbody>{$items_html}</tbody>
                        <tfoot>
                            <tr><td colspan='2' style='padding:10px; text-align:right;'><b>Total:</b></td><td style='padding:10px; text-align:right; color:#f85606;'><b>৳".number_format($total_amount)."</b></td></tr>
                        </tfoot>
                    </table>
                </div>
            ";
            $mail->send();
        } catch (Exception $e) { }

        // পপআপ ফ্ল্যাগ সেট করা
        $show_popup = true;
        $popup_msg = "ধন্যবাদ! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। অর্ডার আইডি: #$new_order_id";
        $popup_type = "success";
        
        unset($_SESSION['cart']);
    }
}

include('header.php'); 
$product_path = "admin/uploads/products/";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout - VerusMart</title>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --daraz-orange: #f85606; --bg-light: #f8fafc; --text-dark: #1e293b; }
        body { background-color: var(--bg-light); font-family: 'Poppins', sans-serif; color: var(--text-dark); margin: 0; }
        .container { width: 94%; max-width: 1200px; margin: 40px auto; }
        .checkout-wrapper { display: grid; grid-template-columns: 1.8fr 1.2fr; gap: 30px; align-items: start; }
        .card { background: #fff; border-radius: 20px; padding: 30px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; margin-bottom: 25px; }
        .step-num { background: var(--daraz-orange); color: #fff; width: 32px; height: 32px; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 10px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        input, textarea { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; outline: none; margin-bottom: 15px; box-sizing: border-box; font-family: inherit; }
        .btn-place-order { background: var(--daraz-orange); color: white; border: none; width: 100%; padding: 16px; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .btn-place-order:hover { background: #d44905; }
        .item-mini { display: flex; align-items: center; gap: 15px; padding-bottom: 15px; border-bottom: 1px solid #f1f5f9; margin-bottom: 15px; }
        .item-mini img { width: 50px; height: 50px; border-radius: 8px; object-fit: contain; }
        @media (max-width: 992px) { .checkout-wrapper { grid-template-columns: 1fr; } .form-grid { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
<main class="container">
    <form action="checkout.php" method="POST">
        <div class="checkout-wrapper">
            <div class="checkout-main">
                <div class="card">
                    <h3 style="margin-bottom:25px;"><span class="step-num">1</span> Shipping Information</h3>
                    <div class="form-grid">
                        <input type="text" name="first_name" value="<?php echo htmlspecialchars($f_name_val); ?>" placeholder="First Name *" required>
                        <input type="text" name="last_name" value="<?php echo htmlspecialchars($l_name_val); ?>" placeholder="Last Name *" required>
                        <input type="email" name="email" value="<?php echo htmlspecialchars($email_val); ?>" placeholder="Email Address *" required>
                        <input type="text" name="phone" value="<?php echo htmlspecialchars($phone_val); ?>" placeholder="Phone Number *" required>
                    </div>
                    <input type="text" name="address" value="<?php echo htmlspecialchars($address_val); ?>" placeholder="Street Address *" required>
                    <textarea name="order_note" rows="3" placeholder="Order Note (Optional) - Special instructions..."></textarea>
                    <input type="text" name="zip" placeholder="Zip code" required>
                </div>
                <div class="card">
                    <h3><span class="step-num">2</span> Payment Method</h3>
                    <div style="background:#fff7ed; padding:15px; border:1px solid var(--daraz-orange); border-radius:12px; display:flex; align-items:center; gap:15px;">
                        <i class="fa-solid fa-truck-fast" style="color:var(--daraz-orange); font-size:20px;"></i>
                        <div><b>Cash on Delivery</b><br><small>পণ্য হাতে পেয়ে টাকা পরিশোধ করুন</small></div>
                    </div>
                </div>
            </div>
            <div class="summary-side">
                <div class="card">
                    <h3 style="margin-top:0;">Order Summary</h3>
                    <?php 
                    $subtotal = 0;
                    if(!empty($_SESSION['cart'])):
                        foreach ($_SESSION['cart'] as $item): 
                            $subtotal += $item['price'] * $item['quantity'];
                    ?>
                        <div class="item-mini">
                            <img src="<?php echo $product_path . $item['image']; ?>" onerror="this.src='https://placehold.jp/50x50.png';">
                            <div style="flex-grow:1;"><b><?php echo htmlspecialchars($item['name']); ?></b><br><small>Qty: <?php echo $item['quantity']; ?></small></div>
                            <b>৳<?php echo number_format($item['price'] * $item['quantity']); ?></b>
                        </div>
                    <?php endforeach; endif; ?>
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;"><span>Subtotal</span><b>৳<?php echo number_format($subtotal); ?></b></div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;"><span>Delivery Fee</span><b>৳60</b></div>
                    <div style="display:flex; justify-content:space-between; font-size:22px; font-weight:800; border-top:2px dashed #eee; padding-top:15px; color:var(--daraz-orange);"><span>Total</span><b>৳<?php echo number_format($subtotal + 60); ?></b></div>
                    <button type="submit" name="place_order" class="btn-place-order" style="margin-top:20px;">Place Order</button>
                </div>
            </div>
        </div>
    </form>
</main>

<script>
    <?php if($show_popup): ?>
        Swal.fire({
            title: '<span style="color:#f85606">অর্ডার সফল হয়েছে!</span>',
            text: '<?php echo $popup_msg; ?>',
            icon: 'success',
            confirmButtonColor: '#f85606',
            confirmButtonText: 'ঠিক আছে',
            backdrop: `rgba(248, 86, 6, 0.15)`
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'index.php';
            }
        });
    <?php endif; ?>
</script>

<?php include('footer.php'); ?>
</body>
</html>