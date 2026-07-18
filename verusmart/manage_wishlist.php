<?php
if (session_status() === PHP_SESSION_NONE) { session_start(); }
include('db.php');

// ইউজার লগইন আছে কি না চেক করুন (user_id সেশনে থাকা জরুরি)
if (!isset($_SESSION['user_id'])) {
    echo "login_required";
    exit;
}

if (isset($_POST['product_id']) && isset($_POST['add_to_wishlist'])) {
    $user_id = (int)$_SESSION['user_id'];
    $product_id = (int)$_POST['product_id'];

    // চেক করা হচ্ছে প্রোডাক্টটি অলরেডি উইশলিস্টে আছে কি না
    $check_query = "SELECT id FROM wishlist WHERE user_id = $user_id AND product_id = $product_id";
    $check_result = mysqli_query($conn, $check_query);

    if (mysqli_num_rows($check_result) > 0) {
        // যদি থাকে, তবে রিমুভ করে দাও (Toggle logic)
        $delete_query = "DELETE FROM wishlist WHERE user_id = $user_id AND product_id = $product_id";
        mysqli_query($conn, $delete_query);
        echo "removed";
    } else {
        // যদি না থাকে, তবে ইনসার্ট করো
        $insert_query = "INSERT INTO wishlist (user_id, product_id) VALUES ($user_id, $product_id)";
        if (mysqli_query($conn, $insert_query)) {
            echo "added";
        } else {
            echo "error";
        }
    }
}
?>