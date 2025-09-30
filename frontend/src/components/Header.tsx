import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useThemeMode } from './ThemeProvider';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleColorMode } = useThemeMode();
  const { isAuthenticated, user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = isAuthenticated 
    ? [
        { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
        { text: 'Log Meal', path: '/log-meal', icon: <RestaurantIcon /> },
        { text: 'Search Foods', path: '/search', icon: <SearchIcon /> },
      ]
    : [
        { text: 'Home', path: '/', icon: <HomeIcon /> },
      ];

  const authItems = isAuthenticated
    ? [
        { 
          text: `${user?.first_name || 'User'}`, 
          action: 'profile', 
          icon: <DashboardIcon />,
          path: '/dashboard'
        },
        { text: 'Logout', action: 'logout', icon: <LogoutIcon /> },
      ]
    : [
        { text: 'Login', path: '/login', icon: <LoginIcon /> },
        { text: 'Sign Up', path: '/register', icon: <PersonAddIcon /> },
      ];

  const handleItemClick = (item: any) => {
    if (item.action === 'logout') {
      logout();
      handleDrawerToggle();
    }
  };

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
        🍒 TempleCals
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.text} 
            component={RouterLink as any}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              borderRadius: 1,
              mb: 1,
              backgroundColor: location.pathname === item.path ? 'primary.light' : 'transparent',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: location.pathname === item.path ? 'primary.main' : 'action.hover',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box sx={{ 
                color: location.pathname === item.path ? theme.palette.primary.main : 'text.secondary',
                mr: 2
              }}>
                {item.icon}
              </Box>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 'bold' : 'regular',
                  color: location.pathname === item.path ? 'primary.main' : 'text.primary'
                }}
              />
            </Box>
          </ListItem>
        ))}
        
        {/* Auth Items */}
        {authItems.map((item) => (
          <ListItem 
            key={item.text}
            {...(item.path ? { component: RouterLink as any, to: item.path } : {})}
            onClick={() => handleItemClick(item)}
            sx={{
              borderRadius: 1,
              mb: 1,
              backgroundColor: item.path && location.pathname === item.path ? 'primary.light' : 'transparent',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: item.path && location.pathname === item.path ? 'primary.main' : 'action.hover',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box sx={{ 
                color: item.path && location.pathname === item.path ? theme.palette.primary.main : 'text.secondary',
                mr: 2
              }}>
                {item.icon}
              </Box>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  fontWeight: item.path && location.pathname === item.path ? 'bold' : 'regular',
                  color: item.path && location.pathname === item.path ? 'primary.main' : 'text.primary'
                }}
              />
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" elevation={0} sx={{ 
      borderBottom: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.mode === 'light' ? 'white' : theme.palette.background.paper,
    }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ py: 1 }}>
          <Typography 
            variant="h5" 
            component={RouterLink} 
            to="/"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold', 
              color: theme.palette.primary.main,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                color: 'primary.dark',
              }
            }}
          >
            <Box 
              component="span" 
              role="img"
              aria-label="Cherry"
              sx={{ fontSize: '1.5rem', mr: 1 }}
            >
              🍒
            </Box>
            TempleCals
          </Typography>

          <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
            <IconButton 
              onClick={toggleColorMode} 
              sx={{ 
                mr: isMobile ? 0 : 2,
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Tooltip>
          
          {isMobile ? (
            <IconButton
              color="primary"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button 
                    key={item.text} 
                    component={RouterLink} 
                    to={item.path}
                    color={isActive ? 'primary' : 'inherit'}
                    variant={isActive ? 'contained' : 'text'}
                    startIcon={item.icon}
                    sx={{ 
                      fontWeight: 500,
                      borderRadius: 2,
                      px: 2,
                      ...(isActive ? {} : { color: 'text.primary' }),
                      '&:hover': {
                        backgroundColor: isActive ? undefined : 'action.hover',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                );
              })}
              
              {/* Auth Buttons */}
              {authItems.map((item) => {
                const isActive = item.path && location.pathname === item.path;
                if (item.action === 'logout') {
                  return (
                    <Button
                      key={item.text}
                      onClick={logout}
                      variant="outlined"
                      startIcon={item.icon}
                      sx={{
                        fontWeight: 500,
                        borderRadius: 2,
                        px: 2,
                        color: 'text.primary',
                        borderColor: 'divider',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      {item.text}
                    </Button>
                  );
                }
                
                return (
                  <Button 
                    key={item.text} 
                    component={RouterLink} 
                    to={item.path}
                    color={isActive ? 'primary' : 'inherit'}
                    variant={isActive ? 'contained' : item.text === 'Sign Up' ? 'contained' : 'text'}
                    startIcon={item.icon}
                    sx={{ 
                      fontWeight: 500,
                      borderRadius: 2,
                      px: 2,
                      ...(isActive ? {} : { color: 'text.primary' }),
                      '&:hover': {
                        backgroundColor: isActive ? undefined : 'action.hover',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                );
              })}
            </Box>
          )}
        </Toolbar>
      </Container>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;
