<?php 
// ১. ডাটাবেজ কানেকশন এবং হেডার/সাইডবার ইনক্লুড
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

// ২. কাস্টমার (ইউজার) স্ট্যাটাস পরিবর্তন লজিক
if(isset($_GET['status_id'])){
    $u_id = (int)$_GET['status_id'];
    $current_status = mysqli_real_escape_string($conn, $_GET['current']);
    $new_status = ($current_status == 'active') ? 'inactive' : 'active';
    
    mysqli_query($conn, "UPDATE users SET status='$new_status' WHERE id=$u_id");
    echo "<script>window.location='customer_list.php';</script>";
}

// ৩. কাস্টমার (ইউজার) ডিলিট লজিক
if(isset($_GET['delete'])){
    $delete_id = (int)$_GET['delete'];
    mysqli_query($conn, "DELETE FROM users WHERE id=$delete_id");
    echo "<script>alert('User deleted permanently!'); window.location='customer_list.php';</script>";
}
?>

<style>
    :root { 
        --primary: #3b82f6; 
        --bg: #f8fafc; 
        --text: #1e293b; 
        --card: #ffffff; 
        --sidebar-width: 260px;
    }

    .content-wrapper { 
        margin-left: var(--sidebar-width); 
        padding: 100px 30px 40px; 
        background: var(--bg); 
        min-height: 100vh; 
        width: calc(100% - var(--sidebar-width)); 
        box-sizing: border-box;
    }

    .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
    }

    .page-title { font-size: 24px; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 12px; }

    .search-box {
        padding: 10px 15px;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        width: 350px;
        outline: none;
    }

    .card { 
        background: var(--card); 
        border-radius: 15px; 
        padding: 25px; 
        box-shadow: 0 4px 20px rgba(0,0,0,0.05); 
        border: none; 
    }

    .table-container { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    
    th { 
        background: #f8fafc; 
        padding: 15px; 
        text-align: left; 
        font-size: 12px; 
        color: #64748b; 
        text-transform: uppercase; 
        border-bottom: 2px solid #f1f5f9; 
    }
    
    td { padding: 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; vertical-align: middle; }

    .user-info { display: flex; align-items: center; gap: 12px; }
    .user-avatar { 
        width: 42px; height: 42px; border-radius: 50%; 
        background: #e2e8f0; display: flex; align-items: center; 
        justify-content: center; font-weight: bold; color: #475569;
    }

    .badge { padding: 6px 12px; border-radius: 50px; font-size: 11px; font-weight: 700; text-transform: uppercase; display: inline-block; }
    .badge-active { background: #dcfce7; color: #166534; }
    .badge-inactive { background: #fee2e2; color: #991b1b; }

    .action-btn { font-size: 16px; margin-right: 10px; text-decoration: none; padding: 8px; border-radius: 6px; transition: 0.2s; }
    .btn-view { color: #3b82f6; background: #eff6ff; }
    .btn-delete { color: #ef4444; background: #fef2f2; }

    @media (max-width: 992px) { 
        .content-wrapper { margin-left: 0; width: 100%; padding: 80px 15px; } 
        .search-box { width: 100%; margin-top: 15px; }
        .page-header { flex-direction: column; align-items: flex-start; }
    }
</style>

<div class="content-wrapper">
    <div class="page-header">
        <h1 class="page-title"><i class="fa-solid fa-users"></i> Customer Management</h1>
        <input type="text" id="customerSearch" class="search-box" placeholder="Search by name, email or phone..." onkeyup="searchTable()">
    </div>

    <div class="card">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="m-0" style="font-size:18px;">Registered Customers</h3>
            <span class="text-muted small">Total: <?php echo mysqli_num_rows(mysqli_query($conn, "SELECT id FROM users")); ?></span>
        </div>

        <div class="table-container">
            <table id="customerTable">
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Contact Info</th>
                        <th>Total Orders</th>
                        <th>Join Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php 
                    // ডাটাবেস (users টেবিল) থেকে ডাটা আনা
                    $sql = "SELECT * FROM users ORDER BY id DESC";
                    $result = mysqli_query($conn, $sql);
                    
                    if(mysqli_num_rows($result) > 0){
                        while($row = mysqli_fetch_assoc($result)){
                            $status = $row['status'] ?: 'active';
                            $name = $row['full_name'];
                            $initial = strtoupper(substr($name, 0, 1));
                    ?>
                    <tr>
                        <td>
                            <div class="user-info">
                                <div class="user-avatar"><?php echo $initial; ?></div>
                                <div>
                                    <div class="fw-bold text-dark"><?php echo htmlspecialchars($name); ?></div>
                                    <div class="text-muted small">ID: #CUS-<?php echo $row['id']; ?></div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div class="fw-semibold"><?php echo htmlspecialchars($row['email']); ?></div>
                            <div class="text-muted small"><?php echo htmlspecialchars($row['phone']); ?></div>
                        </td>
                        <td>
                            <span class="fw-bold text-primary">
                                <?php 
                                    $email = $row['email'];
                                    // আপনার অর্ডার টেবিলের স্ট্রাকচার অনুযায়ী এই কোয়েরি কাজ করবে
                                    $order_res = mysqli_query($conn, "SELECT COUNT(id) as total FROM orders WHERE email='$email'");
                                    $order_data = mysqli_fetch_assoc($order_res);
                                    echo $order_data['total'] ?? 0;
                                ?>
                            </span> Orders
                        </td>
                        <td><?php echo date('d M, Y', strtotime($row['created_at'])); ?></td>
                        <td>
                            <a href="?status_id=<?php echo $row['id']; ?>&current=<?php echo $status; ?>" 
                               class="badge <?php echo ($status == 'active') ? 'badge-active' : 'badge-inactive'; ?>" 
                               style="text-decoration:none;">
                                <?php echo strtoupper($status); ?>
                            </a>
                        </td>
                        <td>
                            <a href="customer_details.php?id=<?php echo $row['id']; ?>" class="action-btn btn-view" title="View"><i class="fa-solid fa-eye"></i></a>
                            <a href="?delete=<?php echo $row['id']; ?>" class="action-btn btn-delete" onclick="return confirm('Are you sure you want to delete this user?')" title="Delete"><i class="fa-solid fa-trash"></i></a>
                        </td>
                    </tr>
                    <?php } 
                    } else { echo "<tr><td colspan='6' class='text-center py-5 text-muted'>No customers found in database.</td></tr>"; } ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
function searchTable() {
    var input = document.getElementById("customerSearch");
    var filter = input.value.toUpperCase();
    var table = document.getElementById("customerTable");
    var tr = table.getElementsByTagName("tr");

    for (var i = 1; i < tr.length; i++) {
        var found = false;
        var tds = tr[i].getElementsByTagName("td");
        for (var j = 0; j < 2; j++) { // প্রথম ২ টি কলামে সার্চ করবে
            if (tds[j]) {
                if (tds[j].textContent.toUpperCase().indexOf(filter) > -1) {
                    found = true;
                    break;
                }
            }
        }
        tr[i].style.display = found ? "" : "none";
    }
}
</script>

</body>
</html>