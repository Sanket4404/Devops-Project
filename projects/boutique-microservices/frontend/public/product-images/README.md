# Product Images

This folder contains production-ready images for your boutique products.

## Expected Image Files

Place your AI-generated production images with these exact filenames:

1. `silk-evening-gown.jpg` - For "Silk Evening Gown" product
2. `cashmere-coat.jpg` - For "Cashmere Coat" product  
3. `leather-handbag.jpg` - For "Leather Handbag" product
4. `diamond-necklace.jpg` - For "Diamond Necklace" product
5. `designer-heels.jpg` - For "Designer Heels" product

## Image Specifications

- **Format**: JPG or PNG recommended
- **Resolution**: 800x800px or higher for best quality
- **File Size**: Under 500KB for fast loading
- **Background**: Clean, professional product photography
- **Style**: Luxury boutique aesthetic

## Adding New Products

When you add new products, update the `getImageForProduct()` function in `simple-product-service.js` to include appropriate image mapping.

Example for a new product:
```javascript
else if (productName.includes('product name')) {
  return '/product-images/new-product-image.jpg';
}
```

## Placeholder

The `placeholder.jpg` is used for any products that don't have specific images mapped.

## Testing

After adding images, test by visiting: http://localhost:3000/products