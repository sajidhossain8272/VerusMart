<?php
session_start();
include('db.php'); // ডাটাবেজ কানেকশন

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // ইনপুট ক্লিন করা
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = $_POST['password'];

    if (empty($email) || empty($password)) {
        header("Location: login.php?error=emptyfields");
        exit();
    } else {
        
        // ১. ইমেইল দিয়ে ইউজারকে খোঁজা
        $sql = "SELECT * FROM users WHERE email='$email'";
        $result = mysqli_query($conn, $sql);

        if ($row = mysqli_fetch_assoc($result)) {
            
            // ২. পাসওয়ার্ড ভেরিফাই করা (Hashed password-এর জন্য এটিই সঠিক পদ্ধতি)
            $pwdCheck = password_verify($password, $row['password']);

            if ($pwdCheck == true) {
                // ৩. লগইন সফল: সেশন তৈরি করা
                $_SESSION['user_id'] = $row['id'];
                $_SESSION['user_name'] = $row['name'];
                $_SESSION['user_email'] = $row['email'];

                // সফল লগইনের পর হোম পেজে রিডাইরেক্ট
                header("Location: index.php?login=success");
                exit();
            } else {
                // পাসওয়ার্ড না মিললে
                header("Location: login.php?error=wrongpwd");
                exit();
            }
        } else {
            // ইউজার না পাওয়া গেলে
            header("Location: login.php?error=nouser");
            exit();
        }
    }
} else {
    header("Location: login.php");
    exit();
}