<?php
include('db.php'); // নিশ্চিত করুন আপনার db কানেকশন ফাইল ঠিক আছে

if (isset($_POST['zip'])) {
    $zip = trim($_POST['zip']);
    
    // Security: SQL Injection থেকে বাঁচার জন্য Prepared Statement
    // আপনার 'areas' কলামে জিপ কোডগুলো টেক্সট হিসেবে থাকলে তা খুঁজে বের করবে
    $stmt = $conn->prepare("SELECT zone_name FROM serving_areas WHERE areas LIKE ? AND status='active'");
    $search_zip = "%$zip%";
    $stmt->bind_param("s", $search_zip);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode(['status' => 'success', 'zone' => $row['zone_name']]);
    } else {
        echo json_encode(['status' => 'error']);
    }
    
    $stmt->close();
    $conn->close();
}
?>