import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ShoppingCart as AddToCartIcon,
  Favorite as WishlistIcon,
  FavoriteBorder as WishlistBorderIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
  showQuickView?: boolean;
  onQuickView?: (product: Product) => void;
  variant?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
  showQuickView = true,
  onQuickView,
  variant = 'grid',
}) => {
  const navigate = useNavigate();
  const isOutOfStock = (product.inventory_quantity ?? product.inventory ?? 0) === 0;

  // Enhanced image URL handling with fallbacks
  const getImageSrc = (): string => {
    if (product.imageUrl) {
      return product.imageUrl;
    }
    
    // Fallback to placeholder image
    return '/images/placeholder.svg';
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    // Try the local placeholder image
    target.src = '/images/placeholder.svg';
    target.onerror = () => {
      // Ultimate fallback - use a data URI for a simple placeholder
      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04NSA3NUgxMTVWMTI1SDg1Vjc1WiIgZmlsbD0iI0QxRDFEMSIvPgo8Y2lyY2xlIGN4PSI5MCIgY3k9IjkwIiByPSI1IiBmaWxsPSIjOUExQTFIIi8+CjxwYXRoIGQ9Ik03NSAxMjVIMTI1VjE0MEg3NVYxMjVaIiBmaWxsPSIjQTFBMUExIi8+Cjwvc3ZnPgo=';
    };
  };

  const renderRating = (rating: number) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {[...Array(5)].map((_, index) => (
          <Box key={index} sx={{ fontSize: '1rem' }}>
            {index < rating ? (
              <StarIcon sx={{ fontSize: '1rem', color: '#ffc107' }} />
            ) : (
              <StarBorderIcon sx={{ fontSize: '1rem', color: '#ffc107' }} />
            )}
          </Box>
        ))}
        <Typography variant="caption" color="text.secondary">
          ({product.reviewCount || 0})
        </Typography>
      </Box>
    );
  };

  const cardSx = variant === 'list' 
    ? { 
        display: 'flex', 
        height: 200,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }
    : {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      };

  const mediaSx = variant === 'list'
    ? {
        width: 200,
        height: 200,
      }
    : {
        height: 280,
        width: '100%',
        objectFit: 'cover',
      };

  return (
    <Card sx={cardSx}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          sx={mediaSx}
          image={getImageSrc()}
          alt={product.name}
          onError={handleImageError}
        />
        
        {product.isNew && (
          <Chip
            label="NEW"
            color="secondary"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              fontWeight: 'bold',
            }}
          />
        )}
        
        {(product.discountPercentage && product.discountPercentage > 0) && (
          <Chip
            label={`-${product.discountPercentage}%`}
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontWeight: 'bold',
            }}
          />
        )}
        
        {isOutOfStock && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" color="white" fontWeight="bold">
              OUT OF STOCK
            </Typography>
          </Box>
        )}
        
        <Box sx={{ position: 'absolute', top: 8, right: showQuickView ? 48 : 8, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {onToggleWishlist && (
            <Tooltip title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(product.id);
                }}
                sx={{
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
                size="small"
              >
                {isInWishlist ? (
                  <WishlistIcon color="error" />
                ) : (
                  <WishlistBorderIcon />
                )}
              </IconButton>
            </Tooltip>
          )}
          
          {showQuickView && onQuickView && (
            <Tooltip title="Quick view">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView(product);
                }}
                sx={{
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
                size="small"
              >
                <ViewIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ mb: 1 }}>
          <Chip
            label={product.category}
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.7rem' }}
          />
        </Box>
        
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: variant === 'list' ? 2 : 1,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.name}
        </Typography>
        
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: variant === 'list' ? 3 : 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.description}
        </Typography>
        
        {product.rating && renderRating(product.rating)}
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Typography
            variant="h6"
            color="primary"
            fontWeight="bold"
          >
            ${(() => {
              const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
              return isNaN(price) || !isFinite(price) ? '0.00' : price.toFixed(2);
            })()}
          </Typography>
          
          {product.originalPrice && product.originalPrice > product.price && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'line-through' }}
            >
              ${(() => {
                const price = typeof product.originalPrice === 'string' ? parseFloat(product.originalPrice) : product.originalPrice;
                return isNaN(price) || !isFinite(price) ? '0.00' : price.toFixed(2);
              })()}
            </Typography>
          )}
        </Box>
        
        <Typography variant="caption" color="text.secondary">
          {(product.inventory_quantity ?? product.inventory ?? 0) > 0 ? `${product.inventory_quantity ?? product.inventory} in stock` : 'Out of stock'}
        </Typography>
      </CardContent>

      <CardActions sx={{ pt: 0, flexDirection: 'column', gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(`/products/${product.id}`)}
          sx={{ width: '100%' }}
        >
          View Details
        </Button>
        
        <Button
          variant="contained"
          size="small"
          startIcon={<AddToCartIcon />}
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          sx={{ width: '100%' }}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;