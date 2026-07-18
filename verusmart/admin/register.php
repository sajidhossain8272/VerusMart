<?php
include('../db.php');
if(isset($_POST['register'])) {
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    
    $check = mysqli_query($conn, "SELECT * FROM users WHERE email='$email'");
    if(mysqli_num_rows($check) > 0) {
        $msg = "Email already exists!";
    } else {
        mysqli_query($conn, "INSERT INTO users (name, email, password, role) VALUES ('$name', '$email', '$password', 'admin')");
        $msg = "Admin Registered Successfully!";
    }
}
?>
<!-- সিম্পল এইচটিএমএল ফর্ম লগইনের মতোই তৈরি করে নিন -->