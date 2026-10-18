import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve static images from public/images directory
const imagesPath = path.join(__dirname, 'public/images');
console.log('Serving images from:', imagesPath);

// Check if images directory exists
if (!fs.existsSync(imagesPath)) {
  console.error('Images directory not found:', imagesPath);
  fs.mkdirSync(imagesPath, { recursive: true });
}

app.use('/images', express.static(imagesPath));
app.use('/product-images', express.static(imagesPath));

// Enhanced image serving with fallbacks
app.get('/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(imagesPath, filename);
  
  // Check if file exists
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    // Try to find a similar file (e.g., .svg instead of .jpg)
    const baseName = filename.split('.')[0];
    const svgPath = path.join(imagesPath, `${baseName}.svg`);
    
    if (fs.existsSync(svgPath)) {
      res.sendFile(svgPath);
    } else {
      // Return a placeholder image
      res.status(404).json({ 
        error: 'Image not found',
        filename: filename,
        availableImages: fs.readdirSync(imagesPath)
      });
    }
  }
});

// List all available images
app.get('/api/images', (req, res) => {
  try {
    const images = fs.readdirSync(imagesPath)
      .filter(file => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file))
      .map(file => ({
        filename: file,
        url: `http://localhost:3002/images/${file}`,
        path: path.join(imagesPath, file)
      }));
    
    res.json({ 
      success: true, 
      data: images,
      count: images.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to list images' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'Image service running', timestamp: new Date().toISOString() });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Product image service running on port ${PORT}`);
  console.log(`Serving images from: ${imagesPath}`);
});