import React from 'react';
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ShoppingCart,
  AccountCircle,
  Home,
  ShoppingBag,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useState } from 'react';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Boutique
        </Typography>
      </Toolbar>
      <List>
        <ListItem component={RouterLink} to="/">
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem component={RouterLink} to="/products">
          <ListItemIcon>
            <ShoppingBag />
          </ListItemIcon>
          <ListItemText primary="Products" />
        </ListItem>
        {isAuthenticated && (
          <>
            <ListItem component={RouterLink} to="/orders">
              <ListItemIcon>
                <ShoppingBag />
              </ListItemIcon>
              <ListItemText primary="Orders" />
            </ListItem>
            <ListItem component={RouterLink} to="/profile">
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Luxury Boutique
          </Typography>
          <IconButton color="inherit" onClick={() => navigate('/cart')}>
            <Badge badgeContent={itemCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>
          {isAuthenticated ? (
            <IconButton color="inherit" onClick={logout}>
              <AccountCircle />
            </IconButton>
          ) : (
            <IconButton color="inherit" onClick={() => navigate('/login')}>
              <AccountCircle />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;