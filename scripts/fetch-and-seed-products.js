const { JSDOM } = require('jsdom');
const fs = require('fs/promises');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function downloadFile(url, destPath) {
  try {
    await fs.mkdir(path.dirname(destPath), { recursive: true });
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(destPath, buffer);
    return true;
  } catch (error) {
    console.error(`Failed to download ${url}:`, error.message);
    return false;
  }
}

async function run() {
  try {
    console.log('Fetching products list HTML...');
    const listUrl = 'https://verusmart.com/products.php';
    const response = await fetch(listUrl);
    const html = await response.text();

    const dom = new JSDOM(html);
    const document = dom.window.document;
    const cards = document.querySelectorAll('.product-card');
    console.log(`Found ${cards.length} product cards in HTML.`);

    // Fetch existing categories from database to map them
    const existingCategories = await prisma.categories.findMany();
    const categoryMap = new Map();
    existingCategories.forEach(cat => {
      categoryMap.set(cat.name.toLowerCase().trim(), cat.id);
    });

    for (const card of cards) {
      // 1. Scrape category name from card
      const categoryEl = card.querySelector('div[style*="text-transform: uppercase"]');
      const rawCategoryName = categoryEl ? categoryEl.textContent.trim() : 'Uncategorized';
      let categoryId = categoryMap.get(rawCategoryName.toLowerCase());

      // If category not found in DB, create it
      if (!categoryId) {
        console.log(`Creating category: "${rawCategoryName}"`);
        const newCat = await prisma.categories.create({
          data: {
            name: rawCategoryName,
            priority: 1,
            status: 'active'
          }
        });
        categoryId = newCat.id;
        categoryMap.set(rawCategoryName.toLowerCase(), categoryId);
      }

      // 2. Scrape product title
      const titleEl = card.querySelector('.title-text');
      const name = titleEl ? titleEl.textContent.trim() : 'Unknown Product';

      // 3. Scrape image source and extract basename
      const imgEl = card.querySelector('img');
      const imgRelativeSrc = imgEl ? imgEl.getAttribute('src') : null;
      let imageName = null;

      if (imgRelativeSrc) {
        const basename = path.basename(imgRelativeSrc);
        imageName = basename;

        // Download and store the image locally
        const originUrl = `https://verusmart.com/${imgRelativeSrc}`;
        
        // Save to public/admin_uploads/products
        const adminDestPath = path.join(process.cwd(), 'public', 'admin_uploads', 'products', basename);
        console.log(`Downloading image for ${name} to admin_uploads...`);
        await downloadFile(originUrl, adminDestPath);

        // Save to public/products
        const publicDestPath = path.join(process.cwd(), 'public', 'products', basename);
        console.log(`Downloading image for ${name} to public/products...`);
        await downloadFile(originUrl, publicDestPath);
      }

      // 4. Scrape prices
      const currentPriceEl = card.querySelector('.current-price');
      const oldPriceEl = card.querySelector('.old-price');

      const price = currentPriceEl ? parseFloat(currentPriceEl.textContent.replace(/[^0-9.]/g, '')) : 0.0;
      const oldPrice = oldPriceEl ? parseFloat(oldPriceEl.textContent.replace(/[^0-9.]/g, '')) : 0.0;

      // 5. Build default descriptive info or check if we want detail links
      const description = `Imported premium ${rawCategoryName} product. High-quality and long lasting selection.`;

      // 6. Check if product already exists in DB (by name)
      const existingProduct = await prisma.products.findFirst({
        where: { name }
      });

      if (existingProduct) {
        console.log(`Product "${name}" already exists in database. Updating details...`);
        await prisma.products.update({
          where: { id: existingProduct.id },
          data: {
            price,
            old_price: oldPrice,
            image: imageName,
            category_id: categoryId,
            status: 'active'
          }
        });
      } else {
        console.log(`Creating product: "${name}"`);
        await prisma.products.create({
          data: {
            name,
            description,
            price,
            old_price: oldPrice,
            stock: 100,
            image: imageName,
            category_id: categoryId,
            status: 'active',
            unit: '1 pcs',
            is_recommended: true,
            is_featured: false,
            is_trending: true,
            is_best_seller: false,
            is_weekday_deal: false
          }
        });
      }
    }

    console.log('Product scraping and seeding successfully completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
