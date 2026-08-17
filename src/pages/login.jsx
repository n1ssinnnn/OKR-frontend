import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  TextField, 
  Button, 
  Divider, 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  Chip
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

// These represent the accounts stored in your database
const demoAccounts = [
  { id: 1, name: 'Dr. Arisara', role: 'Executive', department: 'Policy Strategy', email: 'admin@school.edu' },
  { id: 2, name: 'Lead Engineer Team', role: 'Team Lead', department: 'Engineering Hub', email: 'manager@school.edu' },
  { id: 3, name: 'LMS Developer', role: 'Employee', department: 'Engineering Hub', email: 'employee@school.edu' },
];

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Dark theme strictly for the login page
  const theme = createTheme({
    palette: { mode: 'dark', background: { default: '#0F1115', paper: '#1A1D24' }, primary: { main: '#4ECDC4' } },
    typography: { fontFamily: '"Inter", sans-serif' },
    shape: { borderRadius: 12 },
  });

  const handleManualLogin = (e) => {
    e.preventDefault();
    // Simulate a database check
    const user = demoAccounts.find(u => u.email === email) || demoAccounts[0]; // defaults to admin if typing random stuff for testing
    onLogin(user);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        
        {/* Background ambient glow */}
        <Box sx={{ position: 'absolute', top: '20%', left: '30%', width: 400, height: 400, bgcolor: 'rgba(78, 205, 196, 0.05)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: '20%', right: '30%', width: 400, height: 400, bgcolor: 'rgba(163, 137, 244, 0.05)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />

        <Card elevation={0} sx={{ width: '100%', maxWidth: 440, p: 5, border: '1px solid #2A2D3A', position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: 'primary.main', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#000', mb: 2 }}>
              <LockOutlined />
            </Box>
            <Typography variant="h5" fontWeight={800} letterSpacing="-0.02em">Platform Access</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>Sign in to manage your OKRs</Typography>
          </Box>

          <form onSubmit={handleManualLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 3 }}>
              <TextField label="Corporate Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
              <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required />
            </Box>
            <Button type="submit" variant="contained" fullWidth size="large" sx={{ py: 1.5, fontWeight: 700, borderRadius: 2 }}>
              Authenticate
            </Button>
          </form>

          <Divider sx={{ my: 4 }}>
            <Typography variant="caption" color="text.secondary">FAST-TRACK DEMO LOGIN</Typography>
          </Divider>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {demoAccounts.map(account => (
              <Button 
                key={account.id} 
                variant="outlined" 
                onClick={() => onLogin(account)}
                sx={{ justifyContent: 'space-between', color: '#fff', borderColor: '#2A2D3A', '&:hover': { borderColor: 'primary.main' } }}
              >
                {account.name}
                <Chip label={account.role} size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: account.role === 'Executive' ? '#A389F430' : '#4ECDC430', color: account.role === 'Executive' ? '#A389F4' : '#4ECDC4' }} />
              </Button>
            ))}
          </Box>
        </Card>
      </Box>
    </ThemeProvider>
  );
}