<?php 
if (session_status() === PHP_SESSION_NONE) { session_start(); }
include('db.php'); 
include('header.php'); 

// ১. ডাটা ফেচিং
$product_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$query = "SELECT p.*, c.name as cat_name FROM products p 
          LEFT JOIN categories c ON p.category_id = c.id 
          WHERE p.id = $product_id LIMIT 1";
$res = mysqli_query($conn, $query);
$product = mysqli_fetch_assoc($res);

if(!$product) {
    echo "<div class='container' style='padding:100px; text-align:center;'><h2>পণ্যটি পাওয়া যায়নি!</h2></div>";
    include('footer.php'); exit;
}

// ২. ভেরিয়েন্ট/কালার/সাইজ ডাটা
$v_list = [];
$variants_query = mysqli_query($conn, "SELECT * FROM product_variants WHERE product_id = $product_id ORDER BY id ASC");
while($v = mysqli_fetch_assoc($variants_query)){ $v_list[] = $v; }

$colors_query = mysqli_query($conn, "SELECT c.* FROM colors c JOIN product_colors pc ON c.id = pc.color_id WHERE pc.product_id = $product_id");
$sizes_query = mysqli_query($conn, "SELECT s.* FROM sizes s JOIN product_sizes ps ON s.id = ps.size_id WHERE ps.product_id = $product_id");
$related_query = mysqli_query($conn, "SELECT p.* FROM products p WHERE p.category_id = '{$product['category_id']}' AND p.id != $product_id LIMIT 6");

// ৩. ডিফল্ট দাম
$default_price = ($product['price'] > 0) ? $product['price'] : (isset($v_list[0]) ? $v_list[0]['price'] : 0);
$default_old_price = ($product['old_price'] > 0) ? $product['old_price'] : (isset($v_list[0]) ? $v_list[0]['old_price'] : 0);
$default_v_name = (isset($v_list[0])) ? $v_list[0]['variant_name'] : 'Regular';

$product_path = "admin/uploads/products/";
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title><?php echo htmlspecialchars($product['name']); ?></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
    <style>
        :root { --daraz-orange: #f85606; --daraz-bg: #eff0f5; --primary-green: #10b981; }
        body { font-family: 'Roboto', sans-serif; background-color: var(--daraz-bg); color: #212121; margin: 0; }
        .container { width: 90%; max-width: 1200px; margin: 0 auto; padding: 20px 0; }

        /* পপআপ */
        .cart-toast { position: fixed; top: 20px; right: -400px; background: #fff; border-left: 5px solid var(--daraz-orange); padding: 15px 25px; border-radius: 4px; z-index: 10000; box-shadow: 0 4px 15px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 15px; transition: 0.5s; }
        .cart-toast.show { right: 20px; }

        .details-wrapper { background: #fff; padding: 20px; border-radius: 4px; display: grid; grid-template-columns: 1fr 1.2fr; gap: 30px; }
        
        /* =========================================
           ZOOM FEATURE CSS
        ========================================= */
        .image-gallery { display: flex; flex-direction: column; gap: 15px; position: sticky; top: 90px; }
        .main-img-box { 
            width: 100%; height: 450px; overflow: hidden; 
            background: #fff; border: 1px solid #eee; 
            cursor: zoom-in; position: relative;
        }
        .main-img-box img { 
            width: 100%; height: 100%; object-fit: contain; 
            transition: transform 0.3s ease; 
        }
        .main-img-box:hover img { transform: scale(1.8); } /* হোভার করলে জুম হবে */

        .thumb-row { display: flex; gap: 10px; }
        .thumb-item { width: 70px; height: 70px; border: 1px solid #ddd; cursor: pointer; padding: 2px; }
        .thumb-item.active { border-color: var(--daraz-orange); }
        .thumb-item img { width: 100%; height: 100%; object-fit: cover; }

        /* তথ্য ও অন্যান্য */
        .prod-info h1 { font-size: 24px; font-weight: 400; margin: 0 0 15px; color: #212121; }
        .price-card { padding: 15px 0; border-top: 1px solid #f1f1f1; border-bottom: 1px solid #f1f1f1; margin: 15px 0; }
        .p-current { font-size: 32px; color: var(--daraz-orange); font-weight: 500; }
        .p-old { color: #757575; text-decoration: line-through; font-size: 16px; margin-left: 10px; }

        .label { font-size: 13px; color: #757575; margin-bottom: 8px; display: block; }
        .option-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
        .v-btn { border: 1px solid #ddd; padding: 8px 15px; background: #fff; cursor: pointer; font-size: 13px; transition: 0.2s; }
        .v-btn.active { border-color: var(--daraz-orange); color: var(--daraz-orange); background: #fff4f0; }

        .color-item { width: 30px; height: 30px; border-radius: 50%; border: 1px solid #ddd; cursor: pointer; }
        .color-item.active { outline: 2px solid var(--daraz-orange); outline-offset: 2px; }

        .btn-buy { background: var(--daraz-orange); color: #fff; border: none; padding: 15px; font-weight: 700; cursor: pointer; width: 100%; border-radius: 3px; }
        .btn-cart { background: #26abd4; color: #fff; border: none; padding: 15px; font-weight: 700; cursor: pointer; width: 100%; border-radius: 3px; }

        /* Lightbox Modal */
        #imgModal { display: none; position: fixed; z-index: 99999; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); justify-content: center; align-items: center; }
        #imgModal img { max-width: 90%; max-height: 90%; object-fit: contain; }
        .close-modal { position: absolute; top: 20px; right: 30px; color: #fff; font-size: 40px; cursor: pointer; }

        @media (max-width: 768px) { .details-wrapper { grid-template-columns: 1fr; } .main-img-box { height: 300px; } }
    </style>
</head>
<body>

<div id="cartToast" class="cart-toast">
    <div style="background: var(--daraz-orange); color:#fff; width:25px; height:25px; border-radius:50%; display:flex; align-items:center; justify-content:center;"><i class="fas fa-check" style="font-size:10px;"></i></div>
    <div id="toastMessage" style="font-size: 13px; font-weight: 500;">Item added to cart!</div>
</div>

<!-- Lightbox Modal -->
<div id="imgModal">
    <span class="close-modal" onclick="closeModal()">&times;</span>
    <img id="modalImg" src="">
</div>

<div class="container">
    <div class="details-wrapper">
        <!-- ইমেজ গ্যালারি উইথ জুম -->
        <div class="image-gallery">
            <div class="main-img-box" id="zoomContainer" onmousemove="zoomImage(event)" onmouseleave="resetZoom()" onclick="openModal()">
                <img id="mainImage" src="<?php echo $product_path . $product['image']; ?>" alt="Product">
            </div>
            <div class="thumb-row">
                <div class="thumb-item active" onclick="changeImage('<?php echo $product_path . $product['image']; ?>', this)"><img src="<?php echo $product_path . $product['image']; ?>"></div>
                <?php if(!empty($product['image_2'])): ?><div class="thumb-item" onclick="changeImage('<?php echo $product_path . $product['image_2']; ?>', this)"><img src="<?php echo $product_path . $product['image_2']; ?>"></div><?php endif; ?>
                <?php if(!empty($product['image_3'])): ?><div class="thumb-item" onclick="changeImage('<?php echo $product_path . $product['image_3']; ?>', this)"><img src="<?php echo $product_path . $product['image_3']; ?>"></div><?php endif; ?>
            </div>
        </div>

        <div class="prod-info">
            <span style="background:#f85606; color:#fff; padding:2px 10px; border-radius:2px; font-size:11px;"><?php echo htmlspecialchars($product['cat_name']); ?></span>
            <h1 style="margin-top:10px;"><?php echo htmlspecialchars($product['name']); ?></h1>
            
            <div style="color: #fcc419; font-size: 12px; margin-bottom: 10px;">
                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                <span style="color:#26abd4; margin-left:10px;">(<?php echo rand(20,100); ?> Ratings)</span>
            </div>

            <div class="price-card">
                <span id="displayPrice" class="p-current">৳<?php echo number_format($default_price); ?></span>
                <span id="displayOldPrice" class="p-old">৳<?php echo number_format($default_old_price); ?></span>
            </div>

            <!-- কালার ও সাইজ অপশন -->
            <?php if(mysqli_num_rows($colors_query) > 0): ?>
                <span class="label">Color:</span>
                <div class="option-grid">
                    <?php while($c = mysqli_fetch_assoc($colors_query)): ?>
                        <div class="color-item" style="background:<?php echo $c['color_code']; ?>" onclick="selectColor(this)" title="<?php echo $c['color_name']; ?>"></div>
                    <?php endwhile; ?>
                </div>
            <?php endif; ?>

            <?php if(mysqli_num_rows($sizes_query) > 0): ?>
                <span class="label">Size:</span>
                <div class="option-grid">
                    <?php while($s = mysqli_fetch_assoc($sizes_query)): ?>
                        <button class="v-btn" onclick="selectSize(this)"><?php echo $s['size_name']; ?></button>
                    <?php endwhile; ?>
                </div>
            <?php endif; ?>

            <!-- ওজন ভেরিয়েন্ট -->
            <?php if(count($v_list) > 0): ?>
                <span class="label">Select Weight:</span>
                <div class="option-grid">
                    <?php foreach($v_list as $index => $v): ?>
                        <button class="v-btn <?php echo ($index == 0) ? 'active' : ''; ?>" data-price="<?php echo $v['price']; ?>" data-old="<?php echo $v['old_price']; ?>" data-name="<?php echo $v['variant_name']; ?>" onclick="selectVariant(this)">
                            <?php echo $v['variant_name']; ?>
                        </button>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <button class="btn-buy" onclick="buyNow(<?php echo $product['id']; ?>)">Buy Now</button>
                <button class="btn-cart" onclick="addToBag(<?php echo $product['id']; ?>)">Add to Cart</button>
            </div>
            
            <div style="background:#fffbeb; border:1px solid #fef08a; padding:15px; border-radius:4px; margin-top:20px; font-size:13px; display:flex; align-items:center; gap:10px;">
                <i class="fas fa-truck" style="color:#854d0e;"></i>
                <span>Delivery: Inside Dhaka ৳60 | Outside Dhaka ৳120</span>
            </div>
        </div>
    </div>
</div>

<script>
    // জুম ফাংশনালিটি
    function zoomImage(e) {
        const container = document.getElementById('zoomContainer');
        const img = document.getElementById('mainImage');
        const x = e.clientX - container.offsetLeft;
        const y = e.clientY - container.offsetTop;
        
        img.style.transformOrigin = `${x}px ${y}px`;
        img.style.transform = "scale(2)";
    }

    function resetZoom() {
        const img = document.getElementById('mainImage');
        img.style.transform = "scale(1)";
    }

    // লাইটবক্স ফাংশন
    function openModal() {
        const modal = document.getElementById('imgModal');
        const modalImg = document.getElementById('modalImg');
        const mainImg = document.getElementById('mainImage');
        modal.style.display = "flex";
        modalImg.src = mainImg.src;
    }

    function closeModal() {
        document.getElementById('imgModal').style.display = "none";
    }

    function changeImage(src, el) {
        document.getElementById('mainImage').src = src;
        document.querySelectorAll('.thumb-item').forEach(i => i.classList.remove('active'));
        el.classList.add('active');
    }

    // ভেরিয়েন্ট ও কার্ট লজিক (আগের মতোই থাকবে)
    let selectedPrice = <?php echo $default_price; ?>;
    let vName = '<?php echo $default_v_name; ?>';

    function selectVariant(btn) {
        document.querySelectorAll('.v-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedPrice = btn.dataset.price;
        vName = btn.dataset.name;
        document.getElementById('displayPrice').innerText = '৳' + Number(selectedPrice).toLocaleString();
        document.getElementById('displayOldPrice').innerText = '৳' + Number(btn.dataset.old).toLocaleString();
    }

    function addToBag(pId) {
        const params = "product_id=" + pId + "&add_to_cart=true&price=" + selectedPrice + "&size=" + vName;
        fetch('manage_cart.php', { method: 'POST', body: new URLSearchParams(params) })
        .then(() => {
            const toast = document.getElementById("cartToast");
            toast.classList.add("show");
            setTimeout(() => { toast.classList.remove("show"); location.reload(); }, 1800);
        });
    }

    function buyNow(pId) {
        addToBag(pId);
        setTimeout(() => { window.location.href = 'cart.php'; }, 1000);
    }
</script>

<?php include('footer.php'); ?>
</body>
</html>