<?php 
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

// স্ট্যাটাস আপডেট করার লজিক
if(isset($_GET['status_id']) && isset($_GET['new_status'])){
    $s_id = (int)$_GET['status_id'];
    $n_status = mysqli_real_escape_string($conn, $_GET['new_status']);
    mysqli_query($conn, "UPDATE phone_sell_requests SET status='$n_status' WHERE id=$s_id");
    echo "<script>window.location='phone_requests.php';</script>";
}

// ডিলিট করার লজিক
if(isset($_GET['delete'])){
    $d_id = (int)$_GET['delete'];
    mysqli_query($conn, "DELETE FROM phone_sell_requests WHERE id=$d_id");
    echo "<script>window.location='phone_requests.php';</script>";
}
?>

<style>
    .content-wrapper { margin-left: 260px; padding: 100px 25px 30px; background: #f8fafb; min-height: 100vh; }
    .card { background: #fff; border-radius: 12px; padding: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #f1f5f9; padding: 12px; text-align: left; color: #64748b; font-size: 13px; }
    td { padding: 15px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .badge { padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
    .badge-pending { background: #fef3c7; color: #92400e; }
    .badge-approved { background: #dcfce7; color: #15803d; }
    .badge-rejected { background: #fee2e2; color: #b91c1c; }
    .img-thumb { width: 50px; height: 50px; object-fit: cover; border-radius: 5px; cursor: pointer; }
    .action-btn { padding: 5px 8px; border-radius: 5px; text-decoration: none; font-size: 12px; color: white; margin-right: 5px; }
</style>

<div class="content-wrapper">
    <div class="card">
        <h3 style="margin:0; color:#1e293b;"><i class="fa-solid fa-mobile-screen"></i> Phone Sell Requests</h3>
        
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Device Info</th>
                    <th>Price</th>
                    <th>Condition</th>
                    <th>Status</th>
                    <th>Images</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php 
                $query = mysqli_query($conn, "SELECT * FROM phone_sell_requests ORDER BY id DESC");
                while($row = mysqli_fetch_assoc($query)){
                ?>
                <tr>
                    <td>#SR-<?php echo $row['id']; ?></td>
                    <td>
                        <strong><?php echo $row['full_name']; ?></strong><br>
                        <small><?php echo $row['phone_number']; ?></small>
                    </td>
                    <td>
                        <span style="color:#0f172a; font-weight:600;"><?php echo $row['brand']; ?></span><br>
                        <small><?php echo $row['model']; ?></small>
                    </td>
                    <td><strong>৳<?php echo number_format($row['expected_price']); ?></strong></td>
                    <td><?php echo $row['phone_condition']; ?></td>
                    <td>
                        <span class="badge badge-<?php echo $row['status']; ?>"><?php echo $row['status']; ?></span>
                    </td>
                    <td>
                        <?php if($row['image_1']){ ?>
                            <img src="uploads/sell_requests/<?php echo $row['image_1']; ?>" class="img-thumb" onclick="window.open(this.src)">
                        <?php } ?>
                    </td>
<td>
    <div style="display:flex; gap:5px;">
        <!-- View Details Button (Eye Icon) -->
        <a href="phone_requests_details.php?id=<?php echo $row['id']; ?>" class="action-btn" style="background:#0ea5e9;" title="View Details"><i class="fa fa-eye"></i></a>
        
        <a href="?status_id=<?php echo $row['id']; ?>&new_status=approved" class="action-btn" style="background:#15803d;" title="Approve"><i class="fa fa-check"></i></a>
        <a href="?status_id=<?php echo $row['id']; ?>&new_status=rejected" class="action-btn" style="background:#ef4444;" title="Reject"><i class="fa fa-times"></i></a>
        <a href="?delete=<?php echo $row['id']; ?>" class="action-btn" style="background:#64748b;" onclick="return confirm('Delete this request?')" title="Delete"><i class="fa fa-trash"></i></a>
    </div>
</td>
                </tr>
                <?php } ?>
            </tbody>
        </table>
        
        <?php if(mysqli_num_rows($query) == 0){ echo "<p style='text-align:center; color:gray; padding:20px;'>No requests found.</p>"; } ?>
    </div>
</div>

</body>
</html>