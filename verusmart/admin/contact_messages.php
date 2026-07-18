<?php 
session_start();
include('../db.php'); 

// ডিলিট লজিক
if(isset($_GET['delete'])) {
    $id = $_GET['delete'];
    mysqli_query($conn, "DELETE FROM contact_messages WHERE id = '$id'");
    header("Location: contact_messages.php");
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Contact Messages | Admin</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { margin: 0; font-family: 'Inter', sans-serif; background: #f4f7f6; }
        .main-wrapper { display: flex; }
        .content-body { margin-left: 260px; width: 100%; padding: 20px; margin-top: 70px; }
        .card { background: #fff; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        table { width: 100%; border-collapse: collapse; }
        table th, table td { padding: 15px; text-align: left; border-bottom: 1px solid #f1f5f9; }
        table th { background: #f8fafc; color: #64748b; }
        .msg-box { background: #f9fafb; padding: 10px; border-radius: 5px; font-size: 13px; color: #4b5563; }
    </style>
</head>
<body>

    <?php include('header.php'); ?>

    <div class="main-wrapper">
        <?php include('sidebar.php'); ?>

        <div class="content-body">
            <h2 style="color: #1e293b; margin-bottom: 25px;">Customer Messages</h2>

            <div class="card">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Customer Info</th>
                            <th>Message</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php 
                        $res = mysqli_query($conn, "SELECT * FROM contact_messages ORDER BY id DESC");
                        if(mysqli_num_rows($res) > 0) {
                            while($row = mysqli_fetch_assoc($res)) {
                                echo "<tr>
                                    <td style='font-size:12px;'>".date('d M Y, h:i A', strtotime($row['created_at']))."</td>
                                    <td>
                                        <b>{$row['name']}</b><br>
                                        <small>{$row['email']}</small>
                                    </td>
                                    <td>
                                        <div style='margin-bottom:5px;'><b>Sub: {$row['subject']}</b></div>
                                        <div class='msg-box'>{$row['message']}</div>
                                    </td>
                                    <td>
                                        <a href='?delete={$row['id']}' onclick=\"return confirm('Delete message?')\" style='color:red; text-decoration:none;'><i class='fas fa-trash'></i></a>
                                    </td>
                                </tr>";
                            }
                        } else {
                            echo "<tr><td colspan='4' style='text-align:center;'>No messages found.</td></tr>";
                        }
                        ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</body>
</html>