<?php 
// 1. Session and Connection
if (session_status() === PHP_SESSION_NONE) { session_start(); }
include('db.php'); 
include('header.php'); 

// 2. Fetch section labels (if any)
$labels = [];
$label_res = mysqli_query($conn, "SELECT * FROM section_labels");
if($label_res){
    while($l = mysqli_fetch_assoc($label_res)){
        $labels[$l['section_key']] = $l['label_text'];
    }
}

// 3. Category and Search logic
$category_id = isset($_GET['category']) ? (int)$_GET['category'] : 0;
$search_query = isset($_GET['search']) ? mysqli_real_escape_string($conn, $_GET['search']) : '';

$page_title = "All Products";
if($category_id > 0){
    $cat_name_res = mysqli_query($conn, "SELECT name FROM categories WHERE id = $category_id");
    $cat_data = mysqli_fetch_assoc($cat_name_res);
    if($cat_data) { $page_title = $cat_data['name']; }
} elseif(!empty($search_query)) {
    $page_title = "Search Results for: " . htmlspecialchars($search_query);
}

$product_path = "admin/uploads/products/";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
    <style>
        :root {
            --primary-green: #15a34a;
            --price-red: #e11d48;
            --text-gray: #94a3b8;
            --star-yellow: #facc15;
            --border-light: #86efac;
            --shadow-heavy: 0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05);
        }

        body { background-color: #fcfdfb; font-family: 'Segoe UI', sans-serif; margin: 0; color: #1e293b; }
        .container { width: 94%; max-width: 1400px; margin: 0 auto; padding-top: 30px; }

        .page-header { 
            background: white; padding: 40px 0; border-bottom: 1px solid #f1f5f9; margin-bottom: 40px; 
            box-shadow: 0 4px 10px rgba(0,0,0,0.02); text-align: center;
        }
        .page-header h1 { font-size: 32px; font-weight: 900; color: #0f172a; margin: 0; text-transform: uppercase; }
        .breadcrumb { font-size: 14px; color: var(--text-gray); margin-top: 10px; }
        .breadcrumb a { color: var(--primary-green); text-decoration: none; font-weight: bold; }

        .product-grid { 
            display: grid; 
            grid-template-columns: repeat(4, 1fr); 
            gap: 25px; 
            margin-bottom: 60px;
        }

        .product-card {
            background: #fff; border-radius: 22px; overflow: hidden;
            border: 1.5px solid var(--border-light); 
            box-shadow: var(--shadow-heavy); 
            transition: all 0.4s ease; position: relative; display: flex; flex-direction: column;
            height: 100%;
        }
        .product-card:hover { transform: translateY(-12px); box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15); }

        .img-area { position: relative; width: 100%; height: 240px; background: #fff; display: flex; align-items: center; justify-content: center; padding: 15px; box-sizing: border-box; }
        .img-area img { max-width: 95%; max-height: 95%; object-fit: contain; transition: 0.5s ease; }
        
        .badge-discount { position: absolute; top: 12px; left: 12px; background: var(--price-red); color: white; padding: 5px 12px; border-radius: 10px; font-size: 12px; font-weight: bold; z-index: 2; }
        
        .side-icons { position: absolute; top: 12px; right: 12px; display: flex; flex-direction: column; gap: 8px; z-index: 3; }
        .icon-btn { width: 36px; height: 36px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 15px rgba(0,0,0,0.1); cursor: pointer; color: #333; border:none; transition: 0.3s; }
        .icon-btn:hover { background: var(--primary-green); color: #fff; transform: rotate(15deg); }

        .product-info { padding: 15px 20px 20px; text-align: left; flex-grow: 1; display: flex; flex-direction: column; }
        .title-text { font-size: 17px; font-weight: 700; color: #064e3b; margin: 5px 0; text-decoration: none; display: block; height: 44px; overflow: hidden; line-height: 1.3; }
        .rating-box { color: var(--star-yellow); font-size: 13px; margin: 8px 0; }
        .price-row { display: flex; align-items: baseline; gap: 8px; margin-top: auto; }
        .current-price { font-size: 24px; font-weight: 800; color: #111; }
        .old-price { color: var(--text-gray); text-decoration: line-through; font-size: 16px; }

        .add-bag-btn { 
            background: var(--primary-green); color: white; border: none; padding: 12px; border-radius: 12px; 
            font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; transition: 0.3s;
            box-shadow: 0 5px 15px rgba(21, 128, 61, 0.2); margin-top: 15px;
        }
        .add-bag-btn:hover { background: #166534; transform: scale(1.02); }

        .no-products { text-align: center; padding: 100px 0; grid-column: 1 / -1; }
        .no-products i { font-size: 60px; color: #cbd5e1; margin-bottom: 20px; }

        @media (max-width: 1024px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) {
            .product-grid { grid-template-columns: repeat(2, 1fr); gap: 15px; }
            .img-area { height: 170px; }
            .current-price { font-size: 19px; }
            .page-header h1 { font-size: 22px; }
        }
    </style>
</head>
<body>

<div class="page-header">
    <div class="container">
        <h1><?php echo $page_title; ?></h1>
        <div class="breadcrumb">
            <a href="index.php">Home</a> / Products / <?php echo $page_title; ?>
        </div>
    </div>
</div>

<main class="container">
    <div class="product-grid">
        <?php 
        $sql = "SELECT p.*, c.name as cat_name FROM products p 
                LEFT JOIN categories c ON p.category_id = c.id 
                WHERE p.status='active'";

        if($category_id > 0) $sql .= " AND p.category_id = $category_id";
        if(!empty($search_query)) $sql .= " AND (p.name LIKE '%$search_query%' OR p.description LIKE '%$search_query%')";

        $sql .= " ORDER BY p.id DESC";
        $result = mysqli_query($conn, $sql);

        if(mysqli_num_rows($result) > 0){
            while($prod = mysqli_fetch_assoc($result)){
                
                // --- প্রাইস ফিক্স লজিক ---
                $display_price = $prod['price'];
                $display_old_price = $prod['old_price'];

                if($display_price <= 0){
                    $v_check = mysqli_query($conn, "SELECT price, old_price FROM product_variants WHERE product_id = '{$prod['id']}' LIMIT 1");
                    if($v_row = mysqli_fetch_assoc($v_check)){
                        $display_price = $v_row['price'];
                        $display_old_price = $v_row['old_price'];
                    }
                }

                $discount = ($display_old_price > $display_price) ? round((($display_old_price - $display_price) / $display_old_price) * 100) : 0;
                
                // Wishlist check
                $is_wishlisted = false;
                if(isset($_SESSION['user_id'])){
                    $uid = $_SESSION['user_id'];
                    $pid = $prod['id'];
                    $w_check = mysqli_query($conn, "SELECT id FROM wishlist WHERE user_id=$uid AND product_id=$pid");
                    if(mysqli_num_rows($w_check) > 0) $is_wishlisted = true;
                }
        ?>
            <div class="product-card">
                <div class="img-area">
                    <?php if($discount > 0) { ?><div class="badge-discount">-<?php echo $discount; ?>%</div><?php } ?>
                    
                    <div class="side-icons">
                        <button class="icon-btn" onclick="addToWishlist(<?php echo $prod['id']; ?>, this)">
                            <i class="<?php echo $is_wishlisted ? 'fa-solid' : 'fa-regular'; ?> fa-heart" style="<?php echo $is_wishlisted ? 'color:#e11d48;' : ''; ?>"></i>
                        </button>
                        <a href="product_details.php?id=<?php echo $prod['id']; ?>" class="icon-btn"><i class="fa-regular fa-eye"></i></a>
                    </div>

                    <a href="product_details.php?id=<?php echo $prod['id']; ?>" style="display:contents;">
                        <img src="<?php echo $product_path . $prod['image']; ?>" onerror="this.src='https://placehold.jp/200x200.png?text=Product';">
                    </a>
                </div>

                <div class="product-info">
                    <div style="font-size: 11px; color: var(--text-gray); text-transform: uppercase; font-weight: 700;"><?php echo htmlspecialchars($prod['cat_name'] ?? 'GROCERY'); ?></div>
                    <a href="product_details.php?id=<?php echo $prod['id']; ?>" class="title-text"><?php echo htmlspecialchars($prod['name']); ?></a>
                    
                    <div class="rating-box">
                        <?php for($i=1; $i<=5; $i++) { echo ($i <= ($prod['rating'] ?? 5)) ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>'; } ?>
                        <span style="color:var(--text-gray); font-size:12px;"> (<?php echo $prod['total_reviews'] ?? 0; ?>)</span>
                    </div>
                    
                    <div class="price-row">
                        <!-- Taka Currency Update -->
                        <span class="current-price">৳<?php echo number_format($display_price); ?></span>
                        <?php if($display_old_price > 0) { ?><span class="old-price">৳<?php echo number_format($display_old_price); ?></span><?php } ?>
                    </div>
                    <div style="font-size:12px; color:var(--text-gray); margin-top:5px;"><?php echo htmlspecialchars($prod['unit'] ?? 'per piece'); ?></div>

                    <button class="add-bag-btn" onclick="addToBag(<?php echo $prod['id']; ?>, <?php echo $display_price; ?>, '<?php echo $prod['image']; ?>', '<?php echo addslashes($prod['name']); ?>')">
                        <i class="fa-solid fa-cart-shopping"></i> Add to Bag
                    </button>
                </div>
            </div>
        <?php 
            }
        } else {
            echo '<div class="no-products">
                    <i class="fa-solid fa-box-open"></i>
                    <h3>No products found!</h3>
                    <p>Try searching for something else or check other categories.</p>
                    <a href="products.php" style="color:var(--primary-green); font-weight:bold; text-decoration:none;">View All Products</a>
                  </div>';
        } 
        ?>
    </div>
</main>

<script>
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });

    function addToWishlist(pId, btn) {
        let fd = new FormData();
        fd.append('product_id', pId);
        fd.append('add_to_wishlist', true);

        fetch('manage_wishlist.php', { method: 'POST', body: fd })
        .then(res => res.text())
        .then(data => {
            if (data === "login_required") {
                Swal.fire('Login Required', 'Please login to add to wishlist', 'info');
            } else {
                let icon = btn.querySelector('i');
                icon.classList.toggle('fa-regular');
                icon.classList.toggle('fa-solid');
                icon.style.color = icon.classList.contains('fa-solid') ? '#e11d48' : '';
                Toast.fire({ icon: 'success', title: data === "added" ? 'Added to wishlist!' : 'Removed from wishlist!' });
            }
        });
    }

    function addToBag(pId, price, image, name) {
        let fd = new FormData();
        fd.append('product_id', pId);
        fd.append('price', price);
        fd.append('image', image);
        fd.append('name', name);
        fd.append('quantity', 1);
        fd.append('add_to_cart', true);

        fetch('manage_cart.php', { method: 'POST', body: fd })
        .then(() => {
            Swal.fire({
                title: 'Added to Bag!',
                text: "Do you want to checkout now?",
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#0f172a',
                cancelButtonColor: '#f36d21',
                confirmButtonText: 'Checkout Now',
                cancelButtonText: 'Continue Shopping'
            }).then((result) => {
                if (result.isConfirmed) { window.location.href = 'cart.php'; }
            });
        });
    }
</script>

<?php include('footer.php'); ?>
</body>
</html>