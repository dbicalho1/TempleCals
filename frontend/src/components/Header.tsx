import { 
  AppBar, Toolbar, Typography, Button, Box, Container, 
  useTheme, useMediaQuery, IconButton, Drawer, List, ListItem, ListItemText,
  Tooltip
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SearchIcon from '@mui/icons-material/Search';

import { useThemeMode } from './ThemeProvider';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleColorMode } = useThemeMode();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { text: 'Log Meal', path: '/log-meal', icon: <RestaurantIcon /> },
    { text: 'Search Foods', path: '/search', icon: <SearchIcon /> }
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
        🍒 TempleCals
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.text} 
            button
            component={RouterLink as any}
            to={item.path}
            sx={{
              borderRadius: 1,
              mb: 1,
              backgroundColor: location.pathname === item.path ? 'rgba(158, 27, 52, 0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: location.pathname === item.path ? 'rgba(158, 27, 52, 0.12)' : 'rgba(128, 0, 0, 0.08)',
              },
              '&:focus': {
                outline: 'none',
                boxShadow: 'none',
              },
              '&.Mui-focusVisible': {
                outline: '2px solid #800000',
                outlineOffset: 2,
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
                color: '#800000', // Temple-themed maroon color on hover
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
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: 'rgba(128, 0, 0, 0.08)', // Subtle maroon background on hover
                },
                '&:focus': {
                  outline: 'none',
                  boxShadow: 'none'
                },
                '&.Mui-focusVisible': {
                  outline: `2px solid #800000`,
                  outlineOffset: 2
                }
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
            <Box sx={{ display: 'flex', gap: 1 }}>
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
                        backgroundColor: isActive ? undefined : 'rgba(128, 0, 0, 0.08)', // Maroon hover for non-active buttons
                      },
                      '&:focus': {
                        outline: 'none',
                        boxShadow: 'none'
                      },
                      '&.Mui-focusVisible': {
                        outline: `2px solid #800000`,
                        outlineOffset: 2
                      }
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
