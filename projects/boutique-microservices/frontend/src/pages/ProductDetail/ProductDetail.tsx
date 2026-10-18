import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Paper,
  Divider,
  Breadcrumbs,
  Link,
  Skeleton,
  Snackbar,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as LocalShippingIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
  FavoriteBorder as WishlistIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { addItem } = useCart();

  const relatedProducts: Product[] = []; // This would come from an API call

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        const productData = await productService.getById(id);
        setProduct(productData);
      } catch (error) {
        console.error('Error loading product:', error);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      setSnackbarOpen(true);
      setQuantity(1);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (product && newQuantity >= 1 && newQuantity <= product.inventory) {
      setQuantity(newQuantity);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <LoadingSkeleton variant="detail" />
        </Box>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Product not found
          </Typography>
          <Button variant="contained" onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link component="button" variant="body1" onClick={() => navigate('/')}>
            Home
          </Link>
          <Link component="button" variant="body1" onClick={() => navigate('/products')}>
            Products
          </Link>
          <Typography variant="body1" color="text.primary">
            {product.name}
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <CardMedia
                component="img"
                sx={{
                  height: 600,
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
                image={product.imageUrl}
                alt={product.name}
              />
            </Paper>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Product Info */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip
                    label={product.category}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: 'capitalize' }}
                  />
                  {product.isNew && (
                    <Chip label="NEW" color="secondary" size="small" />
                  )}
                  {product.inventory <= 5 && product.inventory > 0 && (
                    <Chip label="Only a few left!" color="warning" size="small" />
                  )}
                </Box>
                
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                  {product.name}
                </Typography>
                
                {product.rating && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {[...Array(5)].map((_, index) => (
                      <StarIcon
                        key={index}
                        sx={{
                          fontSize: '1.2rem',
                          color: index < product.rating! ? '#ffc107' : '#e0e0e0',
                        }}
                      />
                    ))}
                    <Typography variant="body2" color="text.secondary">
                      ({product.reviewCount || 0} reviews)
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                    ${(() => {
                      const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                      return isNaN(price) || !isFinite(price) ? '0.00' : price.toFixed(2);
                    })()}
                  </Typography>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                      ${(() => {
                        const price = typeof product.originalPrice === 'string' ? parseFloat(product.originalPrice) : product.originalPrice;
                        return isNaN(price) || !isFinite(price) ? '0.00' : price.toFixed(2);
                      })()}
                    </Typography>
                  )}
                  {product.discountPercentage && product.discountPercentage > 0 && (
                    <Chip
                      label={`-${product.discountPercentage}%`}
                      color="error"
                      size="small"
                    />
                  )}
                </Box>
                
                <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.6 }}>
                  {product.description}
                </Typography>
                
                  <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalShippingIcon color="action" />
                      <Typography variant="body2">Free shipping over $500</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <RefreshIcon color="action" />
                      <Typography variant="body2">30-day returns</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SecurityIcon color="action" />
                      <Typography variant="body2">Secure payment</Typography>
                    </Box>
                  </Box>
              </Box>
              
              {/* Purchase Controls */}
              <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                {product.inventory === 0 ? (
                  <Typography variant="h6" color="error" gutterBottom>
                    Out of Stock
                  </Typography>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Typography variant="body1" sx={{ mr: 2, minWidth: 80 }}>
                        Quantity:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity <= 1}
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography
                          variant="body1"
                          sx={{
                            mx: 3,
                            minWidth: '3rem',
                            textAlign: 'center',
                            fontWeight: 600,
                            fontSize: '1.1rem',
                          }}
                        >
                          {quantity}
                        </Typography>
                        <IconButton
                          onClick={() => handleQuantityChange(1)}
                          disabled={quantity >= product.inventory}
                          sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                        {product.inventory} available
                      </Typography>
                    </Box>
                  </>
                )}
                
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleAddToCart}
                    disabled={product.inventory === 0}
                    startIcon={<ShoppingBagIcon />}
                    sx={{
                      flexGrow: 1,
                      py: 1.5,
                      backgroundColor: '#d4af37',
                      color: '#1a1a1a',
                      '&:hover': {
                        backgroundColor: '#b8941f',
                      },
                    }}
                  >
                    {product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                  
                  <IconButton
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      p: 1.5,
                    }}
                  >
                    <WishlistIcon />
                  </IconButton>
                </Box>
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/cart')}
                  fullWidth
                  sx={{ py: 1.5 }}
                >
                  View Cart ({quantity} {quantity === 1 ? 'item' : 'items'})
                </Button>
              </Paper>
              
              {/* Additional Info */}
              <Box sx={{ mt: 'auto' }}>
                <Typography variant="body2" color="text.secondary">
                  SKU: {product.id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {product.category}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Product Details Tabs */}
        <Box sx={{ mt: 6 }}>
          <Paper elevation={2}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Description" />
              <Tab label="Details" />
              <Tab label="Reviews" />
              <Tab label="Shipping" />
            </Tabs>
            
            <Box sx={{ px: 4 }}>
              <TabPanel value={tabValue} index={0}>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                  {product.description}
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                  Experience the perfect blend of luxury and functionality with this premium product. 
                  Crafted with attention to detail and using only the finest materials, this piece 
                  exemplifies excellence in design and quality.
                </Typography>
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">Product ID:</Typography>
                    <Typography variant="body1" paragraph>{product.id}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">Category:</Typography>
                    <Typography variant="body1" paragraph>{product.category}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">Availability:</Typography>
                    <Typography variant="body1" paragraph>
                      {product.inventory > 0 ? 'In Stock' : 'Out of Stock'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2" color="text.secondary">Shipping:</Typography>
                    <Typography variant="body1" paragraph>Free over $500</Typography>
                  </Grid>
                </Grid>
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                <Typography variant="body1" paragraph>
                  No reviews yet. Be the first to review this product!
                </Typography>
                <Button variant="outlined">Write a Review</Button>
              </TabPanel>
              
              <TabPanel value={tabValue} index={3}>
                <Typography variant="h6" gutterBottom>Shipping Information</Typography>
                <Typography variant="body1" paragraph>
                  • Free shipping on orders over $500<br/>
                  • Standard shipping: 5-7 business days<br/>
                  • Express shipping: 2-3 business days<br/>
                  • International shipping available<br/>
                  • 30-day return policy
                </Typography>
              </TabPanel>
            </Box>
          </Paper>
        </Box>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h4" gutterBottom>
              Related Products
            </Typography>
            <Grid container spacing={3}>
              {relatedProducts.map((relatedProduct) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={relatedProduct.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={relatedProduct.imageUrl}
                      alt={relatedProduct.name}
                    />
                    <CardContent>
                      <Typography variant="h6">{relatedProduct.name}</Typography>
                      <Typography variant="h6" color="primary">
                        ${(() => {
                          const price = typeof relatedProduct.price === 'string' ? parseFloat(relatedProduct.price) : relatedProduct.price;
                          return isNaN(price) || !isFinite(price) ? '0.00' : price.toFixed(2);
                        })()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {quantity} {quantity === 1 ? 'item' : 'items'} added to cart
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetail;