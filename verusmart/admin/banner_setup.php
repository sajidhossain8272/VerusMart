<?php 
// ১. ডাটাবেজ কানেকশন এবং হেডার/সাইডবার ইনক্লুড
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

// ইমেজের ডিরেক্টরি পাথ
$upload_dir = "uploads/banners/"; 
if (!is_dir($upload_dir)) { mkdir($upload_dir, 0777, true); }

$edit_mode = false;
$edit_id = "";
$edit_title = "";
$edit_pos = "";

// --- এডিট করার জন্য ডাটা নিয়ে আসা ---
if(isset($_GET['edit'])){
    $edit_mode = true;
    $edit_id = (int)$_GET['edit'];
    $res = mysqli_query($conn, "SELECT * FROM banners WHERE id=$edit_id");
    $row = mysqli_fetch_assoc($res);
    if($row){
        $edit_title = $row['title'];
        $edit_pos = $row['position'];
    }
}

// --- ব্যানার সেভ ও আপডেট লজিক ---
if(isset($_POST['save_banner'])){
    $banner_id = $_POST['banner_id'];
    $title = mysqli_real_escape_string($conn, $_POST['title']);
    $position = $_POST['position']; 
    
    $image = $_FILES['banner_img']['name'];
    $tmp_name = $_FILES['banner_img']['tmp_name'];

    if($banner_id != ""){ 
        if(!empty($image)){
            $old_res = mysqli_query($conn, "SELECT image FROM banners WHERE id=$banner_id");
            $old_data = mysqli_fetch_assoc($old_res);
            if($old_data && file_exists($upload_dir . $old_data['image'])){ unlink($upload_dir . $old_data['image']); }

            $new_name = time() . "_" . preg_replace("/[^a-zA-Z0-9.]/", "_", $image);
            move_uploaded_file($tmp_name, $upload_dir . $new_name);
            $query = "UPDATE banners SET title='$title', image='$new_name', position='$position' WHERE id=$banner_id";
        } else {
            $query = "UPDATE banners SET title='$title', position='$position' WHERE id=$banner_id";
        }
        $msg = "Banner Updated Successfully!";
    } else { 
        $new_name = time() . "_" . preg_replace("/[^a-zA-Z0-9.]/", "_", $image);
        if(move_uploaded_file($tmp_name, $upload_dir . $new_name)){
            $query = "INSERT INTO banners (title, image, position, status) VALUES ('$title', '$new_name', '$position', 'active')";
            $msg = "Banner Uploaded Successfully!";
        }
    }
    if(mysqli_query($conn, $query)){
        echo "<script>alert('$msg'); window.location='banner_setup.php';</script>";
    }
}

// --- ডিলিট লজিক ---
if(isset($_GET['delete'])){
    $id = (int)$_GET['delete'];
    $img_res = mysqli_query($conn, "SELECT image FROM banners WHERE id=$id");
    $img_data = mysqli_fetch_assoc($img_res);
    if($img_data && file_exists($upload_dir . $img_data['image'])) { unlink($upload_dir . $img_data['image']); }
    mysqli_query($conn, "DELETE FROM banners WHERE id=$id");
    echo "<script>window.location='banner_setup.php';</script>";
}

// পরিসংখ্যানের জন্য ডাটা
$total_banners = mysqli_num_rows(mysqli_query($conn, "SELECT id FROM banners"));
$main_banners = mysqli_num_rows(mysqli_query($conn, "SELECT id FROM banners WHERE position='main'"));
$side_banners = mysqli_num_rows(mysqli_query($conn, "SELECT id FROM banners WHERE position LIKE 'side%'"));
?>

<style>
    :root { --primary: #15803d; --bg: #f8fafc; --text: #1e293b; --card-bg: #ffffff; }

    .content-wrapper { 
        margin-left: 260px; 
        padding: 90px 30px 40px; 
        background: var(--bg); 
        min-height: 100vh; 
        transition: 0.3s; 
    }

    /* দই কলাম লেআউট */
    .top-grid {
        display: grid;
        grid-template-columns: 1.6fr 1fr;
        gap: 25px;
        margin-bottom: 30px;
    }

    .card { 
        background: var(--card-bg); 
        border-radius: 15px; 
        box-shadow: 0 4px 20px rgba(0,0,0,0.05); 
        padding: 25px; 
        border: none; 
    }

    .page-title { font-size: 22px; font-weight: 800; color: var(--text); margin-bottom: 25px; display: flex; align-items: center; gap: 10px; }

    /* ফর্ম ডিজাইন */
    .form-group { margin-bottom: 20px; }
    label { font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 8px; display: block; }
    input, select {
        width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; outline: none; transition: 0.3s; font-size: 14px;
    }
    input:focus, select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(21, 128, 61, 0.1); }

    .btn-save { background: var(--primary); color: white; border: none; padding: 14px; border-radius: 10px; cursor: pointer; font-weight: 700; width: 100%; transition: 0.3s; }
    .btn-save:hover { background: #166534; transform: translateY(-2px); }

    /* স্ট্যাটস কার্ড */
    .stat-item {
        display: flex; justify-content: space-between; align-items: center;
        padding: 15px; background: #f1f5f9; border-radius: 12px; margin-bottom: 15px;
    }
    .stat-item i { font-size: 20px; color: var(--primary); }
    .stat-info h5 { margin: 0; font-size: 14px; color: #64748b; }
    .stat-info span { font-size: 20px; font-weight: 800; color: var(--text); }

    /* টেবিল ডিজাইন */
    .table-container { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 700px; }
    th { text-align: left; padding: 15px; background: #f8fafc; color: #475569; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; }
    td { padding: 15px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    
    .banner-preview { width: 120px; height: 65px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    .badge { padding: 5px 12px; border-radius: 50px; font-size: 11px; font-weight: 700; }
    .badge-main { background: #dcfce7; color: #166534; }
    .badge-side { background: #fef3c7; color: #92400e; }

    .action-btns a { font-size: 18px; margin-right: 12px; transition: 0.2s; display: inline-block; }
    .edit-btn { color: #0ea5e9; }
    .delete-btn { color: #ef4444; }
    .action-btns a:hover { transform: scale(1.15); }

    /* রেসপনসিভ */
    @media (max-width: 1200px) { .top-grid { grid-template-columns: 1fr; } }
    @media (max-width: 992px) { .content-wrapper { margin-left: 0; padding: 80px 15px; } }
</style>

<div class="content-wrapper">
    <div class="page-title"><i class="fa-solid fa-images"></i> Banner Management</div>

    <div class="top-grid">
        <!-- ১. আপলোড ফর্ম -->
        <div class="card">
            <h3 style="margin-top:0; margin-bottom:20px; font-size:18px; color: var(--text);">
                <?php echo $edit_mode ? "Update Banner" : "Upload New Banner"; ?>
            </h3>
            <form action="" method="POST" enctype="multipart/form-data">
                <input type="hidden" name="banner_id" value="<?php echo $edit_id; ?>">
                
                <div class="form-group">
                    <label>Banner Title (Optional)</label>
                    <input type="text" name="title" value="<?php echo htmlspecialchars($edit_title); ?>" placeholder="e.g. Fresh Grocery 50% Off">
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label>Display Position</label>
                        <select name="position" required>
                            <option value="main" <?php if($edit_pos == 'main') echo 'selected'; ?>>Main Slider</option>
                            <option value="side_top" <?php if($edit_pos == 'side_top') echo 'selected'; ?>>Side Top</option>
                            <option value="side_bottom" <?php if($edit_pos == 'side_bottom') echo 'selected'; ?>>Side Bottom</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Image File</label>
                        <input type="file" name="banner_img" <?php echo $edit_mode ? "" : "required"; ?> accept="image/*">
                    </div>
                </div>

                <div style="display:flex; gap:10px; margin-top: 10px;">
                    <button type="submit" name="save_banner" class="btn-save">
                        <i class="fa-solid fa-check-circle"></i> <?php echo $edit_mode ? "Update Changes" : "Save Banner"; ?>
                    </button>
                    <?php if($edit_mode): ?>
                        <a href="banner_setup.php" class="btn-cancel" style="padding: 14px; width: 40%; text-align: center; background: #cbd5e1; color: #475569; border-radius: 10px; text-decoration: none; font-weight: 700;">Cancel</a>
                    <?php endif; ?>
                </div>
            </form>
        </div>

        <!-- ২. পরিসংখ্যান বা কুইক ভিউ (ডানদিকের ফাঁকা জায়গা পূরণ করার জন্য) -->
        <div class="card">
            <h3 style="margin-top:0; margin-bottom:20px; font-size:18px; color: var(--text);">Banner Summary</h3>
            
            <div class="stat-item">
                <div class="stat-info">
                    <h5>Total Banners</h5>
                    <span><?php echo $total_banners; ?></span>
                </div>
                <i class="fa-solid fa-layer-group"></i>
            </div>

            <div class="stat-item">
                <div class="stat-info">
                    <h5>Main Sliders</h5>
                    <span><?php echo $main_banners; ?></span>
                </div>
                <i class="fa-solid fa-desktop"></i>
            </div>

            <div class="stat-item">
                <div class="stat-info">
                    <h5>Side Banners</h5>
                    <span><?php echo $side_banners; ?></span>
                </div>
                <i class="fa-solid fa-table-columns"></i>
            </div>
            
            <p style="font-size: 12px; color: #94a3b8; margin-top: 20px; line-height: 1.6;">
                <i class="fa-solid fa-circle-info"></i> Tip: Use high-quality images for the main slider (Recommended: 1200x400px).
            </p>
        </div>
    </div>

    <!-- ৩. ব্যানার লিস্ট টেবিল -->
    <div class="card">
        <h3 style="margin-top:0; margin-bottom:20px; font-size:18px; color: var(--text);">Active Banners List</h3>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Preview</th>
                        <th>Banner Title</th>
                        <th>Position</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php 
                    $banners = mysqli_query($conn, "SELECT * FROM banners ORDER BY id DESC");
                    if(mysqli_num_rows($banners) > 0){
                        while($row = mysqli_fetch_assoc($banners)){
                    ?>
                    <tr>
                        <td>
                            <img src="uploads/banners/<?php echo $row['image']; ?>" class="banner-preview" onerror="this.src='https://placehold.jp/24/cccccc/ffffff/200x100.png?text=No+Img';">
                        </td>
                        <td><strong><?php echo htmlspecialchars($row['title'] ?: 'Promotional Banner'); ?></strong></td>
                        <td>
                            <span class="badge <?php echo ($row['position'] == 'main') ? 'badge-main' : 'badge-side'; ?>">
                                <?php echo strtoupper(str_replace('_', ' ', $row['position'])); ?>
                            </span>
                        </td>
                        <td><span style="color: #15803d; font-size: 13px; font-weight: 700;"><i class="fa-solid fa-circle" style="font-size: 8px;"></i> Active</span></td>
                        <td class="action-btns">
                            <a href="?edit=<?php echo $row['id']; ?>" class="edit-btn" title="Edit"><i class="fa-solid fa-pen-to-square"></i></a>
                            <a href="?delete=<?php echo $row['id']; ?>" class="delete-btn" onclick="return confirm('Delete this banner permanently?')" title="Delete"><i class="fa-solid fa-trash-can"></i></a>
                        </td>
                    </tr>
                    <?php } 
                    } else { echo "<tr><td colspan='5' style='text-align:center; padding:30px; color:gray;'>No banners found.</td></tr>"; } ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
</body>
</html>