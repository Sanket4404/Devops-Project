import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Paper,
  Button,
  IconButton,
  Breadcrumbs,
  Link,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
  Cancel as CancelledIcon,
  Pending as PendingIcon,
  Reorder as ReorderIcon,
  Star as StarIcon,
  ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material';
import { orderService } from '../../services/orderService';
import { Order } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const userOrders = await orderService.getUserOrders();
        setOrders(userOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadOrders();
    }
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <DeliveredIcon color="success" />;
      case 'shipped':
        return <ShippingIcon color="info" />;
      case 'cancelled':
        return <CancelledIcon color="error" />;
      default:
        return <PendingIcon color="warning" />;
    }
  };

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'info' | 'default' => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'cancelled':
        return 'error';
      case 'processing':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Please log in to view your orders
          </Typography>
          <Button variant="contained" href="/login">
            Sign In
          </Button>
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <LoadingSkeleton variant="list" count={5} />
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
          <Link component="button" variant="body1" onClick={() => navigate('/profile')}>
            Profile
          </Link>
          <Typography variant="body1" color="text.primary">
            Orders
          </Typography>
        </Breadcrumbs>

        <Typography variant="h3" component="h1" gutterBottom>
          My Orders
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </Typography>

        {orders.length === 0 ? (
          <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
            <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 3, backgroundColor: '#f5f5f5' }}>
              <ShoppingBagIcon sx={{ fontSize: 40, color: '#999' }} />
            </Avatar>
            <Typography variant="h5" gutterBottom>
              You haven't placed any orders yet
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              Start shopping to see your order history here
            </Typography>
            <Button
              variant="contained"
              size="large"
              href="/products"
              sx={{ px: 4 }}
            >
              Start Shopping
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {orders.map((order) => (
              <Grid size={{ xs: 12, }} key={order.id}>
                <Card elevation={2}>
                  <CardContent sx={{ p: 3 }}>
                    {/* Order Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Order #{order.id.slice(-8)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          icon={getStatusIcon(order.status)}
                          label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          color={getStatusColor(order.status)}
                          variant="outlined"
                        />
                        <IconButton size="small">
                          <ViewIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Order Items Accordion */}
                    <Accordion sx={{ mb: 2 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mr: 2 }}>
                          <Typography variant="subtitle1">
                            {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
                          </Typography>
                          <Typography variant="h6" color="primary">
                            ${typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount).toFixed(2) : order.totalAmount.toFixed(2)}
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List>
                          {order.items.map((item, index) => (
                            <Box key={item.id}>
                              <ListItem sx={{ px: 0 }}>
                                <ListItemIcon>
                                  <CardMedia
                                    component="img"
                                    sx={{
                                      width: 60,
                                      height: 60,
                                      borderRadius: 1,
                                      objectFit: 'cover',
                                    }}
                                    image={item.product.imageUrl}
                                    alt={item.product.name}
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={item.product.name}
                                  secondary={`Quantity: ${item.quantity} × $${typeof item.price === 'string' ? parseFloat(item.price).toFixed(2) : item.price.toFixed(2)}`}
                                  primaryTypographyProps={{ variant: 'subtitle2' }}
                                  secondaryTypographyProps={{ variant: 'body2' }}
                                />
                                <Typography variant="subtitle1" sx={{ minWidth: 80, textAlign: 'right' }}>
                                  ${((typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity).toFixed(2)}
                                </Typography>
                              </ListItem>
                              {index < order.items.length - 1 && <Divider />}
                            </Box>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>

                    {/* Order Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          size="small"
                          startIcon={<DownloadIcon />}
                          variant="outlined"
                        >
                          Invoice
                        </Button>
                        {order.status === 'delivered' && (
                          <Button
                            size="small"
                            startIcon={<StarIcon />}
                            variant="outlined"
                          >
                            Review
                          </Button>
                        )}
                        {order.status === 'delivered' && (
                          <Button
                            size="small"
                            startIcon={<ReorderIcon />}
                            variant="contained"
                          >
                            Reorder
                          </Button>
                        )}
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        Est. Delivery: {new Date(
                          new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000
                        ).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Orders;