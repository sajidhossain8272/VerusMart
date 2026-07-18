<?php 
if (session_status() === PHP_SESSION_NONE) { session_start(); }
include('db.php'); 
include('header.php'); 

// --- এসএমএস পাঠানোর ফাংশন (BulkSMSBD API Example) ---
function sendRealSMS($phone, $otp) {
    $api_key = "YOUR_API_KEY_HERE"; // এখানে আপনার API Key বসান
    $senderid = "8809617611065";   // এখানে আপনার অনুমোদিত Sender ID বসান
    $message = "Your OTP for Shodai Bazaar Phone Sell Request is: " . $otp . ". Do not share it with anyone.";
    
    $url = "https://bulksmsbd.net/api/smsapi?api_key=" . urlencode($api_key) . 
           "&type=text" . 
           "&number=" . urlencode($phone) . 
           "&senderid=" . urlencode($senderid) . 
           "&message=" . urlencode($message);

    // API কল করা
    $response = file_get_contents($url);
    return $response;
}

$req_id = isset($_GET['req_id']) ? (int)$_GET['req_id'] : 0;
$step = 1; 
$status = "";
$otp_sent_to = "";

// ধাপ ১: ফোন নাম্বারে রিয়েল ওটিপি পাঠানো
if(isset($_POST['send_otp'])){
    $phone = mysqli_real_escape_string($conn, $_POST['phone_number']);
    $new_otp = rand(1000, 9999);
    
    $check_req = mysqli_query($conn, "SELECT id FROM phone_sell_requests WHERE id=$req_id");
    
    if(mysqli_num_rows($check_req) > 0){
        // ডাটাবেজে আপডেট
        mysqli_query($conn, "UPDATE phone_sell_requests SET phone_number='$phone', otp_code='$new_otp' WHERE id=$req_id");
        
        // --- আসল এসএমএস পাঠানো ---
        sendRealSMS($phone, $new_otp);
        
        $step = 2; 
        $otp_sent_to = $phone;
        $_SESSION['otp_sent_to'] = $phone; // সেশনে রাখা হলো
    } else {
        $status = "invalid_req";
    }
}

// ধাপ ২: ওটিপি ভেরিফাই করা
if(isset($_POST['verify_now'])){
    $entered_otp = mysqli_real_escape_string($conn, $_POST['otp_box']);
    $req_id = (int)$_POST['current_req_id'];

    $verify_query = mysqli_query($conn, "SELECT id FROM phone_sell_requests WHERE id=$req_id AND otp_code='$entered_otp'");
    
    if(mysqli_num_rows($verify_query) > 0){
        mysqli_query($conn, "UPDATE phone_sell_requests SET is_verified = 1, status='pending' WHERE id=$req_id");
        $status = "success";
    } else {
        $status = "error";
        $step = 2;
        $otp_sent_to = isset($_SESSION['otp_sent_to']) ? $_SESSION['otp_sent_to'] : "";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <style>
        .otp-wrapper { width: 94%; max-width: 500px; margin: 60px auto; }
        .otp-card { background: #fff; padding: 40px; border-radius: 25px; box-shadow: 0 15px 45px rgba(0,0,0,0.07); border: 1px solid #eef2f6; text-align: center; }
        .otp-icon { font-size: 50px; color: #017a0a; margin-bottom: 20px; }
        .card-title { font-size: 26px; font-weight: 800; color: #1e293b; margin-bottom: 10px; }
        .card-sub { font-size: 14px; color: #64748b; margin-bottom: 30px; line-height: 1.6; }
        .form-control { width: 100%; padding: 15px 20px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 16px; font-weight: 600; outline: none; transition: 0.3s; margin-bottom: 20px; text-align: center; }
        .form-control:focus { border-color: #017a0a; box-shadow: 0 0 0 4px rgba(1, 122, 10, 0.08); }
        .otp-box-input { letter-spacing: 15px; font-size: 28px; font-weight: 900; color: #017a0a; }
        .btn-green { width: 100%; background: #017a0a; color: white; padding: 16px; border-radius: 15px; font-weight: 800; font-size: 17px; border: none; cursor: pointer; transition: 0.3s; }
        .btn-green:hover { background: #015a07; transform: translateY(-2px); }
    </style>
</head>
<body>

<div class="otp-wrapper">
    <div class="otp-card">
        
        <?php if($step == 1): ?>
            <!-- ধাপ ১: ফোন নাম্বার কনফার্ম করা -->
            <div class="otp-icon"><i class="fa-solid fa-mobile-screen-button"></i></div>
            <h2 class="card-title">Confirm Number</h2>
            <p class="card-sub">Please enter your phone number to receive the real verification code via SMS.</p>

            <form method="POST">
                <input type="tel" name="phone_number" class="form-control" placeholder="017XXXXXXXX" required autofocus>
                <button type="submit" name="send_otp" class="btn-green">Send OTP Code</button>
            </form>

        <?php else: ?>
            <!-- ধাপ ২: ওটিপি ভেরিফিকেশন (টেস্ট কোড রিমুভ করা হয়েছে) -->
            <div class="otp-icon"><i class="fa-solid fa-shield-check"></i></div>
            <h2 class="card-title">OTP Verification</h2>
            <p class="card-sub">We've sent a 4-digit code to <b><?php echo $otp_sent_to; ?></b>. Please check your SMS inbox.</p>

            <form method="POST">
                <input type="hidden" name="current_req_id" value="<?php echo $req_id; ?>">
                <input type="text" name="otp_box" maxlength="4" class="form-control otp-box-input" placeholder="0000" required autofocus autocomplete="off">
                <button type="submit" name="verify_now" class="btn-green">Verify & Confirm Request</button>
            </form>
            
            <p style="margin-top:20px; font-size:13px; color:#94a3b8;">Didn't receive code? <a href="verify_otp.php?req_id=<?php echo $req_id; ?>" style="color:#017a0a; font-weight:700; text-decoration:none;">Resend SMS</a></p>
        <?php endif; ?>

    </div>
</div>

<script>
<?php if($status == 'success'): ?>
    Swal.fire({
        title: '<span style="color:#017a0a">Success!</span>',
        html: '<b>Success!</b> Your phone sell request has been verified and submitted.<br>We will contact you soon.',
        icon: 'success',
        confirmButtonColor: '#017a0a',
        confirmButtonText: 'Back to Home'
    }).then(() => { window.location.href = 'index.php'; });

<?php elseif($status == 'error'): ?>
    Swal.fire({
        title: 'Invalid Code',
        text: 'The code you entered is incorrect. Please check your SMS and try again.',
        icon: 'error',
        confirmButtonColor: '#d33'
    });
<?php endif; ?>
</script>

<?php include('footer.php'); ?>
</body>
</html>