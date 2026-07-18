<?php 
// ১. কানেকশন ও হেডার-সাইডবার ইনক্লুড
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

// প্রোডাক্ট আইডি চেক করা
if(!isset($_GET['id'])){
    echo "<script>alert('Product ID missing!'); window.location='product_list.php';</script>";
    exit;
}

$product_id = (int)$_GET['id'];

// প্রোডাক্টের নাম আনা (শিরোনামে দেখানোর জন্য)
$p_res = mysqli_query($conn, "SELECT name FROM products WHERE id=$product_id");
$p_data = mysqli_fetch_assoc($p_res);

// ইমেজ আপলোড ডিরেক্টরি
$upload_dir = "uploads/gallery/";
if (!is_dir($upload_dir)) { mkdir($upload_dir, 0777, true); }

// ২. ইমেজ আপলোড লজিক
if(isset($_POST['upload_gallery'])){
    if(!empty($_FILES['gallery_imgs']['name'][0])){
        foreach($_FILES['gallery_imgs']['tmp_name'] as $key => $tmp_name){
            $file_name = $_FILES['gallery_imgs']['name'][$key];
            $ext = pathinfo($file_name, PATHINFO_EXTENSION);
            $new_name = "gal_" . time() . "_" . rand(1000, 9999) . "." . $ext;
            
            if(move_uploaded_file($tmp_name, $upload_dir . $new_name)){
                mysqli_query($conn, "INSERT INTO product_gallery (product_id, image) VALUES ($product_id, '$new_name')");
            }
        }
        echo "<script>alert('Images Uploaded!'); window.location='product_gallery.php?id=$product_id';</script>";
    }
}

// ৩. ইমেজ ডিলিট লজিক
if(isset($_GET['delete'])){
    $img_id = (int)$_GET['delete'];
    $res = mysqli_query($conn, "SELECT image FROM product_gallery WHERE id=$img_id");
    $data = mysqli_fetch_assoc($res);
    
    if($data){
        if(file_exists($upload_dir . $data['image'])){ unlink($upload_dir . $data['image']); }
        mysqli_query($conn, "DELETE FROM product_gallery WHERE id=$img_id");
    }
    header("Location: product_gallery.php?id=$product_id");
}
?>

<style>
    .content-wrapper { 
        margin-left: 260px; padding: 90px 25px 30px; 
        background: #f8fafb; min-height: 100vh; transition: 0.3s; 
    }
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px; }
    .page-title { font-size: 18px; font-weight: 700; color: #1e293b; }
    
    .card { background: #fff; border-radius: 12px; padding: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: none; margin-bottom: 25px; }
    
    /* আপলোড বক্স */
    .upload-box { border: 2px dashed #cbd5e1; padding: 30px; border-radius: 15px; text-align: center; background: #fdfdfd; transition: 0.3s; }
    .upload-box:hover { border-color: #15803d; background: #f0fdf4; }
    
    /* গ্যালারি গ্রিড */
    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
    .gallery-item { position: relative; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; height: 180px; background: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
    .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
    
    .delete-overlay { 
        position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(239, 68, 68, 0.8); display: flex; align-items: center; justify-content: center; 
        opacity: 0; transition: 0.3s; cursor: pointer; color: white; text-decoration: none; font-size: 20px;
    }
    .gallery-item:hover .delete-overlay { opacity: 1; }

    .btn-save { background: #15803d; color: white; border: none; padding: 10px 25px; border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 15px; }
    
    @media (max-width: 992px) { .content-wrapper { margin-left: 0; padding: 80px 15px; } }
</style>

<div class="content-wrapper">
    <div class="page-header">
        <div class="page-title">
            <a href="product_list.php" style="text-decoration:none; color:#64748b;"><i class="fa-solid fa-arrow-left"></i></a> 
            &nbsp; Gallery for: <span style="color:#15803d;"><?php echo htmlspecialchars($p_data['name']); ?></span>
        </div>
    </div>

    <!-- আপলোড সেকশন -->
    <div class="card">
        <form action="" method="POST" enctype="multipart/form-data">
            <div class="upload-box">
                <i class="fa-solid fa-cloud-arrow-up" style="font-size:40px; color:#94a3b8; margin-bottom:15px;"></i>
                <h4 style="margin:0 0 10px;">Select Multiple Images</h4>
                <p style="color:#64748b; font-size:13px;">You can upload multiple JPG, PNG or WebP files at once.</p>
                <input type="file" name="gallery_imgs[]" multiple accept="image/*" required style="margin-top:10px; font-size:13px;">
                <br>
                <button type="submit" name="upload_gallery" class="btn-save">Upload to Gallery</button>
            </div>
        </form>
    </div>

    <!-- বর্তমান গ্যালারি ইমেজসমূহ -->
    <div class="card">
        <h4 style="margin-top:0; margin-bottom:20px; color:#1e293b;">Gallery Images</h4>
        <div class="gallery-grid">
            <?php 
            $query = mysqli_query($conn, "SELECT * FROM product_gallery WHERE product_id=$product_id ORDER BY id DESC");
            if(mysqli_num_rows($query) > 0){
                while($row = mysqli_fetch_assoc($query)){
            ?>
                <div class="gallery-item">
                    <img src="<?php echo $upload_dir . $row['image']; ?>">
                    <a href="?id=<?php echo $product_id; ?>&delete=<?php echo $row['id']; ?>" 
                       class="delete-overlay" 
                       onclick="return confirm('Delete this image from gallery?')">
                        <i class="fa-solid fa-trash-can"></i>
                    </a>
                </div>
            <?php 
                }
            } else {
                echo "<p style='color:gray; grid-column: 1/-1; text-align:center; padding:40px;'>No gallery images found for this product.</p>";
            } 
            ?>
        </div>
    </div>
</div>

</body>
</html>