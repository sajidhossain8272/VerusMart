<?php 
if (session_status() === PHP_SESSION_NONE) { session_start(); }
include('db.php'); 
include('header.php'); 

$msg = "";
if(isset($_POST['send_message'])) {
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $subject = mysqli_real_escape_string($conn, $_POST['subject']);
    $message = mysqli_real_escape_string($conn, $_POST['message']);

    $query = "INSERT INTO contact_messages (name, email, subject, message) VALUES ('$name', '$email', '$subject', '$message')";
    if(mysqli_query($conn, $query)) {
        $msg = "<div style='padding:15px; background:#dcfce7; color:#166534; border-radius:10px; margin-bottom:20px; font-weight:600;'>সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।</div>";
    } else {
        $msg = "<div style='padding:15px; background:#fee2e2; color:#b91c1c; border-radius:10px; margin-bottom:20px;'>দুঃখিত, পুনরায় চেষ্টা করুন।</div>";
    }
}
?>

<style>
    :root {
        --daraz-orange: #f85606;
        --text-dark: #212121;
        --text-muted: #757575;
        --bg-gray: #eff0f5;
    }

    body { background-color: var(--bg-gray); font-family: 'Roboto', 'Poppins', sans-serif; }
    
    .contact-wrapper {
        width: 90%;
        max-width: 1100px;
        margin: 50px auto;
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        gap: 30px;
    }

    .contact-info-card {
        background: #fff;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    }

    .contact-form-card {
        background: #fff;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    }

    .info-item {
        display: flex;
        gap: 15px;
        margin-bottom: 25px;
        align-items: flex-start;
    }

    .info-item i {
        color: var(--daraz-orange);
        font-size: 20px;
        margin-top: 3px;
    }

    .info-text h4 {
        margin: 0 0 5px;
        color: var(--text-dark);
        font-size: 16px;
        font-weight: 700;
    }

    .info-text p {
        margin: 0;
        color: var(--text-muted);
        font-size: 14px;
        line-height: 1.5;
    }

    .form-group { margin-bottom: 15px; }
    .form-group label {
        display: block;
        font-size: 13px;
        font-weight: 700;
        margin-bottom: 8px;
        color: var(--text-dark);
    }

    .form-control {
        width: 100%;
        padding: 12px 15px;
        border: 1px solid #ddd;
        border-radius: 8px;
        outline: none;
        font-size: 14px;
        transition: 0.3s;
    }

    .form-control:focus {
        border-color: var(--daraz-orange);
        box-shadow: 0 0 0 3px rgba(248, 86, 6, 0.1);
    }

    .btn-send {
        background-color: var(--daraz-orange);
        color: #fff;
        border: none;
        padding: 15px 30px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 16px;
        cursor: pointer;
        width: 100%;
        transition: 0.3s;
    }

    .btn-send:hover {
        background-color: #d44905;
        transform: translateY(-2px);
    }

    .social-links {
        display: flex;
        gap: 15px;
        margin-top: 30px;
    }

    .social-links a {
        width: 35px;
        height: 35px;
        background: var(--bg-gray);
        color: var(--text-dark);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        text-decoration: none;
        transition: 0.3s;
    }

    .social-links a:hover {
        background: var(--daraz-orange);
        color: #fff;
    }

    /* রেসপনসিভ ডিজাইন */
    @media (max-width: 900px) {
        .contact-wrapper { grid-template-columns: 1fr; }
        .contact-info-card, .contact-form-card { padding: 30px 20px; }
    }
</style>

<div class="container">
    <div class="contact-wrapper">
        
        <!-- বাম পাশ: কন্টাক্ট ইনফো (ফুটারের তথ্যের সাথে মিল রেখে) -->
        <div class="contact-info-card">
            <h2 style="color: var(--text-dark); margin-bottom: 25px; font-weight: 800;">Contact Us</h2>
            
            <div class="info-item">
                <i class="fas fa-location-dot"></i>
                <div class="info-text">
                    <h4>Address</h4>
                    <p>Kawla, Dhaka - 1229</p>
                </div>
            </div>

            <div class="info-item">
                <i class="fas fa-phone-alt"></i>
                <div class="info-text">
                    <h4>Phone Number</h4>
                    <p>+880 1628083370</p>
                </div>
            </div>

            <div class="info-item">
                <i class="fas fa-envelope"></i>
                <div class="info-text">
                    <h4>Email Address</h4>
                    <p>verusmart4@gmail.com</p>
                </div>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

            <h4>Follow Us</h4>
            <div class="social-links">
                <a href="#"><i class="fab fa-facebook-f"></i></a>
                <a href="#"><i class="fab fa-tiktok"></i></a>
                <a href="#"><i class="fab fa-instagram"></i></a>
                <a href="#"><i class="fab fa-youtube"></i></a>
                <a href="#"><i class="fab fa-twitter"></i></a>
            </div>
        </div>

        <!-- ডান পাশ: মেসেজ ফর্ম -->
        <div class="contact-form-card">
            <h3 style="margin-bottom: 20px;">Send Us a Message</h3>
            <?php echo $msg; ?>
            
            <form method="POST">
                <div class="form-group">
                    <label>Full Name *</label>
                    <input type="text" name="name" class="form-control" placeholder="আপনার নাম লিখুন" required>
                </div>

                <div class="form-group">
                    <label>Email Address *</label>
                    <input type="email" name="email" class="form-control" placeholder="আপনার ইমেইল লিখুন" required>
                </div>

                <div class="form-group">
                    <label>Subject</label>
                    <input type="text" name="subject" class="form-control" placeholder="বিষয়">
                </div>

                <div class="form-group">
                    <label>Your Message *</label>
                    <textarea name="message" class="form-control" rows="5" placeholder="আপনার বার্তাটি লিখুন..." required></textarea>
                </div>

                <button type="submit" name="send_message" class="btn-send">
                    <i class="fas fa-paper-plane"></i> Send Message
                </button>
            </form>
        </div>

    </div>
</div>

<?php include('footer.php'); ?>