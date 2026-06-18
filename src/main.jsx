import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App.jsx';
import './index.css';

const preciseDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#14151f', // Deep charcoal with a subtle blue/violet undertone
      paper: '#1a1c2a',   // Card containers a few shades lighter for nested depth
    },
    primary: {
      main: '#00b8d9', // Vibrant Cyan/Teal brand color
    },
    secondary: {
      main: '#ff9f43', // Muted Orange accent
    },
    text: {
      primary: '#ffffff',
      secondary: '#7a7e93', // Muted gray-blue for labels so data stands out
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  shape: {
    borderRadius: 12, // Medium-soft uniform rounded corners to eliminate industrial sharp edges
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={preciseDarkTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);