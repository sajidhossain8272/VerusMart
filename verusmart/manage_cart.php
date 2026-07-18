<?php
session_start();
include('db.php'); 

// ১. আইডি রিসিভ করা
$p_id = 0;
if (isset($_POST['id'])) {
    $p_id = (int)$_POST['id'];
} elseif (isset($_POST['product_id'])) {
    $p_id = (int)$_POST['product_id'];
}

if ($p_id > 0) {
    // ডাটাবেজ থেকে পণ্যের বেসিক তথ্য আনা
    $res = mysqli_query($conn, "SELECT name, price, image FROM products WHERE id = $p_id");
    $product = mysqli_fetch_assoc($res);

    if ($product) {
        if (!isset($_SESSION['cart'])) {
            $_SESSION['cart'] = array();
        }

        // --- মূল পরিবর্তন এখানে ---
        // যদি বাইরে থেকে (AJAX এর মাধ্যমে) দাম পাঠানো হয়, তবে সেটি নিবে। 
        // নাহলে ডাটাবেজের ডিফল্ট দাম নিবে।
        $final_price = isset($_POST['price']) ? (float)$_POST['price'] : (float)$product['price'];
        
        // কোয়ান্টিটি এবং সাইজ/ওজন রিসিভ করা
        $qty = isset($_POST['quantity']) ? (int)$_POST['quantity'] : 1;
        $size = isset($_POST['size']) ? $_POST['size'] : '';

        // একটি ইউনিক কি (Key) তৈরি করা যাতে একই পণ্যের আলাদা আলাদা ভেরিয়েন্ট কার্টে জমা হতে পারে
        $cart_key = $p_id . "_" . $size;

        if (isset($_SESSION['cart'][$cart_key])) {
            $_SESSION['cart'][$cart_key]['quantity'] += $qty;
            // দাম আপডেট করে দেওয়া যাতে ভেরিয়েন্ট অনুযায়ী সঠিক থাকে
            $_SESSION['cart'][$cart_key]['price'] = $final_price; 
        } else {
            $_SESSION['cart'][$cart_key] = array(
                'product_id' => $p_id,
                'name' => $product['name'],
                'price' => $final_price, // সঠিক ভেরিয়েন্ট প্রাইস সেভ হচ্ছে
                'image' => $product['image'],
                'size' => $size,
                'quantity' => $qty
            );
        }
        echo "Success";
    } else {
        echo "Error: Product not found";
    }
} else {
    echo "Error: No product ID received";
}
?>