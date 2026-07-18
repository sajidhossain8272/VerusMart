<?php 
// ১. ডাটাবেজ কানেকশন ও হেডার/সাইডবার
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

$edit_mode = false;
$edit_id = "";
$edit_name = "";
$edit_cat_id = "";
$edit_priority = 1;

// --- ডিলিট লজিক ---
if(isset($_GET['delete'])){
    $id = (int)$_GET['delete'];
    mysqli_query($conn, "DELETE FROM sub_categories WHERE id=$id");
    echo "<script>window.location='sub-categories.php';</script>";
}

// --- এডিট করার ডাটা আনা ---
if(isset($_GET['edit'])){
    $edit_mode = true;
    $edit_id = (int)$_GET['edit'];
    $res = mysqli_query($conn, "SELECT * FROM sub_categories WHERE id=$edit_id");
    $row = mysqli_fetch_assoc($res);
    if($row){
        $edit_name = $row['name'];
        $edit_cat_id = $row['category_id'];
        $edit_priority = $row['priority'];
    }
}

// --- সেভ ও আপডেট লজিক ---
if(isset($_POST['save_sub_category'])){
    $sub_id = $_POST['sub_id'];
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $cat_id = (int)$_POST['category_id'];
    $priority = (int)$_POST['priority'];

    if($sub_id != ""){
        // আপডেট
        $sql = "UPDATE sub_categories SET name='$name', category_id='$cat_id', priority='$priority' WHERE id=$sub_id";
        $msg = "Sub-Category Updated!";
    } else {
        // নতুন ইনসার্ট
        $sql = "INSERT INTO sub_categories (name, category_id, priority, status) VALUES ('$name', '$cat_id', '$priority', 'active')";
        $msg = "Sub-Category Added!";
    }

    if(mysqli_query($conn, $sql)){
        echo "<script>alert('$msg'); window.location='sub-categories.php';</script>";
    }
}
?>

<style>
    .content-wrapper { margin-left: 260px; padding: 100px 25px 30px; background: #f8fafb; min-height: 100vh; transition: 0.3s; }
    .card { background: #fff; border-radius: 12px; padding: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: none; margin-bottom: 20px; }
    label { display: block; font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 8px; text-transform: uppercase; }
    input, select { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; margin-bottom: 15px; }
    .btn-submit { background: #15803d; color: white; border: none; padding: 12px 30px; border-radius: 8px; cursor: pointer; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th { background: #f8f9fa; padding: 12px; text-align: left; font-size: 12px; color: #64748b; border-bottom: 2px solid #f1f5f9; }
    td { padding: 15px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .action-icons a { margin-right: 10px; text-decoration: none; font-size: 16px; }
    @media (max-width: 992px) { .content-wrapper { margin-left: 0; } }
</style>

<div class="content-wrapper">
    <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 25px;">
        
        <!-- বাঁদিকের ফর্ম -->
        <div class="card">
            <h4><?php echo $edit_mode ? "Update Sub-Category" : "Add New Sub-Category"; ?></h4>
            <form action="" method="POST">
                <input type="hidden" name="sub_id" value="<?php echo $edit_id; ?>">
                
                <label>Sub-Category Name *</label>
                <input type="text" name="name" value="<?php echo htmlspecialchars($edit_name); ?>" required placeholder="e.g. Smart Phones">

                <label>Main Category *</label>
                <select name="category_id" required>
                    <option value="">-- Select Category --</option>
                    <?php 
                    $cats = mysqli_query($conn, "SELECT id, name FROM categories WHERE status='active'");
                    while($c = mysqli_fetch_assoc($cats)){
                        $selected = ($c['id'] == $edit_cat_id) ? "selected" : "";
                        echo "<option value='".$c['id']."' $selected>".$c['name']."</option>";
                    }
                    ?>
                </select>

                <label>Priority</label>
                <input type="number" name="priority" value="<?php echo $edit_priority; ?>">

                <button type="submit" name="save_sub_category" class="btn-submit">
                    <?php echo $edit_mode ? "Update Sub-Category" : "Save Sub-Category"; ?>
                </button>
                <?php if($edit_mode): ?>
                    <a href="sub-categories.php" style="margin-left:10px; color:gray;">Cancel</a>
                <?php endif; ?>
            </form>
        </div>

        <!-- ডানদিকের লিস্ট -->
        <div class="card">
            <h4>Sub-Category List</h4>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Sub-Category</th>
                        <th>Main Category</th>
                        <th>Priority</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <?php 
                    $sl = 1;
                    $query = mysqli_query($conn, "SELECT s.*, c.name as main_cat FROM sub_categories s JOIN categories c ON s.category_id = c.id ORDER BY s.id DESC");
                    while($row = mysqli_fetch_assoc($query)){
                    ?>
                    <tr>
                        <td><?php echo $sl++; ?></td>
                        <td><strong><?php echo htmlspecialchars($row['name']); ?></strong></td>
                        <td><?php echo htmlspecialchars($row['main_cat']); ?></td>
                        <td><?php echo $row['priority']; ?></td>
                        <td class="action-icons">
                            <a href="?edit=<?php echo $row['id']; ?>" style="color:blue;"><i class="fa-solid fa-pen-to-square"></i></a>
                            <a href="?delete=<?php echo $row['id']; ?>" onclick="return confirm('Are you sure?')" style="color:red;"><i class="fa-solid fa-trash"></i></a>
                        </td>
                    </tr>
                    <?php } ?>
                </tbody>
            </table>
        </div>

    </div>
</div>

</body>
</html>