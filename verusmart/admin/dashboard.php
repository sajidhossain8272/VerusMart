<?php 
include '../db.php'; 

// --- Export Report Logic ---
if (isset($_GET['export']) && $_GET['export'] == 'true') {
    ob_end_clean(); // কোনো অতিরিক্ত আউটপুট থাকলে তা পরিষ্কার করার জন্য
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=orders_report_' . date('Y-m-d') . '.csv');
    $output = fopen('php://output', 'w');
    
    // CSV Header (কলামের নামসমূহ)
    fputcsv($output, array('Order ID', 'Customer Name', 'Status', 'Total Amount'));
    
    // Fetch all orders - (created_at কলামটি বাদ দেওয়া হয়েছে)
    $report_query = mysqli_query($conn, "SELECT id, customer_name, status, total_amount FROM orders ORDER BY id DESC");
    
    if ($report_query) {
        while ($row = mysqli_fetch_assoc($report_query)) {
            fputcsv($output, $row);
        }
    }
    fclose($output);
    exit();
}
// --- End Export Logic ---

include 'header.php'; 
include 'sidebar.php'; 

function getCount($conn, $table, $condition = "") {
    if (!$conn) return 0;
    $sql = "SELECT id FROM `$table` " . ($condition ? " WHERE $condition" : "");
    $result = mysqli_query($conn, $sql);
    return ($result) ? mysqli_num_rows($result) : 0;
}

$pending_orders = getCount($conn, 'orders', "status='pending'");
$process_orders = getCount($conn, 'orders', "status='completed' OR status='processing' OR status='delivered'");
$cancel_orders  = getCount($conn, 'orders', "status='canceled'");

$income_query = mysqli_query($conn, "SELECT SUM(total_amount) as total FROM orders WHERE status='completed' OR status='delivered'");
$income_data  = mysqli_fetch_assoc($income_query);
$today_income = $income_data['total'] ?? "0.00";

$recent_orders = mysqli_query($conn, "SELECT * FROM orders ORDER BY id DESC LIMIT 10");
?>

<style>
    .main-content { margin-left: 260px; padding: 100px 30px 30px; transition: 0.3s; }
    .card-grad { border: none; border-radius: 15px; color: #fff; padding: 25px; position: relative; overflow: hidden; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
    .card-grad i { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-size: 50px; opacity: 0.2; }
    .card-blue { background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%); }
    .card-green { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
    .card-yellow { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
    .card-red { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }

    .table-container { background: #fff; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.05); padding: 0; overflow: hidden; }
    .status-pill { padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: 500; }
    .status-pending { background: #fff7ed; color: #c2410c; }
    .status-completed { background: #f0fdf4; color: #15803d; }
    .status-canceled { background: #fef2f2; color: #991b1b; }

    .admin-avater { width: 30px; height: 30px; background: #10b981; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }

    @media (max-width: 992px) { .main-content { margin-left: 0; } }
</style>

<main class="main-content">
    <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h3 class="fw-bold mb-1">Overview</h3>
                <p class="text-muted small">Welcome back, here's what's happening today.</p>
            </div>
            <!-- Export Button -->
            <a href="dashboard.php?export=true" class="btn btn-success btn-sm px-4 rounded-pill shadow-sm text-decoration-none">
                <i class="fas fa-download me-2"></i> Export Report
            </a>
        </div>

        <div class="row g-4 mb-5">
            <div class="col-md-3">
                <div class="card-grad card-blue">
                    <p class="mb-1 opacity-75">Total Orders</p>
                    <h2 class="fw-bold"><?php echo $pending_orders + $process_orders; ?></h2>
                    <small><i class="fas fa-arrow-up me-1"></i> 12% increase</small>
                    <i class="fas fa-shopping-cart"></i>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card-grad card-green">
                    <p class="mb-1 opacity-75">Total Sales</p>
                    <!-- Currency Changed to ৳ (Taka) -->
                    <h2 class="fw-bold">৳ <?php echo number_format($today_income, 2); ?></h2>
                    <small><i class="fas fa-arrow-up me-1"></i> 8% growth</small>
                    <i class="fas fa-wallet"></i>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card-grad card-yellow">
                    <p class="mb-1 opacity-75">Active Process</p>
                    <h2 class="fw-bold"><?php echo $process_orders; ?></h2>
                    <small><i class="fas fa-check-circle me-1"></i> Running now</small>
                    <i class="fas fa-sync"></i>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card-grad card-red">
                    <p class="mb-1 opacity-75">Canceled</p>
                    <h2 class="fw-bold"><?php echo $cancel_orders; ?></h2>
                    <small><i class="fas fa-info-circle me-1"></i> Review needed</small>
                    <i class="fas fa-times-circle"></i>
                </div>
            </div>
        </div>

        <div class="table-container">
            <div class="p-4 d-flex justify-content-between align-items-center border-bottom">
                <h5 class="fw-bold mb-0">Recent Orders</h5>
                <a href="all_orders.php" class="btn btn-light btn-sm border px-3">View All</a>
            </div>
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th class="ps-4">Order ID</th>
                            <th>Customer</th>
                            <th>Status</th>
                            <th>Amount</th>
                            <th class="text-end pe-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php while($row = mysqli_fetch_assoc($recent_orders)): ?>
                        <tr>
                            <td class="ps-4 fw-bold">#SB-<?php echo $row['id']; ?></td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="admin-avater me-2"><?php echo strtoupper(substr($row['customer_name'],0,1)); ?></div>
                                    <?php echo htmlspecialchars($row['customer_name'] ?? ''); ?>
                                </div>
                            </td>
                            <td>
                                <?php 
                                    $status_class = 'status-pending';
                                    if($row['status'] == 'completed' || $row['status'] == 'delivered') $status_class = 'status-completed';
                                    if($row['status'] == 'canceled') $status_class = 'status-canceled';
                                ?>
                                <span class="status-pill <?php echo $status_class; ?>">
                                    <?php echo ucfirst($row['status']); ?>
                                </span>
                            </td>
                            <!-- Currency Changed to ৳ (Taka) -->
                            <td class="fw-bold">৳ <?php echo number_format($row['total_amount'], 2); ?></td>
                            <td class="text-end pe-4">
                                <a href="order_details.php?id=<?php echo $row['id']; ?>" class="btn btn-sm btn-outline-secondary px-3">Details</a>
                            </td>
                        </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</main>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>