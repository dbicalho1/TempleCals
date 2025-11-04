import React, { useState, useEffect } from 'react';
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
  IconButton,
  InputAdornment,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

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

    // Validate password strength (client-side check before backend)
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }
    if (!/[a-z]/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter');
      return;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one number');
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
          minHeight: 'calc(100vh - 70px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ width: '100%' }}
        >
          <Card 
            sx={{ 
              width: '100%', 
              maxWidth: 650,
              mx: 'auto',
              boxShadow: 3,
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
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

                  <TextField
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    fullWidth
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            disabled={loading}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <PasswordStrengthIndicator password={formData.password} />

                  <TextField
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Confirm Password"
                    fullWidth
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    error={formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword}
                    helperText={
                      formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword
                        ? 'Passwords do not match'
                        : ''
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            disabled={loading}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

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
        </motion.div>
      </Box>
    </Container>
  );
};

export default Register;
