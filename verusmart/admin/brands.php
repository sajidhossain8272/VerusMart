<?php 
// ১. ডাটাবেজ কানেকশন ও হেডার-সাইডবার ইনক্লুড
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

// ইমেজ আপলোড ডিরেক্টরি (uploads/brands)
$upload_dir = "uploads/brands/";
if (!is_dir($upload_dir)) { 
    mkdir($upload_dir, 0777, true); 
}

$edit_mode = false;
$edit_id = "";
$edit_name = "";
$edit_priority = 1;

// --- এডিট করার জন্য ডাটা ফেচ করা ---
if(isset($_GET['edit'])){
    $edit_mode = true;
    $edit_id = (int)$_GET['edit'];
    $res = mysqli_query($conn, "SELECT * FROM brands WHERE id=$edit_id");
    $row = mysqli_fetch_assoc($res);
    if($row){
        $edit_name = $row['name'];
        $edit_priority = $row['priority'];
    }
}

// --- ব্র্যান্ড সেভ ও আপডেট লজিক ---
if(isset($_POST['save_brand'])){
    $brand_id = $_POST['brand_id'];
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $priority = (int)$_POST['priority'];
    
    // ইমেজ প্রসেসিং
    $new_image_name = "";
    if($_FILES['brand_logo']['name'] != ""){
        $image = $_FILES['brand_logo']['name'];
        $ext = pathinfo($image, PATHINFO_EXTENSION);
        $new_image_name = "brand_" . time() . "_" . rand(100, 999) . "." . $ext;
        
        if (move_uploaded_file($_FILES['brand_logo']['tmp_name'], $upload_dir . $new_image_name)) {
            // এডিট মোড হলে পুরাতন ইমেজ ডিলিট করা
            if($brand_id != ""){
                $old_res = mysqli_query($conn, "SELECT logo FROM brands WHERE id=$brand_id");
                $old_data = mysqli_fetch_assoc($old_res);
                if($old_data && !empty($old_data['logo']) && file_exists($upload_dir . $old_data['logo'])){
                    unlink($upload_dir . $old_data['logo']);
                }
            }
        }
    }

    if($brand_id != ""){
        // আপডেট কুয়েরি
        $sql = "UPDATE brands SET name='$name', priority='$priority'";
        if($new_image_name != "") { $sql .= ", logo='$new_image_name'"; }
        $sql .= " WHERE id=$brand_id";
        $msg = "Brand Updated Successfully!";
    } else {
        // ইনসার্ট কুয়েরি
        $sql = "INSERT INTO brands (name, logo, priority, status) VALUES ('$name', '$new_image_name', '$priority', 'active')";
        $msg = "Brand Added Successfully!";
    }
    
    if(mysqli_query($conn, $sql)){
        echo "<script>alert('$msg'); window.location='brands.php';</script>";
    } else {
        echo "<script>alert('Error: " . mysqli_error($conn) . "');</script>";
    }
}

// --- ব্র্যান্ড ডিলিট লজিক ---
if(isset($_GET['delete'])){
    $id = (int)$_GET['delete'];
    $res = mysqli_query($conn, "SELECT logo FROM brands WHERE id=$id");
    $data = mysqli_fetch_assoc($res);
    if($data && !empty($data['logo']) && file_exists($upload_dir . $data['logo'])) { 
        unlink($upload_dir . $data['logo']); 
    }
    mysqli_query($conn, "DELETE FROM brands WHERE id=$id");
    echo "<script>window.location='brands.php';</script>";
}
?>

<style>
    .content-wrapper { 
        margin-left: 260px; 
        padding: 90px 25px 30px; 
        background: #f8fafb; 
        min-height: 100vh; 
        transition: 0.3s; 
    }
    .page-header { display: flex; align-items: center; gap: 10px; margin-bottom: 25px; font-size: 18px; font-weight: 700; color: #1e293b; }
    .card { background: #fff; border-radius: 12px; padding: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: none; margin-bottom: 20px; }
    
    label { display: block; font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 8px; }
    input[type="text"], input[type="number"] { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; margin-bottom: 15px; transition: 0.3s; }
    input:focus { border-color: #15803d; box-shadow: 0 0 0 3px rgba(21, 128, 61, 0.1); }
    
    .btn-submit { background: #15803d; color: white; border: none; padding: 12px 30px; border-radius: 8px; cursor: pointer; font-weight: 600; }
    .btn-submit:hover { background: #166534; }
    .btn-cancel { background: #64748b; color: white; text-decoration: none; padding: 11px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; }
    
    .table-container { overflow-x: auto; width: 100%; }
    table { width: 100%; border-collapse: collapse; min-width: 500px; }
    th { background: #f8f9fa; padding: 12px; text-align: left; font-size: 12px; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; }
    td { padding: 15px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    
    .brand-logo-img { width: 50px; height: 50px; object-fit: contain; border-radius: 8px; background: #fff; border: 1px solid #f1f5f9; }
    
    .action-icons a { margin-right: 12px; font-size: 16px; text-decoration: none; }
    .fa-pen-to-square { color: #0ea5e9; }
    .fa-trash { color: #ef4444; }

    @media (max-width: 992px) { 
        .content-wrapper { margin-left: 0; padding: 80px 15px 30px; } 
        .grid-layout { grid-template-columns: 1fr !important; }
    }
</style>

<div class="content-wrapper">
    <div class="page-header">
        <i class="fa-solid fa-tags"></i> 
        <span>Brand Setup</span>
    </div>

    <div class="grid-layout" style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 25px; align-items: start;">
        
        <!-- ব্র্যান্ড ফর্ম -->
        <div class="card">
            <h4 style="margin-top:0; margin-bottom:20px; color:#1e293b;">
                <?php echo $edit_mode ? "Update Brand" : "Add New Brand"; ?>
            </h4>
            <form action="" method="POST" enctype="multipart/form-data">
                <input type="hidden" name="brand_id" value="<?php echo $edit_id; ?>">
                
                <label>Brand Name <span style="color:red;">*</span></label>
                <input type="text" name="name" value="<?php echo htmlspecialchars($edit_name); ?>" placeholder="e.g. Samsung, Apple, Radhuni" required>

                <label>Priority (Serial No)</label>
                <input type="number" name="priority" value="<?php echo $edit_priority; ?>">

                <label>Brand Logo <?php echo $edit_mode ? "(Optional)" : "<span style='color:red;'>*</span>"; ?></label>
                <input type="file" name="brand_logo" <?php echo $edit_mode ? "" : "required"; ?> style="font-size: 13px; margin-bottom:20px;">

                <div style="display:flex; gap:10px; align-items:center;">
                    <button type="submit" name="save_brand" class="btn-submit">
                        <i class="fa-solid fa-save"></i> <?php echo $edit_mode ? "Update Brand" : "Save Brand"; ?>
                    </button>
                    <?php if($edit_mode): ?>
                        <a href="brands.php" class="btn-cancel">Cancel</a>
                    <?php endif; ?>
                </div>
            </form>
        </div>

        <!-- ব্র্যান্ড লিস্ট টেবিল -->
        <div class="card">
            <h4 style="margin-top:0; margin-bottom:20px;">Registered Brands</h4>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Logo</th>
                            <th>Brand Name</th>
                            <th>Priority</th>
                            <th style="text-align:center;">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php 
                        $sl = 1;
                        $query = mysqli_query($conn, "SELECT * FROM brands ORDER BY priority ASC");
                        if(mysqli_num_rows($query) > 0){
                            while($row = mysqli_fetch_assoc($query)){
                        ?>
                        <tr>
                            <td><?php echo $sl++; ?></td>
                            <td>
                                <img src="<?php echo $upload_dir . $row['logo']; ?>" class="brand-logo-img" onerror="this.src='https://via.placeholder.com/50?text=Brand'">
                            </td>
                            <td><strong><?php echo htmlspecialchars($row['name']); ?></strong></td>
                            <td><?php echo $row['priority']; ?></td>
                            <td style="text-align:center;" class="action-icons">
                                <a href="?edit=<?php echo $row['id']; ?>"><i class="fa-solid fa-pen-to-square"></i></a>
                                <a href="?delete=<?php echo $row['id']; ?>" onclick="return confirm('Are you sure?')"><i class="fa-solid fa-trash"></i></a>
                            </td>
                        </tr>
                        <?php } 
                        } else {
                            echo "<tr><td colspan='5' style='text-align:center; padding:20px;'>No brands found.</td></tr>";
                        } ?>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</div>

</body>
</html>