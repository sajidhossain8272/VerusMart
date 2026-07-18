<?php 
// ১. হেডার ইনক্লুড করা
include('header.php'); 

// ২. ডাটাবেজ থেকে তথ্য আনা
$query = "SELECT * FROM serving_areas WHERE status='active'";
$result = mysqli_query($conn, $query);
?>

<style>
    :root {
        --primary-green: #1B5E20; /* Deep Green */
        --light-green: #E8F5E9;
        --accent-green: #2E7D32;
        --text-dark: #333;
        --text-muted: #666;
        --border-color: #E0E0E0;
    }

    body { background-color: #fcfcfc; font-family: 'Segoe UI', Roboto, sans-serif; }

    /* Hero Section */
    .serving-hero {
        background-color: var(--primary-green);
        color: white;
        text-align: center;
        padding: 50px 20px;
    }
    .serving-hero i { font-size: 40px; margin-bottom: 15px; display: block; }
    .serving-hero h1 { font-size: 36px; font-weight: 700; margin-bottom: 10px; }
    .serving-hero p { font-size: 16px; opacity: 0.9; max-width: 600px; margin: 0 auto; }

    .content-container { max-width: 1100px; margin: 0 auto; padding: 40px 15px; }

    /* Feature Cards */
    .features-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-top: -80px;
        margin-bottom: 50px;
    }
    .feature-card {
        background: white;
        padding: 30px 20px;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        border: 1px solid var(--border-color);
    }
    .feature-card i { font-size: 24px; color: var(--accent-green); margin-bottom: 15px; }
    .feature-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 5px; }
    .feature-card p { font-size: 14px; color: var(--text-muted); margin: 0; }

    /* Zone Section Header */
    .section-title { font-size: 24px; font-weight: 700; margin-bottom: 25px; color: #000; }

    /* Delivery Zone Cards */
    .zones-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 25px;
    }
    .zone-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--border-color);
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .zone-header {
        background: var(--primary-green);
        color: white;
        padding: 12px 20px;
        font-size: 18px;
        font-weight: 600;
    }
    .zone-body { padding: 20px; }
    
    .zip-label { font-size: 12px; color: #999; margin-bottom: 10px; display: block; }
    .zip-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 20px; }
    .zip-tag {
        background: #f1f1f1;
        border: 1px solid #ddd;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 11px;
        color: #444;
        font-weight: 600;
    }

    .price-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-size: 14px;
    }
    .price-name { color: var(--text-muted); display: flex; align-items: center; gap: 8px; }
    .price-value { font-weight: 700; color: #000; }

    .free-delivery-badge {
        background: var(--light-green);
        color: var(--accent-green);
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        margin-top: 15px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    /* Notify Section */
    .notify-section {
        background: #F5F5F5;
        border-radius: 12px;
        padding: 40px;
        text-align: center;
        margin-top: 60px;
    }
    .notify-section h2 { font-size: 22px; font-weight: 700; margin-bottom: 10px; }
    .notify-section p { font-size: 14px; color: var(--text-muted); margin-bottom: 25px; }
    
    .notify-form {
        display: flex;
        max-width: 450px;
        margin: 0 auto;
        gap: 10px;
    }
    .notify-form input {
        flex: 1;
        padding: 12px 15px;
        border: 1px solid #ccc;
        border-radius: 6px;
        outline: none;
    }
    .notify-btn {
        background: var(--primary-green);
        color: white;
        border: none;
        padding: 0 25px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .features-grid { grid-template-columns: 1fr; margin-top: 20px; }
        .notify-form { flex-direction: column; }
        .serving-hero h1 { font-size: 28px; }
    }
</style>

<!-- Hero -->
<section class="serving-hero">
    <i class="fa-solid fa-location-dot"></i>
    <h1>Our Delivery Areas</h1>
    <p>We're expanding every day! Check if we deliver to your area and enjoy fresh groceries at your doorstep.</p>
</section>

<div class="content-container">
    
    <!-- Info Feature Cards -->
    <div class="features-grid">
        <div class="feature-card">
            <i class="fa-solid fa-truck"></i>
            <h3>Free Delivery</h3>
            <p>On all orders over $75</p>
        </div>
        <div class="feature-card">
            <i class="fa-solid fa-clock"></i>
            <h3>Same Day Delivery</h3>
            <p>Order before 2PM for same day</p>
        </div>
        <div class="feature-card">
            <i class="fa-solid fa-circle-check"></i>
            <h3>Fresh Guarantee</h3>
            <p>Quality products guaranteed</p>
        </div>
    </div>

    <h2 class="section-title">Delivery Zones</h2>

    <div class="zones-grid">
        <?php 
        if(mysqli_num_rows($result) > 0) {
            while($row = mysqli_fetch_assoc($result)) {
                $area_list = explode(',', $row['areas']);
        ?>
        <div class="zone-card">
            <div class="zone-header">
                <?php echo htmlspecialchars($row['zone_name']); ?>
            </div>
            <div class="zone-body">
                <span class="zip-label">Serving ZIP Codes:</span>
                <div class="zip-tags">
                    <?php 
                    $count = 0;
                    foreach($area_list as $area) { 
                        if($count < 8) { // শুরুতে ৮টি জিপ কোড দেখাবে
                    ?>
                        <span class="zip-tag"><?php echo trim(htmlspecialchars($area)); ?></span>
                    <?php 
                        }
                        $count++;
                    } 
                    if($count > 8) echo '<span class="zip-tag">+'.($count-8).' more</span>';
                    ?>
                </div>

                <div class="price-row">
                    <span class="price-name"><i class="fa-solid fa-truck-pickup"></i> Standard (3 days)</span>
                    <span class="price-value">$<?php echo number_format($row['delivery_charge'], 2); ?></span>
                </div>
                <div class="price-row">
                    <span class="price-name"><i class="fa-solid fa-stopwatch"></i> Express (1 day)</span>
                    <span class="price-value">$16.99</span> <!-- এটি ডাইনামিক করতে চাইলে ডাটাবেজে কলাম যোগ করতে পারেন -->
                </div>

                <div class="free-delivery-badge">
                    <i class="fa-solid fa-check"></i> 
                    Free standard delivery on orders over $<?php echo number_format($row['free_delivery_limit'], 0); ?>
                </div>
            </div>
        </div>
        <?php 
            }
        } else {
            echo "<p>No serving areas found.</p>";
        }
        ?>
    </div>

    <!-- Notify Section -->
    <div class="notify-section">
        <h2>Don't see your area?</h2>
        <p>We're constantly expanding our delivery coverage. Leave your ZIP code and we'll notify you when we start delivering to your area!</p>
        <div class="notify-form">
            <input type="text" id="notify_zip" placeholder="Enter your ZIP code">
            <button class="notify-btn" onclick="checkDeliveryZip()">Notify Me</button>
        </div>
        <div id="zip-result" style="margin-top: 15px; font-weight: 600;"></div>
    </div>
</div>

<!-- AJAX Logic (আগের মতোই থাকবে) -->
<script>
function checkDeliveryZip() {
    const zipInput = document.getElementById('notify_zip').value.trim();
    const resultDiv = document.getElementById('zip-result');

    if (zipInput === "") {
        resultDiv.innerHTML = '<span style="color:red">Please enter a ZIP code!</span>';
        return;
    }

    resultDiv.innerHTML = 'Checking...';

    fetch('check_zip.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'zip=' + encodeURIComponent(zipInput)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            resultDiv.innerHTML = '<span style="color:green">✔ Yes! We deliver to ' + data.zone + '.</span>';
        } else {
            resultDiv.innerHTML = '<span style="color:#555">✖ Area not covered yet. We will notify you!</span>';
        }
    })
    .catch(error => {
        resultDiv.innerHTML = 'Something went wrong.';
    });
}
</script>

<?php include('footer.php'); ?>