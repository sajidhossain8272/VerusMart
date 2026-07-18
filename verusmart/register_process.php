<?php
// ১. সেশন এবং ডাটাবেস কানেকশন
if (session_status() === PHP_SESSION_NONE) { session_start(); }
include('db.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // ২. ইনপুট ডাটা গ্রহণ ও স্যানিটাইজ করা
    $full_name = mysqli_real_escape_string($conn, $_POST['full_name']);
    $email     = mysqli_real_escape_string($conn, $_POST['email']);
    $phone     = mysqli_real_escape_string($conn, $_POST['phone']);
    $password  = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    // ৩. ভ্যালিডেশন চেক
    if (empty($full_name) || empty($email) || empty($phone) || empty($password)) {
        echo "<script>alert('সবগুলো ঘর পূরণ করুন!'); window.location='register.php';</script>";
        exit;
    }

    if ($password !== $confirm_password) {
        echo "<script>alert('পাসওয়ার্ড মিলছে না!'); window.location='register.php';</script>";
        exit;
    }

    // ৪. ইমেইল বা ফোন নম্বর আগে থেকেই আছে কি না চেক করা
    $check_user = "SELECT id FROM users WHERE email = '$email' OR phone = '$phone' LIMIT 1";
    $result = mysqli_query($conn, $check_user);

    if (mysqli_num_rows($result) > 0) {
        echo "<script>alert('এই ইমেইল বা ফোন নম্বরটি ইতিমধ্যে ব্যবহার করা হয়েছে!'); window.location='register.php';</script>";
        exit;
    }

    // ৫. পাসওয়ার্ড সিকিউর করা (Hashing)
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // ৬. ডাটাবেসে ইউজার সেভ করা (Prepared Statement ব্যবহার করা ভালো সিকিউরিটির জন্য)
    $sql = "INSERT INTO users (full_name, email, phone, password, status, created_at) VALUES (?, ?, ?, ?, 'active', NOW())";
    
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "ssss", $full_name, $email, $phone, $hashed_password);

    if (mysqli_stmt_execute($stmt)) {
        echo "<script>alert('রেজিস্ট্রেশন সফল হয়েছে! এখন লগইন করুন।'); window.location='login.php';</script>";
    } else {
        echo "<script>alert('দুঃখিত, কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।'); window.location='register.php';</script>";
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
} else {
    header("Location: register.php");
    exit;
}
?>