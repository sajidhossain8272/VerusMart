<?php 
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

// ১. ডাটা ডিলিট করার লজিক (Secure with Prepared Statement)
if(isset($_GET['delete'])) {
    $id = $_GET['delete'];
    $stmt = $conn->prepare("DELETE FROM serving_areas WHERE id = ?");
    $stmt->bind_param("i", $id);
    if($stmt->execute()) {
        echo "<script>window.location='serving-area.php';</script>";
    }
    $stmt->close();
}

// ২. নতুন জোন অ্যাড করার লজিক (Secure)
if(isset($_POST['add_zone'])) {
    $zone_name = $_POST['zone_name'];
    $delivery_time = $_POST['delivery_time'];
    $areas = $_POST['areas'];
    $charge = $_POST['delivery_charge'];
    $limit = $_POST['free_limit'];
    $status = 'active';

    $stmt = $conn->prepare("INSERT INTO serving_areas (zone_name, delivery_time, areas, delivery_charge, free_delivery_limit, status) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssdds", $zone_name, $delivery_time, $areas, $charge, $limit, $status);
    
    if($stmt->execute()) {
        echo "<script>alert('Zone added successfully!'); window.location='serving-area.php';</script>";
    }
    $stmt->close();
}

// ৩. ডাটা এডিট করার লজিক (Secure)
if(isset($_POST['update_zone'])) {
    $id = $_POST['zone_id'];
    $zone_name = $_POST['zone_name'];
    $delivery_time = $_POST['delivery_time'];
    $areas = $_POST['areas'];
    $charge = $_POST['delivery_charge'];
    $limit = $_POST['free_limit'];

    $stmt = $conn->prepare("UPDATE serving_areas SET zone_name=?, delivery_time=?, areas=?, delivery_charge=?, free_delivery_limit=? WHERE id=?");
    $stmt->bind_param("sssddi", $zone_name, $delivery_time, $areas, $charge, $limit, $id);
    
    if($stmt->execute()) {
        echo "<script>window.location='serving-area.php';</script>";
    }
    $stmt->close();
}

$result = mysqli_query($conn, "SELECT * FROM serving_areas ORDER BY id DESC");
?>

<style>
    :root {
        --primary-green: #00a65a;
        --dark-navy: #1e293b;
    }
    .main-content { margin-left: 260px; padding: 100px 30px 30px; transition: 0.3s; min-height: 100vh; background: #f8fafc; }
    .page-card { background: #fff; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); border: none; overflow: hidden; }
    .status-badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .bg-active { background: #dcfce7; color: #166534; }
    .area-chip { background: #f1f5f9; padding: 3px 10px; border-radius: 6px; font-size: 12px; margin: 2px; display: inline-block; color: #475569; border: 1px solid #e2e8f0; }
    
    .table thead th { background: #f8fafc; color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; }
    .btn-success { background-color: var(--primary-green); border-color: var(--primary-green); }
    .btn-success:hover { background-color: #008d4c; border-color: #008d4c; }

    @media (max-width: 992px) { 
        .main-content { margin-left: 0; padding: 80px 15px 15px; } 
    }
</style>

<main class="main-content">
    <div class="container-fluid">
        <!-- Header Section -->
        <div class="row align-items-center mb-4">
            <div class="col-md-6">
                <h3 class="fw-bold text-dark mb-1">Serving Areas</h3>
                <p class="text-muted small mb-0">Manage your store's delivery zones, ZIP codes, and shipping rates.</p>
            </div>
            <div class="col-md-6 text-md-end mt-3 mt-md-0">
                <button class="btn btn-success px-4 rounded-3 shadow-sm" data-bs-toggle="modal" data-bs-target="#addZoneModal">
                    <i class="fas fa-plus-circle me-2"></i> Add New Zone
                </button>
            </div>
        </div>

        <!-- Data Table Card -->
        <div class="page-card">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th class="ps-4">Zone Name</th>
                            <th>Delivery Time</th>
                            <th>Areas / ZIP Codes</th>
                            <th>Charge</th>
                            <th>Free Limit</th>
                            <th class="text-end pe-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if(mysqli_num_rows($result) > 0): ?>
                            <?php while($row = mysqli_fetch_assoc($result)): ?>
                            <tr>
                                <td class="ps-4">
                                    <div class="fw-bold text-dark"><?php echo htmlspecialchars($row['zone_name']); ?></div>
                                    <span class="status-badge bg-active">Active</span>
                                </td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <i class="far fa-clock text-muted me-2"></i>
                                        <span><?php echo htmlspecialchars($row['delivery_time']); ?></span>
                                    </div>
                                </td>
                                <td style="max-width: 350px;">
                                    <?php 
                                    $tags = explode(',', $row['areas']);
                                    foreach($tags as $t) {
                                        echo "<span class='area-chip'>".trim(htmlspecialchars($t))."</span>";
                                    }
                                    ?>
                                </td>
                                <td><span class="fw-bold">$<?php echo number_format($row['delivery_charge'], 2); ?></span></td>
                                <td><span class="fw-bold">$<?php echo number_format($row['free_delivery_limit'], 2); ?></span></td>
                                <td class="text-end pe-4">
                                    <div class="btn-group">
                                        <button class="btn btn-sm btn-outline-primary rounded-2 me-2" 
                                                onclick='editZone(<?php echo json_encode($row); ?>)'>
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <a href="?delete=<?php echo $row['id']; ?>" 
                                           class="btn btn-sm btn-outline-danger rounded-2" 
                                           onclick="return confirm('Are you sure you want to delete this zone?')">
                                            <i class="fas fa-trash-alt"></i>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="6" class="text-center py-5 text-muted">No serving areas found. Click "Add New Zone" to start.</td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</main>

<!-- Modal: Add New Zone -->
<div class="modal fade" id="addZoneModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-dark text-white border-0">
                <h5 class="modal-title fw-bold"><i class="fas fa-map-marker-alt me-2"></i> Add New Zone</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form action="" method="POST">
                <div class="modal-body p-4">
                    <div class="mb-3">
                        <label class="form-label fw-bold small">Zone Name</label>
                        <input type="text" name="zone_name" class="form-control bg-light" placeholder="e.g. Queens, NY" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold small">Delivery Time</label>
                        <input type="text" name="delivery_time" class="form-control bg-light" placeholder="e.g. Same Day / 1-2 Days" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold small">Areas / ZIP Codes (Comma separated)</label>
                        <textarea name="areas" class="form-control bg-light" rows="3" placeholder="11101, 11102, Astoria, Jamaica" required></textarea>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label class="form-label fw-bold small">Delivery Charge ($)</label>
                            <input type="number" step="0.01" name="delivery_charge" class="form-control bg-light" value="0.00" required>
                        </div>
                        <div class="col-6">
                            <label class="form-label fw-bold small">Free Delivery Over ($)</label>
                            <input type="number" step="0.01" name="free_limit" class="form-control bg-light" value="0.00" required>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0 px-4 pb-4">
                    <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Close</button>
                    <button type="submit" name="add_zone" class="btn btn-success px-4">Create Zone</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Modal: Edit Zone -->
<div class="modal fade" id="editZoneModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
            <div class="modal-header bg-primary text-white border-0">
                <h5 class="modal-title fw-bold"><i class="fas fa-edit me-2"></i> Edit Delivery Zone</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form action="" method="POST">
                <input type="hidden" name="zone_id" id="edit_id">
                <div class="modal-body p-4">
                    <div class="mb-3">
                        <label class="form-label fw-bold small">Zone Name</label>
                        <input type="text" name="zone_name" id="edit_name" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold small">Delivery Time</label>
                        <input type="text" name="delivery_time" id="edit_time" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-bold small">Areas / ZIP Codes</label>
                        <textarea name="areas" id="edit_areas" class="form-control" rows="3" required></textarea>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label class="form-label fw-bold small">Charge ($)</label>
                            <input type="number" step="0.01" name="delivery_charge" id="edit_charge" class="form-control" required>
                        </div>
                        <div class="col-6">
                            <label class="form-label fw-bold small">Free Over ($)</label>
                            <input type="number" step="0.01" name="free_limit" id="edit_limit" class="form-control" required>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0 px-4 pb-4">
                    <button type="button" class="btn btn-light px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" name="update_zone" class="btn btn-primary px-4">Update Changes</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<script>
    // এডিট মোডাল ফাংশন
    function editZone(data) {
        document.getElementById('edit_id').value = data.id;
        document.getElementById('edit_name').value = data.zone_name;
        document.getElementById('edit_time').value = data.delivery_time;
        document.getElementById('edit_areas').value = data.areas;
        document.getElementById('edit_charge').value = data.delivery_charge;
        document.getElementById('edit_limit').value = data.free_delivery_limit;
        
        var editModal = new bootstrap.Modal(document.getElementById('editZoneModal'));
        editModal.show();
    }
</script>

</body>
</html>