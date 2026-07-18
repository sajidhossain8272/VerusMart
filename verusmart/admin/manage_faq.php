<?php 
session_start();
// ১. ডাটাবেজ কানেকশন (এক ধাপ পেছনে গিয়ে db.php লোড করা)
include('../db.php'); 

// ২. নতুন FAQ অ্যাড করার লজিক
if(isset($_POST['add_faq'])) {
    $q = mysqli_real_escape_string($conn, $_POST['question']);
    $a = mysqli_real_escape_string($conn, $_POST['answer']);
    
    $query = "INSERT INTO faqs (question, answer) VALUES ('$q', '$a')";
    if(mysqli_query($conn, $query)) {
        echo "<script>alert('FAQ Added Successfully!'); window.location='manage_faq.php';</script>";
    }
}

// ৩. FAQ ডিলিট করার লজিক
if(isset($_GET['delete'])) {
    $id = $_GET['delete'];
    mysqli_query($conn, "DELETE FROM faqs WHERE id = '$id'");
    header("Location: manage_faq.php");
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage FAQ | Shodai Bazaar Admin</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        body { margin: 0; font-family: 'Inter', sans-serif; background: #f4f7f6; }
        
        /* মেইন কন্টেন্ট এরিয়া সেটআপ */
        .main-wrapper { display: flex; }
        .content-body { 
            margin-left: 260px; /* সাইডবারের উইডথ অনুযায়ী */
            width: 100%; 
            padding: 20px; 
            margin-top: 70px; /* হেডারের হাইট অনুযায়ী */
        }

        .card { background: #fff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 30px; }
        .card h3 { margin-top: 0; color: #1e293b; border-bottom: 1px solid #eee; padding-bottom: 15px; }

        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #475569; }
        .form-group input, .form-group textarea { 
            width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; 
        }

        .btn-save { background: #10b981; color: white; border: none; padding: 12px 25px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.3s; }
        .btn-save:hover { background: #059669; }

        table { width: 100%; border-collapse: collapse; }
        table th, table td { padding: 15px; text-align: left; border-bottom: 1px solid #f1f5f9; }
        table th { background: #f8fafc; color: #64748b; }
        .btn-delete { color: #ef4444; text-decoration: none; font-weight: 600; }

        @media (max-width: 992px) {
            .content-body { margin-left: 0; }
        }
    </style>
</head>
<body>

    <!-- ১. অ্যাডমিন হেডার ইনক্লুড -->
    <?php include('header.php'); ?>

    <div class="main-wrapper">
        <!-- ২. অ্যাডমিন সাইডবার ইনক্লুড -->
        <?php include('sidebar.php'); ?>

        <div class="content-body">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #1e293b;">Help & FAQ Management</h2>
            </div>

            <!-- FAQ Add Form -->
            <div class="card">
                <h3><i class="fas fa-plus-circle"></i> Add New FAQ</h3>
                <form method="POST">
                    <div class="form-group">
                        <label>Question</label>
                        <input type="text" name="question" required placeholder="Example: What is the delivery time?">
                    </div>
                    <div class="form-group">
                        <label>Answer</label>
                        <textarea name="answer" rows="3" required placeholder="Enter the detailed answer..."></textarea>
                    </div>
                    <button type="submit" name="add_faq" class="btn-save">Save FAQ</button>
                </form>
            </div>

            <!-- FAQ List Table -->
            <div class="card">
                <h3><i class="fas fa-list"></i> Existing FAQs</h3>
                <div style="overflow-x: auto;">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Question</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php 
                            $res = mysqli_query($conn, "SELECT * FROM faqs ORDER BY id DESC");
                            if(mysqli_num_rows($res) > 0) {
                                while($row = mysqli_fetch_assoc($res)) {
                                    echo "<tr>
                                        <td>#{$row['id']}</td>
                                        <td style='max-width: 500px;'><b>{$row['question']}</b><br><small style='color:gray;'>".substr($row['answer'], 0, 100)."...</small></td>
                                        <td>
                                            <a href='?delete={$row['id']}' class='btn-delete' onclick=\"return confirm('Delete this FAQ?')\">
                                                <i class='fas fa-trash'></i> Delete
                                            </a>
                                        </td>
                                    </tr>";
                                }
                            } else {
                                echo "<tr><td colspan='3' style='text-align:center;'>No FAQs found. Add one above!</td></tr>";
                            }
                            ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

</body>
</html>