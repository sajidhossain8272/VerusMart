<?php 
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

if(!isset($_GET['id'])){ echo "<script>window.location='product_list.php';</script>"; exit; }
$id = (int)$_GET['id'];
$p = mysqli_fetch_assoc(mysqli_query($conn, "SELECT * FROM products WHERE id = $id"));
$v_count = mysqli_num_rows(mysqli_query($conn, "SELECT id FROM product_variants WHERE product_id = $id"));

$selected_colors = []; $sc_res = mysqli_query($conn, "SELECT color_id FROM product_colors WHERE product_id = $id");
while($sc = mysqli_fetch_assoc($sc_res)){ $selected_colors[] = $sc['color_id']; }
$selected_sizes = []; $ss_res = mysqli_query($conn, "SELECT size_id FROM product_sizes WHERE product_id = $id");
while($ss = mysqli_fetch_assoc($ss_res)){ $selected_sizes[] = $ss['size_id']; }

if(isset($_POST['update_product'])){
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $description = mysqli_real_escape_string($conn, $_POST['description']); 
    $cat_id = (int)$_POST['category_id'];
    $brand_id = (int)$_POST['brand_id'];
    $stock = (int)$_POST['stock'];
    $unit = mysqli_real_escape_string($conn, $_POST['unit']);
    $rating = (int)$_POST['rating'];
    $total_reviews = (int)$_POST['total_reviews'];

    $price_type = $_POST['price_type'];
    $main_p = 0.00; $old_p = 0.00;
    if($price_type == 'basic'){
        $main_p = $_POST['main_price']; $old_p = $_POST['main_old_price'] ?: 0.00;
    } else {
        if(isset($_POST['v_price'][0])){ $main_p = $_POST['v_price'][0]; $old_p = $_POST['v_old'][0] ?: 0.00; }
    }

    $img_updates = "";
    for($i=1; $i<=3; $i++){
        $field = ($i == 1) ? 'p_img' : 'p_img_'.$i;
        $db_col = ($i == 1) ? 'image' : 'image_'.$i;
        if(isset($_FILES[$field]) && $_FILES[$field]['name'] != ""){
            $new_name = "prod_".time()."_".rand(100,999)."_".$i.".".pathinfo($_FILES[$field]['name'], PATHINFO_EXTENSION);
            move_uploaded_file($_FILES[$field]['tmp_name'], "uploads/products/" . $new_name);
            $img_updates .= ", $db_col='$new_name'";
        }
    }

    $sql = "UPDATE products SET name='$name', description='$description', category_id='$cat_id', brand_id='$brand_id', price='$main_p', old_price='$old_p', stock='$stock', unit='$unit', rating='$rating', total_reviews='$total_reviews' $img_updates WHERE id=$id";
    if(mysqli_query($conn, $sql)){
        mysqli_query($conn, "DELETE FROM product_colors WHERE product_id=$id");
        if(isset($_POST['colors'])){ foreach($_POST['colors'] as $c_id){ mysqli_query($conn, "INSERT INTO product_colors (product_id, color_id) VALUES ($id, $c_id)"); } }
        mysqli_query($conn, "DELETE FROM product_sizes WHERE product_id=$id");
        if(isset($_POST['sizes'])){ foreach($_POST['sizes'] as $s_id){ mysqli_query($conn, "INSERT INTO product_sizes (product_id, size_id) VALUES ($id, $s_id)"); } }

        mysqli_query($conn, "DELETE FROM product_variants WHERE product_id=$id");
        if($price_type == 'variant' && isset($_POST['v_name'])){
            foreach($_POST['v_name'] as $k => $v_n){ if(!empty($v_n)){ $vp = $_POST['v_price'][$k]; $vo = $_POST['v_old'][$k]; mysqli_query($conn, "INSERT INTO product_variants (product_id, variant_name, price, old_price) VALUES ($id, '$v_n', '$vp', '$vo')"); } }
        }
        echo "<script>alert('Product Updated!'); window.location='product_list.php';</script>";
    }
}
?>

<style>
    :root { --sidebar-width: 260px; --primary: #15803d; --bg: #f8fafc; }
    .content-wrapper { margin-left: var(--sidebar-width); padding: 100px 30px; width: calc(100% - var(--sidebar-width)); background: var(--bg); min-height: 100vh; }
    .card { background: #fff; border-radius: 15px; padding: 35px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
    .section-label { font-size: 13px; font-weight: 800; color: var(--primary); text-transform: uppercase; margin: 30px 0 15px; display: flex; align-items: center; gap: 10px; }
    .section-label::after { content: ""; height: 2px; flex: 1; background: #f1f5f9; }
    input, select, textarea { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 15px; outline: none; font-size: 13px; background: #fafbfc; }
    .checkbox-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; background: #f8fafc; padding: 15px; border-radius: 10px; border: 1px solid #eee; margin-bottom: 25px; }
    .check-item { display: flex; align-items: center; gap: 8px; background: #fff; padding: 10px; border-radius: 8px; border: 1px solid #eee; cursor: pointer; font-size: 11px; font-weight: 700; }
    .variant-row { display: grid; grid-template-columns: 2fr 1fr 1fr 40px; gap: 10px; background: #f1f5f9; padding: 10px; border-radius: 8px; margin-bottom: 8px; }
    .btn-update { background: var(--primary); color: white; border: none; padding: 16px; border-radius: 10px; cursor: pointer; font-weight: 800; width: 100%; font-size: 16px; margin-top: 10px; }
    .pricing-box { background: #fffbeb; border: 1px solid #fde68a; padding: 20px; border-radius: 12px; margin-bottom: 20px; }
    .preview-img { width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd; }
    @media (max-width: 992px) { .content-wrapper { margin-left: 0; width: 100%; } }
</style>

<div class="content-wrapper">
    <div class="card">
        <h2 style="font-weight: 800; margin-bottom: 30px;"><i class="fa-solid fa-pen-to-square"></i> Edit: <?php echo $p['name']; ?></h2>
        <form action="" method="POST" enctype="multipart/form-data">
            <div class="section-label">General Info</div>
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 20px;">
                <div><label>Name *</label><input type="text" name="name" value="<?php echo htmlspecialchars($p['name']); ?>" required></div>
                <div><label>Category *</label><select name="category_id"><?php $cats = mysqli_query($conn, "SELECT id, name FROM categories"); while($c = mysqli_fetch_assoc($cats)){ $sel = ($c['id'] == $p['category_id']) ? "selected" : ""; echo "<option value='".$c['id']."' $sel>".$c['name']."</option>"; } ?></select></div>
                <div><label>Brand</label><select name="brand_id"><option value="0">No Brand</option><?php $brands = mysqli_query($conn, "SELECT id, name FROM brands"); while($b = mysqli_fetch_assoc($brands)){ $sel = ($b['id'] == $p['brand_id']) ? "selected" : ""; echo "<option value='".$b['id']."' $sel>".$b['name']."</option>"; } ?></select></div>
            </div>
            <label>Description</label><textarea name="description" rows="4"><?php echo htmlspecialchars($p['description']); ?></textarea>

            <div class="section-label">Pricing Selection</div>
            <div class="pricing-box">
                <label>Price Type *</label>
                <select name="price_type" id="price_type" onchange="togglePriceFields()">
                    <option value="basic" <?php if($v_count == 0) echo 'selected'; ?>>Basic Price</option>
                    <option value="variant" <?php if($v_count > 0) echo 'selected'; ?>>Variant Price</option>
                </select>
            </div>

            <div id="basic_price_div" style="display: <?php echo ($v_count == 0) ? 'grid' : 'none'; ?>; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div><label>Price (৳) *</label><input type="number" step="0.01" name="main_price" value="<?php echo $p['price']; ?>" id="m_p"></div>
                <div><label>Old Price (৳)</label><input type="number" step="0.01" name="main_old_price" value="<?php echo $p['old_price']; ?>"></div>
            </div>

            <div id="variant_price_div" style="display: <?php echo ($v_count > 0) ? 'block' : 'none'; ?>;">
                <div id="variant_list">
                    <?php $vars = mysqli_query($conn, "SELECT * FROM product_variants WHERE product_id = $id"); while($v = mysqli_fetch_assoc($vars)){ ?>
                        <div class="variant-row"><div><input type="text" name="v_name[]" value="<?php echo $v['variant_name']; ?>" required></div><div><input type="number" step="0.01" name="v_price[]" value="<?php echo $v['price']; ?>" required></div><div><input type="number" step="0.01" name="v_old[]" value="<?php echo $v['old_price']; ?>"></div><button type="button" style="background:red; color:#fff; border:none; border-radius:50%; width:30px; height:30px;" onclick="this.parentElement.remove()">×</button></div>
                    <?php } ?>
                </div>
                <button type="button" onclick="addVariant()">+ Add Option</button>
            </div>

            <div class="section-label">Colors & Sizes</div>
            <div class="checkbox-container"><?php $colors = mysqli_query($conn, "SELECT * FROM colors"); while($c = mysqli_fetch_assoc($colors)){ ?>
                <label class="check-item"><input type="checkbox" name="colors[]" value="<?php echo $c['id']; ?>" <?php if(in_array($c['id'], $selected_colors)) echo 'checked'; ?>> <span><?php echo $c['color_name']; ?></span></label>
            <?php } ?></div>
            <div class="checkbox-container"><?php $sizes = mysqli_query($conn, "SELECT * FROM sizes"); while($s = mysqli_fetch_assoc($sizes)){ ?>
                <label class="check-item"><input type="checkbox" name="sizes[]" value="<?php echo $s['id']; ?>" <?php if(in_array($s['id'], $selected_sizes)) echo 'checked'; ?>> <span><?php echo $s['size_name']; ?></span></label>
            <?php } ?></div>

            <div class="section-label">Images</div>
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:15px;"><?php for($i=1;$i<=3;$i++){ $col = ($i==1)?'image':'image_'.$i; $inp = ($i==1)?'p_img':'p_img_'.$i; ?>
                <div style="background:#f8fafc; padding:10px; border:1px solid #eee; border-radius:10px;"><label>Img <?php echo $i; ?></label><?php if($p[$col]){ ?><img src="uploads/products/<?php echo $p[$col]; ?>" class="preview-img"><br><?php } ?><input type="file" name="<?php echo $inp; ?>"></div>
            <?php } ?></div>

            <div class="section-label">Inventory</div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                <div><label>Stock *</label><input type="number" name="stock" value="<?php echo $p['stock']; ?>" required></div>
                <div><label>Unit</label><input type="text" name="unit" value="<?php echo $p['unit']; ?>"></div>
                <div><label>Rating</label><select name="rating"><option value="5" <?php if($p['rating']==5) echo 'selected'; ?>>5 Star</option></select></div>
            </div>
            <button type="submit" name="update_product" class="btn-update">Save Changes</button>
        </form>
    </div>
</div>
<script>
    function togglePriceFields() {
        var type = document.getElementById('price_type').value;
        document.getElementById('basic_price_div').style.display = (type === 'basic') ? 'grid' : 'none';
        document.getElementById('variant_price_div').style.display = (type === 'variant') ? 'block' : 'none';
        document.getElementById('m_p').required = (type === 'basic');
    }
    function addVariant() {
        const div = document.createElement('div'); div.className = 'variant-row';
        div.innerHTML = `<div><input type="text" name="v_name[]" placeholder="Weight" required></div><div><input type="number" name="v_price[]" placeholder="Price" required></div><div><input type="number" name="v_old[]" placeholder="Old"></div><button type="button" onclick="this.parentElement.remove()" style="background:red; color:#fff; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer;">×</button>`;
        document.getElementById('variant_list').appendChild(div);
    }
</script>