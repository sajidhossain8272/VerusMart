<?php 
// ১. ডাটাবেজ কানেকশন এবং হেডার/সাইডবার ইনক্লুড
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

// ২. ভেন্ডর স্ট্যাটাস পরিবর্তন লজিক
if(isset($_GET['status_id'])){
    $v_id = (int)$_GET['status_id'];
    $current_status = mysqli_real_escape_string($conn, $_GET['current']);
    $new_status = ($current_status == 'active') ? 'inactive' : 'active';
    
    mysqli_query($conn, "UPDATE vendors SET status='$new_status' WHERE id=$v_id");
    echo "<script>window.location='vendor_list.php';</script>";
}

// ৩. ভেন্ডর ডিলিট লজিক
if(isset($_GET['delete'])){
    $delete_id = (int)$_GET['delete'];
    mysqli_query($conn, "DELETE FROM vendors WHERE id=$delete_id");
    echo "<script>alert('Vendor deleted!'); window.location='vendor_list.php';</script>";
}
?>

<style>
    :root { 
        --primary: #8b5cf6; /* ভেন্ডরের জন্য বেগুনি থিম */
        --bg: #f8fafc; 
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

    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
    .page-title { font-size: 24px; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 12px; }

    .search-box { padding: 10px 15px; border: 1px solid #e2e8f0; border-radius: 10px; width: 350px; outline: none; }

    .card { background: white; border-radius: 15px; padding: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: none; }

    .table-container { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    
    th { background: #f8fafc; padding: 15px; text-align: left; font-size: 12px; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; }
    td { padding: 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; vertical-align: middle; }

    .vendor-info { display: flex; align-items: center; gap: 12px; }
    .vendor-avatar { width: 42px; height: 42px; border-radius: 10px; background: #ede9fe; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #8b5cf6; }

    .badge { padding: 6px 12px; border-radius: 50px; font-size: 11px; font-weight: 700; text-transform: uppercase; display: inline-block; }
    .badge-active { background: #dcfce7; color: #166534; }
    .badge-inactive { background: #fee2e2; color: #991b1b; }

    .action-btn { font-size: 16px; margin-right: 8px; text-decoration: none; padding: 8px; border-radius: 6px; transition: 0.2s; }
    .btn-view { color: #8b5cf6; background: #f5f3ff; }
    .btn-delete { color: #ef4444; background: #fef2f2; }

    @media (max-width: 992px) { 
        .content-wrapper { margin-left: 0; width: 100%; padding: 80px 15px; } 
        .page-header { flex-direction: column; align-items: flex-start; gap: 15px; }
        .search-box { width: 100%; }
    }
</style>

<div class="content-wrapper">
    <div class="page-header">
        <h1 class="page-title"><i class="fa-solid fa-user-tie"></i> Vendor Management</h1>
        <input type="text" id="vendorSearch" class="search-box" placeholder="Search by name, shop or email..." onkeyup="searchTable()">
    </div>

    <div class="card">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="m-0" style="font-size:18px;">Registered Vendors</h3>
            <button class="btn btn-primary btn-sm" style="border-radius:8px; background:var(--primary); border:none;">+ Add New Vendor</button>
        </div>

        <div class="table-container">
            <table id="vendorTable">
                <thead>
                    <tr>
                        <th>Vendor & Shop</th>
                        <th>Contact Info</th>
                        <th>Total Products</th>
                        <th>Join Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php 
                    // vendors টেবিল থেকে ডাটা আনা (যদি টেবিল না থাকে তবে নিচের SQL কোডটি রান করুন)
                    $sql = "SELECT * FROM vendors ORDER BY id DESC";
                    $result = mysqli_query($conn, $sql);
                    
                    if($result && mysqli_num_rows($result) > 0){
                        while($row = mysqli_fetch_assoc($result)){
                            $status = $row['status'] ?: 'active';
                            $initial = strtoupper(substr($row['name'], 0, 1));
                    ?>
                    <tr>
                        <td>
                            <div class="vendor-info">
                                <div class="vendor-avatar"><?php echo $initial; ?></div>
                                <div>
                                    <div class="fw-bold text-dark"><?php echo htmlspecialchars($row['name']); ?></div>
                                    <div class="text-muted small"><?php echo htmlspecialchars($row['shop_name'] ?? 'No Shop Name'); ?></div>
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
                                    $v_id = $row['id'];
                                    // ভেন্ডরের মোট প্রোডাক্ট সংখ্যা বের করা
                                    $prod_res = mysqli_query($conn, "SELECT COUNT(id) as total FROM products WHERE vendor_id='$v_id'");
                                    echo mysqli_fetch_assoc($prod_res)['total'] ?? 0;
                                ?>
                            </span> Items
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
                            <a href="vendor_details.php?id=<?php echo $row['id']; ?>" class="action-btn btn-view" title="View"><i class="fa-solid fa-eye"></i></a>
                            <a href="?delete=<?php echo $row['id']; ?>" class="action-btn btn-delete" onclick="return confirm('Delete this vendor?')" title="Delete"><i class="fa-solid fa-trash"></i></a>
                        </td>
                    </tr>
                    <?php } 
                    } else { echo "<tr><td colspan='6' class='text-center py-5 text-muted'>No vendors found.</td></tr>"; } ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
function searchTable() {
    var input = document.getElementById("vendorSearch");
    var filter = input.value.toUpperCase();
    var table = document.getElementById("vendorTable");
    var tr = table.getElementsByTagName("tr");

    for (var i = 1; i < tr.length; i++) {
        var found = false;
        var tds = tr[i].getElementsByTagName("td");
        for (var j = 0; j < 2; j++) { 
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