import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { AppThemeProvider } from './components/ThemeProvider';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import LogMeal from './pages/LogMeal';
import Search from './pages/Search';
import './App.css';

function App() {
  return (
    <AppThemeProvider>
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', py: 3 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/log-meal" element={<LogMeal />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </AppThemeProvider>
  );
}

export default App
