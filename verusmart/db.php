<?php
$host = "localhost";
$user = "mobileh1_verusmart";
$pass = "l!sbo7d9~(x&~Sd3";
$dbname = "mobileh1_verusmart";

$conn = mysqli_connect($host, $user, $pass, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
mysqli_set_charset($conn, "utf8");
?>