const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
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

app.get('/health', (req, res) => {
  res.json({ status: 'Product service is healthy', timestamp: new Date().toISOString() });
});

app.get('/products', async (req, res) => {
  try {
    const {
      page = '1',
      limit = '12',
      sortBy = 'created_at',
      category,
      search,
      minPrice,
      maxPrice
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let whereClause = 'WHERE 1=1';
    const queryParams = [];

    if (category) {
      whereClause += ' AND category = $' + (queryParams.length + 1);
      queryParams.push(category);
    }

    if (search) {
      whereClause += ' AND (name ILIKE $' + (queryParams.length + 1) + ' OR description ILIKE $' + (queryParams.length + 2) + ')';
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (minPrice) {
      whereClause += ' AND price >= $' + (queryParams.length + 1);
      queryParams.push(minPrice);
    }

    if (maxPrice) {
      whereClause += ' AND price <= $' + (queryParams.length + 1);
      queryParams.push(maxPrice);
    }

    const countQuery = `SELECT COUNT(*) as total FROM products ${whereClause}`;
    const productsQuery = `
      SELECT * FROM products 
      ${whereClause}
      ORDER BY ${sortBy}
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;
    queryParams.push(limitNum, offset);

    const [countResult, productsResult] = await Promise.all([
      pool.query(countQuery, queryParams.slice(0, -2)),
      pool.query(productsQuery, queryParams)
    ]);

    const total = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(total / limitNum);

    const response = {
      success: true,
      data: {
        products: productsResult.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          total,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, error: 'Failed to get products' });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const response = {
      success: true,
      data: result.rows[0]
    };

    res.json(response);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, error: 'Failed to get product' });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Product service running on port ${PORT}`);
});