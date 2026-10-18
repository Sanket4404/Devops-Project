import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Serve static images from public directory
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Mock products data with proper image URLs
const mockProducts = [
  {
    id: '1',
    name: 'Midnight Silk Evening Gown',
    description: 'Exquisite floor-length gown crafted from 100% mulberry silk with a flowing A-line silhouette.',
    price: 1899.00,
    image_url: '/images/dress.svg',
    category: 'clothing',
    inventory: 15,
    rating: 4.8,
    reviewCount: 12,
    isNew: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Italian Wool Cashmere Coat',
    description: 'Sophisticated double-breasted coat crafted from premium Italian wool and cashmere blend.',
    price: 1299.00,
    image_url: '/images/coat.svg',
    category: 'clothing',
    inventory: 12,
    rating: 4.9,
    reviewCount: 8,
    isNew: true,
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z'
  },
  {
    id: '3',
    name: 'French Silk Pleated Blouse',
    description: 'Elegant blouse featuring delicate pleating details crafted from premium French silk.',
    price: 599.00,
    image_url: '/images/blouse.svg',
    category: 'clothing',
    inventory: 18,
    rating: 4.6,
    reviewCount: 15,
    isNew: false,
    created_at: '2024-01-13T10:00:00Z',
    updated_at: '2024-01-13T10:00:00Z'
  },
  {
    id: '4',
    name: 'Italian Wool Trousers',
    description: 'Perfectly tailored trousers crafted from premium Italian wool crepe.',
    price: 449.00,
    image_url: '/images/jeans.svg',
    category: 'clothing',
    inventory: 20,
    rating: 4.7,
    reviewCount: 10,
    isNew: false,
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T10:00:00Z'
  },
  {
    id: '5',
    name: 'Mongolian Cashmere V-Neck Sweater',
    description: 'Luxurious V-neck sweater spun from the finest Mongolian cashmere.',
    price: 399.00,
    image_url: '/images/tshirt.svg',
    category: 'clothing',
    inventory: 25,
    rating: 4.9,
    reviewCount: 22,
    isNew: true,
    created_at: '2024-01-11T10:00:00Z',
    updated_at: '2024-01-11T10:00:00Z'
  },
  {
    id: '6',
    name: 'Hand-Painted Silk Scarf',
    description: 'Artisan hand-painted silk scarf featuring an abstract floral design.',
    price: 299.00,
    image_url: '/images/scarf.svg',
    category: 'accessories',
    inventory: 30,
    rating: 4.8,
    reviewCount: 18,
    isNew: false,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z'
  },
  {
    id: '7',
    name: 'Italian Leather Reversible Belt',
    description: 'Versatile reversible belt crafted from premium Italian leather.',
    price: 189.00,
    image_url: '/images/belt.svg',
    category: 'accessories',
    inventory: 35,
    rating: 4.5,
    reviewCount: 14,
    isNew: false,
    created_at: '2024-01-09T10:00:00Z',
    updated_at: '2024-01-09T10:00:00Z'
  },
  {
    id: '8',
    name: 'Italian Leather Tote Bag',
    description: 'Spacious yet elegant tote bag crafted from full-grain Italian calfskin.',
    price: 899.00,
    image_url: '/images/crossbody.svg',
    category: 'bags',
    inventory: 8,
    rating: 4.9,
    reviewCount: 20,
    isNew: true,
    created_at: '2024-01-08T10:00:00Z',
    updated_at: '2024-01-08T10:00:00Z'
  },
  {
    id: '9',
    name: 'Beaded Evening Clutch',
    description: 'Stunning evening clutch featuring thousands of hand-sewn crystal beads.',
    price: 449.00,
    image_url: '/images/crossbody.svg',
    category: 'bags',
    inventory: 12,
    rating: 4.7,
    reviewCount: 16,
    isNew: false,
    created_at: '2024-01-07T10:00:00Z',
    updated_at: '2024-01-07T10:00:00Z'
  },
  {
    id: '10',
    name: 'Akoya Pearl Stud Earrings',
    description: 'Timeless stud earrings featuring perfectly round Akoya pearls with brilliant luster.',
    price: 799.00,
    image_url: '/images/earrings.svg',
    category: 'jewelry',
    inventory: 10,
    rating: 5.0,
    reviewCount: 25,
    isNew: false,
    created_at: '2024-01-06T10:00:00Z',
    updated_at: '2024-01-06T10:00:00Z'
  },
  {
    id: '11',
    name: 'Italian Leather Stiletto Heels',
    description: 'Elegant stiletto heels crafted from Italian patent leather.',
    price: 699.00,
    image_url: '/images/shoes.svg',
    category: 'shoes',
    inventory: 8,
    rating: 4.6,
    reviewCount: 12,
    isNew: true,
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z'
  },
  {
    id: '12',
    name: 'Ballet Flats Leather Shoes',
    description: 'Comfortable yet chic ballet flats crafted from soft Italian lambskin leather.',
    price: 399.00,
    image_url: '/images/shoes.svg',
    category: 'shoes',
    inventory: 18,
    rating: 4.8,
    reviewCount: 19,
    isNew: false,
    created_at: '2024-01-04T10:00:00Z',
    updated_at: '2024-01-04T10:00:00Z'
  }
];

app.get('/products', (req, res) => {
  const { page = '1', limit = '12', category, search, sortBy } = req.query;
  
  let filteredProducts = [...mockProducts];
  
  // Apply filters
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }
  
  if (search) {
    const searchLower = search.toString().toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.category.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply sorting
  if (sortBy) {
    switch (sortBy) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'created_at':
        filteredProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }
  }
  
  const pageNum = parseInt(String(page));
  const limitNum = parseInt(String(limit));
  const offset = (pageNum - 1) * limitNum;
  
  const paginatedProducts = filteredProducts.slice(offset, offset + limitNum);
  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / limitNum);
  
  res.json({
    success: true,
    data: {
      products: paginatedProducts,
      pagination: {
        currentPage: pageNum,
        totalPages,
        total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    }
  });
});

app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = mockProducts.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  
  res.json({ success: true, data: product });
});

app.get('/categories', (req, res) => {
  const categories = [
    { id: '1', name: 'clothing', description: 'Luxury clothing items', image_url: '/images/dress.svg', product_count: 5 },
    { id: '2', name: 'accessories', description: 'Fashion accessories', image_url: '/images/scarf.svg', product_count: 2 },
    { id: '3', name: 'bags', description: 'Designer bags and purses', image_url: '/images/crossbody.svg', product_count: 2 },
    { id: '4', name: 'jewelry', description: 'Fine jewelry pieces', image_url: '/images/earrings.svg', product_count: 1 },
    { id: '5', name: 'shoes', description: 'Luxury footwear', image_url: '/images/shoes.svg', product_count: 2 }
  ];
  
  res.json({ success: true, data: categories });
});

app.get('/health', (req, res) => {
  res.json({ status: 'Product service is healthy', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Mock Products service running on port ${PORT}`);
  console.log(`Serving images from: ${path.join(__dirname, 'public')}`);
});