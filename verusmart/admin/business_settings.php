<?php 
// ১. কানেকশন এবং হেডার
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

$upload_dir = "uploads/business/";
if (!is_dir($upload_dir)) { mkdir($upload_dir, 0777, true); }

// ২. ডাটা আপডেট লজিক
if(isset($_POST['update_settings'])){
    $company_name = mysqli_real_escape_string($conn, $_POST['company_name']);
    $phone = mysqli_real_escape_string($conn, $_POST['phone']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $address = mysqli_real_escape_string($conn, $_POST['address']);
    $facebook = mysqli_real_escape_string($conn, $_POST['facebook']);
    $tiktok = mysqli_real_escape_string($conn, $_POST['tiktok']);
    $instagram = mysqli_real_escape_string($conn, $_POST['instagram']);
    $youtube = mysqli_real_escape_string($conn, $_POST['youtube']);
    $twitter = mysqli_real_escape_string($conn, $_POST['twitter']);

    // লোগো আপলোড লজিক
    $logo_query = "";
    if($_FILES['logo']['name'] != ""){
        $logo_name = "logo_" . time() . "_" . $_FILES['logo']['name'];
        if(move_uploaded_file($_FILES['logo']['tmp_name'], $upload_dir . $logo_name)){
            $logo_query = ", logo='$logo_name'";
        }
    }

    $sql = "UPDATE business_settings SET 
            company_name='$company_name', phone='$phone', email='$email', 
            address='$address', facebook='$facebook', tiktok='$tiktok', 
            instagram='$instagram', youtube='$youtube', twitter='$twitter' 
            $logo_query 
            WHERE id=1";

    if(mysqli_query($conn, $sql)){
        echo "<script>alert('Business Settings Updated Successfully!'); window.location='business_settings.php';</script>";
    } else {
        echo "<script>alert('Error: " . mysqli_error($conn) . "');</script>";
    }
}

// ৩. বর্তমান ডাটা নিয়ে আসা
$res = mysqli_query($conn, "SELECT * FROM business_settings WHERE id=1");
$data = mysqli_fetch_assoc($res);
?>

<style>
    :root { --sidebar-width: 260px; --bg-light: #f4f7f6; --primary: #15803d; }
    body { background-color: var(--bg-light); font-family: 'Segoe UI', sans-serif; margin: 0; }
    
    .content-wrapper { 
        margin-left: var(--sidebar-width); padding: 30px; margin-top: 65px;
        width: calc(100% - var(--sidebar-width)); box-sizing: border-box;
    }
    @media (max-width: 992px) { .content-wrapper { margin-left: 0; width: 100%; } }

    .card { background: #fff; border-radius: 15px; padding: 35px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0,0.02); }
    .section-title { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 25px; border-bottom: 2px solid #f1f5f9; padding-bottom: 10px; display: flex; align-items: center; gap: 10px; }
    
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
    @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }

    label { display: block; font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 8px; text-transform: uppercase; }
    input, textarea { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; outline: none; background: #fdfdfd; transition: 0.3s; font-size: 14px; }
    input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(21, 128, 61, 0.1); }
    
    .logo-preview-box { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; background: #f8fafc; padding: 10px; border-radius: 10px; border: 1px dashed #cbd5e1; }
    .logo-preview { height: 60px; max-width: 150px; object-fit: contain; }
    
    .btn-update { background: var(--primary); color: #fff; border: none; padding: 16px; border-radius: 12px; font-weight: 800; cursor: pointer; width: 100%; font-size: 16px; margin-top: 35px; box-shadow: 0 10px 20px rgba(21, 128, 61, 0.2); transition: 0.3s; }
    .btn-update:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(21, 128, 61, 0.3); }
</style>

<div class="content-wrapper">
    <div class="card">
        <h2 style="margin-top:0; margin-bottom:30px;"><i class="fas fa-tools"></i> Website Configuration</h2>
        
        <form action="" method="POST" enctype="multipart/form-data">
            
            <div class="section-title"><i class="fas fa-store"></i> General Info</div>
            <div class="form-grid">
                <div>
                    <label>Company Name</label>
                    <input type="text" name="company_name" value="<?php echo htmlspecialchars($data['company_name']); ?>" required>
                </div>
                <div>
                    <label>Website Header Logo</label>
                    <div class="logo-preview-box">
                        <?php if(!empty($data['logo'])){ ?>
                            <img src="uploads/business/<?php echo $data['logo']; ?>" class="logo-preview">
                        <?php } else { ?>
                            <span style="font-size:12px; color:gray;">No Logo Uploaded</span>
                        <?php } ?>
                    </div>
                    <input type="file" name="logo" accept="image/*">
                </div>
            </div>

            <div class="section-title" style="margin-top:40px;"><i class="fas fa-headset"></i> Contact Details</div>
            <div class="form-grid">
                <div><label>Phone Number</label><input type="text" name="phone" value="<?php echo $data['phone']; ?>"></div>
                <div><label>Email Address</label><input type="email" name="email" value="<?php echo $data['email']; ?>"></div>
                <div style="grid-column: span 2;"><label>Office Address</label><textarea name="address" rows="2"><?php echo $data['address']; ?></textarea></div>
            </div>

            <div class="section-title" style="margin-top:40px;"><i class="fas fa-share-nodes"></i> Social Media Links</div>
            <div class="form-grid">
                <div><label><i class="fab fa-facebook"></i> Facebook Link</label><input type="text" name="facebook" value="<?php echo $data['facebook']; ?>" placeholder="https://facebook.com/yourpage"></div>
                <div><label><i class="fab fa-tiktok"></i> TikTok Link</label><input type="text" name="tiktok" value="<?php echo $data['tiktok'] ?? ''; ?>" placeholder="https://tiktok.com/@user"></div>
                <div><label><i class="fab fa-instagram"></i> Instagram Link</label><input type="text" name="instagram" value="<?php echo $data['instagram']; ?>" placeholder="https://instagram.com/user"></div>
                <div><label><i class="fab fa-youtube"></i> YouTube Link</label><input type="text" name="youtube" value="<?php echo $data['youtube'] ?? ''; ?>" placeholder="https://youtube.com/@channel"></div>
                <div><label><i class="fab fa-twitter"></i> Twitter (X) Link</label><input type="text" name="twitter" value="<?php echo $data['twitter'] ?? ''; ?>" placeholder="https://twitter.com/user"></div>
            </div>

            <button type="submit" name="update_settings" class="btn-update">Save & Publish All Changes</button>
        </form>
    </div>
</div>
</body>
</html>