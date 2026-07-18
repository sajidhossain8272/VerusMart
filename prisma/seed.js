const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const SQL_FILE_PATH = path.join(__dirname, '../verusmart-old/verusmart.sql');

// Column type definitions
const INT_COLUMNS = {
  admins: ['id'],
  banners: ['id'],
  brands: ['id', 'priority'],
  business_settings: ['id'],
  categories: ['id', 'priority'],
  colors: ['id'],
  contact_messages: ['id'],
  customers: ['id'],
  faqs: ['id'],
  order_items: ['id', 'order_id', 'quantity'],
  orders: ['id', 'user_id'],
  pages: ['id'],
  payment_methods: ['id'],
  phone_sell_requests: ['id', 'user_id'],
  product_colors: ['id', 'product_id', 'color_id'],
  product_gallery: ['id', 'product_id'],
  product_sizes: ['id', 'product_id', 'size_id'],
  product_variants: ['id', 'product_id'],
  products: ['id', 'category_id', 'brand_id', 'stock', 'discount_percent', 'rating', 'total_reviews'],
  refund_requests: ['id'],
  section_labels: ['id'],
  serving_areas: ['id', 'free_delivery_limit'],
  sizes: ['id'],
  sub_categories: ['id', 'category_id', 'priority'],
  users: ['id'],
  vendors: ['id'],
  wishlist: ['id', 'user_id', 'product_id']
};

const DECIMAL_COLUMNS = {
  business_settings: ['shipping_inside', 'shipping_outside'],
  order_items: ['price'],
  orders: ['total_amount'],
  phone_sell_requests: ['expected_price', 'original_price'],
  product_variants: ['price', 'old_price'],
  products: ['price', 'old_price'],
  refund_requests: ['amount']
};

const DATE_COLUMNS = {
  admins: ['created_at'],
  banners: ['created_at'],
  brands: ['created_at'],
  contact_messages: ['created_at'],
  customers: ['created_at'],
  orders: ['order_date'],
  pages: ['updated_at'],
  payment_methods: ['created_at'],
  phone_sell_requests: ['created_at'],
  product_gallery: ['created_at'],
  products: ['created_at'],
  refund_requests: ['created_at'],
  sub_categories: ['created_at'],
  users: ['created_at'],
  vendors: ['created_at'],
  wishlist: ['created_at']
};

const BOOLEAN_COLUMNS = {
  phone_sell_requests: ['is_verified'],
  products: ['is_recommended', 'is_featured', 'is_trending', 'is_best_seller', 'is_weekday_deal']
};

// SQL Dump Parser
function parseSqlDump(sqlText) {
  const inserts = [];
  let index = 0;
  
  while (true) {
    const insertStart = sqlText.indexOf('INSERT INTO `', index);
    if (insertStart === -1) break;
    
    const tableNameStart = insertStart + 'INSERT INTO `'.length;
    const tableNameEnd = sqlText.indexOf('`', tableNameStart);
    const tableName = sqlText.substring(tableNameStart, tableNameEnd);
    
    const columnsStart = sqlText.indexOf('(', tableNameEnd);
    const columnsEnd = sqlText.indexOf(')', columnsStart);
    const columnsText = sqlText.substring(columnsStart + 1, columnsEnd);
    const columns = columnsText.split(',').map(c => c.trim().replace(/`/g, ''));
    
    const valuesIndex = sqlText.indexOf('VALUES', columnsEnd);
    const valuesStart = valuesIndex + 'VALUES'.length;
    
    let insideString = null;
    let escaped = false;
    let valuesBlock = '';
    let foundSemicolon = false;
    
    let i = valuesStart;
    for (; i < sqlText.length; i++) {
      const char = sqlText[i];
      valuesBlock += char;
      
      if (escaped) {
        escaped = false;
        continue;
      }
      
      if (char === '\\') {
        escaped = true;
        continue;
      }
      
      if (insideString) {
        if (char === insideString) {
          insideString = null;
        }
        continue;
      }
      
      if (char === "'" || char === '"') {
        insideString = char;
        continue;
      }
      
      if (char === ';') {
        foundSemicolon = true;
        break;
      }
    }
    
    inserts.push({
      tableName,
      columns,
      valuesBlock: valuesBlock.substring(0, valuesBlock.length - 1).trim()
    });
    
    index = i + 1;
  }
  
  return inserts;
}

// Values Block Parser (extract rows and values)
function parseValuesBlock(valuesBlock) {
  const rows = [];
  let insideString = null;
  let escaped = false;
  let inParentheses = false;
  let currentVal = '';
  let currentRow = [];
  
  for (let i = 0; i < valuesBlock.length; i++) {
    const char = valuesBlock[i];
    
    if (escaped) {
      if (char === 'n') currentVal += '\n';
      else if (char === 'r') currentVal += '\r';
      else if (char === 't') currentVal += '\t';
      else currentVal += char;
      escaped = false;
      continue;
    }
    
    if (char === '\\') {
      escaped = true;
      continue;
    }
    
    if (insideString) {
      if (char === insideString) {
        insideString = null;
      } else {
        currentVal += char;
      }
      continue;
    }
    
    if (char === "'" || char === '"') {
      insideString = char;
      continue;
    }
    
    if (char === '(') {
      inParentheses = true;
      currentRow = [];
      currentVal = '';
      continue;
    }
    
    if (char === ')') {
      inParentheses = false;
      currentRow.push(cleanValue(currentVal));
      rows.push(currentRow);
      currentVal = '';
      continue;
    }
    
    if (char === ',') {
      if (inParentheses) {
        currentRow.push(cleanValue(currentVal));
        currentVal = '';
      }
      continue;
    }
    
    if (inParentheses) {
      currentVal += char;
    }
  }
  
  return rows;
}

function cleanValue(val) {
  const trimmed = val.trim();
  if (trimmed.toUpperCase() === 'NULL') {
    return null;
  }
  return trimmed;
}

// Convert a parsed string value to correct type based on table and column
function convertType(tableName, columnName, value) {
  if (value === null) return null;
  
  // Int
  if (INT_COLUMNS[tableName] && INT_COLUMNS[tableName].includes(columnName)) {
    return parseInt(value, 10);
  }
  
  // Decimal / Float
  if (DECIMAL_COLUMNS[tableName] && DECIMAL_COLUMNS[tableName].includes(columnName)) {
    return parseFloat(value);
  }
  
  // Date
  if (DATE_COLUMNS[tableName] && DATE_COLUMNS[tableName].includes(columnName)) {
    if (value === '0000-00-00 00:00:00' || value === '') return null;
    return new Date(value);
  }
  
  // Boolean
  if (BOOLEAN_COLUMNS[tableName] && BOOLEAN_COLUMNS[tableName].includes(columnName)) {
    return value === '1' || value === 1 || value === 'true';
  }
  
  return value;
}

async function main() {
  console.log('Starting DB seeding...');
  
  if (!fs.existsSync(SQL_FILE_PATH)) {
    console.error(`SQL dump file not found at: ${SQL_FILE_PATH}`);
    process.exit(1);
  }
  
  const sqlText = fs.readFileSync(SQL_FILE_PATH, 'utf-8');
  console.log('Loaded SQL dump file. Parsing...');
  
  const inserts = parseSqlDump(sqlText);
  console.log(`Found ${inserts.length} INSERT INTO statement blocks.`);
  
  const allTableNames = [
    'admins', 'banners', 'brands', 'business_settings', 'categories', 'colors',
    'contact_messages', 'customers', 'faqs', 'order_items', 'orders', 'pages',
    'payment_methods', 'phone_sell_requests', 'product_colors', 'product_gallery',
    'product_sizes', 'product_variants', 'products', 'refund_requests',
    'section_labels', 'serving_areas', 'sizes', 'sub_categories', 'users',
    'vendors', 'wishlist'
  ];
  
  // 1. Truncate tables first (Cascading)
  console.log('Truncating tables...');
  for (const table of allTableNames) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
      console.log(`Truncated table: ${table}`);
    } catch (err) {
      console.warn(`Failed to truncate table ${table}: ${err.message}`);
    }
  }
  
  // 2. Insert rows block by block
  for (const insert of inserts) {
    const { tableName, columns, valuesBlock } = insert;
    
    if (!prisma[tableName]) {
      console.warn(`Table "${tableName}" does not exist in Prisma Client. Skipping...`);
      continue;
    }
    
    console.log(`Processing seed data for table: ${tableName}`);
    const rawRows = parseValuesBlock(valuesBlock);
    console.log(`Parsed ${rawRows.length} rows for table: ${tableName}`);
    
    const formattedData = rawRows.map(row => {
      const dataObj = {};
      columns.forEach((col, idx) => {
        dataObj[col] = convertType(tableName, col, row[idx]);
      });
      return dataObj;
    });
    
    try {
      if (formattedData.length > 0) {
        await prisma[tableName].createMany({
          data: formattedData
        });
        console.log(`Successfully seeded ${formattedData.length} rows to "${tableName}".`);
      }
    } catch (err) {
      console.error(`Error seeding table "${tableName}":`, err);
      console.log('Attempting row-by-row fallback insertion...');
      for (const row of formattedData) {
        try {
          await prisma[tableName].create({ data: row });
        } catch (rowErr) {
          console.error(`Failed to insert row in "${tableName}":`, row, rowErr.message);
        }
      }
    }
  }
  
  // 3. Reset PostgreSQL serial sequences
  console.log('Resetting PostgreSQL sequences...');
  for (const table of allTableNames) {
    if (INT_COLUMNS[table] && INT_COLUMNS[table].includes('id')) {
      try {
        const countRes = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::integer as count FROM "${table}"`);
        const count = countRes[0].count;
        if (count > 0) {
          await prisma.$executeRawUnsafe(
            `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), coalesce(max(id), 0) + 1, false) FROM "${table}"`
          );
          console.log(`Reset sequence for table: ${table}`);
        } else {
          await prisma.$executeRawUnsafe(
            `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), 1, false) FROM "${table}"`
          );
          console.log(`Reset sequence (empty table) for table: ${table}`);
        }
      } catch (err) {
        console.warn(`Could not reset sequence for table ${table}: ${err.message}`);
      }
    }
  }
  
  console.log('DB seeding completed successfully!');
}

main()
  .catch(e => {
    console.error('Fatal error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
