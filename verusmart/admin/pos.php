<?php 
// ১. কানেকশন ও হেডার-সাইডবার ইনক্লুড
include '../db.php'; 
include 'header.php'; 
include 'sidebar.php'; 

// ডাটা ফেচ করা (প্রোডাক্ট এবং ক্যাটাগরি)
$categories = mysqli_query($conn, "SELECT * FROM categories WHERE status='active'");
$products = mysqli_query($conn, "SELECT p.*, c.name as cat_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.status='active'");
?>

<style>
    :root { --primary: #15803d; --bg-light: #f8fafb; --border: #e2e8f0; }
    
    .content-wrapper { margin-left: 260px; padding: 80px 20px 20px; background: var(--bg-light); min-height: 100vh; transition: 0.3s; }
    
    .pos-container { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; height: calc(100vh - 120px); }

    /* বামদিকের প্রোডাক্ট সেকশন */
    .product-section { background: #fff; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .search-filter { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
    .search-filter input { flex: 1; padding: 10px; border: 1px solid var(--border); border-radius: 8px; outline: none; }
    
    .cat-scroll { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 15px; }
    .cat-badge { background: #f1f5f9; padding: 8px 15px; border-radius: 20px; font-size: 13px; cursor: pointer; white-space: nowrap; font-weight: 600; border: 1px solid transparent; }
    .cat-badge.active { background: var(--primary); color: white; }

    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px; overflow-y: auto; padding-right: 5px; }
    .pos-product-card { border: 1px solid var(--border); border-radius: 10px; padding: 10px; text-align: center; cursor: pointer; transition: 0.2s; background: #fff; }
    .pos-product-card:hover { border-color: var(--primary); transform: translateY(-3px); box-shadow: 0 5px 10px rgba(0,0,0,0.05); }
    .pos-product-card img { width: 80px; height: 80px; object-fit: contain; margin-bottom: 8px; }
    .pos-product-card h5 { font-size: 13px; margin: 5px 0; color: #1e293b; height: 35px; overflow: hidden; }
    .pos-product-card p { font-size: 14px; font-weight: 800; color: var(--primary); margin: 0; }

    /* ডানদিকের কার্ট সেকশন */
    .billing-section { background: #fff; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .cart-table { flex: 1; overflow-y: auto; margin-bottom: 20px; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { text-align: left; font-size: 12px; text-transform: uppercase; color: #64748b; border-bottom: 2px solid var(--border); padding: 10px 5px; }
    .table td { padding: 10px 5px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    
    .qty-input { width: 50px; padding: 5px; border: 1px solid var(--border); border-radius: 4px; text-align: center; }
    
    .bill-summary { border-top: 2px dashed var(--border); padding-top: 15px; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 15px; }
    .total-row { font-size: 20px; font-weight: 800; color: #1e293b; margin-top: 10px; border-top: 1px solid var(--border); padding-top: 10px; }

    .btn-pay { background: var(--primary); color: white; border: none; width: 100%; padding: 15px; border-radius: 10px; font-size: 16px; font-weight: 800; cursor: pointer; margin-top: 10px; }
    .btn-pay:hover { background: #166534; }

    /* রেসপনসিভ */
    @media (max-width: 1100px) {
        .pos-container { grid-template-columns: 1fr; height: auto; }
        .content-wrapper { margin-left: 0; }
        .product-section { height: 500px; }
    }
</style>

<div class="content-wrapper">
    <div class="pos-container">
        
        <!-- বামদিক: প্রোডাক্ট সিলেকশন -->
        <div class="product-section">
            <div class="search-filter">
                <input type="text" id="productSearch" placeholder="Search product by name or SKU..." onkeyup="filterProducts()">
                <select class="search-filter" style="width: auto; flex: 0;" onchange="filterByCategory(this.value)">
                    <option value="all">All Categories</option>
                    <?php while($cat = mysqli_fetch_assoc($categories)){ ?>
                        <option value="<?php echo $cat['id']; ?>"><?php echo $cat['name']; ?></option>
                    <?php } ?>
                </select>
            </div>

            <div class="product-grid" id="productGrid">
                <?php while($prod = mysqli_fetch_assoc($products)){ ?>
                <div class="pos-product-card" 
                     data-id="<?php echo $prod['id']; ?>" 
                     data-name="<?php echo htmlspecialchars($prod['name']); ?>" 
                     data-price="<?php echo $prod['price']; ?>" 
                     data-cat="<?php echo $prod['category_id']; ?>"
                     onclick="addToCart(this)">
                    <img src="uploads/products/<?php echo $prod['image']; ?>" onerror="this.src='https://via.placeholder.com/80'">
                    <h5><?php echo $prod['name']; ?></h5>
                    <p>$<?php echo number_format($prod['price'], 2); ?></p>
                </div>
                <?php } ?>
            </div>
        </div>

        <!-- ডানদিক: বিলিং কার্ট -->
        <div class="billing-section">
            <h4 style="margin-top:0;"><i class="fa-solid fa-cart-shopping"></i> Current Order</h4>
            
            <div class="cart-table">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id="cartBody">
                        <!-- আইটেম এখানে যোগ হবে -->
                    </tbody>
                </table>
            </div>

            <div class="bill-summary">
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span id="subTotal">$0.00</span>
                </div>
                <div class="summary-row">
                    <span>Discount</span>
                    <input type="number" id="discount" value="0" style="width:60px; text-align:right;" onchange="calculateTotal()">
                </div>
                <div class="total-row summary-row">
                    <span>Total Payable</span>
                    <span id="grandTotal">$0.00</span>
                </div>
                
                <button class="btn-pay" onclick="placeOrder()">
                    <i class="fa-solid fa-check-double"></i> Complete Sale & Print
                </button>
            </div>
        </div>

    </div>
</div>

<script>
let cart = [];

function addToCart(element) {
    const id = element.getAttribute('data-id');
    const name = element.getAttribute('data-name');
    const price = parseFloat(element.getAttribute('data-price'));

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ id, name, price, qty: 1 });
    }
    renderCart();
}

function renderCart() {
    const cartBody = document.getElementById('cartBody');
    cartBody.innerHTML = '';
    let subTotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        subTotal += itemTotal;

        cartBody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td><input type="number" class="qty-input" value="${item.qty}" min="1" onchange="updateQty(${index}, this.value)"></td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${itemTotal.toFixed(2)}</td>
                <td><i class="fa-solid fa-trash text-danger" style="cursor:pointer; color:red;" onclick="removeItem(${index})"></i></td>
            </tr>
        `;
    });

    document.getElementById('subTotal').innerText = '$' + subTotal.toFixed(2);
    calculateTotal();
}

function updateQty(index, qty) {
    cart[index].qty = parseInt(qty);
    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

function calculateTotal() {
    const subTotal = parseFloat(document.getElementById('subTotal').innerText.replace('$', ''));
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const grandTotal = subTotal - discount;
    document.getElementById('grandTotal').innerText = '$' + (grandTotal > 0 ? grandTotal : 0).toFixed(2);
}

function filterProducts() {
    const search = document.getElementById('productSearch').value.toLowerCase();
    const cards = document.getElementsByClassName('pos-product-card');

    for (let card of cards) {
        const name = card.getAttribute('data-name').toLowerCase();
        card.style.display = name.includes(search) ? 'block' : 'none';
    }
}

function filterByCategory(catId) {
    const cards = document.getElementsByClassName('pos-product-card');
    for (let card of cards) {
        const itemCat = card.getAttribute('data-cat');
        if (catId === 'all' || itemCat === catId) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    }
}

function placeOrder() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }
    alert("Order Placed Successfully! Processing Payment...");
    // এখানে আপনি AJAX দিয়ে ডাটাবেসে ডাটা পাঠাতে পারেন।
    cart = [];
    renderCart();
}
</script>

</body>
</html>