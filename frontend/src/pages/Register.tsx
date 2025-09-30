import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Link,
  Stack,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    daily_calorie_goal: 2000,
    daily_protein_goal: 150,
    daily_carb_goal: 250,
    daily_fat_goal: 65,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name.includes('_goal') ? parseFloat(value) || 0 : value 
    });
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 600 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Box textAlign="center">
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  🍒 TempleCals
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  Create Your Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Join TempleCals to start tracking your nutrition goals
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  {/* Personal Information */}
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Personal Information
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <TextField
                      name="first_name"
                      label="First Name"
                      fullWidth
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <TextField
                      name="last_name"
                      label="Last Name"
                      fullWidth
                      required
                      value={formData.last_name}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </Box>

                  <TextField
                    name="email"
                    type="email"
                    label="Email"
                    fullWidth
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />

                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <TextField
                      name="password"
                      type="password"
                      label="Password"
                      fullWidth
                      required
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      helperText="Minimum 6 characters"
                    />
                    <TextField
                      name="confirmPassword"
                      type="password"
                      label="Confirm Password"
                      fullWidth
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </Box>

                  {/* Nutrition Goals */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mt: 2 }}>
                    Daily Nutrition Goals (Optional)
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                    <TextField
                      name="daily_calorie_goal"
                      type="number"
                      label="Calorie Goal"
                      fullWidth
                      value={formData.daily_calorie_goal}
                      onChange={handleChange}
                      disabled={loading}
                      InputProps={{ inputProps: { min: 1000, max: 5000 } }}
                    />
                    <TextField
                      name="daily_protein_goal"
                      type="number"
                      label="Protein Goal (g)"
                      fullWidth
                      value={formData.daily_protein_goal}
                      onChange={handleChange}
                      disabled={loading}
                      InputProps={{ inputProps: { min: 50, max: 300 } }}
                    />
                    <TextField
                      name="daily_carb_goal"
                      type="number"
                      label="Carb Goal (g)"
                      fullWidth
                      value={formData.daily_carb_goal}
                      onChange={handleChange}
                      disabled={loading}
                      InputProps={{ inputProps: { min: 100, max: 500 } }}
                    />
                    <TextField
                      name="daily_fat_goal"
                      type="number"
                      label="Fat Goal (g)"
                      fullWidth
                      value={formData.daily_fat_goal}
                      onChange={handleChange}
                      disabled={loading}
                      InputProps={{ inputProps: { min: 30, max: 150 } }}
                    />
                  </Box>

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
                      mt: 3,
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </Stack>
              </Box>

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    sx={{ fontWeight: 600, textDecoration: 'none' }}
                  >
                    Sign in here
                  </Link>
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Register;
