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
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
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
              maxWidth: 450,
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
                    Welcome Back
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sign in to your account to continue tracking your nutrition
                  </Typography>
                </Box>

              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    name="email"
                    type="email"
                    label="Email"
                    fullWidth
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    sx={{ borderRadius: 2 }}
                  />

                  <TextField
                    name="password"
                    type="password"
                    label="Password"
                    fullWidth
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    sx={{ borderRadius: 2 }}
                  />

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
                    {loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </Stack>
              </Box>

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    sx={{ fontWeight: 600, textDecoration: 'none' }}
                  >
                    Sign up here
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

export default Login;
