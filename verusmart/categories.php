<?php 
if (session_status() === PHP_SESSION_NONE) { session_start(); }
include('db.php'); 
include('header.php'); 

// ডাটাবেজ থেকে সব ক্যাটাগরি নিয়ে আসা
$query = "SELECT * FROM categories ORDER BY name ASC";
$result = mysqli_query($conn, $query);

// ক্যাটাগরি ইমেজের পাথ (আপনার প্রজেক্ট অনুযায়ী চেক করে নিন)
$cat_path = "admin/uploads/category/"; 
?>

<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Categories - ShodaiBazaar</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root {
            --primary-green: #027007;
            --bg-light: #f8fafc;
            --text-dark: #1e293b;
            --border-color: #e2e8f0;
        }
        body { background-color: var(--bg-light); font-family: 'Inter', sans-serif; margin: 0; }
        .cat-container { width: 92%; max-width: 1200px; margin: 40px auto; padding-bottom: 100px; }
        
        .page-title { font-size: 28px; font-weight: 800; color: var(--text-dark); margin-bottom: 30px; text-align: center; }

        /* ক্যাটাগরি গ্রিড */
        .categories-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 20px;
        }

        .cat-card {
            background: #fff;
            border-radius: 20px;
            padding: 20px;
            text-align: center;
            text-decoration: none;
            color: var(--text-dark);
            border: 1px solid var(--border-color);
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }

        .cat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            border-color: var(--primary-green);
        }

        .cat-img-wrap {
            width: 100px;
            height: 100px;
            margin: 0 auto 15px;
            background: #f1f5f9;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .cat-img-wrap img {
            width: 65%;
            height: 65%;
            object-fit: contain;
            transition: 0.3s;
        }

        .cat-card:hover img {
            transform: scale(1.1);
        }

        .cat-card h3 {
            font-size: 16px;
            font-weight: 700;
            margin: 0;
            color: var(--text-dark);
        }

        .item-count {
            font-size: 12px;
            color: #64748b;
            margin-top: 5px;
            display: block;
        }

        /* রেসপন্সিভনেস */
        @media (max-width: 768px) {
            .categories-grid {
                grid-template-columns: repeat(2, 1fr); /* মোবাইলে ২ কলাম */
                gap: 15px;
            }
            .page-title { font-size: 22px; }
            .cat-card { padding: 15px; border-radius: 15px; }
            .cat-img-wrap { width: 80px; height: 80px; }
        }
    </style>
</head>
<body>

<div class="cat-container">
    <h1 class="page-title">Explore Categories</h1>

    <div class="categories-grid">
        <?php 
        if (mysqli_num_rows($result) > 0) {
            while($row = mysqli_fetch_assoc($result)) {
                // প্রতিটি ক্যাটাগরিতে কয়টি প্রোডাক্ট আছে তা বের করা (Optional)
                $cat_id = $row['id'];
                $count_res = mysqli_query($conn, "SELECT COUNT(*) as total FROM products WHERE category_id = $cat_id");
                $count_data = mysqli_fetch_assoc($count_res);
                ?>
                
                <a href="products.php?category=<?php echo $row['id']; ?>" class="cat-card">
                    <div class="cat-img-wrap">
                        <img src="<?php echo $cat_path . $row['image']; ?>" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3081/3081840.png';">
                    </div>
                    <h3><?php echo htmlspecialchars($row['name']); ?></h3>
                    <span class="item-count"><?php echo $count_data['total']; ?> Products</span>
                </a>

                <?php
            }
        } else {
            echo "<p style='text-align:center; grid-column: 1/-1;'>No categories found.</p>";
        }
        ?>
    </div>
</div>

<?php include('footer.php'); ?>
</body>
</html>