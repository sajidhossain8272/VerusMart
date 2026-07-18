<?php 
ob_start(); 
require_once '../db.php'; 

// ১. স্ট্যাটাস আপডেট ও ডিলিট লজিক
if(isset($_GET['do']) && isset($_GET['id'])){
    $oid = intval($_GET['id']);
    $action = $_GET['do'];
    
    if($action == 'deliver'){
        mysqli_query($conn, "UPDATE `orders` SET `status` = 'delivered' WHERE `id` = $oid");
        header("Location: all_orders.php?view=delivered&success=1");
    } 
    elseif($action == 'cancel'){
        mysqli_query($conn, "UPDATE `orders` SET `status` = 'canceled' WHERE `id` = $oid");
        header("Location: all_orders.php?view=canceled&success=1");
    } 
    elseif($action == 'delete'){
        // প্রথমে ওই অর্ডারের আইটেমগুলো ডিলিট করতে হবে (Integrity রক্ষায়)
        mysqli_query($conn, "DELETE FROM `order_items` WHERE `order_id` = $oid");
        // তারপর মেইন অর্ডার ডিলিট
        mysqli_query($conn, "DELETE FROM `orders` WHERE `id` = $oid");
        header("Location: all_orders.php?success=deleted");
    }
    exit();
}

include 'header.php'; 
include 'sidebar.php'; 

$view = isset($_GET['view']) ? $_GET['view'] : 'all';
?>

<style>
    :root { --sidebar-width: 260px; --green: #10b981; --red: #ef4444; --primary: #3b82f6; --dark: #1e293b; }
    .content-wrapper { margin-left: var(--sidebar-width); padding: 100px 30px; background: #f8fafc; min-height: 100vh; font-family: 'Roboto', sans-serif; }
    
    .nav-tabs-custom { display: flex; gap: 10px; margin-bottom: 25px; overflow-x: auto; padding-bottom: 5px; }
    .nav-link-custom { padding: 10px 20px; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; text-decoration: none; color: #64748b; font-weight: 600; font-size: 13px; transition: 0.3s; white-space: nowrap; }
    .nav-link-custom.active { background: var(--green); color: #fff; border-color: var(--green); }
    
    .table-card { background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); overflow: hidden; border: 1px solid #eee; }
    .table thead th { background: #f8fafc; padding: 15px; font-size: 11px; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; }
    .table tbody td { padding: 15px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; font-size: 14px; }

    .status-badge { padding: 5px 12px; border-radius: 50px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
    .badge-pending { background: #fff7ed; color: #c2410c; }
    .badge-delivered { background: #dcfce7; color: #10b981; }
    .badge-canceled { background: #fee2e2; color: var(--red); }

    /* অ্যাকশন বাটন ডিজাইন */
    .action-btn { padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; transition: 0.3s; }
    .btn-deliver { background: #dcfce7; color: #15803d; margin-right: 5px; }
    .btn-deliver:hover { background: #15803d; color: #fff; }
    
    .btn-cancel { background: #fff1f2; color: #be123c; margin-right: 5px; }
    .btn-cancel:hover { background: #be123c; color: #fff; }
    
    .btn-view { background: #eff6ff; color: #2563eb; margin-right: 5px; }
    .btn-view:hover { background: #2563eb; color: #fff; }
    
    .btn-delete { background: #fff; color: #94a3b8; border: 1px solid #e2e8f0; }
    .btn-delete:hover { background: var(--red); color: #fff; border-color: var(--red); }

    @media (max-width: 992px) { .content-wrapper { margin-left: 0; padding: 80px 15px; } }
</style>

<div class="content-wrapper">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold m-0"><i class="fa-solid fa-cart-flatbed text-success me-2"></i> Order Management</h4>
        <?php if(isset($_GET['success'])): ?>
            <span class="badge bg-success py-2 px-3 rounded-pill shadow-sm">
                <?php echo ($_GET['success'] == 'deleted' ? 'Order deleted permanently!' : 'Action successful!'); ?>
            </span>
        <?php endif; ?>
    </div>

    <!-- ফিল্টার ট্যাব -->
    <div class="nav-tabs-custom">
        <a href="all_orders.php?view=all" class="nav-link-custom <?php echo ($view=='all'?'active':''); ?>">All Orders</a>
        <a href="all_orders.php?view=pending" class="nav-link-custom <?php echo ($view=='pending'?'active':''); ?>">Pending</a>
        <a href="all_orders.php?view=delivered" class="nav-link-custom <?php echo ($view=='delivered'?'active':''); ?>">Delivered</a>
        <a href="all_orders.php?view=canceled" class="nav-link-custom <?php echo ($view=='canceled'?'active':''); ?>">Canceled</a>
    </div>

    <div class="table-card">
        <div class="table-responsive">
            <table class="table mb-0">
                <thead>
                    <tr>
                        <th class="ps-4">ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th class="text-end pe-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php 
                    if($view == 'delivered') { $sql = "SELECT * FROM orders WHERE status='delivered'"; } 
                    elseif($view == 'canceled') { $sql = "SELECT * FROM orders WHERE status='canceled'"; } 
                    elseif($view == 'pending') { $sql = "SELECT * FROM orders WHERE status='pending' OR status=''"; } 
                    else { $sql = "SELECT * FROM orders"; }
                    
                    $sql .= " ORDER BY id DESC";
                    $res = mysqli_query($conn, $sql);
                    
                    if(mysqli_num_rows($res) > 0){
                        while($row = mysqli_fetch_assoc($res)){
                            $status = strtolower($row['status'] ?: 'pending');
                    ?>
                    <tr>
                        <td class="ps-4 fw-bold">#<?php echo $row['id']; ?></td>
                        <td>
                            <div class="fw-bold"><?php echo htmlspecialchars($row['customer_name']); ?></div>
                            <small class="text-muted"><?php echo $row['phone']; ?></small>
                        </td>
                        <td class="fw-bold text-dark">৳<?php echo number_format($row['total_amount']); ?></td>
                        <td>
                            <span class="status-badge <?php 
                                if($status == 'delivered') echo 'badge-delivered';
                                elseif($status == 'canceled') echo 'badge-canceled';
                                else echo 'badge-pending';
                            ?>">
                                <?php echo strtoupper($status); ?>
                            </span>
                        </td>
                        <td class="text-end pe-4">
                            <?php if($status == 'pending'): ?>
                                <a href="all_orders.php?id=<?php echo $row['id']; ?>&do=deliver" class="action-btn btn-deliver" onclick="return confirm('Deliver this order?')">Deliver</a>
                                <a href="all_orders.php?id=<?php echo $row['id']; ?>&do=cancel" class="action-btn btn-cancel" onclick="return confirm('Cancel this order?')">Cancel</a>
                            <?php endif; ?>

                            <!-- View Button -->
                            <a href="order_details.php?id=<?php echo $row['id']; ?>" class="action-btn btn-view" title="View Details">
                                <i class="fa-solid fa-eye"></i>
                            </a>

                            <!-- New Delete Button (Trash Icon) -->
                            <a href="all_orders.php?id=<?php echo $row['id']; ?>&do=delete" class="action-btn btn-delete" onclick="return confirm('WARNING: This will permanently delete the order! Are you sure?')" title="Delete Order">
                                <i class="fa-solid fa-trash"></i>
                            </a>
                        </td>
                    </tr>
                    <?php } 
                    } else { echo "<tr><td colspan='5' class='text-center py-5 text-muted'>No orders found.</td></tr>"; } ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
<?php ob_end_flush(); ?>