import { useState } from 'react';
import { 
  Container, Typography, TextField, Button, 
  Box, Card, CardContent, Grid as MuiGrid, List, ListItem, 
  ListItemText, Divider, Alert, Stack, Chip, useTheme,
  Avatar, IconButton, Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { addMealEntry, MealEntry, FoodItem } from '../services/mockData';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import SendIcon from '@mui/icons-material/Send';
import StorefrontIcon from '@mui/icons-material/Storefront';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Fix for Grid component TypeScript issues
const Grid = MuiGrid as any;

const LogMeal = () => {
  const theme = useTheme();
  const [mealDescription, setMealDescription] = useState('');
  const [mealEntry, setMealEntry] = useState<MealEntry | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mealDescription.trim()) {
      setError('Please enter a meal description');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate a slight delay to show loading state
    setTimeout(() => {
      try {
        // Add the meal entry using our mock service
        const newEntry = addMealEntry(mealDescription);
        
        // Check if any food items were found
        if (newEntry.foodItems.length === 0) {
          setError('No matching food items found. Try being more specific or check our food database.');
          setMealEntry(null);
          setSuccess(false);
          setIsLoading(false);
          return;
        }
        
        // Set the meal entry to display the results
        setMealEntry(newEntry);
        setError('');
        setSuccess(true);
        setIsLoading(false);
        
        // Reset form after 5 seconds if successful
        setTimeout(() => {
          if (success) {
            setMealDescription('');
            setSuccess(false);
          }
        }, 5000);
        
      } catch (err) {
        setError('An error occurred while logging your meal. Please try again.');
        setMealEntry(null);
        setSuccess(false);
        setIsLoading(false);
      }
    }, 800); // Simulate API call delay
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Log Your Meal
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Track your nutrition from Temple University campus dining options
        </Typography>
      </Box>
      
      <Card sx={{ mb: 4, overflow: 'hidden', borderRadius: 3 }}>
        <Box sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          py: 2, 
          px: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <RestaurantIcon />
          <Typography variant="h6" fontWeight="medium">
            What did you eat today?
          </Typography>
        </Box>
        
        <CardContent sx={{ p: 3 }}>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary' }}>
            Enter what you ate at Temple University campus. Be specific about food items and locations.
          </Typography>
          
          <Box sx={{ 
            bgcolor: 'background.default', 
            p: 2, 
            borderRadius: 2, 
            mb: 3,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <InfoOutlinedIcon fontSize="small" sx={{ mr: 0.5, color: 'info.main' }} />
              Example entries:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip 
                label="Coffee and a bacon, egg, and cheese from Richie's" 
                size="small" 
                onClick={() => setMealDescription("Coffee and a bacon, egg, and cheese from Richie's")}
                sx={{ my: 0.5 }}
              />
              <Chip 
                label="Chicken quesadilla from The Truck" 
                size="small" 
                onClick={() => setMealDescription("Chicken quesadilla from The Truck")}
                sx={{ my: 0.5 }}
              />
              <Chip 
                label="Turkey sandwich and chips from Morgan Hall" 
                size="small" 
                onClick={() => setMealDescription("Turkey sandwich and chips from Morgan Hall")}
                sx={{ my: 0.5 }}
              />
            </Stack>
          </Box>
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="What did you eat?"
              variant="outlined"
              value={mealDescription}
              onChange={(e) => setMealDescription(e.target.value)}
              placeholder="Describe your meal and where you got it"
              margin="none"
              error={!!error}
              helperText={error}
              InputProps={{
                endAdornment: (
                  <IconButton 
                    color="primary" 
                    edge="end" 
                    type="submit"
                    disabled={isLoading || !mealDescription.trim()}
                    sx={{ 
                      bgcolor: mealDescription.trim() ? 'primary.main' : 'transparent',
                      color: mealDescription.trim() ? 'white' : 'action.disabled',
                      '&:hover': {
                        bgcolor: mealDescription.trim() ? 'primary.dark' : 'transparent',
                      },
                      transition: theme.transitions.create(['background-color', 'transform']),
                      transform: isLoading ? 'scale(0.9)' : 'scale(1)',
                    }}
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                ),
              }}
              sx={{ mb: 2 }}
            />
          </Box>
        </CardContent>
      </Card>
      
      <Fade in={success} timeout={500}>
        <Alert 
          severity="success" 
          variant="filled"
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            '& .MuiAlert-icon': { fontSize: '1.5rem' }
          }}
        >
          Meal successfully logged to your daily nutrition!
        </Alert>
      </Fade>
      
      {mealEntry && (
        <Fade in={!!mealEntry} timeout={800}>
          <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ 
              bgcolor: 'background.default', 
              borderBottom: '1px solid',
              borderColor: 'divider',
              py: 2, 
              px: 3
            }}>
              <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FastfoodIcon color="primary" />
                Nutritional Information
              </Typography>
            </Box>
            
            <CardContent sx={{ p: 3 }}>
              <Card sx={{ 
                mb: 4, 
                bgcolor: theme.palette.primary.main, 
                color: 'white',
                borderRadius: 2,
                boxShadow: `0 8px 20px -10px ${theme.palette.primary.main}80`
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2, opacity: 0.9 }}>
                    {mealEntry.description}
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mt: 0 }}>
                    <Grid item xs={6} sm={3} sx={{ display: 'flex' }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Calories
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {mealEntry.totalCalories}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={3} sx={{ display: 'flex' }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Protein
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {mealEntry.totalProtein}g
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={3} sx={{ display: 'flex' }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Carbs
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {mealEntry.totalCarbs}g
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6} sm={3} sx={{ display: 'flex' }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Fat
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {mealEntry.totalFat}g
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <StorefrontIcon fontSize="small" color="secondary" />
                Food Items Detected
              </Typography>
              
              <List sx={{ 
                bgcolor: 'background.default', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden'
              }}>
                {mealEntry.foodItems.map((item: FoodItem, index: number) => (
                  <Box key={item.id}>
                    <ListItem sx={{ px: 3, py: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: `${theme.palette.primary.light}20`, 
                          color: theme.palette.primary.main,
                          mr: 2,
                          fontWeight: 'bold'
                        }}
                      >
                        {index + 1}
                      </Avatar>
                      <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {item.name}
                          </Typography>
                          <Chip 
                            label={item.source} 
                            size="small" 
                            color="default" 
                            sx={{ 
                              bgcolor: 'background.paper',
                              fontWeight: 'medium',
                              fontSize: '0.75rem'
                            }} 
                          />
                        </Box>
                        
                        <Grid container spacing={1} sx={{ mb: 1 }}>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Calories
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {item.calories}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Protein
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {item.protein}g
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Carbs
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {item.carbs}g
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Fat
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {item.fat}g
                            </Typography>
                          </Grid>
                        </Grid>
                        
                        <Typography variant="caption" color="text.secondary">
                          Serving size: {item.servingSize}
                        </Typography>
                      </Box>
                    </ListItem>
                    {index < mealEntry.foodItems.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Fade>
      )}
    </Container>
  );
};

export default LogMeal;
