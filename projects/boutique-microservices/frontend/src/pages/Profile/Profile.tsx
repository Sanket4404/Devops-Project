import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  ShoppingBag as OrdersIcon,
  Favorite as WishlistIcon,
  CreditCard as PaymentIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Please log in to view your profile
          </Typography>
          <Button variant="contained" href="/login">
            Sign In
          </Button>
        </Box>
      </Container>
    );
  }

  const menuItems = [
    { icon: <OrdersIcon />, label: 'Order History', path: '/orders' },
    { icon: <WishlistIcon />, label: 'Wishlist', path: '/wishlist' },
    { icon: <PaymentIcon />, label: 'Payment Methods', path: '/payment' },
    { icon: <SettingsIcon />, label: 'Account Settings', path: '/settings' },
  ];

  const stats = [
    { label: 'Total Orders', value: '12' },
    { label: 'Wishlist Items', value: '8' },
    { label: 'Member Since', value: new Date(user.createdAt || Date.now()).toLocaleDateString() },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          My Profile
        </Typography>
        
        <Grid container spacing={4}>
          {/* Profile Header */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  backgroundColor: '#d4af37',
                  color: '#1a1a1a',
                  fontSize: '3rem',
                  fontWeight: 600,
                }}
              >
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {user.firstName} {user.lastName}
              </Typography>
              <Chip
                label={user.role}
                color="primary"
                size="small"
                sx={{ mb: 2, textTransform: 'capitalize' }}
              />
              <Typography variant="body2" color="text.secondary" paragraph>
                {user.email}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                fullWidth
                sx={{ mb: 2 }}
              >
                Edit Profile
              </Button>
              <Button
                variant="text"
                color="error"
                startIcon={<LogoutIcon />}
                fullWidth
              >
                Logout
              </Button>
            </Paper>
          </Grid>
          
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={3}>
              {/* Stats Cards */}
              <Grid size={{ xs: 12 }}>
                <Grid container spacing={2}>
                  {stats.map((stat, index) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={index}>
                      <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Typography variant="h4" color="primary" gutterBottom>
                            {stat.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stat.label}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              
              {/* Personal Information */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <PersonIcon color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Full Name"
                        secondary={`${user.firstName} ${user.lastName}`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email Address"
                        secondary={user.email}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Phone Number"
                        secondary="Not provided"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LocationIcon color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Address"
                        secondary="Not provided"
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              
              {/* Quick Actions */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <List>
                    {menuItems.map((item, index) => (
                      <ListItem
                        key={index}
                        component="a"
                        href={item.path}
                        sx={{ borderRadius: 2, mb: 1 }}
                      >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
              
              {/* Recent Activity */}
              <Grid size={{ xs: 12 }}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Your recent activity will appear here
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile;