<?php 
if (session_status() === PHP_SESSION_NONE) { session_start(); }
include('db.php'); 
include('header.php'); 

$product_path = "admin/uploads/products/";

if (isset($_GET['remove'])) {
    $id = $_GET['remove'];
    unset($_SESSION['cart'][$id]);
    echo "<script>window.location='cart.php';</script>";
}

$subtotal = 0;
$delivery_charge = 60;
$free_delivery_threshold = 1000;
?>

<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>আপনার শপিং ব্যাগ - VerusMart</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root { --daraz-orange: #f85606; --main-green: #10b981; --bg-body: #eff0f5; --text-dark: #212121; }
        body { background-color: var(--bg-body); font-family: 'Roboto', sans-serif; margin: 0; }
        .container { width: 90%; max-width: 1200px; margin: 30px auto; }
        .cart-wrapper { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 20px; align-items: start; }
        .cart-card { background: #fff; border-radius: 8px; padding: 15px; margin-bottom: 12px; position: relative; display: flex; gap: 15px; align-items: center; border: 1px solid #f0f0f0; }
        .item-img { width: 80px; height: 80px; border-radius: 4px; object-fit: contain; border: 1px solid #eee; }
        .item-details h4 { margin: 0 0 5px; font-size: 15px; font-weight: 500; color: #212121; }
        .qty-box { display: flex; align-items: center; border: 1px solid #ddd; border-radius: 4px; width: fit-content; }
        .qty-btn { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #fafafa; border: none; }
        .qty-val { width: 35px; text-align: center; font-size: 13px; font-weight: 700; }
        .price-col { text-align: right; min-width: 100px; font-size: 18px; font-weight: 700; color: var(--daraz-orange); }
        .summary-card { background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .checkout-btn { display: block; background: var(--daraz-orange); color: #fff; text-align: center; text-decoration: none; padding: 14px; border-radius: 4px; font-weight: 700; margin-top: 20px; }
    </style>
</head>
<body>
<main class="container">
    <h2 style="font-weight: 500; margin-bottom: 20px;">আপনার শপিং ব্যাগ</h2>
    <?php if (!empty($_SESSION['cart'])): ?>
        <div class="cart-wrapper">
            <div class="cart-list">
                <?php 
                foreach ($_SESSION['cart'] as $id => $item): 
                    // সেশন থেকে সরাসরি দাম নেওয়া (যা product_details থেকে পাঠানো হয়েছে)
                    $item_price = (isset($item['price']) && $item['price'] > 0) ? $item['price'] : 0;
                    $subtotal += ($item_price * $item['quantity']);
                ?>
                <div class="cart-card">
                    <a href="cart.php?remove=<?php echo $id; ?>" style="position:absolute; top:10px; right:10px; color:#ccc; text-decoration:none;">×</a>
                    <img src="<?php echo $product_path . $item['image']; ?>" class="item-img">
                    <div style="flex-grow:1;">
                        <h4><?php echo htmlspecialchars($item['name']); ?></h4>
                        <div style="font-size:12px; color:#757575;">
                            দাম: ৳<?php echo number_format($item_price); ?> 
                            <?php if(!empty($item['size'])): ?> | সাইজ: <?php echo $item['size']; endif; ?>
                        </div>
                        <div class="qty-box" style="margin-top:10px;">
                            <button class="qty-btn" onclick="updateQty('<?php echo $id; ?>', -1)">−</button>
                            <span class="qty-val"><?php echo $item['quantity']; ?></span>
                            <button class="qty-btn" onclick="updateQty('<?php echo $id; ?>', 1)">+</button>
                        </div>
                    </div>
                    <div class="price-col">৳<?php echo number_format($item_price * $item['quantity']); ?></div>
                </div>
                <?php endforeach; ?>
            </div>

            <div class="summary-side">
                <div class="summary-card">
                    <h3>অর্ডার সামারি</h3>
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;"><span>সাবটোটাল</span><b>৳<?php echo number_format($subtotal); ?></b></div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;"><span>ডেলিভারি চার্জ</span><b>৳<?php echo $delivery_charge; ?></b></div>
                    <div style="display:flex; justify-content:space-between; border-top:1px solid #eee; padding-top:15px; font-size:20px; color:var(--daraz-orange);"><span>মোট</span><b>৳<?php echo number_format($subtotal + $delivery_charge); ?></b></div>
                    <a href="checkout.php" class="checkout-btn">চেকআউট করুন</a>
                </div>
            </div>
        </div>
    <?php else: ?>
        <p>আপনার ব্যাগ খালি। <a href="index.php">কেনাকাটা করুন</a></p>
    <?php endif; ?>
</main>
<script>
function updateQty(id, change) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "update_cart_qty.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() { if (this.readyState === 4 && this.status === 200) location.reload(); };
    xhr.send("id=" + id + "&change=" + change);
}
</script>
<?php include('footer.php'); ?>
</body>
</html>