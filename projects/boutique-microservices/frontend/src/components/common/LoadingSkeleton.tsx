import React from 'react';
import {
  Skeleton,
  Card,
  CardContent,
  Box,
  Grid,
} from '@mui/material';

interface LoadingSkeletonProps {
  variant?: 'product' | 'list' | 'detail';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'product',
  count = 1,
}) => {
  const renderProductSkeleton = () => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Skeleton variant="rectangular" sx={{ pt: '100%' }} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" height={24} width="80%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={16} width="60%" sx={{ mb: 2 }} />
        <Skeleton variant="text" height={20} width="40%" />
      </CardContent>
    </Card>
  );

  const renderListSkeleton = () => (
    <Card sx={{ display: 'flex', height: 200 }}>
      <Skeleton variant="rectangular" width={200} height={200} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" height={24} width="60%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={16} width="80%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={16} width="70%" sx={{ mb: 2 }} />
        <Skeleton variant="text" height={20} width="30%" />
      </CardContent>
    </Card>
  );

  const renderDetailSkeleton = () => (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Skeleton variant="rectangular" sx={{ pt: '100%' }} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Skeleton variant="text" height={40} width="80%" sx={{ mb: 2 }} />
        <Skeleton variant="text" height={24} width="60%" sx={{ mb: 2 }} />
        <Skeleton variant="text" height={20} width="40%" sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Skeleton variant="rectangular" width={120} height={40} />
          <Skeleton variant="rectangular" width={120} height={40} />
        </Box>
        <Skeleton variant="text" height={16} width="90%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={16} width="85%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={16} width="80%" />
      </Grid>
    </Grid>
  );

  if (variant === 'detail') {
    return renderDetailSkeleton();
  }

  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid
          size={{
            xs: 12,
            sm: variant === 'list' ? 12 : 6,
            md: variant === 'list' ? 12 : 4,
            lg: variant === 'list' ? 12 : 3,
          }}
          key={index}
        >
          {variant === 'list' ? renderListSkeleton() : renderProductSkeleton()}
        </Grid>
      ))}
    </Grid>
  );
};

export default LoadingSkeleton;