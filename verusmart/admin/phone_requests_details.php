<?php 
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

// আইডি অনুযায়ী ডাটা নিয়ে আসা
if(isset($_GET['id'])){
    $id = (int)$_GET['id'];
    $query = mysqli_query($conn, "SELECT * FROM phone_sell_requests WHERE id=$id");
    $data = mysqli_fetch_assoc($query);
    
    if(!$data){
        echo "<script>alert('Invalid Request!'); window.location='phone_requests.php';</script>";
        exit;
    }
} else {
    echo "<script>window.location='phone_requests.php';</script>";
    exit;
}
?>

<style>
    .content-wrapper { margin-left: 260px; padding: 100px 25px 30px; background: #f8fafb; min-height: 100vh; }
    .back-btn { text-decoration: none; color: #64748b; font-weight: 600; font-size: 14px; margin-bottom: 20px; display: inline-block; }
    .details-card { background: #fff; border-radius: 15px; padding: 35px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
    
    .section-title { font-size: 14px; font-weight: 800; color: #15803d; text-transform: uppercase; margin: 30px 0 15px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; }
    
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 25px; }
    .info-item { margin-bottom: 10px; }
    .info-item label { display: block; font-size: 12px; color: #94a3b8; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
    .info-item p { font-size: 16px; color: #1e293b; font-weight: 600; margin: 0; }

    .image-gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px; }
    .gallery-img { width: 100%; height: 250px; object-fit: cover; border-radius: 12px; border: 1px solid #eee; cursor: pointer; transition: 0.3s; }
    .gallery-img:hover { transform: scale(1.02); }

    .status-badge { padding: 6px 15px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
    .badge-pending { background: #fef3c7; color: #92400e; }
    .badge-approved { background: #dcfce7; color: #15803d; }
    .badge-rejected { background: #fee2e2; color: #b91c1c; }

    .issues-box { background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; color: #475569; line-height: 1.6; }
</style>

<div class="content-wrapper">
    <a href="phone_requests.php" class="back-btn"><i class="fa fa-arrow-left"></i> Back to List</a>
    
    <div class="details-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <h2 style="margin:0; font-size:24px; color:#1e293b;">Request ID: #SR-<?php echo $data['id']; ?></h2>
            <span class="status-badge badge-<?php echo $data['status']; ?>"><?php echo $data['status']; ?></span>
        </div>

        <!-- Customer Info -->
        <div class="section-title">Customer Information</div>
        <div class="info-grid">
            <div class="info-item">
                <label>Full Name</label>
                <p><?php echo htmlspecialchars($data['full_name']); ?></p>
            </div>
            <div class="info-item">
                <label>Contact Number</label>
                <p><?php echo htmlspecialchars($data['phone_number']); ?></p>
            </div>
            <div class="info-item">
                <label>Submission Date</label>
                <p><?php echo date("d M Y, h:i A", strtotime($data['created_at'])); ?></p>
            </div>
        </div>

        <!-- Device Info -->
        <div class="section-title">Device Information</div>
        <div class="info-grid">
            <div class="info-item">
                <label>Brand Name</label>
                <p><?php echo htmlspecialchars($data['brand']); ?></p>
            </div>
            <div class="info-item">
                <label>Model Name</label>
                <p><?php echo htmlspecialchars($data['model']); ?></p>
            </div>
            <div class="info-item">
                <label>Expected Price</label>
                <p style="color:#15803d; font-size:20px;">৳<?php echo number_format($data['expected_price']); ?></p>
            </div>
            <div class="info-item">
                <label>Current Condition</label>
                <p><?php echo htmlspecialchars($data['phone_condition']); ?></p>
            </div>
        </div>

        <!-- Details / Issues -->
        <div class="section-title">Device Details & Issues</div>
        <div class="issues-box">
            <?php echo !empty($data['details']) ? nl2br(htmlspecialchars($data['details'])) : "No specific issues mentioned."; ?>
        </div>

        <!-- Images Section -->
        <div class="section-title">Uploaded Photos</div>
        <div class="image-gallery">
            <?php 
            for($i=1; $i<=3; $i++){
                $img_key = "image_".$i;
                if(!empty($data[$img_key])){
                    echo '<img src="uploads/sell_requests/'.$data[$img_key].'" class="gallery-img" onclick="window.open(this.src)">';
                }
            }
            ?>
        </div>
        
        <!-- Action Buttons -->
        <div style="margin-top: 40px; display:flex; gap:15px; border-top: 1px solid #eee; padding-top:25px;">
             <a href="phone_requests.php?status_id=<?php echo $data['id']; ?>&new_status=approved" class="btn" style="background:#15803d; color:white; padding:12px 25px; border-radius:8px; text-decoration:none; font-weight:700;">Approve This Request</a>
             <a href="phone_requests.php?status_id=<?php echo $data['id']; ?>&new_status=rejected" class="btn" style="background:#ef4444; color:white; padding:12px 25px; border-radius:8px; text-decoration:none; font-weight:700;">Reject This Request</a>
        </div>
    </div>
</div>

</body>
</html>