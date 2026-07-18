<?php 
// এরর দেখার জন্য (কাজ শেষ হলে এই ২ লাইন মুছে দিতে পারেন)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ১. ডাটাবেজ কানেকশন ও হেডার
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

// ইমেজ আপলোড ডিরেক্টরি
$upload_dir = "uploads/category/";
if (!is_dir($upload_dir)) { 
    mkdir($upload_dir, 0777, true); 
}

$edit_mode = false;
$edit_id = "";
$edit_name = "";
$edit_priority = 1;

// --- এডিট করার জন্য ডাটা আনা ---
if(isset($_GET['edit'])){
    $edit_mode = true;
    $edit_id = (int)$_GET['edit'];
    $res = mysqli_query($conn, "SELECT * FROM categories WHERE id=$edit_id");
    if($res){
        $row = mysqli_fetch_assoc($res);
        if($row){
            $edit_name = $row['name'];
            $edit_priority = $row['priority'];
        }
    }
}

// --- ক্যাটাগরি সেভ ও আপডেট লজিক ---
if(isset($_POST['save_category'])){
    $cat_id = $_POST['cat_id'];
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $priority = (int)$_POST['priority'];
    
    // ১. ক্যাটাগরি আইকন প্রসেসিং
    $new_image_name = "";
    if(isset($_FILES['cat_img']) && $_FILES['cat_img']['name'] != ""){
        $image = $_FILES['cat_img']['name'];
        $ext = pathinfo($image, PATHINFO_EXTENSION);
        $new_image_name = "icon_" . time() . "_" . rand(100, 999) . "." . $ext;
        move_uploaded_file($_FILES['cat_img']['tmp_name'], $upload_dir . $new_image_name);
    }

    // ২. ক্যাটাগরি ব্যানার প্রসেসিং
    $new_banner_name = "";
    if(isset($_FILES['cat_banner']) && $_FILES['cat_banner']['name'] != ""){
        $banner = $_FILES['cat_banner']['name'];
        $b_ext = pathinfo($banner, PATHINFO_EXTENSION);
        $new_banner_name = "banner_" . time() . "_" . rand(100, 999) . "." . $b_ext;
        move_uploaded_file($_FILES['cat_banner']['tmp_name'], $upload_dir . $new_banner_name);
    }

    if($cat_id != ""){
        // আপডেট কুয়েরি
        $sql = "UPDATE categories SET name='$name', priority='$priority'";
        if($new_image_name != "") { $sql .= ", image='$new_image_name'"; }
        if($new_banner_name != "") { $sql .= ", banner='$new_banner_name'"; }
        $sql .= " WHERE id=$cat_id";
        $msg = "Category Updated Successfully!";
    } else {
        // ইনসার্ট কুয়েরি
        $sql = "INSERT INTO categories (name, priority, image, banner, status) VALUES ('$name', '$priority', '$new_image_name', '$new_banner_name', 'active')";
        $msg = "Category Added Successfully!";
    }
    
    if(mysqli_query($conn, $sql)){
        echo "<script>alert('$msg'); window.location='category_setup.php';</script>";
    } else {
        echo "<script>alert('Error: " . mysqli_error($conn) . "');</script>";
    }
}

// --- ক্যাটাগরি ডিলিট লজিক ---
if(isset($_GET['delete'])){
    $id = (int)$_GET['delete'];
    mysqli_query($conn, "DELETE FROM categories WHERE id=$id");
    echo "<script>window.location='category_setup.php';</script>";
}
?>

<style>
    .content-wrapper { margin-left: 260px; padding: 90px 25px 30px; background: #f8fafb; min-height: 100vh; transition: 0.3s; }
    .page-header { display: flex; align-items: center; gap: 10px; margin-bottom: 25px; font-size: 18px; font-weight: 700; color: #1e293b; }
    .card { background: #fff; border-radius: 12px; padding: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: none; margin-bottom: 20px; }
    label { display: block; font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 8px; }
    input[type="text"], input[type="number"] { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; margin-bottom: 15px; background: #fff; }
    .btn-submit { background: #15803d; color: white; border: none; padding: 12px 30px; border-radius: 8px; cursor: pointer; font-weight: 600; }
    .table-container { overflow-x: auto; width: 100%; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f8f9fa; padding: 12px; text-align: left; font-size: 12px; color: #64748b; border-bottom: 2px solid #f1f5f9; }
    td { padding: 15px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .cat-img { width: 40px; height: 40px; object-fit: contain; }
    .banner-preview { width: 80px; height: 40px; object-fit: cover; border-radius: 4px; }
</style>

<div class="content-wrapper">
    <div class="page-header">
        <i class="fa-solid fa-layer-group"></i> <span>Category Setup</span>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 25px;">
        <!-- Form -->
        <div class="card">
            <h4><?php echo $edit_mode ? "Update Category" : "Add New Category"; ?></h4>
            <form action="" method="POST" enctype="multipart/form-data">
                <input type="hidden" name="cat_id" value="<?php echo $edit_id; ?>">
                
                <label>Category Name *</label>
                <input type="text" name="name" value="<?php echo htmlspecialchars($edit_name); ?>" required>

                <label>Priority</label>
                <input type="number" name="priority" value="<?php echo $edit_priority; ?>">

                <label>Category Icon *</label>
                <input type="file" name="cat_img" style="margin-bottom:15px;">

                <label>Category Banner (For Featured)</label>
                <input type="file" name="cat_banner" style="margin-bottom:20px;">

                <button type="submit" name="save_category" class="btn-submit">Save</button>
            </form>
        </div>

        <!-- Table -->
        <div class="card">
            <h4>Category List</h4>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Icon</th>
                            <th>Banner</th>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php 
                        $sl = 1;
                        $query = mysqli_query($conn, "SELECT * FROM categories ORDER BY priority ASC");
                        while($row = mysqli_fetch_assoc($query)){
                        ?>
                        <tr>
                            <td><?php echo $sl++; ?></td>
                            <td><img src="<?php echo $upload_dir . $row['image']; ?>" class="cat-img" onerror="this.src='https://via.placeholder.com/40'"></td>
                            <td>
                                <?php if(!empty($row['banner'])): ?>
                                    <img src="<?php echo $upload_dir . $row['banner']; ?>" class="banner-preview">
                                <?php else: ?>
                                    <small>No Banner</small>
                                <?php endif; ?>
                            </td>
                            <td><strong><?php echo htmlspecialchars($row['name']); ?></strong></td>
                            <td>
                                <a href="?edit=<?php echo $row['id']; ?>" style="color:blue;"><i class="fa-solid fa-edit"></i></a> | 
                                <a href="?delete=<?php echo $row['id']; ?>" onclick="return confirm('Are you sure?')" style="color:red;"><i class="fa-solid fa-trash"></i></a>
                            </td>
                        </tr>
                        <?php } ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>