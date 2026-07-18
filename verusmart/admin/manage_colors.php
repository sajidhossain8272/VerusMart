<?php 
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

// কালার যোগ করার লজিক
if(isset($_POST['add_color'])){
    $name = mysqli_real_escape_string($conn, $_POST['color_name']);
    $code = mysqli_real_escape_string($conn, $_POST['color_code']);
    mysqli_query($conn, "INSERT INTO colors (color_name, color_code) VALUES ('$name', '$code')");
    echo "<script>window.location='manage_colors.php';</script>";
}

// ডিলিট করার লজিক
if(isset($_GET['delete'])){
    $id = (int)$_GET['delete'];
    mysqli_query($conn, "DELETE FROM colors WHERE id=$id");
    echo "<script>window.location='manage_colors.php';</script>";
}
?>

<style>
    .content-wrapper { margin-left: 260px; padding: 100px 30px; background: #f8fafc; min-height: 100vh; }
    .card { background: #fff; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .form-group { margin-bottom: 15px; }
    input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; outline: none; }
    .btn-save { background: #15803d; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; border-bottom: 1px solid #eee; text-align: left; }
    .color-preview { width: 25px; height: 25px; border-radius: 50%; display: inline-block; border: 1px solid #ddd; }
</style>

<div class="content-wrapper">
    <div style="display: grid; grid-template-columns: 1fr 1.5fr; gap: 25px;">
        <div class="card">
            <h4>Add New Color</h4>
            <form action="" method="POST">
                <div class="form-group">
                    <label>Color Name</label>
                    <input type="text" name="color_name" placeholder="e.g. Red" required>
                </div>
                <div class="form-group">
                    <label>Color Code (Hex)</label>
                    <input type="color" name="color_code" style="height:45px; padding:2px;">
                </div>
                <button type="submit" name="add_color" class="btn-save">Save Color</button>
            </form>
        </div>

        <div class="card">
            <h4>Color List</h4>
            <table>
                <thead>
                    <tr><th>#</th><th>Preview</th><th>Name</th><th>Action</th></tr>
                </thead>
                <tbody>
                    <?php 
                    $res = mysqli_query($conn, "SELECT * FROM colors");
                    $sl = 1;
                    while($row = mysqli_fetch_assoc($res)){ ?>
                        <tr>
                            <td><?php echo $sl++; ?></td>
                            <td><div class="color-preview" style="background:<?php echo $row['color_code']; ?>"></div></td>
                            <td><?php echo $row['color_name']; ?></td>
                            <td><a href="?delete=<?php echo $row['id']; ?>" style="color:red;" onclick="return confirm('Delete?')"><i class="fas fa-trash"></i></a></td>
                        </tr>
                    <?php } ?>
                </tbody>
            </table>
        </div>
    </div>
</div>