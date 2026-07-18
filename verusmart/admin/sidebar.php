<style>
    .sidebar {
        width: 260px; background: #1e293b; height: 100vh; position: fixed;
        top: 70px; left: 0; transition: 0.3s; z-index: 1000; overflow-y: auto; padding-bottom: 100px;
    }
    .sidebar::-webkit-scrollbar { width: 4px; }
    .sidebar::-webkit-scrollbar-thumb { background: #334155; }

    .group-label { color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 20px 25px 10px; letter-spacing: 1px; }
    
    .menu-item {
        display: flex; align-items: center; padding: 10px 20px; color: #94a3b8;
        text-decoration: none; transition: 0.3s; margin: 4px 15px; border-radius: 8px; font-size: 14px;
    }
    .menu-item:hover, .menu-item.active { background: rgba(255,255,255,0.05); color: #fff; }
    .menu-item.active { background: #10b981; color: #fff; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); }

    .menu-item i {
        width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
        border-radius: 8px; margin-right: 12px; font-size: 14px; transition: 0.3s;
    }
    
    /* আইকন কালার কোড */
    .ic-dash { background: rgba(16, 185, 129, 0.2); color: #10b981; }
    .ic-cat { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
    .ic-prod { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
    .ic-ord { background: rgba(139, 92, 246, 0.2); color: #8b5cf6; }
    .ic-cust { background: rgba(236, 72, 153, 0.2); color: #ec4899; }
    .ic-ban { background: rgba(6, 182, 212, 0.2); color: #06b6d4; }
    .ic-map { background: rgba(244, 63, 94, 0.2); color: #f43f5e; }
    .ic-set { background: rgba(100, 116, 139, 0.2); color: #64748b; }
    .ic-help { background: rgba(14, 165, 233, 0.2); color: #0ea5e9; } 
    .ic-info { background: rgba(249, 115, 22, 0.2); color: #f97316; }
    .ic-contact { background: rgba(168, 85, 247, 0.2); color: #a855f7; } 
    .ic-sell { background: rgba(239, 68, 68, 0.2); color: #ef4444; } /* Sell Request Icon */

    .submenu { display: none; padding-left: 55px; background: rgba(0,0,0,0.1); border-radius: 0 0 8px 8px; margin: 0 15px; }
    .submenu a { display: block; padding: 8px 0; color: #94a3b8; text-decoration: none; font-size: 13px; transition: 0.2s; }
    .submenu a:hover { color: #fff; }
    .rotate { transform: rotate(180deg); }
</style>

<aside class="sidebar" id="sidebar">
    <div class="group-label">Main</div>
    <a href="dashboard.php" class="menu-item active"><i class="fas fa-th-large ic-dash"></i> Dashboard</a>
    
    <div class="group-label">Inventory</div>
    
    <!-- Sell Requests (Phone Sell) -->
    <a href="phone_requests.php" class="menu-item">
        <i class="fa-solid fa-mobile-screen ic-sell"></i> <span>Sell Requests</span>
    </a>
    
    <!-- Categories Dropdown -->
    <div class="menu-item drop-btn" style="cursor:pointer;"><i class="fas fa-layer-group ic-cat"></i> Categories <i class="fas fa-chevron-down ms-auto" style="font-size:10px;"></i></div>
    <div class="submenu">
        <a href="category_setup.php">Category List</a>
        <a href="sub-categories.php">Sub Categories</a>
    </div>

    <!-- Products Dropdown -->
    <div class="menu-item drop-btn" style="cursor:pointer;"><i class="fas fa-box ic-prod"></i> Products <i class="fas fa-chevron-down ms-auto" style="font-size:10px;"></i></div>
    <div class="submenu">
        <a href="product_list.php">Product List</a>
        <a href="add_product.php">Add New Product</a>
        <a href="manage_colors.php">Manage Colors</a>
        <a href="manage_sizes.php">Manage Sizes</a>
    </div>

    <!-- Order Management (NEW Dropdown added based on Pic 2) -->
    <div class="menu-item drop-btn" style="cursor:pointer;"><i class="fas fa-shopping-bag ic-ord"></i> Orders <i class="fas fa-chevron-down ms-auto" style="font-size:10px;"></i></div>
    <div class="submenu">
        <a href="all_orders.php">All Orders</a>
        <a href="all_orders.php?status=pending">Pending Orders</a>
        <a href="all_orders.php?status=delivered">Delivered Orders</a>
        <a href="all_orders.php?status=canceled">Canceled Orders</a>
    </div>

    <a href="customer_list.php" class="menu-item"><i class="fas fa-users ic-cust"></i> Customers</a>

    <div class="group-label">Customer Support</div>
    <div class="menu-item drop-btn" style="cursor:pointer;"><i class="fas fa-headset ic-help"></i> Help & Support <i class="fas fa-chevron-down ms-auto" style="font-size:10px;"></i></div>
    <div class="submenu">
        <a href="manage_faq.php">FAQ</a>
        <a href="contact_messages.php">Contact Messages</a>
        <a href="order_tracking_setup.php">Track Order</a>
        <a href="manage_pages.php">Returns Policy</a>
    </div>

    <div class="group-label">Business Info</div>
    <div class="menu-item drop-btn" style="cursor:pointer;"><i class="fas fa-address-book ic-contact"></i> Contact Us <i class="fas fa-chevron-down ms-auto" style="font-size:10px;"></i></div>
    <div class="submenu">
        <a href="business_settings.php">Phone Number</a>
        <a href="business_settings.php">Email Address</a>
        <a href="business_settings.php">Location / Address</a>
    </div>

    <div class="group-label">Company Management</div>
    <div class="menu-item drop-btn" style="cursor:pointer;"><i class="fas fa-info-circle ic-info"></i> Company Info <i class="fas fa-chevron-down ms-auto" style="font-size:10px;"></i></div>
    <div class="submenu">
        <a href="manage_pages.php">About Us</a>
        <a href="manage_pages.php">Privacy Policy</a>
        <a href="manage_pages.php">Terms & Conditions</a>
    </div>

    <div class="group-label">Marketing</div>
    <a href="banner_setup.php" class="menu-item"><i class="fas fa-images ic-ban"></i> Banners</a>
    <a href="serving-area.php" class="menu-item"><i class="fas fa-map-marker-alt ic-map"></i> Serving Area</a>
    <a href="business_settings.php" class="menu-item"><i class="fas fa-cog ic-set"></i> Settings</a>
</aside>

<script>
    document.querySelectorAll('.drop-btn').forEach(btn => {
        btn.onclick = function() {
            const submenu = this.nextElementSibling;
            // Close other open submenus
            document.querySelectorAll('.submenu').forEach(sub => {
                if(sub !== submenu) sub.style.display = 'none';
            });
            // Toggle current
            submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
            this.querySelector('.fa-chevron-down').classList.toggle('rotate');
        }
    });
</script>