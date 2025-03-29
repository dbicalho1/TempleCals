import { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Box, Grid as MuiGrid, Divider, Card, CardContent,
  LinearProgress, Stack, useTheme
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getMealEntriesByDate, getDailyTotals, MealEntry } from '../services/mockData';
import RestaurantIcon from '@mui/icons-material/Restaurant';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Fix for Grid component TypeScript issues
const Grid = MuiGrid as any;

const Dashboard = () => {
  const theme = useTheme();
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [dailyTotals, setDailyTotals] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0
  });
  
  // Define nutritional goals
  const goals = {
    calories: 2000,
    protein: 50,
    carbs: 275,
    fat: 65
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Load today's meals
    const todaysMeals = getMealEntriesByDate(today);
    setMeals(todaysMeals);
    
    // Calculate daily totals
    const totals = getDailyTotals(today);
    setDailyTotals(totals);
  }, [today]);

  // Nutrition data for the chart
  const chartData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        label: 'Grams',
        data: [dailyTotals.totalProtein, dailyTotals.totalCarbs, dailyTotals.totalFat],
        backgroundColor: [
          theme.palette.info.light,
          theme.palette.warning.light,
          theme.palette.error.light,
        ],
        borderColor: [
          theme.palette.info.main,
          theme.palette.warning.main,
          theme.palette.error.main,
        ],
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: theme.typography.fontFamily,
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Macronutrient Breakdown',
        font: {
          family: theme.typography.fontFamily,
          size: 16,
          weight: 600
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: theme.typography.fontFamily,
        },
        bodyFont: {
          family: theme.typography.fontFamily,
        }
      }
    },
    scales: {
      y: {
        ticks: {
          font: {
            family: theme.typography.fontFamily,
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        ticks: {
          font: {
            family: theme.typography.fontFamily,
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  // Calculate progress percentages
  const calculateProgress = (current: number, goal: number) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  const caloriesProgress = calculateProgress(dailyTotals.totalCalories, goals.calories);
  const proteinProgress = calculateProgress(dailyTotals.totalProtein, goals.protein);
  const carbsProgress = calculateProgress(dailyTotals.totalCarbs, goals.carbs);
  const fatProgress = calculateProgress(dailyTotals.totalFat, goals.fat);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Today's Nutrition Summary
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Daily Calories Card */}
        <Grid item xs={12} md={6} lg={3} sx={{ display: 'flex' }}>
          <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Box 
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                bgcolor: theme.palette.primary.main
              }}
            />
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Total Calories
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                <Typography variant="h3" fontWeight="bold" color="primary.main">
                  {dailyTotals.totalCalories}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                  / {goals.calories}
                </Typography>
              </Box>
              <Box sx={{ mt: 2, mb: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={caloriesProgress} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(158, 27, 52, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.palette.primary.main,
                    }
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {caloriesProgress}% of daily goal
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Protein Card */}
        <Grid item xs={12} md={6} lg={3} sx={{ display: 'flex' }}>
          <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Box 
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                bgcolor: theme.palette.info.main
              }}
            />
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Protein
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                <Typography variant="h3" fontWeight="bold" color="info.main">
                  {dailyTotals.totalProtein}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                  g / {goals.protein}g
                </Typography>
              </Box>
              <Box sx={{ mt: 2, mb: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={proteinProgress} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.palette.info.main,
                    }
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {proteinProgress}% of daily goal
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Carbs Card */}
        <Grid item xs={12} md={6} lg={3} sx={{ display: 'flex' }}>
          <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Box 
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                bgcolor: theme.palette.warning.main
              }}
            />
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Carbs
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                <Typography variant="h3" fontWeight="bold" color="warning.main">
                  {dailyTotals.totalCarbs}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                  g / {goals.carbs}g
                </Typography>
              </Box>
              <Box sx={{ mt: 2, mb: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={carbsProgress} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 160, 0, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.palette.warning.main,
                    }
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {carbsProgress}% of daily goal
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Fat Card */}
        <Grid item xs={12} md={6} lg={3} sx={{ display: 'flex' }}>
          <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
            <Box 
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                bgcolor: theme.palette.error.main
              }}
            />
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Fat
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                <Typography variant="h3" fontWeight="bold" color="error.main">
                  {dailyTotals.totalFat}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
                  g / {goals.fat}g
                </Typography>
              </Box>
              <Box sx={{ mt: 2, mb: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={fatProgress} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(211, 47, 47, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.palette.error.main,
                    }
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {fatProgress}% of daily goal
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Chart */}
        <Grid item xs={12} md={8} sx={{ display: 'flex' }}>
          <Card sx={{ height: '100%', minHeight: 400 }}>
            <CardContent sx={{ p: 3, height: '100%' }}>
              <Box sx={{ height: 'calc(100% - 40px)', pt: 1 }}>
                <Bar options={chartOptions} data={chartData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Today's Meals */}
        <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
          <Card sx={{ height: '100%', minHeight: 400 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RestaurantIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight="bold">
                  Today's Meals
                </Typography>
              </Box>
              
              <Box sx={{ maxHeight: 320, overflow: 'auto', pr: 1 }}>
                {meals.length > 0 ? (
                  meals.map((meal) => (
                    <Box key={meal.id} sx={{ mb: 3 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" fontWeight="medium">
                          {meal.description}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                          {meal.totalCalories} cal
                        </Typography>
                      </Stack>
                      <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                        <Typography variant="body2" color="info.main">
                          P: {meal.totalProtein}g
                        </Typography>
                        <Typography variant="body2" color="warning.main">
                          C: {meal.totalCarbs}g
                        </Typography>
                        <Typography variant="body2" color="error.main">
                          F: {meal.totalFat}g
                        </Typography>
                      </Box>
                      <Divider sx={{ mt: 2 }} />
                    </Box>
                  ))
                ) : (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <RestaurantIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      No meals logged today
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      Go to "Log Meal" to add one!
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
