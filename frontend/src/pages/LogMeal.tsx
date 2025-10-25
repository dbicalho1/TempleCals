import { useState, useEffect } from 'react';
import { 
  Container, Typography, TextField, Button, 
  Box, Card, CardContent, Grid as MuiGrid, List, ListItem, 
  ListItemText, Divider, Alert, Stack, Chip, useTheme,
  Avatar, IconButton, Fade, CircularProgress, FormControl,
  InputLabel, Select, MenuItem
} from '@mui/material';
import { getMeals, logMeal, Meal, getDiningHalls, getMealCategories } from '../services/api';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import SendIcon from '@mui/icons-material/Send';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const Grid = MuiGrid as any;

const LogMeal = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiningHall, setSelectedDiningHall] = useState<number | ''>('');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [diningHalls, setDiningHalls] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load dining halls, categories, and all meals on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [hallsData, categoriesData, mealsData] = await Promise.all([
          getDiningHalls(),
          getMealCategories(),
          getMeals()
        ]);
        setDiningHalls(hallsData);
        setCategories(categoriesData);
        setMeals(mealsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load meals data');
      } finally {
        setIsInitialLoad(false);
      }
    };
    loadData();
  }, []);

  const handleSearch = async () => {
    setIsLoading(true);
    setError('');
    try {
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedDiningHall) params.dining_hall_id = selectedDiningHall;
      if (selectedCategory) params.category_id = selectedCategory;
      
      const data = await getMeals(params);
      setMeals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search meals');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogMeal = async (meal: Meal) => {
    try {
      await logMeal({ meal_id: meal.id });
      setSuccessMessage(`${meal.name} logged successfully!`);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log meal');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (isInitialLoad) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Log Your Meal
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Search and log meals from Temple University campus dining halls
        </Typography>
      </Box>

      {success && (
        <Fade in={success} timeout={500}>
          <Alert 
            severity="success" 
            variant="filled"
            onClose={() => setSuccess(false)}
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {successMessage}
          </Alert>
        </Fade>
      )}

      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError('')}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}
      
      {/* Search and Filters */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search meals"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g., chicken, pizza, salad"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Dining Hall</InputLabel>
                <Select
                  value={selectedDiningHall}
                  label="Dining Hall"
                  onChange={(e) => setSelectedDiningHall(e.target.value as number)}
                >
                  <MenuItem value="">All Dining Halls</MenuItem>
                  {diningHalls.map((hall) => (
                    <MenuItem key={hall.id} value={hall.id}>{hall.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value as number)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                fullWidth 
                onClick={handleSearch}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : <SearchIcon />}
              >
                {isLoading ? 'Searching...' : 'Search Meals'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Meals List */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Available Meals ({meals.length})
      </Typography>

      {meals.length === 0 ? (
        <Card>
          <CardContent sx={{ py: 8, textAlign: 'center' }}>
            <RestaurantIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No meals found
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Try adjusting your search filters or check the Search page for the full catalog
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigate('/search')}
            >
              Browse All Meals
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {meals.map((meal) => (
            <Grid item xs={12} sm={6} md={4} key={meal.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {meal.name}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                      <Chip 
                        label={meal.dining_hall} 
                        size="small" 
                        icon={<StorefrontIcon />}
                        sx={{ fontSize: '0.7rem' }}
                      />
                      <Chip 
                        label={meal.category} 
                        size="small" 
                        color="secondary"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </Stack>
                    {meal.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {meal.description}
                      </Typography>
                    )}
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Calories
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color="primary">
                        {meal.calories}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Protein
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color="info.main">
                        {meal.protein}g
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Carbs
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color="warning.main">
                        {meal.carbs}g
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Fat
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color="error.main">
                        {meal.fat}g
                      </Typography>
                    </Grid>
                  </Grid>

                  {meal.allergens && meal.allergens.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Allergens:
                      </Typography>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                        {meal.allergens.map((allergen, idx) => (
                          <Chip 
                            key={idx}
                            label={allergen}
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.65rem' }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleLogMeal(meal)}
                  >
                    Log This Meal
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default LogMeal;
