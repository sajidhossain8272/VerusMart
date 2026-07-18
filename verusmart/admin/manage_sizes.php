<?php 
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

// সাইজ যোগ করার লজিক
if(isset($_POST['add_size'])){
    $name = mysqli_real_escape_string($conn, $_POST['size_name']);
    mysqli_query($conn, "INSERT INTO sizes (size_name) VALUES ('$name')");
    echo "<script>window.location='manage_sizes.php';</script>";
}

// ডিলিট করার লজিক
if(isset($_GET['delete'])){
    $id = (int)$_GET['delete'];
    mysqli_query($conn, "DELETE FROM sizes WHERE id=$id");
    echo "<script>window.location='manage_sizes.php';</script>";
}
?>

<style>
    .content-wrapper { margin-left: 260px; padding: 100px 30px; background: #f8fafc; min-height: 100vh; }
    .card { background: #fff; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; outline: none; margin-bottom: 15px; }
    .btn-save { background: #15803d; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 12px; border-bottom: 1px solid #eee; text-align: left; }
</style>

<div class="content-wrapper">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px;">
        <div class="card">
            <h4>Add New Size</h4>
            <form action="" method="POST">
                <label>Size Name (e.g. XL, XXL, 500ml)</label>
                <input type="text" name="size_name" placeholder="Size Name" required>
                <button type="submit" name="add_size" class="btn-save">Save Size</button>
            </form>
        </div>

        <div class="card">
            <h4>Size List</h4>
            <table>
                <thead>
                    <tr><th>#</th><th>Size Name</th><th>Action</th></tr>
                </thead>
                <tbody>
                    <?php 
                    $res = mysqli_query($conn, "SELECT * FROM sizes");
                    $sl = 1;
                    while($row = mysqli_fetch_assoc($res)){ ?>
                        <tr>
                            <td><?php echo $sl++; ?></td>
                            <td><?php echo $row['size_name']; ?></td>
                            <td><a href="?delete=<?php echo $row['id']; ?>" style="color:red;" onclick="return confirm('Delete?')"><i class="fas fa-trash"></i></a></td>
                        </tr>
                    <?php } ?>
                </tbody>
            </table>
        </div>
    </div>
</div>