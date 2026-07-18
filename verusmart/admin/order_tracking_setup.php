<?php 
session_start();
include('../db.php'); 

// স্ট্যাটাস আপডেট লজিক
if(isset($_POST['update_status'])) {
    $oid = $_POST['order_id'];
    $new_status = $_POST['status'];
    mysqli_query($conn, "UPDATE orders SET status = '$new_status' WHERE id = '$oid'");
    echo "<script>alert('Order status updated!'); window.location='order_tracking_setup.php';</script>";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Order Management | Admin</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { margin: 0; font-family: 'Inter', sans-serif; background: #f4f7f6; }
        .main-wrapper { display: flex; }
        .content-body { margin-left: 260px; width: 100%; padding: 20px; margin-top: 70px; }
        .card { background: #fff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        table { width: 100%; border-collapse: collapse; }
        table th, table td { padding: 15px; text-align: left; border-bottom: 1px solid #f1f5f9; }
        table th { background: #f8fafc; color: #64748b; }
        select { padding: 8px; border-radius: 5px; border: 1px solid #ddd; }
        .btn-update { background: #10b981; color: #fff; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; }
    </style>
</head>
<body>

    <?php include('header.php'); ?>

    <div class="main-wrapper">
        <?php include('sidebar.php'); ?>

        <div class="content-body">
            <h2 style="color: #1e293b; margin-bottom: 25px;">Order Tracking & Management</h2>

            <div class="card">
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Phone</th>
                            <th>Amount</th>
                            <th>Current Status</th>
                            <th>Update Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php 
                        $res = mysqli_query($conn, "SELECT * FROM orders ORDER BY id DESC");
                        while($row = mysqli_fetch_assoc($res)) {
                            echo "<tr>
                                <td>#{$row['id']}</td>
                                <td>{$row['customer_name']}</td>
                                <td>{$row['phone']}</td>
                                <td>$".number_format($row['total_amount'], 2)."</td>
                                <td><b style='color:#017a0a; text-transform:uppercase;'>{$row['status']}</b></td>
                                <td>
                                    <form method='POST' style='display:flex; gap:10px;'>
                                        <input type='hidden' name='order_id' value='{$row['id']}'>
                                        <select name='status'>
                                            <option value='pending' ".($row['status'] == 'pending' ? 'selected' : '').">Pending</option>
                                            <option value='processing' ".($row['status'] == 'processing' ? 'selected' : '').">Processing</option>
                                            <option value='completed' ".($row['status'] == 'completed' ? 'selected' : '').">Completed</option>
                                            <option value='canceled' ".($row['status'] == 'canceled' ? 'selected' : '').">Canceled</option>
                                        </select>
                                        <button type='submit' name='update_status' class='btn-update'>Update</button>
                                    </form>
                                </td>
                            </tr>";
                        }
                        ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</body>
</html>