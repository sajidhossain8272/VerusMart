<?php 
// ১. কানেকশন ও হেডার-সাইডবার ইনক্লুড
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

// লোগো আপলোড ডিরেক্টরি
$upload_dir = "uploads/payments/";
if (!is_dir($upload_dir)) { mkdir($upload_dir, 0777, true); }

$edit_mode = false;
$edit_id = "";
$edit_name = "";
$edit_details = "";

// --- এডিট করার জন্য ডাটা আনা ---
if(isset($_GET['edit'])){
    $edit_mode = true;
    $edit_id = (int)$_GET['edit'];
    $res = mysqli_query($conn, "SELECT * FROM payment_methods WHERE id=$edit_id");
    $row = mysqli_fetch_assoc($res);
    if($row){
        $edit_name = $row['name'];
        $edit_details = $row['account_details'];
    }
}

// --- মেথড সেভ ও আপডেট লজিক ---
if(isset($_POST['save_method'])){
    $p_id = $_POST['p_id'];
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $details = mysqli_real_escape_string($conn, $_POST['details']);
    
    $logo_query = "";
    if($_FILES['logo']['name'] != ""){
        $logo_name = "pay_" . time() . "_" . $_FILES['logo']['name'];
        if(move_uploaded_file($_FILES['logo']['tmp_name'], $upload_dir . $logo_name)){
            $logo_query = ", logo='$logo_name'";
        }
    }

    if($p_id != ""){
        $sql = "UPDATE payment_methods SET name='$name', account_details='$details' $logo_query WHERE id=$p_id";
        $msg = "Payment Method Updated!";
    } else {
        $temp_logo = ($logo_query != "") ? str_replace(", logo='", "", str_replace("'", "", $logo_query)) : "";
        $sql = "INSERT INTO payment_methods (name, account_details, logo, status) VALUES ('$name', '$details', '$temp_logo', 'active')";
        $msg = "New Payment Method Added!";
    }
    
    if(mysqli_query($conn, $sql)){
        echo "<script>alert('$msg'); window.location='payment_methods.php';</script>";
    }
}

// --- স্ট্যাটাস পরিবর্তন লজিক ---
if(isset($_GET['status'])){
    $id = (int)$_GET['id'];
    $new_st = ($_GET['status'] == 'active') ? 'inactive' : 'active';
    mysqli_query($conn, "UPDATE payment_methods SET status='$new_st' WHERE id=$id");
    header('location: payment_methods.php');
}

// --- ডিলিট লজিক ---
if(isset($_GET['delete'])){
    $id = (int)$_GET['delete'];
    mysqli_query($conn, "DELETE FROM payment_methods WHERE id=$id");
    header('location: payment_methods.php');
}
?>

<style>
    :root { --primary: #15803d; --bg: #f8fafc; --card: #ffffff; }

    .content-wrapper { 
        margin-left: 260px; 
        padding: 90px 30px 40px; 
        background: var(--bg); 
        min-height: 100vh; 
        transition: 0.3s; 
    }

    /* ফুল পেজ গ্রিড লেআউট */
    .payment-grid {
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        gap: 25px;
        align-items: start;
    }

    .card { background: var(--card); border-radius: 15px; padding: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: none; }
    .page-title { font-size: 22px; font-weight: 800; color: #1e293b; margin-bottom: 25px; display: flex; align-items: center; gap: 10px; }

    /* ফর্ম ডিজাইন */
    label { display: block; font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 8px; text-transform: uppercase; }
    input, textarea { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; outline: none; margin-bottom: 15px; }
    input:focus, textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(21, 128, 61, 0.1); }

    .btn-save { background: var(--primary); color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer; font-weight: 700; width: 100%; transition: 0.3s; }
    .btn-save:hover { background: #166534; transform: translateY(-2px); }

    /* টেবিল ডিজাইন */
    .table-container { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f8fafc; padding: 15px; text-align: left; font-size: 12px; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; }
    td { padding: 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; vertical-align: middle; }
    
    .method-logo { width: 50px; height: 35px; object-fit: contain; border-radius: 5px; background: #fff; border: 1px solid #f1f5f9; }
    
    .status-btn { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-decoration: none; }
    .status-active { background: #dcfce7; color: #15803d; }
    .status-inactive { background: #fee2e2; color: #b91c1c; }

    .action-icons a { font-size: 16px; margin-right: 12px; text-decoration: none; }

    @media (max-width: 1100px) { 
        .payment-grid { grid-template-columns: 1fr; } 
        .content-wrapper { margin-left: 0; padding: 80px 15px; }
    }
</style>

<div class="content-wrapper">
    <div class="page-title"><i class="fa-solid fa-credit-card"></i> Payment Methods Setup</div>

    <div class="payment-grid">
        
        <!-- ১. মেথড অ্যাড/এডিট ফর্ম -->
        <div class="card">
            <h3 style="margin-top:0; margin-bottom:20px; font-size:18px; color:#1e293b;">
                <?php echo $edit_mode ? "Update Method" : "Add New Payment Method"; ?>
            </h3>
            <form action="" method="POST" enctype="multipart/form-data">
                <input type="hidden" name="p_id" value="<?php echo $edit_id; ?>">
                
                <label>Method Name (e.g. Bkash, Nagad)</label>
                <input type="text" name="name" value="<?php echo htmlspecialchars($edit_name); ?>" placeholder="Enter Name" required>

                <label>Account Details / Instructions</label>
                <textarea name="details" rows="3" placeholder="Enter account number or instructions"><?php echo htmlspecialchars($edit_details); ?></textarea>

                <label>Logo/Icon</label>
                <input type="file" name="logo" accept="image/*">

                <div style="display:flex; gap:10px;">
                    <button type="submit" name="save_method" class="btn-save">
                        <i class="fa-solid fa-save"></i> <?php echo $edit_mode ? "Update Method" : "Save Method"; ?>
                    </button>
                    <?php if($edit_mode): ?>
                        <a href="payment_methods.php" style="padding:12px; border-radius:10px; text-decoration:none; background:#cbd5e1; color:#475569; font-weight:700;">Cancel</a>
                    <?php endif; ?>
                </div>
            </form>
        </div>

        <!-- ২. মেথড লিস্ট টেবিল (ডানদিকের জায়গা ভরাট করার জন্য) -->
        <div class="card">
            <h3 style="margin-top:0; margin-bottom:20px; font-size:18px; color:#1e293b;">Configured Methods</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Logo</th>
                            <th>Method Name</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php 
                        $query = mysqli_query($conn, "SELECT * FROM payment_methods ORDER BY id DESC");
                        if(mysqli_num_rows($query) > 0){
                            while($row = mysqli_fetch_assoc($query)){
                        ?>
                        <tr>
                            <td>
                                <img src="uploads/payments/<?php echo $row['logo']; ?>" 
                                     class="method-logo" 
                                     onerror="this.src='https://placehold.jp/50x35.png?text=Pay';">
                            </td>
                            <td>
                                <strong><?php echo htmlspecialchars($row['name']); ?></strong><br>
                                <small style="color:gray;"><?php echo htmlspecialchars($row['account_details']); ?></small>
                            </td>
                            <td>
                                <a href="?id=<?php echo $row['id']; ?>&status=<?php echo $row['status']; ?>" 
                                   class="status-btn <?php echo ($row['status']=='active') ? 'status-active' : 'status-inactive'; ?>">
                                    <?php echo strtoupper($row['status']); ?>
                                </a>
                            </td>
                            <td class="action-icons">
                                <a href="?edit=<?php echo $row['id']; ?>" style="color:#0ea5e9;"><i class="fa-solid fa-pen-to-square"></i></a>
                                <a href="?delete=<?php echo $row['id']; ?>" style="color:#ef4444;" onclick="return confirm('Delete this method?')"><i class="fa-solid fa-trash"></i></a>
                            </td>
                        </tr>
                        <?php } 
                        } else { echo "<tr><td colspan='4' style='text-align:center; padding:30px; color:gray;'>No methods found.</td></tr>"; } ?>
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</div>

</body>
</html>