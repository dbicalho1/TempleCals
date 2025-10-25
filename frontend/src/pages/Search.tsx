import { useState, useEffect } from 'react';
import { 
  Container, Typography, TextField, Paper, Box, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, InputAdornment, Chip, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getMeals, getDiningHalls, Meal } from '../services/api';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Meal[]>([]);
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [diningHalls, setDiningHalls] = useState<any[]>([]);
  const [selectedDiningHall, setSelectedDiningHall] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [mealsData, hallsData] = await Promise.all([
          getMeals(),
          getDiningHalls()
        ]);
        setAllMeals(mealsData);
        setSearchResults(mealsData);
        setDiningHalls(hallsData);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterMeals(query, selectedDiningHall);
  };

  const handleDiningHallFilter = (hall: string) => {
    if (selectedDiningHall === hall) {
      setSelectedDiningHall(null);
      filterMeals(searchQuery, null);
    } else {
      setSelectedDiningHall(hall);
      filterMeals(searchQuery, hall);
    }
  };

  const filterMeals = (query: string, hall: string | null) => {
    let results = allMeals;
    
    if (query) {
      results = results.filter(meal => 
        meal.name.toLowerCase().includes(query.toLowerCase()) ||
        meal.description?.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (hall) {
      results = results.filter(meal => meal.dining_hall === hall);
    }
    
    setSearchResults(results);
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
            Filter by dining hall:
          </Typography>
          {diningHalls.map((hall) => (
            <Chip
              key={hall.id}
              label={hall.name}
              onClick={() => handleDiningHallFilter(hall.name)}
              color={selectedDiningHall === hall.name ? "primary" : "default"}
              variant={selectedDiningHall === hall.name ? "filled" : "outlined"}
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
                <Typography variant="subtitle2" sx={{ color: theme => theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}>Dining Hall</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ color: theme => theme.palette.mode === 'dark' ? '#ffffff' : 'inherit' }}>Category</Typography>
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress sx={{ my: 4 }} />
                </TableCell>
              </TableRow>
            ) : searchResults.length > 0 ? (
              searchResults.map((meal) => (
                <TableRow key={meal.id} hover>
                  <TableCell>{meal.name}</TableCell>
                  <TableCell>{meal.dining_hall}</TableCell>
                  <TableCell>{meal.category}</TableCell>
                  <TableCell>{meal.calories}</TableCell>
                  <TableCell>{meal.protein}</TableCell>
                  <TableCell>{meal.carbs}</TableCell>
                  <TableCell>{meal.fat}</TableCell>
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
