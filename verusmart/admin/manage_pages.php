<?php 
session_start();
include('../db.php'); // ডাটাবেজ কানেকশন

// ১. নতুন পেজ তৈরি করার লজিক
if(isset($_POST['add_page'])) {
    $title = mysqli_real_escape_string($conn, $_POST['title']);
    $slug = mysqli_real_escape_string($conn, strtolower(str_replace(' ', '-', $_POST['slug'])));
    $content = mysqli_real_escape_string($conn, $_POST['content']);

    $query = "INSERT INTO pages (slug, title, content) VALUES ('$slug', '$title', '$content')";
    if(mysqli_query($conn, $query)) {
        echo "<script>alert('New Page Created!'); window.location='manage_pages.php';</script>";
    }
}

// ২. পেজ আপডেট করার লজিক (Edit)
if(isset($_POST['update_page'])) {
    $id = $_POST['page_id'];
    $title = mysqli_real_escape_string($conn, $_POST['title']);
    $content = mysqli_real_escape_string($conn, $_POST['content']);

    $query = "UPDATE pages SET title='$title', content='$content' WHERE id='$id'";
    if(mysqli_query($conn, $query)) {
        echo "<script>alert('Page Updated!'); window.location='manage_pages.php';</script>";
    }
}

// ৩. পেজ ডিলিট করার লজিক
if(isset($_GET['delete'])) {
    $id = $_GET['delete'];
    mysqli_query($conn, "DELETE FROM pages WHERE id = '$id'");
    header("Location: manage_pages.php");
}

// এডিট করার জন্য ডাটা আনা
$edit_page = null;
if(isset($_GET['edit'])) {
    $id = $_GET['edit'];
    $res = mysqli_query($conn, "SELECT * FROM pages WHERE id = '$id'");
    $edit_page = mysqli_fetch_assoc($res);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Manage Pages | Admin Dashboard</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { margin: 0; font-family: 'Inter', sans-serif; background: #f1f5f9; }
        .main-wrapper { display: flex; }
        .content-body { margin-left: 260px; width: 100%; padding: 20px; margin-top: 70px; box-sizing: border-box; }
        
        .card { background: #fff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 30px; }
        .form-control { margin-bottom: 15px; }
        .form-control label { display: block; margin-bottom: 8px; font-weight: 600; color: #475569; }
        .form-control input, .form-control textarea { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; }
        
        .btn { padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; text-decoration: none; }
        .btn-success { background: #10b981; color: white; }
        .btn-primary { background: #3b82f6; color: white; }
        .btn-cancel { background: #64748b; color: white; }

        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        table th, table td { padding: 15px; text-align: left; border-bottom: 1px solid #f1f5f9; }
        table th { background: #f8fafc; color: #64748b; }
        
        .action-links a { margin-right: 10px; font-size: 14px; text-decoration: none; }
    </style>
</head>
<body>

    <?php include('header.php'); ?>

    <div class="main-wrapper">
        <?php include('sidebar.php'); ?>

        <div class="content-body">
            <h2 style="color: #1e293b;"><i class="fas fa-file-alt"></i> Manage Website Pages</h2>

            <!-- Add or Edit Form -->
            <div class="card">
                <h3><?php echo $edit_page ? "Edit Page: ".$edit_page['title'] : "Create New Page"; ?></h3>
                <form method="POST">
                    <?php if($edit_page): ?>
                        <input type="hidden" name="page_id" value="<?php echo $edit_page['id']; ?>">
                    <?php endif; ?>

                    <div class="form-control">
                        <label>Page Title</label>
                        <input type="text" name="title" value="<?php echo $edit_page['title'] ?? ''; ?>" required placeholder="Example: Returns Policy">
                    </div>

                    <?php if(!$edit_page): ?>
                    <div class="form-control">
                        <label>URL Slug (unique-name)</label>
                        <input type="text" name="slug" required placeholder="example: returns-policy">
                    </div>
                    <?php endif; ?>

                    <div class="form-control">
                        <label>Page Content (HTML support)</label>
                        <textarea name="content" rows="10" required><?php echo $edit_page['content'] ?? ''; ?></textarea>
                    </div>

                    <button type="submit" name="<?php echo $edit_page ? 'update_page' : 'add_page'; ?>" class="btn btn-success">
                        <?php echo $edit_page ? 'Update Page' : 'Save Page'; ?>
                    </button>
                    <?php if($edit_page): ?>
                        <a href="manage_pages.php" class="btn btn-cancel">Cancel Edit</a>
                    <?php endif; ?>
                </form>
            </div>

            <!-- Pages List -->
            <div class="card">
                <h3>Current Pages</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Page Title</th>
                            <th>Slug (Link)</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php 
                        $pages = mysqli_query($conn, "SELECT * FROM pages");
                        while($row = mysqli_fetch_assoc($pages)) {
                            echo "<tr>
                                <td><b>{$row['title']}</b></td>
                                <td><code style='color:blue;'>page.php?slug={$row['slug']}</code></td>
                                <td class='action-links'>
                                    <a href='manage_pages.php?edit={$row['id']}' style='color: #3b82f6;'><i class='fas fa-edit'></i> Edit</a>
                                    <a href='manage_pages.php?delete={$row['id']}' onclick=\"return confirm('Delete this page?')\" style='color: #ef4444;'><i class='fas fa-trash'></i> Delete</a>
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