import { useState, useEffect } from 'react';
import { 
  Container, Typography, TextField, Paper, Box, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, InputAdornment, Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { searchFoodItems, FoodItem } from '../services/mockData';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  useEffect(() => {
    // Get all food items on initial load
    const items = searchFoodItems('');
    
    // Extract unique sources for filtering
    const uniqueSources = Array.from(new Set(items.map(item => item.source)));
    setSources(uniqueSources);
    
    // Set initial search results to all items
    setSearchResults(items);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Filter by search query
    let results = searchFoodItems(query);
    
    // Apply source filter if selected
    if (selectedSource) {
      results = results.filter(item => item.source === selectedSource);
    }
    
    setSearchResults(results);
  };

  const handleSourceFilter = (source: string) => {
    if (selectedSource === source) {
      // Deselect if already selected
      setSelectedSource(null);
      
      // Reapply just the search query
      const results = searchFoodItems(searchQuery);
      setSearchResults(results);
    } else {
      // Select new source
      setSelectedSource(source);
      
      // Filter by both search query and selected source
      const results = searchFoodItems(searchQuery).filter(
        item => item.source === source
      );
      setSearchResults(results);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Search Temple Campus Foods
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          label="Search for food items"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by food name or location"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="body2" sx={{ mr: 1, alignSelf: 'center' }}>
            Filter by source:
          </Typography>
          {sources.map((source) => (
            <Chip
              key={source}
              label={source}
              onClick={() => handleSourceFilter(source)}
              color={selectedSource === source ? "primary" : "default"}
              variant={selectedSource === source ? "filled" : "outlined"}
            />
          ))}
        </Box>
      </Paper>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><Typography variant="subtitle2">Food Item</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Source</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Serving Size</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Calories</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Protein (g)</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Carbs (g)</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Fat (g)</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchResults.length > 0 ? (
              searchResults.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.source}</TableCell>
                  <TableCell>{item.servingSize}</TableCell>
                  <TableCell>{item.calories}</TableCell>
                  <TableCell>{item.protein}</TableCell>
                  <TableCell>{item.carbs}</TableCell>
                  <TableCell>{item.fat}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No food items found. Try a different search term.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Search;
