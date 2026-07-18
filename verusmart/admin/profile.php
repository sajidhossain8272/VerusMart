<?php
include('header.php'); 
include('sidebar.php');
include('../db.php');

$admin_id = $_SESSION['admin_id'];
$msg = "";

if(isset($_POST['update_profile'])) {
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = $_POST['password'];

    if(!empty($password)) {
        $sql = "UPDATE admins SET name='$name', email='$email', password='$password' WHERE id='$admin_id'";
    } else {
        $sql = "UPDATE admins SET name='$name', email='$email' WHERE id='$admin_id'";
    }

    if(mysqli_query($conn, $sql)) {
        $_SESSION['admin_name'] = $name;
        $msg = "<div class='alert alert-success'>প্রোফাইল সফলভাবে আপডেট হয়েছে!</div>";
    }
}

$res = mysqli_query($conn, "SELECT * FROM admins WHERE id='$admin_id'");
$data = mysqli_fetch_assoc($res);
?>

<style>
    .main-content {
        margin-left: var(--sidebar-width);
        margin-top: var(--header-height);
        padding: 40px;
        min-height: calc(100vh - var(--header-height));
        background: #f3f4f7;
    }
    .profile-card {
        max-width: 700px;
        margin: auto;
        background: #fff;
        padding: 40px;
        border-radius: 15px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #334155; font-size: 14px; }
    .form-control {
        width: 100%;
        padding: 12px 15px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        outline: none;
        transition: 0.3s;
    }
    .form-control:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
    .btn-update {
        background: #3b82f6;
        color: #fff;
        padding: 13px;
        border: none;
        border-radius: 8px;
        width: 100%;
        font-weight: 700;
        cursor: pointer;
        transition: 0.3s;
    }
    .btn-update:hover { background: #2563eb; }
    .alert { padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; text-align: center; }
    .alert-success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
</style>

<div class="main-content">
    <div class="profile-card">
        <h3 style="margin-bottom: 30px; color: #1e293b; font-weight: 700;">Admin Profile Settings</h3>
        
        <?php echo $msg; ?>

        <form method="POST">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" name="name" class="form-control" value="<?php echo $data['name']; ?>" required>
            </div>
            
            <div class="form-group">
                <label>Email Address</label>
                <input type="email" name="email" class="form-control" value="<?php echo $data['email']; ?>" required>
            </div>
            
            <div class="form-group">
                <label>New Password (ফাঁকা রাখলে আগেরটাই থাকবে)</label>
                <input type="password" name="password" class="form-control" placeholder="••••••••">
            </div>
            
            <button type="submit" name="update_profile" class="btn-update">Update Profile Now</button>
        </form>
    </div>
</div>

</body>
</html>