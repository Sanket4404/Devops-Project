import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Grid,
  Paper,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [removedItemName, setRemovedItemName] = useState('');

  const handleCheckout = () => {
    // In a real app, this would navigate to checkout
    navigate('/checkout');
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    const item = items.find(item => item.id === productId);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity >= 1 && newQuantity <= item.inventory) {
        updateQuantity(productId, newQuantity);
      }
    }
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeItem(productId);
    setRemovedItemName(productName);
    setSnackbarOpen(true);
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <ShoppingBagIcon sx={{ fontSize: 80, color: '#d4af37', mb: 3 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            Your Cart is Empty
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Looks like you haven't added any products to your cart yet.
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="/products"
            sx={{ px: 4, py: 1.5 }}
          >
            Start Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  const subtotal = total;
  const shipping = subtotal > 500 ? 0 : 15;
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + shipping + tax;

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Shopping Cart
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          {items.length} {items.length === 1 ? 'Item' : 'Items'} in your cart
        </Typography>
        
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
              {items.map((item, index) => (
                <Box key={item.id}>
                  <Box sx={{ py: 2 }}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid size={{ xs: 12, sm: 2 }}>
                        <CardMedia
                          component="img"
                          sx={{
                            height: 120,
                            objectFit: 'cover',
                            borderRadius: 2,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          }}
                          image={item.imageUrl}
                          alt={item.name}
                        />
                      </Grid>
                      
                      <Grid size={{ xs: 12, sm: 5 }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {item.category}
                        </Typography>
                        <Typography variant="body1" color="primary" sx={{ fontWeight: 600 }}>
                          ${typeof item.price === 'string' ? parseFloat(item.price).toFixed(2) : item.price.toFixed(2)} each
                        </Typography>
                      </Grid>
                      
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={item.quantity <= 1}
                            sx={{
                              backgroundColor: 'background.paper',
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
                            sx={{ 
                              minWidth: '3rem', 
                              textAlign: 'center',
                              fontWeight: 600,
                              fontSize: '1.1rem'
                            }}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton
                            onClick={() => handleQuantityChange(item.id, 1)}
                            disabled={item.quantity >= item.inventory}
                            sx={{
                              backgroundColor: 'background.paper',
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
                        {item.inventory <= 5 && item.inventory > 0 && (
                          <Typography variant="caption" color="warning.main">
                            Only {item.inventory} left in stock!
                          </Typography>
                        )}
                      </Grid>
                      
                      <Grid size={{ xs: 12, sm: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            ${((typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity).toFixed(2)}
                          </Typography>
                          <IconButton
                            onClick={() => handleRemoveItem(item.id, item.name)}
                            color="error"
                            sx={{
                              '&:hover': {
                                backgroundColor: 'rgba(211, 47, 47, 0.04)',
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                  {index < items.length - 1 && <Divider />}
                </Box>
              ))}
            </Paper>
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                href="/products"
                sx={{ px: 3 }}
              >
                Continue Shopping
              </Button>
              <Button
                variant="outlined"
                onClick={clearCart}
                color="error"
                sx={{ px: 3 }}
              >
                Clear Cart
              </Button>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 24 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Order Summary
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">Subtotal:</Typography>
                  <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShippingIcon fontSize="small" />
                    <Typography variant="body1">Shipping:</Typography>
                  </Box>
                  <Typography variant="body1">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </Typography>
                </Box>
                
                {shipping > 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                    Add ${(500 - subtotal).toFixed(2)} more for free shipping
                  </Typography>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">Tax:</Typography>
                  <Typography variant="body1">${tax.toFixed(2)}</Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Total:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#d4af37' }}>
                    ${finalTotal.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
              
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleCheckout}
                fullWidth
                sx={{ mb: 2, py: 1.5 }}
              >
                Proceed to Checkout
              </Button>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', mb: 2 }}>
                <SecurityIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  Secure Checkout Process
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {removedItemName} removed from cart
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Cart;