<?php 
// ১. ডাটাবেজ কানেকশন এবং হেডার/সাইডবার ইনক্লুড
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

$product_upload_dir = "uploads/products/";
if (!is_dir($product_upload_dir)) { mkdir($product_upload_dir, 0777, true); }

// ২. ডাইনামিক সেকশন লেবেল ফেচ
$labels = [];
$label_res = mysqli_query($conn, "SELECT * FROM section_labels");
if($label_res){
    while($l = mysqli_fetch_assoc($label_res)){ $labels[$l['section_key']] = $l['label_text']; }
}

// ৩. প্রোডাক্ট সেভ লজিক (বাটন ক্লিক করার পর)
if(isset($_POST['add_product'])){
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $description = mysqli_real_escape_string($conn, $_POST['description']); 
    $cat_id = (int)$_POST['category_id'];
    $brand_id = (int)$_POST['brand_id'];
    $stock = (int)$_POST['stock'];
    $unit = mysqli_real_escape_string($conn, $_POST['unit']);
    $rating = (int)$_POST['rating'];
    $total_reviews = (int)$_POST['total_reviews'];

    // প্রাইস টাইপ অনুযায়ী প্রাইস সেট করা
    $price_type = $_POST['price_type'];
    $main_p = 0.00;
    $old_p = 0.00;

    if($price_type == 'basic'){
        $main_p = mysqli_real_escape_string($conn, $_POST['main_price']);
        $old_p = !empty($_POST['main_old_price']) ? mysqli_real_escape_string($conn, $_POST['main_old_price']) : 0.00;
    } else {
        // যদি ভেরিয়েন্ট হয়, তবে প্রথম ভেরিয়েন্টের দামকে মেইন প্রাইস ধরা হবে (৳০ এড়াতে)
        if(isset($_POST['v_price'][0])){
            $main_p = $_POST['v_price'][0];
            $old_p = !empty($_POST['v_old'][0]) ? $_POST['v_old'][0] : 0.00;
        }
    }

    // ইমেজ আপলোড প্রসেসিং (৩টি ইমেজ)
    $images = ["", "", ""];
    $input_names = ['p_img', 'p_img_2', 'p_img_3'];
    foreach($input_names as $index => $field_name){
        if(isset($_FILES[$field_name]) && $_FILES[$field_name]['name'] != ""){
            $ext = pathinfo($_FILES[$field_name]['name'], PATHINFO_EXTENSION);
            $new_name = "prod_" . time() . "_" . rand(100, 999) . "_" . $index . "." . $ext;
            if (move_uploaded_file($_FILES[$field_name]['tmp_name'], $product_upload_dir . $new_name)) {
                $images[$index] = $new_name;
            }
        }
    }

    // প্রোডাক্ট টেবিলে ডাটা ইনসার্ট
    $query = "INSERT INTO products (name, description, category_id, brand_id, price, old_price, unit, stock, rating, total_reviews, image, image_2, image_3, status) 
              VALUES ('$name', '$description', '$cat_id', '$brand_id', '$main_p', '$old_p', '$unit', '$stock', '$rating', '$total_reviews', '{$images[0]}', '{$images[1]}', '{$images[2]}', 'active')";
    
    if(mysqli_query($conn, $query)){
        $p_id = mysqli_insert_id($conn);

        // কালার সেভ
        if(isset($_POST['colors'])){
            foreach($_POST['colors'] as $color_id){
                mysqli_query($conn, "INSERT INTO product_colors (product_id, color_id) VALUES ($p_id, $color_id)");
            }
        }

        // সাইজ সেভ
        if(isset($_POST['sizes'])){
            foreach($_POST['sizes'] as $size_id){
                mysqli_query($conn, "INSERT INTO product_sizes (product_id, size_id) VALUES ($p_id, $size_id)");
            }
        }

        // ভেরিয়েন্ট প্রাইস সেভ (যদি টাইপ ভেরিয়েন্ট হয়)
        if($price_type == 'variant' && isset($_POST['v_name'])){
            foreach($_POST['v_name'] as $key => $v_name){
                if(!empty($v_name)){
                    $vp = mysqli_real_escape_string($conn, $_POST['v_price'][$key]);
                    $vo = mysqli_real_escape_string($conn, $_POST['v_old'][$key]);
                    mysqli_query($conn, "INSERT INTO product_variants (product_id, variant_name, price, old_price) VALUES ($p_id, '$v_name', '$vp', '$vo')");
                }
            }
        }

        echo "<script>alert('Product Published Successfully!'); window.location='product_list.php';</script>";
    } else {
        echo "Error: " . mysqli_error($conn);
    }
}
?>

<style>
    :root { --sidebar-width: 260px; --primary: #15803d; --bg: #f8fafc; }
    .content-wrapper { margin-left: var(--sidebar-width); padding: 100px 30px; width: calc(100% - var(--sidebar-width)); box-sizing: border-box; }
    .card { background: #fff; border-radius: 15px; padding: 35px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
    .section-label { font-size: 14px; font-weight: 800; color: var(--primary); text-transform: uppercase; margin: 30px 0 15px; display: flex; align-items: center; gap: 10px; }
    .section-label::after { content: ""; height: 2px; flex: 1; background: #f1f5f9; }
    label { display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 8px; text-transform: uppercase; }
    input, select, textarea { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 20px; outline: none; font-size: 14px; background: #fafbfc; }
    
    .checkbox-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; background: #f8fafc; padding: 15px; border-radius: 10px; border: 1px solid #eef2f7; margin-bottom: 25px; }
    .check-item { display: flex; align-items: center; gap: 8px; background: #fff; padding: 10px; border-radius: 8px; border: 1px solid #eee; cursor: pointer; font-size: 12px; font-weight: 700; }
    
    .variant-row { display: grid; grid-template-columns: 2fr 1fr 1fr 40px; gap: 10px; background: #f1f5f9; padding: 10px; border-radius: 8px; margin-bottom: 8px; }
    .pricing-toggle-box { background: #fffbeb; border: 1px solid #fde68a; padding: 20px; border-radius: 12px; margin-bottom: 20px; }

    .btn-save { background: var(--primary); color: white; border: none; padding: 18px; border-radius: 10px; cursor: pointer; font-weight: 800; width: 100%; font-size: 17px; margin-top: 15px; box-shadow: 0 10px 20px rgba(21, 128, 61, 0.2); }
    @media (max-width: 992px) { .content-wrapper { margin-left: 0; width: 100%; } }
</style>

<div class="content-wrapper">
    <div class="card">
        <h2 style="margin-bottom:30px;"><i class="fa-solid fa-cart-plus"></i> Add New Product</h2>
        
        <form action="" method="POST" enctype="multipart/form-data">
            
            <div class="section-label">General Info</div>
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 20px;">
                <div><label>Product Name *</label><input type="text" name="name" placeholder="Product Name" required></div>
                <div>
                    <label>Category *</label>
                    <select name="category_id" required>
                        <?php $cats = mysqli_query($conn, "SELECT id, name FROM categories"); while($c = mysqli_fetch_assoc($cats)){ echo "<option value='".$c['id']."'>".$c['name']."</option>"; } ?>
                    </select>
                </div>
                <div><label>Brand</label><select name="brand_id"><option value="0">No Brand</option><?php $brands = mysqli_query($conn, "SELECT id, name FROM brands"); while($b = mysqli_fetch_assoc($brands)){ echo "<option value='".$b['id']."'>".$b['name']."</option>"; } ?></select></div>
            </div>

            <label>Product Description</label>
            <textarea name="description" rows="4"></textarea>

            <div class="section-label">Pricing Selection</div>
            <div class="pricing-toggle-box">
                <label>Choose Price Type *</label>
                <select name="price_type" id="price_type_select" onchange="togglePriceFields()" required>
                    <option value="basic">Basic Price (Single Price for all)</option>
                    <option value="variant">Variant Price (Weight/Size Wise Price)</option>
                </select>
            </div>

            <div id="basic_price_section">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div><label>Main Price (৳) *</label><input type="number" step="0.01" name="main_price" id="main_price_input"></div>
                    <div><label>Old Price (৳)</label><input type="number" step="0.01" name="main_old_price"></div>
                </div>
            </div>

            <div id="variant_price_section" style="display:none;">
                <div id="variant_list">
                    <div class="variant-row">
                        <div><input type="text" name="v_name[]" placeholder="e.g. 500g / 1kg"></div>
                        <div><input type="number" step="0.01" name="v_price[]" placeholder="Price"></div>
                        <div><input type="number" step="0.01" name="v_old[]" placeholder="Old Price"></div>
                        <div style="text-align:center; color:gray;">-</div>
                    </div>
                </div>
                <button type="button" onclick="addVariant()" style="cursor:pointer; margin-bottom:20px;">+ Add More Variant</button>
            </div>

            <div class="section-label">Available Colors</div>
            <div class="checkbox-container">
                <?php $colors = mysqli_query($conn, "SELECT * FROM colors"); while($c = mysqli_fetch_assoc($colors)){ ?>
                    <label class="check-item"><input type="checkbox" name="colors[]" value="<?php echo $c['id']; ?>"> <span><?php echo $c['color_name']; ?></span></label>
                <?php } ?>
            </div>

            <div class="section-label">Available Sizes</div>
            <div class="checkbox-container">
                <?php $sizes = mysqli_query($conn, "SELECT * FROM sizes"); while($s = mysqli_fetch_assoc($sizes)){ ?>
                    <label class="check-item"><input type="checkbox" name="sizes[]" value="<?php echo $s['id']; ?>"> <span><?php echo $s['size_name']; ?></span></label>
                <?php } ?>
            </div>

            <div class="section-label">Product Images</div>
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:15px;">
                <input type="file" name="p_img" required>
                <input type="file" name="p_img_2">
                <input type="file" name="p_img_3">
            </div>

            <div class="section-label">Stock & Reviews</div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
                <div><label>Stock *</label><input type="number" name="stock" value="100" required></div>
                <div><label>Unit</label><input type="text" name="unit" placeholder="per piece"></div>
                <div><label>Rating</label><select name="rating"><option value="5">5 Star</option><option value="4">4 Star</option></select></div>
                <div><label>Total Reviews</label><input type="number" name="total_reviews" value="120"></div>
            </div>

            <button type="submit" name="add_product" class="btn-save">Publish Product</button>
        </form>
    </div>
</div>

<script>
    function togglePriceFields() {
        var type = document.getElementById('price_type_select').value;
        var basicSec = document.getElementById('basic_price_section');
        var variantSec = document.getElementById('variant_price_section');
        var mainInput = document.getElementById('main_price_input');

        if(type === 'basic'){
            basicSec.style.display = 'block';
            variantSec.style.display = 'none';
            mainInput.setAttribute('required', '');
        } else {
            basicSec.style.display = 'none';
            variantSec.style.display = 'block';
            mainInput.removeAttribute('required');
        }
    }

    function addVariant() {
        const container = document.getElementById('variant_list');
        const row = document.createElement('div');
        row.className = 'variant-row';
        row.innerHTML = `
            <div><input type="text" name="v_name[]" placeholder="Weight/Size" required></div>
            <div><input type="number" step="0.01" name="v_price[]" placeholder="Price" required></div>
            <div><input type="number" step="0.01" name="v_old[]" placeholder="Old Price"></div>
            <button type="button" onclick="this.parentElement.remove()" style="background:red; color:white; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer;">×</button>
        `;
        container.appendChild(row);
    }
</script>

</body>
</html>