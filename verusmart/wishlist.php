<?php 
// ১. সেশন এবং ডাটাবেস কানেকশন সবার আগে
if (session_status() === PHP_SESSION_NONE) { session_start(); }
include('db.php'); 

// ২. লগইন চেক (কোনো আউটপুট বা হেডার ফাইলের আগে)
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

$user_id = (int)$_SESSION['user_id'];

// ৩. রিমুভ লজিক (হেডার ফাইলের আগে যাতে রিডাইরেক্ট কাজ করে)
if (isset($_GET['remove'])) {
    $wish_id = (int)$_GET['remove'];
    mysqli_query($conn, "DELETE FROM wishlist WHERE id = $wish_id AND user_id = $user_id");
    header("Location: wishlist.php");
    exit;
}

// ৪. এখন হেডার ফাইল ইনক্লুড করুন
include('header.php'); 
$product_path = "admin/uploads/products/";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Wishlist</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <style>
        :root { --primary-green: #15a34a; --price-red: #e11d48; --text-gray: #64748b; }
        body { background-color: #fcfdfb; font-family: 'Inter', sans-serif; margin: 0; }
        .container { width: 94%; max-width: 1200px; margin: 0 auto; padding: 40px 0; }
        .wish-header { text-align: center; margin-bottom: 50px; }
        .wishlist-container { background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #f1f5f9; }
        .wish-item { display: grid; grid-template-columns: 100px 1fr 150px 180px 50px; align-items: center; padding: 20px; border-bottom: 1px solid #f1f5f9; }
        .wish-img img { width: 80px; height: 80px; object-fit: cover; border-radius: 10px; }
        .wish-price { font-size: 20px; font-weight: 800; color: #0f172a; }
        .btn-add-cart { background: #0f172a; color: white; border: none; padding: 10px 15px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .btn-add-cart:hover { background: var(--primary-green); }
        .empty-wishlist { text-align: center; padding: 80px 0; }
        .btn-shop { display: inline-block; margin-top: 20px; background: #f36d21; color: white; padding: 12px 35px; border-radius: 8px; text-decoration: none; font-weight: 700; }
        @media (max-width: 768px) { .wish-item { grid-template-columns: 80px 1fr; gap: 10px; padding: 15px; } }
    </style>
</head>
<body>

<div class="container">
    <div class="wish-header">
        <h1>My Wishlist <i class="fa-solid fa-heart" style="color: var(--price-red);"></i></h1>
        <p>Save your favorite products to buy them later</p>
    </div>

    <div class="wishlist-container">
        <?php 
        $query = "SELECT w.id as wish_id, p.* FROM wishlist w 
                  JOIN products p ON w.product_id = p.id 
                  WHERE w.user_id = $user_id ORDER BY w.created_at DESC";
        $result = mysqli_query($conn, $query);

        if (mysqli_num_rows($result) > 0) {
            while ($item = mysqli_fetch_assoc($result)) {
        ?>
            <div class="wish-item">
                <div class="wish-img"><img src="<?php echo $product_path . $item['image']; ?>"></div>
                <div class="wish-info"><h4><?php echo htmlspecialchars($item['name']); ?></h4><p style="color:var(--primary-green);">In Stock</p></div>
                <div class="wish-price">$<?php echo number_format($item['price'], 2); ?></div>
                <div class="wish-action">
                    <button class="btn-add-cart" onclick="addToBag(<?php echo $item['id']; ?>)">Add to Bag</button>
                </div>
                <div class="wish-remove-btn">
                    <a href="wishlist.php?remove=<?php echo $item['wish_id']; ?>" style="color: #cbd5e1;"><i class="fa-solid fa-trash-can"></i></a>
                </div>
            </div>
        <?php } } else { ?>
            <div class="empty-wishlist">
                <i class="fa-solid fa-heart-circle-xmark" style="font-size: 80px; color: #e2e8f0;"></i>
                <h3>Your wishlist is empty!</h3>
                <a href="index.php" class="btn-shop">Start Shopping</a>
            </div>
        <?php } ?>
    </div>
</div>

<script>
function addToBag(pId) {
    let fd = new FormData(); fd.append('product_id', pId); fd.append('quantity', 1); fd.append('add_to_cart', true);
    fetch('manage_cart.php', { method: 'POST', body: fd })
    .then(() => { Swal.fire({ title: 'Success!', text: 'Added to bag', icon: 'success', confirmButtonColor: '#15a34a' }); });
}
</script>

<?php include('footer.php'); ?>
</body>
</html>