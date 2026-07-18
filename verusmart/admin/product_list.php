<?php 
// ১. ডাটাবেজ কানেকশন
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

$product_path = "uploads/products/";

// --- ডিলিট লজিক ---
if(isset($_GET['delete'])){
    $id = (int)$_GET['delete'];
    $img_res = mysqli_query($conn, "SELECT image FROM products WHERE id=$id");
    $img_data = mysqli_fetch_assoc($img_res);
    if($img_data && file_exists($product_path . $img_data['image'])) { 
        unlink($product_path . $img_data['image']); 
    }
    mysqli_query($conn, "DELETE FROM products WHERE id=$id");
    echo "<script>window.location='product_list.php';</script>";
}

// --- হাইড/অ্যাক্টিভ লজিক ---
if(isset($_GET['toggle_status'])){
    $id = (int)$_GET['id'];
    $new_status = ($_GET['toggle_status'] == 'active') ? 'hidden' : 'active';
    mysqli_query($conn, "UPDATE products SET status='$new_status' WHERE id=$id");
    echo "<script>window.location='product_list.php';</script>";
}

// প্রোডাক্ট লিস্ট কুয়েরি (ক্যাটাগরি নাম সহ)
$query = "SELECT p.*, c.name as cat_name FROM products p 
          LEFT JOIN categories c ON p.category_id = c.id 
          ORDER BY p.id DESC";
$result = mysqli_query($conn, $query);
?>

<style>
    :root {
        --sidebar-width: 260px;
        --bg-light: #f4f7f6;
        --primary-blue: #3b82f6;
    }

    body { background-color: var(--bg-light); font-family: 'Segoe UI', sans-serif; margin: 0; }

    /* মেইন এরিয়া - রেসপনসিভ ও ফাঁকা জায়গা পূরণ */
    .content-wrapper { 
        margin-left: var(--sidebar-width); 
        padding: 30px; 
        transition: 0.3s; 
        margin-top: 65px;
        min-height: 100vh;
        width: calc(100% - var(--sidebar-width)); 
        box-sizing: border-box;
    }

    @media (max-width: 992px) {
        .content-wrapper { margin-left: 0; width: 100%; padding: 20px; }
    }

    /* ৩ডি কার্ড ডিজাইন */
    .table-card { 
        background: #fff; 
        border-radius: 15px; 
        box-shadow: 0 10px 30px rgba(0,0,0,0.05); 
        border: 1px solid rgba(0,0,0,0.02);
        overflow: hidden;
    }

    .card-header {
        padding: 20px 25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        border-bottom: 1px solid #f1f1f1;
    }
    .card-header h4 { margin: 0; font-size: 20px; font-weight: 700; color: #334155; }
    .btn-add { background: #15803d; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: bold; transition: 0.3s; }
    .btn-add:hover { background: #166534; transform: translateY(-2px); }

    /* টেবিল ডিজাইন */
    .table-responsive { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f8fafc; color: #64748b; font-size: 12px; text-transform: uppercase; text-align: left; padding: 15px 20px; border-bottom: 2px solid #f1f5f9; letter-spacing: 0.5px; }
    td { padding: 15px 20px; font-size: 14px; color: #475569; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    tr:hover { background-color: #fcfdfe; }

    .p-img { width: 50px; height: 50px; border-radius: 8px; object-fit: contain; background: #f8fafc; border: 1px solid #eee; }
    
    /* স্ট্যাটাস ও স্টক ব্যাজ */
    .badge { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; display: inline-block; }
    .status-active { background: #dcfce7; color: #15803d; }
    .status-hidden { background: #fee2e2; color: #b91c1c; }
    .stock-tag { color: #3b82f6; font-weight: 800; }

    /* অ্যাকশন আইকন বাটন */
    .action-btns { display: flex; gap: 10px; }
    .action-btn { 
        width: 35px; height: 35px; border-radius: 8px; display: flex; align-items: center; justify-content: center; 
        text-decoration: none; font-size: 14px; transition: 0.3s; border: 1px solid #eee;
    }
    .btn-edit { color: #3b82f6; background: #eff6ff; }
    .btn-edit:hover { background: #3b82f6; color: #fff; }
    .btn-hide { color: #64748b; background: #f1f5f9; }
    .btn-hide:hover { background: #64748b; color: #fff; }
    .btn-delete { color: #ef4444; background: #fef2f2; }
    .btn-delete:hover { background: #ef4444; color: #fff; }
</style>

<div class="content-wrapper">
    <!-- পেজ হেডার -->
    <div style="margin-bottom: 25px;">
        <h2 style="margin: 0; font-weight: 800; color: #1e293b;">Product Inventory</h2>
        <p style="color: #94a3b8; font-size: 13px; margin: 5px 0 0;">Manage your store products, pricing and stock levels.</p>
    </div>

    <div class="table-card">
        <div class="card-header">
            <h4>All Products (<?php echo mysqli_num_rows($result); ?>)</h4>
            <a href="add_product.php" class="btn-add"><i class="fa fa-plus"></i> Add New Product</a>
        </div>

        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Product Details</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if(mysqli_num_rows($result) > 0): ?>
                        <?php while($row = mysqli_fetch_assoc($result)): ?>
                        <tr>
                            <td>
                                <img src="<?php echo $product_path . $row['image']; ?>" 
                                     class="p-img" 
                                     onerror="this.onerror=null; this.src='https://placehold.jp/50x50.png?text=No+Img';">
                            </td>
                            <td>
                                <div style="font-weight: 700; color: #1e293b;"><?php echo htmlspecialchars($row['name']); ?></div>
                                <div style="font-size: 11px; color: #94a3b8;">ID: #<?php echo $row['id']; ?></div>
                            </td>
                            <td><span style="font-size: 12px; font-weight: 600; color: #64748b;"><?php echo htmlspecialchars($row['cat_name'] ?? 'Uncategorized'); ?></span></td>
                            <td>
                                <div style="font-weight: 800; color: #0f172a;">$<?php echo number_format($row['price'], 2); ?></div>
                                <?php if($row['old_price'] > 0): ?>
                                    <div style="font-size: 11px; color: #94a3b8; text-decoration: line-through;">$<?php echo $row['old_price']; ?></div>
                                <?php endif; ?>
                            </td>
                            <td>
                                <span class="stock-tag"><?php echo $row['stock']; ?></span> <small style="color: #94a3b8;">pcs</small>
                            </td>
                            <td>
                                <span class="badge <?php echo ($row['status'] == 'active') ? 'status-active' : 'status-hidden'; ?>">
                                    <?php echo ucfirst($row['status']); ?>
                                </span>
                            </td>
                            <td>
                                <div class="action-btns">
                                    <!-- হাইড/শো বাটন -->
                                    <a href="?toggle_status=<?php echo $row['status']; ?>&id=<?php echo $row['id']; ?>" 
                                       class="action-btn btn-hide" title="Hide/Show Product">
                                        <i class="fa <?php echo ($row['status'] == 'active') ? 'fa-eye' : 'fa-eye-slash'; ?>"></i>
                                    </a>
                                    
                                    <!-- এডিট বাটন -->
                                    <a href="edit_product.php?id=<?php echo $row['id']; ?>" class="action-btn btn-edit" title="Edit">
                                        <i class="fa fa-pen"></i>
                                    </a>
                                    
                                    <!-- ডিলিট বাটন -->
                                    <a href="?delete=<?php echo $row['id']; ?>" 
                                       class="action-btn btn-delete" 
                                       onclick="return confirm('Are you sure you want to delete this product?')" 
                                       title="Delete">
                                        <i class="fa fa-trash"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr><td colspan="7" align="center" style="padding: 50px; color: #94a3b8;">No products found in the database.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
</body>
</html>