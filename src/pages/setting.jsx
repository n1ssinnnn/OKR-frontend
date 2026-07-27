import React, { useState, useMemo } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  MenuItem,
  Tooltip,
  Card,
  InputAdornment,
} from '@mui/material';
import {
  ExpandMore,
  Add,
  DarkMode,
  LightMode,
  Flag,
  TrackChanges,
  WarningAmber,
  CheckCircle,
  Lock,
  Domain,
  Groups,
  Person,
  Send,
  Forum,
} from '@mui/icons-material';

// --- RBAC SIMULATION DATA ---
const simulatedUsers = [
  { id: 1, name: 'Dr. Arisara', role: 'Executive', department: 'Policy Strategy' },
  { id: 2, name: 'Lead Engineer', role: 'Manager', department: 'Engineering Hub' },
  { id: 3, name: 'LMS Developer', role: 'Employee', department: 'Engineering Hub' },
  { id: 4, name: 'UI Designer', role: 'Employee', department: 'Engineering Hub' },
];

export default function OKRTrackingEngine({ currentUser = { id: 1, name: 'Dr. Arisara', role: 'Executive', department: 'Policy Strategy' } }) {
  const [mode, setMode] = useState('dark');
  const [okrs, setOkrs] = useState(initialOKRs);
  const [commentInputs, setCommentInputs] = useState({});
  
  // Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [draftLevel, setDraftLevel] = useState('');

  // --- THEME CONFIGURATION ---
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === 'dark' ? {
        background: { default: '#0F1115', paper: '#1A1D24' },
        primary: { main: '#4ECDC4' },
        secondary: { main: '#A389F4' },
        success: { main: '#50E3C2' },
        warning: { main: '#FFB86C' },
        error: { main: '#f9bee4' },
        company: { main: '#A389F4' }, 
        team: { main: '#4ECDC4' },    
        individual: { main: '#8B92A5' } 
      } : {
        background: { default: '#F4F7FE', paper: '#FFFFFF' },
        primary: { main: '#4318FF' },
        secondary: { main: '#39B8FF' },
        company: { main: '#4318FF' },
        team: { main: '#39B8FF' },
        individual: { main: '#8F9BBA' }
      })
    },
    typography: { fontFamily: '"Inter", sans-serif' },
    shape: { borderRadius: 12 },
    components: {
      MuiAccordion: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            '&:before': { display: 'none' },
            backgroundColor: mode === 'dark' ? '#1A1D24' : '#FFFFFF',
            border: mode === 'dark' ? '1px solid #2A2D3A' : '1px solid #E2E8F0',
            borderRadius: '12px !important',
            marginBottom: '16px',
          }
        }
      }
    }
  }), [mode]);
}

// 1. Define your settings configuration object
const userSettings = {
  theme: "dark",
  showNotifications: true,
  fontSize: "16px",
  sidebarWidth: 250,
};

function SettingsPanel() {
  return (
    // 2. Map settings to JSX attributes using curly braces
    <div 
      className={`app-container ${userSettings.theme}`}
      style={{ fontSize: userSettings.fontSize }} // Double braces for inline style objects
    >
      <h1>Application Settings</h1>
      
      {/* 3. Conditional rendering based on settings */}
      {userSettings.showNotifications ? (
        <div className="alert-box">Notifications are Enabled</div>
      ) : (
        <div className="alert-box">Notifications are Muted</div>
      )}

      <aside style={{ width: userSettings.sidebarWidth }}>
        <p>Sidebar Navigation</p>
      </aside>
    </div>
  );
}

export default SettingsPanel;
