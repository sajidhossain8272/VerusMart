<?php 
// ১. কানেকশন ও হেডার-সাইডবার ইনক্লুড
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

// ২. স্ট্যাটাস আপডেট লজিক
if(isset($_POST['update_status'])){
    $request_id = (int)$_POST['request_id'];
    $new_status = mysqli_real_escape_string($conn, $_POST['status']);
    
    $update_sql = "UPDATE refund_requests SET status='$new_status' WHERE id=$request_id";
    if(mysqli_query($conn, $update_sql)){
        echo "<script>alert('Status Updated Successfully!'); window.location='refund_requests.php';</script>";
    }
}
?>

<style>
    .content-wrapper { 
        margin-left: 260px; 
        padding: 90px 25px 30px; 
        background: #f8fafb; 
        min-height: 100vh; 
        transition: 0.3s; 
    }
    .page-header { display: flex; align-items: center; gap: 10px; margin-bottom: 25px; font-size: 18px; font-weight: 700; color: #1e293b; }
    
    .card { background: #fff; border-radius: 12px; padding: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: none; }
    
    /* টেবিল ডিজাইন */
    .table-container { overflow-x: auto; width: 100%; }
    table { width: 100%; border-collapse: collapse; min-width: 800px; }
    th { background: #f8f9fa; padding: 15px 12px; text-align: left; font-size: 12px; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #f1f5f9; }
    td { padding: 15px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; vertical-align: middle; }

    /* স্ট্যাটাস ব্যাজ */
    .badge { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .badge-pending { background: #fef3c7; color: #92400e; }
    .badge-approved { background: #dcfce7; color: #15803d; }
    .badge-rejected { background: #fee2e2; color: #b91c1c; }

    /* স্ট্যাটাস ড্রপডাউন */
    .status-select { padding: 6px; border-radius: 6px; border: 1px solid #e2e8f0; outline: none; font-size: 13px; }
    .btn-update { background: #15803d; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; margin-left: 5px; }

    @media (max-width: 992px) { 
        .content-wrapper { margin-left: 0; padding: 80px 15px 30px; } 
    }
</style>

<div class="content-wrapper">
    <div class="page-header">
        <i class="fa-solid fa-hand-holding-dollar"></i> 
        <span>Refund Requests Management</span>
    </div>

    <!-- রিফান্ড রিকোয়েস্ট টেবিল -->
    <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h4 style="margin:0; color:#1e293b;">Recent Requests</h4>
            <div style="font-size:12px; color:gray;">
                Total: <?php echo mysqli_num_rows(mysqli_query($conn, "SELECT id FROM refund_requests")); ?>
            </div>
        </div>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th style="text-align:center;">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php 
                    $query = mysqli_query($conn, "SELECT * FROM refund_requests ORDER BY id DESC");
                    if(mysqli_num_rows($query) > 0){
                        while($row = mysqli_fetch_assoc($query)){
                            $status_class = "badge-" . $row['status'];
                    ?>
                    <tr>
                        <td><?php echo date('d M, Y', strtotime($row['created_at'])); ?></td>
                        <td><strong>#<?php echo $row['order_id']; ?></strong></td>
                        <td><?php echo htmlspecialchars($row['customer_name']); ?></td>
                        <td style="font-weight:700; color:#111;">$<?php echo number_format($row['amount'], 2); ?></td>
                        <td style="max-width:200px; color:#64748b; font-size:13px;"><?php echo htmlspecialchars($row['reason']); ?></td>
                        <td>
                            <span class="badge <?php echo $status_class; ?>"><?php echo $row['status']; ?></span>
                        </td>
                        <td style="text-align:center;">
                            <form action="" method="POST" style="display:flex; align-items:center; justify-content:center;">
                                <input type="hidden" name="request_id" value="<?php echo $row['id']; ?>">
                                <select name="status" class="status-select">
                                    <option value="pending" <?php if($row['status']=='pending') echo 'selected'; ?>>Pending</option>
                                    <option value="approved" <?php if($row['status']=='approved') echo 'selected'; ?>>Approve</option>
                                    <option value="rejected" <?php if($row['status']=='rejected') echo 'selected'; ?>>Reject</option>
                                </select>
                                <button type="submit" name="update_status" class="btn-update">Update</button>
                            </form>
                        </td>
                    </tr>
                    <?php } 
                    } else {
                        echo "<tr><td colspan='7' style='text-align:center; padding:40px; color:gray;'>No refund requests found.</td></tr>";
                    } ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

</body>
</html>