import React, { useState, useMemo } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Drawer,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Autocomplete,
  LinearProgress,
  Snackbar,
  Alert,
  Chip,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  Avatar,
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

export default function SettingsPage({ currentUser }) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">
          Welcome, {currentUser.name}
        </Typography>

        <Typography sx={{ mt: 2 }}>
          This is the settings page.
        </Typography>
      </Paper>
    </Box>
  );
}