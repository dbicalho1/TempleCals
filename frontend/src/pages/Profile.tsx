import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  Switch,
  FormControlLabel,
  Paper,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

interface ProfileData {
  age: number | '';
  weight: number | '';
  height: number | '';
  gender: string;
  activity_level: string;
  goal: string;
  daily_calorie_goal: number | '';
  daily_protein_goal: number | '';
  daily_carb_goal: number | '';
  daily_fat_goal: number | '';
}

interface RecommendedMacros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState<ProfileData>({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activity_level: '',
    goal: '',
    daily_calorie_goal: '',
    daily_protein_goal: '',
    daily_carb_goal: '',
    daily_fat_goal: '',
  });
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [recommended, setRecommended] = useState<RecommendedMacros | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        age: user.age || '',
        weight: user.weight || '',
        height: user.height || '',
        gender: user.gender || '',
        activity_level: user.activity_level || '',
        goal: user.goal || '',
        daily_calorie_goal: user.daily_calorie_goal || '',
        daily_protein_goal: user.daily_protein_goal || '',
        daily_carb_goal: user.daily_carb_goal || '',
        daily_fat_goal: user.daily_fat_goal || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('templecals_token');
      const response = await fetch('http://localhost:5001/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          auto_calculate: autoCalculate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Update user in context
      updateUser(data.user);
      setRecommended(data.recommended_macros);
      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'light', label: 'Light (1-3 days/week)' },
    { value: 'moderate', label: 'Moderate (3-5 days/week)' },
    { value: 'active', label: 'Active (6-7 days/week)' },
    { value: 'very_active', label: 'Very Active (physical job + training)' },
  ];

  const goals = [
    { value: 'cutting', label: 'Cutting (lose weight)' },
    { value: 'bulking', label: 'Bulking (gain muscle)' },
    { value: 'maintaining', label: 'Maintaining (stay the same)' },
    { value: 'tracking', label: 'Just Tracking' },
  ];

  const genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Profile Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Update your personal information and nutrition goals
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Personal Information */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Personal Information
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
                    <TextField
                      name="age"
                      type="number"
                      label="Age"
                      fullWidth
                      value={formData.age}
                      onChange={handleChange}
                      disabled={loading}
                      inputProps={{ min: 13, max: 120 }}
                    />
                  </Box>

                  <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
                    <TextField
                      name="gender"
                      select
                      label="Gender"
                      fullWidth
                      value={formData.gender}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      {genders.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
                    <TextField
                      name="weight"
                      type="number"
                      label="Weight (lbs)"
                      fullWidth
                      value={formData.weight}
                      onChange={handleChange}
                      disabled={loading}
                      inputProps={{ min: 50, max: 500, step: 0.1 }}
                    />
                  </Box>

                  <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
                    <TextField
                      name="height"
                      type="number"
                      label="Height (inches)"
                      fullWidth
                      value={formData.height}
                      onChange={handleChange}
                      disabled={loading}
                      inputProps={{ min: 36, max: 96, step: 0.1 }}
                      helperText="Example: 5'10&quot; = 70 inches"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Fitness Goals */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <FitnessCenterIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Fitness Goals
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: '1 1 250px' }}>
                    <TextField
                      name="activity_level"
                      select
                      label="Activity Level"
                      fullWidth
                      value={formData.activity_level}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      {activityLevels.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  <Box sx={{ flex: '1 1 250px' }}>
                    <TextField
                      name="goal"
                      select
                      label="Goal"
                      fullWidth
                      value={formData.goal}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      {goals.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Nutrition Goals */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Daily Nutrition Goals
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={autoCalculate}
                        onChange={(e) => setAutoCalculate(e.target.checked)}
                        disabled={loading}
                      />
                    }
                    label="Auto-calculate"
                  />
                </Box>

                {autoCalculate ? (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    Your nutrition goals will be automatically calculated based on your profile information.
                  </Alert>
                ) : (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                      <TextField
                        name="daily_calorie_goal"
                        type="number"
                        label="Daily Calories"
                        fullWidth
                        value={formData.daily_calorie_goal}
                        onChange={handleChange}
                        disabled={loading}
                        inputProps={{ min: 800, max: 6000 }}
                      />
                    </Box>

                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                      <TextField
                        name="daily_protein_goal"
                        type="number"
                        label="Protein (g)"
                        fullWidth
                        value={formData.daily_protein_goal}
                        onChange={handleChange}
                        disabled={loading}
                        inputProps={{ min: 0, max: 500, step: 0.1 }}
                      />
                    </Box>

                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                      <TextField
                        name="daily_carb_goal"
                        type="number"
                        label="Carbs (g)"
                        fullWidth
                        value={formData.daily_carb_goal}
                        onChange={handleChange}
                        disabled={loading}
                        inputProps={{ min: 0, max: 1000, step: 0.1 }}
                      />
                    </Box>

                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: '200px' }}>
                      <TextField
                        name="daily_fat_goal"
                        type="number"
                        label="Fat (g)"
                        fullWidth
                        value={formData.daily_fat_goal}
                        onChange={handleChange}
                        disabled={loading}
                        inputProps={{ min: 0, max: 300, step: 0.1 }}
                      />
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Recommended Macros Display */}
            {recommended && autoCalculate && (
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'primary.light', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                  Recommended Daily Goals
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: '1 1 calc(25% - 12px)', minWidth: '120px', textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Calories
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {recommended.calories}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 calc(25% - 12px)', minWidth: '120px', textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Protein
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {recommended.protein}g
                    </Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 calc(25% - 12px)', minWidth: '120px', textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Carbs
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {recommended.carbs}g
                    </Typography>
                  </Box>
                  <Box sx={{ flex: '1 1 calc(25% - 12px)', minWidth: '120px', textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Fat
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {recommended.fat}g
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Save Profile'}
            </Button>
          </Stack>
        </Box>
      </motion.div>
    </Container>
  );
};

export default Profile;
