<?php 
// ১. ডাটাবেজ কানেকশন এবং হেডার/সাইডবার ইনক্লুড
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

// তারিখ ফিল্টারিং লজিক
$start_date = isset($_GET['start_date']) ? $_GET['start_date'] : date('Y-m-01'); // মাসের প্রথম দিন
$end_date = isset($_GET['end_date']) ? $_GET['end_date'] : date('Y-m-d'); // আজকের দিন

// পরিসংখ্যন কুয়েরি (তারিখ অনুযায়ী)
$stats_query = mysqli_query($conn, "SELECT 
    COUNT(id) as total_orders, 
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_order_value
    FROM orders 
    WHERE order_date BETWEEN '$start_date' AND '$end_date' AND status='delivered'");
$stats = mysqli_fetch_assoc($stats_query);

$total_orders = $stats['total_orders'] ?? 0;
$total_revenue = $stats['total_revenue'] ?? 0;
$avg_order = $stats['avg_order_value'] ?? 0;
?>

<style>
    :root { --primary: #15803d; --bg: #f8fafc; --text: #1e293b; --card-bg: #ffffff; }

    .content-wrapper { 
        margin-left: 260px; 
        padding: 90px 30px 40px; 
        background: var(--bg); 
        min-height: 100vh; 
        transition: 0.3s; 
    }

    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; flex-wrap: wrap; gap: 15px; }
    .page-title { font-size: 22px; font-weight: 800; color: var(--text); display: flex; align-items: center; gap: 10px; margin: 0; }

    .card { background: var(--card-bg); border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); padding: 25px; border: none; }

    /* ফিল্টার সেকশন */
    .filter-card { margin-bottom: 25px; }
    .filter-form { display: flex; gap: 15px; align-items: end; flex-wrap: wrap; }
    .form-group { flex: 1; min-width: 200px; }
    label { font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 8px; display: block; }
    input { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px; outline: none; font-size: 14px; }
    .btn-filter { background: var(--primary); color: white; border: none; padding: 11px 25px; border-radius: 10px; cursor: pointer; font-weight: 700; }

    /* ফুল পেজ লেআউট গ্রিড */
    .report-grid {
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: 25px;
    }

    /* পরিসংখ্যান কার্ড */
    .stat-card {
        padding: 20px; background: #fff; border-radius: 15px; margin-bottom: 20px;
        display: flex; align-items: center; gap: 15px; border: 1px solid #f1f5f9;
    }
    .stat-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
    .icon-rev { background: #dcfce7; color: #15803d; }
    .icon-ord { background: #e0f2fe; color: #0369a1; }
    .icon-avg { background: #fef3c7; color: #92400e; }
    
    .stat-info h5 { margin: 0; font-size: 13px; color: #64748b; }
    .stat-info span { font-size: 20px; font-weight: 800; color: var(--text); }

    /* টেবিল ডিজাইন */
    .table-container { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 700px; }
    th { text-align: left; padding: 15px; background: #f8fafc; color: #475569; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; }
    td { padding: 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; vertical-align: middle; }
    
    .status-delivered { background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }

    /* রেসপনসিভ */
    @media (max-width: 1200px) { .report-grid { grid-template-columns: 1fr; } }
    @media (max-width: 992px) { .content-wrapper { margin-left: 0; padding: 80px 15px; } }
</style>

<div class="content-wrapper">
    <!-- পেজ হেডার এবং ফিল্টার -->
    <div class="page-header">
        <h1 class="page-title"><i class="fa-solid fa-chart-line"></i> Sales Report</h1>
        <button onclick="window.print()" class="btn-filter" style="background:#64748b;"><i class="fa-solid fa-print"></i> Print Report</button>
    </div>

    <div class="card filter-card">
        <form action="" method="GET" class="filter-form">
            <div class="form-group">
                <label>Start Date</label>
                <input type="date" name="start_date" value="<?php echo $start_date; ?>">
            </div>
            <div class="form-group">
                <label>End Date</label>
                <input type="date" name="end_date" value="<?php echo $end_date; ?>">
            </div>
            <button type="submit" class="btn-filter">Generate Report</button>
        </form>
    </div>

    <div class="report-grid">
        <!-- বামদিকের রিপোর্ট টেবিল -->
        <div class="card">
            <h3 style="margin-top:0; margin-bottom:20px; font-size:18px;">Delivered Orders Details</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total Sale</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php 
                        $sales_query = mysqli_query($conn, "SELECT * FROM orders 
                            WHERE order_date BETWEEN '$start_date' AND '$end_date' 
                            AND status='delivered' 
                            ORDER BY id DESC");
                        
                        if(mysqli_num_rows($sales_query) > 0){
                            while($row = mysqli_fetch_assoc($sales_query)){
                        ?>
                        <tr>
                            <td><strong>#<?php echo $row['id']; ?></strong></td>
                            <td><?php echo date('d M, Y', strtotime($row['order_date'])); ?></td>
                            <td><?php echo htmlspecialchars($row['customer_name'] ?? 'Guest'); ?></td>
                            <td><?php echo $row['total_items'] ?? '1'; ?> Items</td>
                            <td style="font-weight:700;">$<?php echo number_format($row['total_amount'], 2); ?></td>
                            <td><span class="status-delivered">DELIVERED</span></td>
                        </tr>
                        <?php } 
                        } else { echo "<tr><td colspan='6' style='text-align:center; padding:40px; color:gray;'>No sales found for this period.</td></tr>"; } ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ডানদিকের সামারি সেকশন (ফাঁকা জায়গা ভরাট করার জন্য) -->
        <div>
            <div class="card" style="margin-bottom: 25px;">
                <h3 style="margin-top:0; margin-bottom:20px; font-size:18px;">Sales Summary</h3>
                
                <div class="stat-card">
                    <div class="stat-icon icon-rev"><i class="fa-solid fa-dollar-sign"></i></div>
                    <div class="stat-info">
                        <h5>Total Revenue</h5>
                        <span>$<?php echo number_format($total_revenue, 2); ?></span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon icon-ord"><i class="fa-solid fa-cart-shopping"></i></div>
                    <div class="stat-info">
                        <h5>Total Orders</h5>
                        <span><?php echo $total_orders; ?></span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon icon-avg"><i class="fa-solid fa-chart-pie"></i></div>
                    <div class="stat-info">
                        <h5>Avg. Order Value</h5>
                        <span>$<?php echo number_format($avg_order, 2); ?></span>
                    </div>
                </div>
            </div>

            <div class="card" style="background: var(--primary); color: white;">
                <h4 style="margin:0 0 10px;">Quick Insight</h4>
                <p style="font-size: 13px; opacity: 0.9; line-height: 1.6;">
                    The report shows sales data from <strong><?php echo date('d M', strtotime($start_date)); ?></strong> to <strong><?php echo date('d M', strtotime($end_date)); ?></strong>. 
                    Only delivered orders are counted in the revenue.
                </p>
            </div>
        </div>
    </div>
</div>

</body>
</html>