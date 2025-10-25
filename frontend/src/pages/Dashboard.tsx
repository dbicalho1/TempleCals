import { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Box, Grid as MuiGrid, Divider, Card, CardContent,
  LinearProgress, Stack, useTheme, Chip, Tabs, Tab
} from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { getDailyMeals, UserMeal, DailyMealsResponse, deleteUserMeal } from '../services/api';
import { 
  mockNutritionHistory, 
  mockWeightHistory, 
  mockStreakData,
  getWeightTrend,
  DailyNutrition 
} from '../services/mockAnalytics';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PersonIcon from '@mui/icons-material/Person';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ScaleIcon from '@mui/icons-material/Scale';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useAuth } from '../contexts/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Fix for Grid component TypeScript issues
const Grid = MuiGrid as any;

const Dashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [meals, setMeals] = useState<UserMeal[]>([]);
  const [groupedMeals, setGroupedMeals] = useState<Array<UserMeal & { count: number }>>([]);
  const [dailyData, setDailyData] = useState<DailyMealsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Analytics state
  const [timePeriod, setTimePeriod] = useState<'7days' | '30days'>('7days');
  const [nutritionHistory, setNutritionHistory] = useState<DailyNutrition[]>([]);
  const [weightTrend, setWeightTrend] = useState(getWeightTrend(mockWeightHistory));
  
  const goals = dailyData?.goals || {
    calories: user?.daily_calorie_goal || 2000,
    protein: user?.daily_protein_goal || 150,
    carbs: user?.daily_carb_goal || 250,
    fat: user?.daily_fat_goal || 65
  };
  
  const dailyTotals = dailyData?.totals || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };
  
  const hasProfileSetup = user?.age && user?.weight && user?.height && user?.goal;

  const today = new Date().toISOString().split('T')[0];

  const groupIdenticalMeals = (mealEntries: UserMeal[]) => {
    const mealGroups: Record<string, UserMeal & { count: number }> = {};
    
    mealEntries.forEach(meal => {
      const mealKey = `${meal.meal.name}-${meal.total_calories}-${meal.total_protein}-${meal.total_carbs}-${meal.total_fat}`;
      
      if (mealGroups[mealKey]) {
        mealGroups[mealKey].count += 1;
      } else {
        mealGroups[mealKey] = { ...meal, count: 1 };
      }
    });
    return Object.values(mealGroups);
  };
  
  const fetchDailyData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getDailyMeals(today);
      setDailyData(data);
      setMeals(data.meals);
      setGroupedMeals(groupIdenticalMeals(data.meals));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load meals');
      console.error('Error fetching daily meals:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteMeal = async (mealId: number) => {
    try {
      await deleteUserMeal(mealId);
      // Refresh data after deletion
      await fetchDailyData();
    } catch (err) {
      console.error('Error deleting meal:', err);
      alert('Failed to delete meal');
    }
  };

  useEffect(() => {
    fetchDailyData();
  }, [today]);

  // Load analytics data based on time period
  useEffect(() => {
    const days = timePeriod === '7days' ? 7 : 30;
    const filtered = mockNutritionHistory.slice(-days);
    setNutritionHistory(filtered);
  }, [timePeriod]);

  const chartData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        label: 'Grams',
        data: [dailyTotals.protein, dailyTotals.carbs, dailyTotals.fat],
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

  // Calorie Trend Chart
  const calorieTrendData = {
    labels: nutritionHistory.map(day => {
      const date = new Date(day.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Calories',
        data: nutritionHistory.map(day => day.calories),
        borderColor: theme.palette.primary.main,
        backgroundColor: `${theme.palette.primary.main}20`,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Goal',
        data: nutritionHistory.map(() => goals.calories),
        borderColor: theme.palette.success.main,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  // Weight Trend Chart
  const weightTrendData = {
    labels: mockWeightHistory.map(entry => {
      const date = new Date(entry.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Weight (lbs)',
        data: mockWeightHistory.map(entry => entry.weight),
        borderColor: theme.palette.info.main,
        backgroundColor: `${theme.palette.info.main}20`,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const calculateProgress = (current: number, goal: number) => 
    Math.min(Math.round((current / goal) * 100), 100);

  const caloriesProgress = calculateProgress(dailyTotals.calories, goals.calories);
  const proteinProgress = calculateProgress(dailyTotals.protein, goals.protein);
  const carbsProgress = calculateProgress(dailyTotals.carbs, goals.carbs);
  const fatProgress = calculateProgress(dailyTotals.fat, goals.fat);

  const isCaloriesExceeded = dailyTotals.calories > goals.calories;
  const isProteinExceeded = dailyTotals.protein > goals.protein;
  const isCarbsExceeded = dailyTotals.carbs > goals.carbs;
  const isFatExceeded = dailyTotals.fat > goals.fat;

  const getGoalLabel = (goal?: string) => {
    const goalLabels: Record<string, string> = {
      cutting: 'Cutting',
      bulking: 'Bulking',
      maintaining: 'Maintaining',
      tracking: 'Tracking'
    };
    return goal ? goalLabels[goal] : null;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Welcome back, {user?.first_name}!
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
            </Box>
            {user?.goal && (
              <Chip
                icon={<FitnessCenterIcon />}
                label={getGoalLabel(user.goal)}
                color="primary"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
          
          {!hasProfileSetup && (
            <Card sx={{ bgcolor: 'primary.light', border: '1px solid', borderColor: 'primary.main', mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 0.5 }}>
                      Complete Your Profile
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Set up your profile to get personalized nutrition goals based on your fitness goals.
                    </Typography>
                  </Box>
                  <Button
                    component={RouterLink}
                    to="/profile"
                    variant="contained"
                    startIcon={<PersonIcon />}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    Set Up Profile
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </motion.div>
      
      {/* Tabbed Navigation */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              py: 2
            }
          }}
        >
          <Tab label="Overview" />
          <Tab label="Today's Meals" />
          <Tab label="Analytics" />
        </Tabs>
      </Paper>
      
      {/* Tab Content: Overview */}
      {activeTab === 0 && (
        <motion.div
          key="overview"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Grid container spacing={3}>
        {/* Daily Calories Card */}
        <Grid item xs={12} md={6} lg={3} sx={{ display: 'flex' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            style={{ width: '100%' }}
          >
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
                  {dailyTotals.calories}
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
              {isCaloriesExceeded && (
                <Typography variant="body2" color="error" sx={{ mt: 1, fontWeight: 'medium' }}>
                  Warning! You are over the calorie limit
                </Typography>
              )}
            </CardContent>
          </Card>
          </motion.div>
        </Grid>
        
        {/* Protein Card */}
        <Grid item xs={12} md={6} lg={3} sx={{ display: 'flex' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            style={{ width: '100%' }}
          >
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
                  {dailyTotals.protein}
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
              {isProteinExceeded && (
                <Typography variant="body2" color="error" sx={{ mt: 1, fontWeight: 'medium' }}>
                  Warning! You are over the protein limit
                </Typography>
              )}
            </CardContent>
          </Card>
          </motion.div>
        </Grid>
        
        {/* Carbs Card */}
        <Grid item xs={12} md={6} lg={3} sx={{ display: 'flex' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            style={{ width: '100%' }}
          >
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
                  {dailyTotals.carbs}
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
              {isCarbsExceeded && (
                <Typography variant="body2" color="error" sx={{ mt: 1, fontWeight: 'medium' }}>
                  Warning! You are over the carb limit
                </Typography>
              )}
            </CardContent>
          </Card>
          </motion.div>
        </Grid>
        
        {/* Fat Card */}
        <Grid item xs={12} md={6} lg={3} sx={{ display: 'flex' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
            style={{ width: '100%' }}
          >
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
                  {dailyTotals.fat}
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
              {isFatExceeded && (
                <Typography variant="body2" color="error" sx={{ mt: 1, fontWeight: 'medium' }}>
                  Warning! You are over the fat limit
                </Typography>
              )}
            </CardContent>
          </Card>
          </motion.div>
        </Grid>
        
        {/* Chart */}
        <Grid item xs={12} md={8} sx={{ display: 'flex' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
            style={{ width: '100%' }}
          >
            <Card sx={{ height: '100%', minHeight: 400 }}>
              <CardContent sx={{ p: 3, height: '100%' }}>
                <Box sx={{ height: 'calc(100% - 40px)', pt: 1 }}>
                  <Bar options={chartOptions} data={chartData} />
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        
        {/* Today's Meals */}
        <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
            style={{ width: '100%' }}
          >
            <Card sx={{ height: '100%', minHeight: 400 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RestaurantIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight="bold">
                  Today's Meals
                </Typography>
              </Box>
              
              <Box sx={{ maxHeight: 320, overflow: 'auto', pr: 1 }}>
                {groupedMeals.length > 0 ? (
                  groupedMeals.map((meal) => (
                    <Box 
                      key={meal.id} 
                      sx={{ 
                        mb: 2,
                        pb: 2,
                        borderBottom: 1, 
                        borderColor: 'divider',
                        width: '100%'
                      }}
                    >
                      {/* Meal Header Row - Title and Calories */}
                      <Box 
                        sx={{ 
                          display: 'grid',
                          gridTemplateColumns: 'minmax(0, 1fr) 80px',
                          width: '100%',
                          mb: 1.5,
                          alignItems: 'center'
                        }}
                      >
                        {/* Meal Title with Count Badge */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          minWidth: 0, // Allows text to truncate properly
                          pr: 1
                        }}>
                          <Typography 
                            variant="subtitle1" 
                            fontWeight="medium"
                            sx={{ 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              mr: meal.count > 1 ? 1 : 0
                            }}
                          >
                            {meal.meal.name}
                          </Typography>
                          {meal.count > 1 && (
                            <Chip 
                              label={`x${meal.count}`} 
                              size="small" 
                              color="primary" 
                              sx={{ 
                                height: 20, 
                                fontSize: '0.7rem',
                                flexShrink: 0
                              }}
                            />
                          )}
                        </Box>
                        
                        {/* Calories */}
                        <Typography 
                          variant="subtitle2" 
                          fontWeight="bold" 
                          color="primary.main"
                          sx={{ 
                            textAlign: 'right',
                            flexShrink: 0
                          }}
                        >
                          {meal.total_calories} cal
                        </Typography>
                      </Box>
                      
                      {/* Nutrition Details Row */}
                      <Box 
                        sx={{ 
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          width: '100%',
                          gap: 1
                        }}
                      >
                        <Typography variant="body2" color="info.main">
                          P: {meal.total_protein}g
                        </Typography>
                        <Typography variant="body2" color="warning.main">
                          C: {meal.total_carbs}g
                        </Typography>
                        <Typography variant="body2" color="error.main">
                          F: {meal.total_fat}g
                        </Typography>
                      </Box>
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
          </motion.div>
        </Grid>
      </Grid>
        </motion.div>
      )}

      {/* Tab Content: Today's Meals */}
      {activeTab === 1 && (
        <motion.div
          key="meals"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <RestaurantIcon sx={{ mr: 1, color: theme.palette.primary.main, fontSize: 28 }} />
                  <Typography variant="h5" fontWeight="bold">
                    Today's Meals
                  </Typography>
                </Box>
                <Chip 
                  label={`${groupedMeals.reduce((sum, meal) => sum + meal.count, 0)} items logged`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
              
              {groupedMeals.length > 0 ? (
                <Stack spacing={2}>
                  {groupedMeals.map((meal) => (
                    <Card 
                      key={meal.id} 
                      variant="outlined"
                      sx={{ 
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: 2,
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="h6" fontWeight="medium">
                                {meal.meal.name}
                              </Typography>
                              {meal.count > 1 && (
                                <Chip 
                                  label={`×${meal.count}`} 
                                  size="small" 
                                  color="primary"
                                />
                              )}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {meal.meal.dining_hall} • {meal.meal.category}
                            </Typography>
                          </Box>
                          <Chip
                            label={`${meal.total_calories} cal`}
                            color="primary"
                            sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}
                          />
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Protein
                            </Typography>
                            <Typography variant="h6" color="info.main" fontWeight="bold">
                              {meal.total_protein}g
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Carbs
                            </Typography>
                            <Typography variant="h6" color="warning.main" fontWeight="bold">
                              {meal.total_carbs}g
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Fat
                            </Typography>
                            <Typography variant="h6" color="error.main" fontWeight="bold">
                              {meal.total_fat}g
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ py: 8, textAlign: 'center' }}>
                  <RestaurantIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No meals logged today
                  </Typography>
                  <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                    Head to "Log Meal" to start tracking your nutrition!
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/log-meal"
                    variant="contained"
                    startIcon={<RestaurantIcon />}
                  >
                    Log Your First Meal
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tab Content: Analytics */}
      {activeTab === 2 && (
        <motion.div
          key="analytics"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Stats Cards Row */}
          <Grid container spacing={3} sx={{ mb: 3, justifyContent: 'center' }}>
            {/* Streak Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)` }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocalFireDepartmentIcon sx={{ fontSize: 40, color: 'white', mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold" color="white">
                      Current Streak
                    </Typography>
                  </Box>
                  <Typography variant="h2" fontWeight="bold" color="white" sx={{ mb: 1 }}>
                    {mockStreakData.currentStreak}
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.9)">
                    days hitting calorie goal
                  </Typography>
                  <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="caption" color="rgba(255,255,255,0.7)">
                        Longest
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="white">
                        {mockStreakData.longestStreak} days
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="rgba(255,255,255,0.7)">
                        Total Logged
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="white">
                        {mockStreakData.totalDaysLogged} days
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Weight Trend Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ScaleIcon sx={{ fontSize: 32, color: theme.palette.info.main, mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Weight Trend
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                    <Typography variant="h2" fontWeight="bold" color="text.primary">
                      {mockWeightHistory[mockWeightHistory.length - 1].weight}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ ml: 1 }}>
                      lbs
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {weightTrend.direction === 'down' ? (
                      <TrendingDownIcon sx={{ color: theme.palette.success.main, mr: 0.5 }} />
                    ) : weightTrend.direction === 'up' ? (
                      <TrendingUpIcon sx={{ color: theme.palette.error.main, mr: 0.5 }} />
                    ) : null}
                    <Typography 
                      variant="body2" 
                      color={weightTrend.direction === 'down' ? 'success.main' : weightTrend.direction === 'up' ? 'error.main' : 'text.secondary'}
                    >
                      {weightTrend.change > 0 ? '+' : ''}{weightTrend.change} lbs ({weightTrend.percentage > 0 ? '+' : ''}{weightTrend.percentage}%)
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Since {new Date(mockWeightHistory[0].date).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Goal Achievement Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmojiEventsIcon sx={{ fontSize: 32, color: theme.palette.warning.main, mr: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Goal Achievement
                    </Typography>
                  </Box>
                  <Typography variant="h2" fontWeight="bold" color="warning.main" sx={{ mb: 1 }}>
                    {Math.round((mockStreakData.currentStreak / mockStreakData.totalDaysLogged) * 100)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    of days on track
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(mockStreakData.currentStreak / mockStreakData.totalDaysLogged) * 100}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      mb: 2,
                      backgroundColor: 'rgba(255, 160, 0, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: theme.palette.warning.main,
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Last logged: {new Date(mockStreakData.lastLoggedDate).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Helpful Message for New Users */}
          {nutritionHistory.length < 7 && (
            <Card sx={{ mb: 3, bgcolor: 'info.lighter', border: '1px solid', borderColor: 'info.light' }}>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CalendarTodayIcon sx={{ fontSize: 32, color: 'info.main' }} />
                  <Box>
                    <Typography variant="body1" fontWeight="medium" color="text.primary">
                      Keep logging to see your trends!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Log meals consistently for at least 7 days to see meaningful patterns and track your progress over time.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Time Period Selector */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight="bold">
              Nutrition Trends
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                label="7 Days"
                color={timePeriod === '7days' ? 'primary' : 'default'}
                onClick={() => setTimePeriod('7days')}
                sx={{ fontWeight: timePeriod === '7days' ? 'bold' : 'normal' }}
              />
              <Chip
                label="30 Days"
                color={timePeriod === '30days' ? 'primary' : 'default'}
                onClick={() => setTimePeriod('30days')}
                sx={{ fontWeight: timePeriod === '30days' ? 'bold' : 'normal' }}
              />
            </Stack>
          </Box>

          {/* Charts Grid */}
          <Grid container spacing={3}>
            {/* Calorie Trend Chart */}
            <Grid item xs={12} lg={8}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Daily Calorie Intake
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Track your calories over time vs your goal
                  </Typography>
                  <Box sx={{ height: 350 }}>
                    <Line data={calorieTrendData} options={trendChartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Today's Macro Breakdown */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Today's Macros
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Current breakdown
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <Bar options={chartOptions} data={chartData} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Weight Tracking Chart */}
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Weight Progress
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        Your weight journey over time
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<ScaleIcon />}
                        size="small"
                      >
                        Log Weight
                      </Button>
                    </Box>
                  </Box>
                  <Box sx={{ height: 300 }}>
                    <Line data={weightTrendData} options={trendChartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      )}

    </Container>
  );
};

export default Dashboard;
