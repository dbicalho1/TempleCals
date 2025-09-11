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
    const items = searchFoodItems('');
    setSources(Array.from(new Set(items.map(item => item.source))));
    setSearchResults(items);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    let results = searchFoodItems(query);
    if (selectedSource) {
      results = results.filter(item => item.source === selectedSource);
    }
    setSearchResults(results);
  };

  const handleSourceFilter = (source: string) => {
    if (selectedSource === source) {
      setSelectedSource(null);
      setSearchResults(searchFoodItems(searchQuery));
    } else {
      setSelectedSource(source);
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
          <TableHead sx={{
            backgroundColor: theme => theme.palette.mode === 'light' ? 'grey.100' : 'primary.main',
          }}>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ color: theme => theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}>Food Item</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ color: theme => theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}>Source</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ color: theme => theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}>Serving Size</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ color: theme => theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}>Calories</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ color: theme => theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}>Protein (g)</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ color: theme => theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}>Carbs (g)</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ color: theme => theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}>Fat (g)</Typography>
              </TableCell>
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
