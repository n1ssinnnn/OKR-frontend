import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Tooltip,
  Typography,
  createTheme,
} from '@mui/material';
import AccountTree from '@mui/icons-material/AccountTree';
import GpsFixed from '@mui/icons-material/GpsFixed';
import Logout from '@mui/icons-material/Logout';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import Settings from '@mui/icons-material/Settings';
import TrackChanges from '@mui/icons-material/TrackChanges';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import MenuOpen from '@mui/icons-material/MenuOpen';

import OKRUserManagement from './pages/module1.jsx';
import OKRTrackingEngine from './pages/module2.jsx';
import OKRWorkspace, {
  INITIAL_OBJECTIVES,
  OKR_CYCLES,
} from './pages/module3.jsx';
import OKRAlignment from './pages/module4.jsx';
import SettingsPage from './pages/setting.jsx';
import LoginScreen from './pages/login.jsx';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0F1115', paper: '#1A1D24' },
    primary: { main: '#4ECDC4' },
    divider: '#2A2D3A',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const navigation = [
  { id: 'objectives', label: 'Objectives & KRs', Icon: GpsFixed, group: 'Workspace' },
  { id: 'alignment', label: 'Alignment', Icon: AccountTree, group: 'Workspace' },
  { id: 'tracking', label: 'Tracking', Icon: TrackChanges, group: 'Workspace' },
  { id: 'users', label: 'Employees', Icon: PeopleAlt, group: 'Organization' },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeView, setActiveView] = useState('objectives');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Modules 3 and 4 use the same data, including parent links and KR progress.
  // Layout reference: retain your existing API/store binding if it differs.
  const [objectives, setObjectives] = useState(INITIAL_OBJECTIVES);

  const handleLogin = user => {
    setCurrentUser(user);
    setActiveView('objectives');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('objectives');
  };

  const labelDisplay = sidebarCollapsed ? 'none' : { xs: 'none', md: 'block' };
  const sidebarButton = selected => ({
    width: '100%', minWidth: 0, minHeight: 42, px: 1.25, gap: 1.25,
    justifyContent: sidebarCollapsed ? 'center' : { xs: 'center', md: 'flex-start' },
    textTransform: 'none', borderRadius: '8px', fontWeight: 500,
    color: selected ? '#71DED4' : '#A1A9BC',
    bgcolor: selected ? 'rgba(78,205,196,0.1)' : 'transparent',
    '&:hover': { bgcolor: 'rgba(78,205,196,0.07)', color: '#DCE4EE' },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!currentUser ? <LoginScreen onLogin={handleLogin} /> : (
        <Box sx={{ display: 'flex', width: '100%', height: '100dvh', minHeight: 0, overflow: 'hidden', bgcolor: 'background.default' }}>
          <Box component="aside" aria-label="Application sidebar" sx={{
            width: sidebarCollapsed ? 76 : { xs: 64, md: 216 }, flexShrink: 0,
            display: 'flex', flexDirection: 'column', px: { xs: 1, md: 1.5 }, py: 2,
            overflowY: 'auto', bgcolor: '#14171D', borderRight: '1px solid', borderColor: 'divider',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 0.75, mb: 3, minHeight: 40, justifyContent: sidebarCollapsed ? 'center' : { xs: 'center', md: 'flex-start' } }}>
              <Box aria-label="OKR Intelligent Platform" sx={{ width: 30, height: 30, flexShrink: 0, borderRadius: '9px', bgcolor: '#4ECDC4', color: '#0F1115', display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 800 }}>O</Box>
              <Box sx={{ display: labelDisplay }}>
                <Typography sx={{ color: '#F0F3F7', fontWeight: 650, fontSize: 14, lineHeight: 1.3 }}>OKR Intelligent</Typography>
                <Typography sx={{ color: '#7E8799', fontSize: 11 }}>Workspace</Typography>
              </Box>
            </Box>

            <Box component="nav" aria-label="Main navigation" sx={{ flexGrow: 1 }}>
              {['Workspace', 'Organization'].map(group => <Box key={group} sx={{ mb: 2.5 }}>
                <Typography sx={{ display: labelDisplay, px: 1.25, mb: 0.75, fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#697386' }}>{group}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {navigation.filter(item => item.group === group).map(({ id, label, Icon }) => (
                    <Tooltip key={id} title={label} placement="right">
                      <Button aria-label={label} aria-pressed={activeView === id} onClick={() => setActiveView(id)} sx={sidebarButton(activeView === id)}>
                        <Icon sx={{ fontSize: 20, flexShrink: 0 }} />
                        <Typography component="span" sx={{ display: labelDisplay, fontSize: 13 }}>{label}</Typography>
                      </Button>
                    </Tooltip>
                  ))}
                </Box>
              </Box>)}
            </Box>

            <Tooltip title="Settings" placement="right">
              <Button aria-label="Settings" aria-pressed={activeView === 'settings'} onClick={() => setActiveView('settings')} sx={sidebarButton(activeView === 'settings')}>
                <Settings sx={{ fontSize: 20 }} /><Typography component="span" sx={{ display: labelDisplay, fontSize: 13 }}>Settings</Typography>
              </Button>
            </Tooltip>

            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 1.5, pt: 1.5, display: 'flex', alignItems: 'center', gap: 1, justifyContent: sidebarCollapsed ? 'center' : { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
              <Tooltip title={`${currentUser.name || 'User'} · ${currentUser.role || ''}`} placement="right">
                <Avatar sx={{ width: 30, height: 30, bgcolor: '#29313C', color: '#C0D7D4', fontSize: 12 }}>{(currentUser.name || 'U').charAt(0).toUpperCase()}</Avatar>
              </Tooltip>
              <Box sx={{ display: labelDisplay, minWidth: 0, flex: 1 }}>
                <Typography noWrap sx={{ fontSize: 12, fontWeight: 500, color: '#DCE4EE' }}>{currentUser.name || 'User'}</Typography>
                <Typography noWrap sx={{ fontSize: 10, color: '#7E8799' }}>{currentUser.role || ''}</Typography>
              </Box>
              <Tooltip title="Sign out" placement="right"><IconButton size="small" aria-label="Sign out" onClick={handleLogout} sx={{ color: '#8B92A5' }}><Logout sx={{ fontSize: 17 }} /></IconButton></Tooltip>
            </Box>
            <Button aria-label={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'} onClick={() => setSidebarCollapsed(value => !value)} sx={{ display: { xs: 'none', md: 'flex' }, color: '#697386', minWidth: 0, mt: 1, fontSize: 11, textTransform: 'none', gap: 0.75 }}>
              {sidebarCollapsed ? <MenuOpen fontSize="small" /> : <ChevronLeft fontSize="small" />}
              {!sidebarCollapsed && 'Collapse sidebar'}
            </Button>
          </Box>

          <Box component="main" sx={{ flex: 1, minWidth: 0, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
            {activeView === 'users' && <OKRUserManagement currentUser={currentUser} />}
            {activeView === 'tracking' && <OKRTrackingEngine currentUser={currentUser} />}
            {activeView === 'objectives' && <OKRWorkspace currentUser={currentUser} objectives={objectives} cycles={OKR_CYCLES} onObjectivesChange={setObjectives} />}
            {activeView === 'alignment' && <OKRAlignment currentUser={currentUser} objectives={objectives} cycles={OKR_CYCLES} onObjectivesChange={setObjectives} />}
            {activeView === 'settings' && <SettingsPage currentUser={currentUser} />}
          </Box>
        </Box>
      )}
    </ThemeProvider>
  );
}
