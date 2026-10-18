import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Autocomplete,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

interface SearchBarProps {
  onSearch: (query: string) => void;
  suggestions?: string[];
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  suggestions = [],
  placeholder = "Search luxury products...",
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            backgroundColor: 'background.paper',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'divider',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          },
        }}
        sx={{
          '& .MuiInputLabel-root': {
            fontSize: '1.1rem',
          },
        }}
      />
      
      {suggestions.length > 0 && query && (
        <Box sx={{ mt: 1 }}>
          <Autocomplete
            options={suggestions}
            value={[query].filter(Boolean)}
            onChange={(_, newValue) => {
              const newQuery = Array.isArray(newValue) ? newValue[0] : newValue;
              setQuery(newQuery || '');
              onSearch(newQuery || '');
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                placeholder="Suggestions"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  size="small"
                  label={option}
                  {...getTagProps({ index })}
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))
            }
            multiple
            freeSolo
          />
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;