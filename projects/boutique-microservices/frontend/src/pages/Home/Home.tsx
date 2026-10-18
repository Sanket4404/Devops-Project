import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Paper,
  IconButton,
  Fade,
  Slide,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ShoppingBag as ShoppingBagIcon,
  Star as StarIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import ProductCard from '../../components/common/ProductCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      console.log('[Home] Loading products...');
      try {
        const featuredProducts = await productService.getAll();
        console.log('[Home] Got products:', featuredProducts.length);
        setProducts(featuredProducts.slice(0, 8));
      } catch (error) {
        console.error('[Home] Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <LoadingSkeleton count={8} />
        </Box>
      </Container>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #424242 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                    }}
                  >
                    Discover Timeless
                    <Box component="span" sx={{ color: '#d4af37' }}>
                      {' '}Elegance
                    </Box>
                  </Typography>
                  <Typography
                    variant="h5"
                    component="p"
                    sx={{
                      mb: 4,
                      lineHeight: 1.6,
                      fontWeight: 300,
                      opacity: 0.9,
                    }}
                  >
                    Indulge in our curated collection of luxury products, 
                    where sophistication meets exceptional quality.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ShoppingBagIcon />}
                      href="/products"
                      sx={{
                        backgroundColor: '#d4af37',
                        color: '#1a1a1a',
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: '#b8941f',
                        },
                      }}
                    >
                      Shop Collection
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      href="#featured"
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderColor: 'white',
                        },
                      }}
                    >
                      Explore More
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Slide in timeout={1500} direction="right">
                <Box
                  sx={{
                    height: { xs: 300, md: 400 },
                    background: 'linear-gradient(45deg, #d4af37 0%, #f4e5c2 100%)',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: '"Playfair Display", serif',
                      color: '#1a1a1a',
                      textAlign: 'center',
                      p: 4,
                    }}
                  >
                    LUXURY
                    <br />
                    REDEFINED
                  </Typography>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <ShippingIcon sx={{ fontSize: 48, color: '#d4af37', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Free Shipping
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  On orders over $500
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <SecurityIcon sx={{ fontSize: 48, color: '#d4af37', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Secure Payment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  100% secure transactions
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <StarIcon sx={{ fontSize: 48, color: '#d4af37', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Premium Quality
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Carefully selected products
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <RefreshIcon sx={{ fontSize: 48, color: '#d4af37', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Easy Returns
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  30-day return policy
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Featured Products Section */}
      <Box sx={{ backgroundColor: '#f8f8f8', py: 8 }} id="featured">
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontFamily: '"Playfair Display", serif' }}
            >
              Featured Products
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Discover our handpicked selection of luxury items
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
                <ProductCard
                  product={product}
                  onAddToCart={addItem}
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              href="/products"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 4,
                py: 1.5,
              }}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Home;