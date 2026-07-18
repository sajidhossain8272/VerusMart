<?php 
// ১. সেশন এবং ডাটাবেজ কানেকশন
if (session_status() === PHP_SESSION_NONE) { session_start(); }
include('db.php'); 
include('header.php'); 

// ইমেজ আপলোড ডিরেক্টরি
$target_dir = "admin/uploads/sell_requests/";
if (!is_dir($target_dir)) { mkdir($target_dir, 0777, true); }

// ২. ফর্ম সাবমিশন লজিক
if(isset($_POST['submit_sell_request'])){
    $user_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : "NULL";
    $name    = mysqli_real_escape_string($conn, $_POST['user_name']);
    $phone   = mysqli_real_escape_string($conn, $_POST['user_phone']);
    $brand   = mysqli_real_escape_string($conn, $_POST['phone_brand']);
    $model   = mysqli_real_escape_string($conn, $_POST['phone_model']);
    $cond    = mysqli_real_escape_string($conn, $_POST['phone_condition']);
    $e_price = mysqli_real_escape_string($conn, $_POST['expected_price']);
    $o_price = mysqli_real_escape_string($conn, $_POST['original_price']);
    $details = mysqli_real_escape_string($conn, $_POST['phone_details']);

    // ৪ ডিজিটের ওটিপি তৈরি করা
    $otp_code = rand(1000, 9999);

    // ছবি প্রসেসিং (সর্বোচ্চ ৩টি)
    $uploaded_images = [null, null, null];
    if(!empty($_FILES['phone_photos']['name'][0])){
        $file_count = count($_FILES['phone_photos']['name']);
        for($i = 0; $i < $file_count && $i < 3; $i++){
            $ext = pathinfo($_FILES['phone_photos']['name'][$i], PATHINFO_EXTENSION);
            $new_filename = "sell_" . time() . "_" . rand(100, 999) . "." . $ext;
            if(move_uploaded_file($_FILES['phone_photos']['tmp_name'][$i], $target_dir . $new_filename)){
                $uploaded_images[$i] = $new_filename;
            }
        }
    }

    $img1 = ($uploaded_images[0]) ? "'".$uploaded_images[0]."'" : "NULL";
    $img2 = ($uploaded_images[1]) ? "'".$uploaded_images[1]."'" : "NULL";
    $img3 = ($uploaded_images[2]) ? "'".$uploaded_images[2]."'" : "NULL";

    // ডাটাবেজে সেভ করা (is_verified = 0 থাকবে)
    $sql = "INSERT INTO phone_sell_requests (user_id, full_name, phone_number, brand, model, phone_condition, expected_price, original_price, details, image_1, image_2, image_3, otp_code, status, is_verified) 
            VALUES ($user_id, '$name', '$phone', '$brand', '$model', '$cond', '$e_price', '$o_price', '$details', $img1, $img2, $img3, '$otp_code', 'pending', 0)";

    if(mysqli_query($conn, $sql)){
        $last_id = mysqli_insert_id($conn);
        // রিকোয়েস্ট আইডি এবং ওটিপি নিয়ে ভেরিফিকেশন পেজে রিডাইরেক্ট
        echo "<script>window.location.href = 'verify_otp.php?req_id=$last_id&otp=$otp_code';</script>";
        exit;
    } else {
        echo "<script>alert('Error: " . mysqli_error($conn) . "');</script>";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        :root { --main-green: #017a0a; --bg-light: #f4f7f6; }
        .sell-container { width: 94%; max-width: 850px; margin: 40px auto; background: #fff; padding: 40px; border-radius: 25px; box-shadow: 0 15px 35px rgba(0,0,0,0.06); border: 1px solid #eef2f6; }
        .sell-title { color: var(--main-green); font-weight: 800; font-size: 30px; margin-bottom: 10px; text-align: center; }
        .form-group { margin-bottom: 22px; }
        .form-group label { display: block; font-weight: 700; font-size: 13px; color: #1e293b; margin-bottom: 10px; text-transform: uppercase; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 13px 18px; border: 1.5px solid #e2e8f0; border-radius: 12px; outline: none; font-size: 15px; background: #fafbfc; transition: 0.3s; }
        .form-group input:focus { border-color: var(--main-green); background: #fff; box-shadow: 0 0 0 4px rgba(1, 122, 10, 0.08); }
        .grid-row { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
        .btn-submit-sell { width: 100%; background: var(--main-green); color: white; border: none; padding: 16px; border-radius: 15px; font-weight: 800; font-size: 17px; cursor: pointer; transition: 0.4s; margin-top: 15px; }
        .btn-submit-sell:hover { background: #015a07; transform: translateY(-3px); }
        .file-upload-wrapper { border: 2px dashed #cbd5e1; padding: 30px; border-radius: 15px; background: #f8fafc; text-align: center; cursor: pointer; }
        @media (max-width: 768px) { .grid-row { grid-template-columns: 1fr; gap: 0; } }
    </style>
</head>
<body>
<div class="container">
    <div class="sell-container">
        <h2 class="sell-title"><i class="fa-solid fa-mobile-screen-button"></i> Sell Your Phone</h2>
        <p style="text-align:center; color:#64748b; margin-bottom:35px;">Submit details to receive an OTP and confirm your request.</p>

        <form action="" method="POST" enctype="multipart/form-data">
            <div class="grid-row">
                <div class="form-group"><label>Full Name *</label><input type="text" name="user_name" required></div>
                <div class="form-group"><label>Phone Number *</label><input type="tel" name="user_phone" required></div>
            </div>
            <div class="grid-row">
                <div class="form-group">
                    <label>Phone Brand *</label>
                    <select name="phone_brand" required>
                        <option value="">-- Choose Brand --</option>
                        <option value="Samsung">Samsung</option>
                        <option value="Apple">Apple</option>
                        <option value="Xiaomi">Xiaomi</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div class="form-group"><label>Model Name *</label><input type="text" name="phone_model" required></div>
            </div>
            <div class="form-group">
                <label>Device Condition *</label>
                <select name="phone_condition" required>
                    <option value="Box Intact">Brand New</option>
                    <option value="Good">Used - Good</option>
                    <option value="Issues">Has Issues</option>
                </select>
            </div>
            <div class="grid-row">
                <div class="form-group"><label>Expected Price (৳) *</label><input type="number" name="expected_price" required></div>
                <div class="form-group"><label>Original Price (৳) *</label><input type="number" name="original_price" required></div>
            </div>
            <div class="form-group"><label>Details/Issues</label><textarea name="phone_details" rows="3"></textarea></div>
            <div class="form-group">
                <label>Photos (Max 3)</label>
                <div class="file-upload-wrapper" onclick="document.getElementById('fileInput').click();">
                    <i class="fa-solid fa-cloud-arrow-up" style="font-size: 25px; color: var(--main-green);"></i>
                    <p style="margin:5px 0 0; font-size:14px; font-weight:600;">Click to upload images</p>
                    <input type="file" id="fileInput" name="phone_photos[]" multiple hidden>
                </div>
            </div>
            <button type="submit" name="submit_sell_request" class="btn-submit-sell">Submit & Get OTP</button>
        </form>
    </div>
</div>
<?php include('footer.php'); ?>
</body>
</html>