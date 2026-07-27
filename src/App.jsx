import React, { useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, IconButton, Tooltip, Avatar } from '@mui/material';
import { PeopleAlt, TrackChanges, SpaceDashboard, Settings, Logout } from '@mui/icons-material';

import OKRUserManagement from './pages/module1.jsx';
import OKRTrackingEngine from './pages/module2.jsx';
import SettingsPage from './pages/setting.jsx';
import LoginScreen from './pages/login.jsx';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null); 
  const [activeView, setActiveView] = useState('tracking'); 
  
  const globalTheme = useMemo(() => createTheme({
    palette: { mode: 'dark', background: { default: '#0F1115', paper: '#1A1D24' }, primary: { main: '#4ECDC4' } },
    typography: { fontFamily: '"Inter", sans-serif' },
  }), []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setActiveView('tracking'); 
  };

  const handleLogout = () => {
    setCurrentUser(null); 
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <ThemeProvider theme={globalTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
        
        {/* GLOBAL MASTER SIDEBAR */}
        <Box 
          sx={{ 
            width: 88, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', 
            alignItems: 'center', py: 3, borderRight: '1px solid #2A2D3A', zIndex: 10
          }}
        >
          <Box 
            sx={{ 
              width: 44, height: 44, borderRadius: 2, bgcolor: 'primary.main', 
              display: 'flex', justifyContent: 'center', alignItems: 'center', 
              color: '#000', mb: 6, fontWeight: 900, fontSize: '1.2rem' 
            }}
          >
            O
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, flexGrow: 1 }}>

            {/* UNLOCKED ROUTE: Everyone can now click this button */}
            <Tooltip title="Organization Directory" placement="right">
              <IconButton 
                onClick={() => setActiveView('users')}
                sx={{ 
                  color: activeView === 'users' ? 'primary.main' : '#8B92A5',
                  bgcolor: activeView === 'users' ? 'rgba(78, 205, 196, 0.15)' : 'transparent',
                  borderRadius: 3, '&:hover': { bgcolor: 'rgba(78, 205, 196, 0.1)' }
                }}
              >
                <PeopleAlt sx={{ fontSize: 28 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="OKR Command Center" placement="right">
              <IconButton 
                onClick={() => setActiveView('tracking')}
                sx={{ 
                  color: activeView === 'tracking' ? 'primary.main' : '#8B92A5',
                  bgcolor: activeView === 'tracking' ? 'rgba(78, 205, 196, 0.15)' : 'transparent',
                  borderRadius: 3, '&:hover': { bgcolor: 'rgba(78, 205, 196, 0.1)' }
                }}
              >
                <TrackChanges sx={{ fontSize: 28 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Legacy Dashboard" placement="right">
              <IconButton sx={{ color: '#8B92A5', borderRadius: 3, opacity: 0.5 }}>
                <SpaceDashboard sx={{ fontSize: 28 }} />
              </IconButton>
            </Tooltip>
          </Box>

          <Tooltip title="Settings" placement="right">
            <IconButton
              onClick={() => setActiveView("settings")}
              sx={{
                color: activeView === "settings" ? "primary.main" : "#8B92A5",
                bgcolor: activeView === "settings" ? "rgba(78,205,196,0.15)" : "transparent",
                borderRadius: 3, "&:hover": { bgcolor: "rgba(78,205,196,0.1)"}
              }}
            >
              <Settings sx={{ fontSize: 28 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title={`Logged in as ${currentUser.name}`} placement="right">
            <Avatar sx={{ width: 36, height: 36, bgcolor: '#3A3D4A', fontSize: '0.9rem', mb: 2, cursor: 'pointer' }}>
              {currentUser.name.charAt(0)}
            </Avatar>
          </Tooltip>
          <Tooltip title="Sign Out" placement="right">
            <IconButton onClick={handleLogout} sx={{ color: '#f9bee4' }}>
              <Logout />
            </IconButton>
          </Tooltip>
        </Box>

        {/* DYNAMIC CONTENT AREA */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {/* We now pass currentUser to both modules */}
          {activeView === 'users' && <OKRUserManagement currentUser={currentUser} />}
          {activeView === 'tracking' && <OKRTrackingEngine currentUser={currentUser} />}
          {activeView === 'settings' && <SettingsPage currentUser={currentUser} />}
        </Box>

      </Box>
    </ThemeProvider>
  );
}