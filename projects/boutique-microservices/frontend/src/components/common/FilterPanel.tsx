import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

export interface FilterOptions {
  priceRange: [number, number];
  category: string;
  brand: string[];
  size: string[];
  color: string[];
  rating: number;
  inStock: boolean;
}

interface FilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
  categories: string[];
  brands: string[];
  sizes: string[];
  colors: string[];
  maxPrice: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  onFilterChange,
  categories,
  brands,
  sizes,
  colors,
  maxPrice,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, maxPrice],
    category: '',
    brand: [],
    size: [],
    color: [],
    rating: 0,
    inStock: false,
  });

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    const newFilters = { ...filters, priceRange: newValue as [number, number] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCategoryChange = (category: string) => {
    const newFilters = { ...filters, category };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBrandToggle = (brand: string) => {
    const newBrand = filters.brand.includes(brand)
      ? filters.brand.filter(b => b !== brand)
      : [...filters.brand, brand];
    const newFilters = { ...filters, brand: newBrand };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSizeToggle = (size: string) => {
    const newSize = filters.size.includes(size)
      ? filters.size.filter(s => s !== size)
      : [...filters.size, size];
    const newFilters = { ...filters, size: newSize };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleColorToggle = (color: string) => {
    const newColor = filters.color.includes(color)
      ? filters.color.filter(c => c !== color)
      : [...filters.color, color];
    const newFilters = { ...filters, color: newColor };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRatingChange = (rating: number) => {
    const newFilters = { ...filters, rating };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleInStockToggle = () => {
    const newFilters = { ...filters, inStock: !filters.inStock };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      priceRange: [0, maxPrice],
      category: '',
      brand: [],
      size: [],
      color: [],
      rating: 0,
      inStock: false,
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const activeFilterCount = [
    filters.category,
    filters.brand.length,
    filters.size.length,
    filters.color.length,
    filters.rating,
    filters.inStock,
  ].filter(Boolean).length + (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0);

  return (
    <Card sx={{ height: 'fit-content', position: 'sticky', top: 24 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon />
            <Typography variant="h6">Filters</Typography>
            {activeFilterCount > 0 && (
              <Chip
                label={activeFilterCount}
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Box>
          {activeFilterCount > 0 && (
            <Button
              startIcon={<ClearIcon />}
              onClick={clearFilters}
              size="small"
            >
              Clear
            </Button>
          )}
        </Box>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Price Range</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ px: 2, pt: 2 }}>
              <Typography variant="body2" gutterBottom>
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </Typography>
              <Slider
                value={filters.priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={maxPrice}
                step={50}
                sx={{ mt: 2 }}
              />
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Category</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth>
              <Select
                value={filters.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Brand</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {brands.map((brand) => (
                <FormControlLabel
                  key={brand}
                  control={
                    <Checkbox
                      checked={filters.brand.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                      size="small"
                    />
                  }
                  label={brand}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Size</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {sizes.map((size) => (
                <Chip
                  key={size}
                  label={size}
                  clickable
                  color={filters.size.includes(size) ? 'primary' : 'default'}
                  onClick={() => handleSizeToggle(size)}
                  size="small"
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Color</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {colors.map((color) => (
                <Chip
                  key={color}
                  label={color}
                  clickable
                  color={filters.color.includes(color) ? 'primary' : 'default'}
                  onClick={() => handleColorToggle(color)}
                  size="small"
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">Rating</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[4, 3, 2, 1].map((rating) => (
                <FormControlLabel
                  key={rating}
                  control={
                    <Checkbox
                      checked={filters.rating === rating}
                      onChange={() => handleRatingChange(filters.rating === rating ? 0 : rating)}
                      size="small"
                    />
                  }
                  label={`${rating} Stars & Up`}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.inStock}
                onChange={handleInStockToggle}
                size="small"
              />
            }
            label="In Stock Only"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;