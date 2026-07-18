<?php 
// ১. ডাটাবেজ কানেকশন এবং হেডার/সাইডবার ইনক্লুড
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

// ক্যাটাগরি ফিল্টারিং লজিক
$cat_id = isset($_GET['category']) ? $_GET['category'] : 'all';

// পরিসংখ্যান কুয়েরি
$low_stock_limit = 5; // ৫ এর নিচে থাকলে লো স্টক দেখাবে
$stats_res = mysqli_query($conn, "SELECT 
    COUNT(id) as total_products,
    SUM(CASE WHEN stock <= 0 THEN 1 ELSE 0 END) as out_of_stock,
    SUM(CASE WHEN stock > 0 AND stock <= $low_stock_limit THEN 1 ELSE 0 END) as low_stock,
    SUM(stock * price) as total_inventory_value
    FROM products WHERE status='active'");
$stats = mysqli_fetch_assoc($stats_res);

$total_products = $stats['total_products'] ?? 0;
$out_of_stock = $stats['out_of_stock'] ?? 0;
$low_stock = $stats['low_stock'] ?? 0;
$inventory_value = $stats['total_inventory_value'] ?? 0;
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
    select { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px; outline: none; font-size: 14px; }
    .btn-filter { background: var(--primary); color: white; border: none; padding: 11px 25px; border-radius: 10px; cursor: pointer; font-weight: 700; }

    /* ফুল পেজ লেআউট গ্রিড */
    .report-grid {
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: 25px;
    }

    /* পরিসংখ্যান কার্ড */
    .stat-card {
        padding: 18px; background: #fff; border-radius: 12px; margin-bottom: 15px;
        display: flex; align-items: center; gap: 15px; border: 1px solid #f1f5f9;
    }
    .stat-icon { width: 45px; height: 45px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
    .icon-total { background: #e0f2fe; color: #0369a1; }
    .icon-out { background: #fee2e2; color: #b91c1c; }
    .icon-low { background: #fef3c7; color: #92400e; }
    .icon-val { background: #dcfce7; color: #15803d; }
    
    .stat-info h5 { margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; }
    .stat-info span { font-size: 18px; font-weight: 800; color: var(--text); }

    /* টেবিল ডিজাইন */
    .table-container { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; min-width: 700px; }
    th { text-align: left; padding: 15px; background: #f8fafc; color: #475569; font-size: 12px; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; }
    td { padding: 12px 15px; border-bottom: 1px solid #f1f5f9; font-size: 14px; vertical-align: middle; }
    
    .stock-badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
    .bg-success { background: #dcfce7; color: #15803d; }
    .bg-warning { background: #fef3c7; color: #92400e; }
    .bg-danger { background: #fee2e2; color: #b91c1c; }

    /* রেসপনসিভ */
    @media (max-width: 1200px) { .report-grid { grid-template-columns: 1fr; } }
    @media (max-width: 992px) { .content-wrapper { margin-left: 0; padding: 80px 15px; } }
</style>

<div class="content-wrapper">
    <div class="page-header">
        <h1 class="page-title"><i class="fa-solid fa-boxes-stacked"></i> Inventory Stock Report</h1>
        <button onclick="window.print()" class="btn-filter" style="background:#64748b;"><i class="fa-solid fa-print"></i> Download/Print PDF</button>
    </div>

    <!-- ফিল্টার সেকশন -->
    <div class="card filter-card">
        <form action="" method="GET" class="filter-form">
            <div class="form-group">
                <label>Filter by Category</label>
                <select name="category">
                    <option value="all">All Categories</option>
                    <?php 
                    $cat_list = mysqli_query($conn, "SELECT id, name FROM categories WHERE status='active'");
                    while($c = mysqli_fetch_assoc($cat_list)){
                        $selected = ($cat_id == $c['id']) ? 'selected' : '';
                        echo "<option value='".$c['id']."' $selected>".$c['name']."</option>";
                    }
                    ?>
                </select>
            </div>
            <button type="submit" class="btn-filter">Filter Report</button>
        </form>
    </div>

    <div class="report-grid">
        <!-- বামদিক: স্টক টেবিল -->
        <div class="card">
            <h3 style="margin-top:0; margin-bottom:20px; font-size:18px;">Product Stock Inventory</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Current Stock</th>
                            <th>Price</th>
                            <th>Stock Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php 
                        $sql = "SELECT p.*, c.name as cat_name FROM products p 
                                LEFT JOIN categories c ON p.category_id = c.id 
                                WHERE p.status='active'";
                        if($cat_id != 'all'){ $sql .= " AND p.category_id = '$cat_id'"; }
                        $sql .= " ORDER BY p.stock ASC"; // কম স্টক গুলো আগে দেখাবে

                        $products = mysqli_query($conn, $sql);
                        if(mysqli_num_rows($products) > 0){
                            while($p = mysqli_fetch_assoc($products)){
                                // স্ট্যাটাস নির্ধারণ
                                if($p['stock'] <= 0){
                                    $st_label = "OUT OF STOCK"; $st_class = "bg-danger";
                                } elseif($p['stock'] <= $low_stock_limit) {
                                    $st_label = "LOW STOCK"; $st_class = "bg-warning";
                                } else {
                                    $st_label = "IN STOCK"; $st_class = "bg-success";
                                }
                        ?>
                        <tr>
                            <td>
                                <img src="uploads/products/<?php echo $p['image']; ?>" 
                                     onerror="this.src='https://placehold.jp/40x40.png?text=Product';"
                                     style="width:40px; height:40px; border-radius:8px; object-fit:contain;">
                            </td>
                            <td><strong><?php echo htmlspecialchars($p['name']); ?></strong></td>
                            <td><?php echo htmlspecialchars($p['cat_name'] ?? 'General'); ?></td>
                            <td><?php echo $p['stock']; ?> <?php echo $p['unit'] ?? 'pcs'; ?></td>
                            <td>$<?php echo number_format($p['price'], 2); ?></td>
                            <td><span class="stock-badge <?php echo $st_class; ?>"><?php echo $st_label; ?></span></td>
                        </tr>
                        <?php } 
                        } else { echo "<tr><td colspan='6' style='text-align:center; padding:40px; color:gray;'>No products found.</td></tr>"; } ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- ডানদিক: স্টক সামারি (ফাঁকা জায়গা ভরাট করার জন্য) -->
        <div>
            <div class="card" style="margin-bottom: 25px;">
                <h3 style="margin-top:0; margin-bottom:20px; font-size:18px;">Inventory Summary</h3>
                
                <div class="stat-card">
                    <div class="stat-icon icon-total"><i class="fa-solid fa-list-check"></i></div>
                    <div class="stat-info">
                        <h5>Total Products</h5>
                        <span><?php echo $total_products; ?> Items</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon icon-out"><i class="fa-solid fa-circle-xmark"></i></div>
                    <div class="stat-info">
                        <h5>Out of Stock</h5>
                        <span><?php echo $out_of_stock; ?> Items</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon icon-low"><i class="fa-solid fa-triangle-exclamation"></i></div>
                    <div class="stat-info">
                        <h5>Low Stock Alert</h5>
                        <span><?php echo $low_stock; ?> Items</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon icon-val"><i class="fa-solid fa-vault"></i></div>
                    <div class="stat-info">
                        <h5>Inventory Value</h5>
                        <span>$<?php echo number_format($inventory_value, 2); ?></span>
                    </div>
                </div>
            </div>

            <div class="card" style="background: #1e293b; color: white; padding: 20px;">
                <h4 style="margin:0 0 10px; font-size: 16px;"><i class="fa-solid fa-lightbulb" style="color:#facc15;"></i> Stock Advice</h4>
                <p style="font-size: 12px; opacity: 0.8; line-height: 1.6; margin: 0;">
                    Currently, you have <strong><?php echo $low_stock; ?></strong> items running low. It is recommended to restock these items soon to avoid losing potential customers.
                </p>
            </div>
        </div>
    </div>
</div>

</body>
</html>