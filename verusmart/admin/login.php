<?php
session_start();
include('../db.php'); 

if(isset($_POST['login'])) {
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = $_POST['password'];

    $query = "SELECT * FROM admins WHERE email='$email'";
    $result = mysqli_query($conn, $query);

    if ($result) {
        if(mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            
            // পাসওয়ার্ড চেক
            if($password == $row['password'] || password_verify($password, $row['password'])) {
                $_SESSION['admin_id'] = $row['id'];
                $_SESSION['admin_name'] = $row['name'];
                
                // এখানে পরিবর্তন করা হয়েছে: index.php এর বদলে dashboard.php
                header('location: dashboard.php');
                exit();
            } else {
                $error = "ভুল পাসওয়ার্ড!";
            }
        } else {
            $error = "এই ইমেইলে কোনো অ্যাডমিন পাওয়া যায়নি!";
        }
    } else {
        $error = "ডাটাবেস এরর: " . mysqli_error($conn);
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Login - Verus Mart</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
        body { background: #012a14; display: flex; align-items: center; height: 100vh; font-family: 'Poppins', sans-serif; }
        .login-card { width: 400px; margin: auto; padding: 30px; border-radius: 15px; background: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
        .btn-success { background: #017a0a; border: none; }
        .btn-success:hover { background: #014d05; }
    </style>
</head>
<body>
    <div class="login-card">
        <h4 class="text-center mb-4">Verus Mart  Admin</h4>
        
        <?php if(isset($error)): ?>
            <div class="alert alert-danger py-2" style="font-size: 14px; text-align: center;"><?php echo $error; ?></div>
        <?php endif; ?>

        <form method="POST">
            <div class="mb-3">
                <label class="form-label">Email Address</label>
                <input type="email" name="email" class="form-control" placeholder="admin@gmail.com" required>
            </div>
            <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" name="password" class="form-control" placeholder="******" required>
            </div>
            <button type="submit" name="login" class="btn btn-success w-100">Login to Dashboard</button>
        </form>
    </div>
</body>
</html>