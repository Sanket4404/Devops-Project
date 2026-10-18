import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
require('dotenv').config();

const app = express();
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'boutique_auth',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

// Update all products to use the new image service URLs
const imageServiceUrl = 'http://localhost:3002/product-images';

const updateProducts = async () => {
  const result = await pool.query('SELECT name FROM products');
  for (const product of result.rows) {
    const imageUrl = `${imageServiceUrl}/${encodeURIComponent(product.name)}`;
    
    await pool.query(
      'UPDATE products SET image_url = $1, images = $2 WHERE name = $3',
      [imageUrl, [imageUrl], product.name]
    );
  }
  console.log(`Updated ${result.rows.length} products with new image URLs`);
};

app.get('/health', (req, res) => {
  res.json({ status: 'Product update service running', timestamp: new Date().toISOString() });
});

app.post('/update-images', async (req, res) => {
  try {
    await updateProducts();
    res.json({ success: true, message: 'All products updated with working image URLs' });
  } catch (error) {
    console.error('Error updating products:', error);
    res.status(500).json({ success: false, error: 'Failed to update products' });
  }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Product update service running on port ${PORT}`);
  // Auto-update images on startup
  setTimeout(updateProducts, 1000);
});