<?php 
include('db.php'); 
include('header.php'); 

if (isset($_GET['slug'])) {
    $slug = mysqli_real_escape_string($conn, $_GET['slug']);
    // ডাটাবেজ থেকে পেজ ডাটা আনা
    $query = mysqli_query($conn, "SELECT * FROM pages WHERE slug = '$slug'");
    $page = mysqli_fetch_assoc($query);

    if ($page) {
?>
    <div class="container" style="padding: 60px 20px; min-height: 500px; background: #fff; margin-top: 30px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
        <h1 style="color: #017a0a; border-bottom: 2px solid #f1f1f1; padding-bottom: 15px; margin-bottom: 25px;">
            <?php echo $page['title']; ?>
        </h1>
        <div style="line-height: 1.8; color: #444; font-size: 16px;">
            <?php echo $page['content']; ?>
        </div>
    </div>
<?php 
    } else {
        echo "<div class='container' style='padding:100px; text-align:center;'><h2>Page not found!</h2><a href='index.php'>Go Home</a></div>";
    }
}
include('footer.php'); 
?>