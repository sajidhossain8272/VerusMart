const { PrismaClient } = require('@prisma/client');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// 1. Manually parse .env if present
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const key = trimmed.substring(0, idx).trim();
        let val = trimmed.substring(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || '';
const apiKey = process.env.CLOUDINARY_API_KEY || '';
const apiSecret = process.env.CLOUDINARY_API_SECRET || '';
const cloudinaryUrl = process.env.CLOUDINARY_URL || '';

if (cloudinaryUrl) {
  cloudinary.config({ cloudinary_url: cloudinaryUrl, secure: true });
} else if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

function isConfigured() {
  return !!(cloudinaryUrl || (cloudName && apiKey && apiSecret));
}

const prisma = new PrismaClient();

async function uploadFileOrData(source, folder, customPublicId) {
  const options = {
    folder: `verusmart/${folder}`,
    resource_type: 'auto',
  };
  if (customPublicId) {
    options.public_id = customPublicId.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
  }

  // Base64 string or remote URL
  if (typeof source === 'string' && (source.startsWith('data:') || source.startsWith('http://') || source.startsWith('https://'))) {
    const res = await cloudinary.uploader.upload(source, options);
    return res.secure_url;
  }

  // Local file path
  if (typeof source === 'string' && fs.existsSync(source)) {
    const res = await cloudinary.uploader.upload(source, options);
    return res.secure_url;
  }

  // Buffer
  if (Buffer.isBuffer(source)) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(options, (err, res) => {
        if (err || !res) reject(err || new Error('Upload stream returned empty'));
        else resolve(res.secure_url);
      });
      stream.end(source);
    });
  }

  return null;
}

function findLocalProductImage(imgName) {
  if (!imgName) return null;
  if (imgName.startsWith('data:') || imgName.startsWith('http')) return imgName;

  const paths = [
    path.join(__dirname, '..', 'public', 'admin_uploads', 'products', imgName),
    path.join(__dirname, '..', 'public', 'products', imgName),
    path.join(__dirname, '..', 'public', 'admin_uploads', imgName),
  ];

  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function findLocalCategoryImage(imgName) {
  if (!imgName) return null;
  if (imgName.startsWith('data:') || imgName.startsWith('http')) return imgName;

  const paths = [
    path.join(__dirname, '..', 'public', 'admin_uploads', 'category', imgName),
    path.join(__dirname, '..', 'public', 'admin_uploads', imgName),
  ];

  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function findLocalBannerImage(imgName) {
  if (!imgName) return null;
  if (imgName.startsWith('data:') || imgName.startsWith('http')) return imgName;

  const paths = [
    path.join(__dirname, '..', 'public', 'admin_uploads', 'banners', imgName),
    path.join(__dirname, '..', 'public', 'admin_uploads', imgName),
  ];

  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function main() {
  console.log('🚀 Starting VerusMart Cloudinary Migration / Re-upload Script...');

  if (!isConfigured()) {
    console.error('❌ Cloudinary is not configured!');
    console.error('Please ensure your .env file includes:');
    console.error('  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"');
    console.error('  CLOUDINARY_API_KEY="your_api_key"');
    console.error('  CLOUDINARY_API_SECRET="your_api_secret"');
    console.error('Or:');
    console.error('  CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"');
    process.exit(1);
  }

  console.log(`✅ Cloudinary configured for cloud: "${cloudName || 'via URL'}"`);

  // 1. Re-upload Products
  const products = await prisma.products.findMany();
  console.log(`\n📦 Found ${products.length} products to check...`);

  let updatedCount = 0;
  for (const p of products) {
    let newImage = p.image;
    let newImage2 = p.image_2;
    let newImage3 = p.image_3;
    let changed = false;

    // Process main image
    if (p.image) {
      if (p.image.startsWith('https://res.cloudinary.com/')) {
        // Already on Cloudinary
      } else {
        const localSource = findLocalProductImage(p.image);
        if (localSource) {
          try {
            console.log(`  Uploading main image for Product #${p.id} ("${p.name}")...`);
            const cldUrl = await uploadFileOrData(localSource, 'products', `prod_${p.id}_main`);
            if (cldUrl) {
              newImage = cldUrl;
              changed = true;
              console.log(`    ↳ Uploaded: ${cldUrl}`);
            }
          } catch (err) {
            console.error(`    ⚠️ Failed to upload image for Product #${p.id}:`, err.message);
          }
        }
      }
    }

    // Process image 2
    if (p.image_2 && !p.image_2.startsWith('https://res.cloudinary.com/')) {
      const localSource2 = findLocalProductImage(p.image_2);
      if (localSource2) {
        try {
          const cldUrl = await uploadFileOrData(localSource2, 'products', `prod_${p.id}_img2`);
          if (cldUrl) {
            newImage2 = cldUrl;
            changed = true;
          }
        } catch (err) {
          console.error(`    ⚠️ Failed to upload image_2 for Product #${p.id}:`, err.message);
        }
      }
    }

    // Process image 3
    if (p.image_3 && !p.image_3.startsWith('https://res.cloudinary.com/')) {
      const localSource3 = findLocalProductImage(p.image_3);
      if (localSource3) {
        try {
          const cldUrl = await uploadFileOrData(localSource3, 'products', `prod_${p.id}_img3`);
          if (cldUrl) {
            newImage3 = cldUrl;
            changed = true;
          }
        } catch (err) {
          console.error(`    ⚠️ Failed to upload image_3 for Product #${p.id}:`, err.message);
        }
      }
    }

    if (changed) {
      await prisma.products.update({
        where: { id: p.id },
        data: {
          image: newImage,
          image_2: newImage2,
          image_3: newImage3,
        },
      });
      updatedCount++;
    }
  }

  console.log(`✨ Successfully updated ${updatedCount} products with Cloudinary URLs!`);

  // 2. Re-upload Categories
  const categories = await prisma.categories.findMany();
  console.log(`\n📂 Found ${categories.length} categories to check...`);
  for (const c of categories) {
    let newImg = c.image;
    let newBanner = c.banner;
    let changed = false;

    if (c.image && !c.image.startsWith('https://res.cloudinary.com/')) {
      const src = findLocalCategoryImage(c.image);
      if (src) {
        try {
          const cldUrl = await uploadFileOrData(src, 'categories', `cat_${c.id}`);
          if (cldUrl) {
            newImg = cldUrl;
            changed = true;
          }
        } catch (err) {
          console.error(`  ⚠️ Category #${c.id} upload failed:`, err.message);
        }
      }
    }

    if (c.banner && !c.banner.startsWith('https://res.cloudinary.com/')) {
      const src = findLocalCategoryImage(c.banner);
      if (src) {
        try {
          const cldUrl = await uploadFileOrData(src, 'categories', `cat_${c.id}_banner`);
          if (cldUrl) {
            newBanner = cldUrl;
            changed = true;
          }
        } catch (err) {
          console.error(`  ⚠️ Category #${c.id} banner upload failed:`, err.message);
        }
      }
    }

    if (changed) {
      await prisma.categories.update({
        where: { id: c.id },
        data: { image: newImg, banner: newBanner },
      });
      console.log(`  ↳ Category #${c.id} ("${c.name}") updated with Cloudinary URL.`);
    }
  }

  // 3. Re-upload Banners
  const banners = await prisma.banners.findMany();
  console.log(`\n🖼️ Found ${banners.length} banners to check...`);
  for (const b of banners) {
    if (b.image && !b.image.startsWith('https://res.cloudinary.com/')) {
      const src = findLocalBannerImage(b.image);
      if (src) {
        try {
          const cldUrl = await uploadFileOrData(src, 'banners', `banner_${b.id}`);
          if (cldUrl) {
            await prisma.banners.update({
              where: { id: b.id },
              data: { image: cldUrl },
            });
            console.log(`  ↳ Banner #${b.id} updated with Cloudinary URL.`);
          }
        } catch (err) {
          console.error(`  ⚠️ Banner #${b.id} upload failed:`, err.message);
        }
      }
    }
  }

  console.log('\n🎉 All uploads and database updates complete!');
}

main()
  .catch((err) => {
    console.error('Fatal error during migration:', err);
  })
  .finally(() => {
    prisma.$disconnect();
  });
