<?php
session_start();

if (isset($_POST['id']) && isset($_POST['change'])) {
    $id = $_POST['id'];
    $change = (int)$_POST['change'];

    if (isset($_SESSION['cart'][$id])) {
        $_SESSION['cart'][$id]['quantity'] += $change;

        // যদি কোয়ানিটি ১ এর নিচে চলে যায়, তবে আইটেমটি রিমুভ করবে অথবা ১ রাখবে
        if ($_SESSION['cart'][$id]['quantity'] < 1) {
            unset($_SESSION['cart'][$id]);
        }
    }
    echo "Success";
}
?>