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
  Search,
  Add,
  UploadFile,
  CloudUpload,
  DarkMode,
  LightMode,
  Close,
  ViewList,
  AccountTree,
} from '@mui/icons-material';

// --- CONTEXTUAL MOCK DATA ---
const predefinedDepartments = [
  'Engineering Hub',
  'Policy Strategy',
  'Phak Phrom Soep',
  'Media & PR',
  'Student Affairs'
];

const mockManagers = [
  { id: 'm1', name: 'Dr. Arisara (Advisor)' },
  { id: 'm2', name: 'Campaign Director' },
  { id: 'm3', name: 'Lead Engineer' },
];

const initialUsers = [
  { id: 1, name: 'Dr. Arisara (Advisor)', email: 'arisara@school.edu', role: 'Executive', department: 'Policy Strategy', manager: 'Board' },
  { id: 2, name: 'Lead Engineer', email: 'lead.eng@school.edu', role: 'Manager', department: 'Engineering Hub', manager: 'Dr. Arisara (Advisor)' },
  { id: 3, name: 'Campaign Director', email: 'director@school.edu', role: 'Manager', department: 'Phak Phrom Soep', manager: 'Dr. Arisara (Advisor)' },
  { id: 4, name: 'LMS Developer', email: 'dev.lms@school.edu', role: 'Employee', department: 'Engineering Hub', manager: 'Lead Engineer' },
  { id: 5, name: 'AI Media Artist', email: 'ai.artist@school.edu', role: 'Employee', department: 'Media & PR', manager: 'Campaign Director' },
  { id: 6, name: 'Policy Drafter', email: 'policy@school.edu', role: 'Employee', department: 'Policy Strategy', manager: 'Dr. Arisara (Advisor)' },
];

// We accept currentUser as a prop to check permissions!
export default function OKRUserManagement({ currentUser = { role: 'Employee' } }) {
  const [mode, setMode] = useState('dark');
  const [view, setView] = useState('map'); // Let's default to the cool RBAC map!
  const [users, setUsers] = useState(initialUsers);
  
  // Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [importStep, setImportStep] = useState(0);

  // --- PERMISSION CHECK ---
  const canManageUsers = currentUser.role === 'Executive' || currentUser.role === 'Admin';

  // --- THEME CONFIGURATION ---
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === 'dark' ? {
        background: { default: '#0F1115', paper: '#1A1D24' },
        primary: { main: '#4ECDC4' },
        secondary: { main: '#A389F4' },
        divider: '#2A2D3A'
      } : {
        background: { default: '#F4F7FE', paper: '#FFFFFF' },
        primary: { main: '#4318FF' },
        secondary: { main: '#39B8FF' },
        divider: '#E2E8F0'
      })
    },
    typography: { fontFamily: '"Inter", sans-serif' },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } }
    }
  }), [mode]);

  const handleSaveSingleUser = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setDrawerOpen(false);
      setSuccessMsg(true);
    }, 1500);
  };

  const handleBulkImportCommit = () => {
    setImportStep(3);
    setTimeout(() => {
      setModalOpen(false);
      setImportStep(0);
    }, 2000);
  };

  const executives = users.filter(u => u.role === 'Executive');
  const getDirectReports = (managerName) => users.filter(u => u.manager === managerName);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4, minHeight: '100vh', bgcolor: 'background.default' }}>
        
        {/* HEADER */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" letterSpacing="-0.03em" sx={{ mt: 0.5, backgroundColor: '#5694bb', p: 1, borderRadius: 1, display: 'inline-block' }} style={{ color: '#000000', fontWeight: 600 }}>
              Organization Directory
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, backgroundColor: '#6ab9c0', p: 1, borderRadius: 1, display: 'inline-block' }} style={{ color: '#000000', fontWeight: 600 }}>
              {canManageUsers ? 'Manage internal access and view RBAC alignments' : 'View organizational structure and team alignments'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <IconButton onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} sx={{ bgcolor: 'background.paper' }}>
              {mode === 'dark' ? <LightMode color="warning" /> : <DarkMode color="primary" />}
            </IconButton>
          </Box>
        </Box>

        {/* ACTION TOOLBAR */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#4e88ad', p: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center'}} >
            <TextField
              placeholder="Search directory..."
              size="small"
              InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
              sx={{ width: 300, color: 'text.primary', bgcolor: 'background.paper', borderRadius: 1, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' } }}
            />
            
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(e, newView) => { if (newView) setView(newView); }}
              size="small"
              sx={{ bgcolor: 'background.default' }}
            >
              <ToggleButton value="list" sx={{ px: 2 }}><ViewList sx={{ mr: 1, fontSize: 20 }}/> List</ToggleButton>
              <ToggleButton value="map" sx={{ px: 2 }}><AccountTree sx={{ mr: 1, fontSize: 20 }}/> RBAC Map</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* SECURED BUTTONS: Only render if Executive/Admin */}
          {canManageUsers && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" startIcon={<UploadFile />} onClick={() => setModalOpen(true)}>
                Bulk Import
              </Button>
              <Button variant="contained" startIcon={<Add />} onClick={() => setDrawerOpen(true)}>
                Add User
              </Button>
            </Box>
          )}
        </Box>

        {/* CONTENT AREA: LIST vs MAP */}
        {view === 'list' ? (
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'divider' }}>
            <Table>
              <TableHead sx={{ bgcolor: mode === 'dark' ? '#22252E' : '#F4F7FE' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Employee Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Corporate Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role Tier</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Direct Report</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell fontWeight={500}>{user.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{user.email}</TableCell>
                    <TableCell>
                      <Chip label={user.role} size="small" sx={{ bgcolor: user.role === 'Executive' ? 'secondary.main' : user.role === 'Manager' ? 'primary.main' : mode === 'dark' ? '#333' : '#e0e0e0', color: user.role === 'Employee' ? 'text.primary' : '#fff', fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>{user.manager}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, p: 2 }}>
            {executives.map((exec) => (
              <Box key={exec.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, width: 320, border: `2px solid ${theme.palette.secondary.main}`, bgcolor: 'background.paper' }}>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>{exec.name.charAt(0)}</Avatar>
                  <Box>
                    <Typography fontWeight={700}>{exec.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{exec.department}</Typography>
                    <Chip label="Executive" size="small" sx={{ mt: 0.5, height: 20, fontSize: '0.7rem', bgcolor: 'secondary.main', color: '#fff' }} />
                  </Box>
                </Card>

                {getDirectReports(exec.name).length > 0 && <Box sx={{ width: 2, height: 40, bgcolor: 'divider' }} />}

                <Box sx={{ display: 'flex', gap: 4, position: 'relative' }}>
                  {getDirectReports(exec.name).length > 1 && <Box sx={{ position: 'absolute', top: 0, left: '25%', right: '25%', height: 2, bgcolor: 'divider' }} />}

                  {getDirectReports(exec.name).map((manager) => (
                    <Box key={manager.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {getDirectReports(exec.name).length > 1 && <Box sx={{ width: 2, height: 20, bgcolor: 'divider' }} />}
                      
                      <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, width: 280, border: `1px solid ${theme.palette.primary.main}`, bgcolor: 'background.paper' }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>{manager.name.charAt(0)}</Avatar>
                        <Box>
                          <Typography fontWeight={700} fontSize="0.95rem">{manager.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{manager.department}</Typography>
                          <Chip label="Team Lead" size="small" sx={{ mt: 0.5, display: 'block', width: 'fit-content', height: 18, fontSize: '0.65rem', bgcolor: 'primary.main', color: '#fff' }} />
                        </Box>
                      </Card>

                      {getDirectReports(manager.name).length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2, gap: 1.5, pl: 2, borderLeft: `2px solid ${theme.palette.divider}` }}>
                          {getDirectReports(manager.name).map((emp) => (
                            <Box key={emp.id} sx={{ display: 'flex', alignItems: 'center', width: 260, position: 'relative' }}>
                              <Box sx={{ width: 16, height: 2, bgcolor: 'divider', mr: 1 }} />
                              <Card sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1, bgcolor: mode === 'dark' ? '#22252E' : '#F8FAFC', boxShadow: 'none', border: 1, borderColor: 'divider' }}>
                                <Avatar sx={{ width: 28, height: 28, fontSize: '0.8rem' }}>{emp.name.charAt(0)}</Avatar>
                                <Box>
                                  <Typography fontWeight={600} fontSize="0.85rem">{emp.name}</Typography>
                                  <Typography variant="caption" color="text.secondary">{emp.role}</Typography>
                                </Box>
                              </Card>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* =========================================
            SINGLE USER PROVISIONING DRAWER
            ========================================= */}
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: 450, p: 3, bgcolor: 'background.default' } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h6" fontWeight={700}>Provision New User</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}><Close /></IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="First Name" fullWidth size="small" />
              <TextField label="Last Name" fullWidth size="small" />
            </Box>
            <TextField label="Corporate Email" type="email" fullWidth size="small" required helperText="Must be a valid organizational email address." />
            <TextField select label="Role / Access Tier" fullWidth size="small" defaultValue="">
              {['Admin', 'Executive', 'Manager', 'Employee'].map((role) => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </TextField>
            <Autocomplete options={predefinedDepartments} renderInput={(params) => <TextField {...params} label="Department Grouping" size="small" />} />
            <Autocomplete options={mockManagers} getOptionLabel={(option) => option.name} renderInput={(params) => <TextField {...params} label="Direct Report To" size="small" />} />
          </Box>
          <Box sx={{ mt: 'auto', pt: 4 }}>
            <Button variant="contained" fullWidth size="large" onClick={handleSaveSingleUser} disabled={isSaving}>
              {isSaving ? 'Provisioning...' : 'Save User Profile'}
            </Button>
          </Box>
        </Drawer>
        <Snackbar open={successMsg} autoHideDuration={4000} onClose={() => setSuccessMsg(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity="success" variant="filled" sx={{ width: '100%' }}>Account provisioned successfully.</Alert>
        </Snackbar>

        {/* =========================================
            BULK IMPORT MODAL
            ========================================= */}
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: 'background.paper', borderRadius: 3 } }}>
          <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
            Bulk Roster Import
            <IconButton onClick={() => setModalOpen(false)} size="small"><Close /></IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ minHeight: 400, display: 'flex', flexDirection: 'column' }}>
            {importStep === 0 && (
              <Box 
                sx={{ 
                  flexGrow: 1, border: '2px dashed', borderColor: 'primary.main', borderRadius: 2, 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  bgcolor: mode === 'dark' ? 'rgba(78, 205, 196, 0.05)' : 'rgba(67, 24, 255, 0.05)',
                  cursor: 'pointer', transition: 'all 0.2s', '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => setImportStep(1)} 
              >
                <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" fontWeight={600}>Drag & Drop CSV/Excel file here</Typography>
                <Typography variant="body2" color="text.secondary">or click to browse local storage</Typography>
              </Box>
            )}
            {importStep === 1 && (
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>Map Data Columns</Typography>
                <Grid container spacing={2} sx={{ mb: 2, pb: 1, borderBottom: 1, borderColor: 'divider' }}>
                  <Grid item xs={6}><Typography variant="body2" color="text.secondary">System Expected Fields</Typography></Grid>
                  <Grid item xs={6}><Typography variant="body2" color="text.secondary">Uploaded File Headers</Typography></Grid>
                </Grid>
                {['Email', 'First Name', 'Role', 'Department'].map((field) => (
                  <Grid container spacing={2} sx={{ mb: 2, alignItems: 'center' }} key={field}>
                    <Grid item xs={6}><Typography fontWeight={500}>{field} *</Typography></Grid>
                    <Grid item xs={6}>
                      <TextField select fullWidth size="small" defaultValue={field}>
                        <MenuItem value={field}>{field} (Auto-detected)</MenuItem>
                        <MenuItem value="unmapped">-- Ignore --</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                ))}
              </Box>
            )}
            {importStep === 2 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>Pre-Flight Data Check</Typography>
                  <Chip label="1 Warning Detected" color="error" size="small" />
                </Box>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Department</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>john.doe@company.com</TableCell>
                        <TableCell>John Doe</TableCell>
                        <TableCell>Employee</TableCell>
                        <TableCell>Engineering Hub</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>jane.smith@company.com</TableCell>
                        <TableCell>Jane Smith</TableCell>
                        <TableCell>Manager</TableCell>
                        <TableCell sx={{ bgcolor: 'rgba(244, 67, 54, 0.15)', border: '1px solid #f44336', color: '#f44336', fontWeight: 'bold' }}>
                          [UNMAPPED DEPT]
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
            {importStep === 3 && (
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6" align="center" mb={2}>Committing Roster...</Typography>
                <LinearProgress color="primary" sx={{ height: 10, borderRadius: 5 }} />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            {importStep === 1 && (
              <>
                <Button onClick={() => setImportStep(0)} color="inherit">Back</Button>
                <Button variant="contained" onClick={() => setImportStep(2)}>Run Data Pre-Check</Button>
              </>
            )}
            {importStep === 2 && (
              <>
                <Button onClick={() => setImportStep(1)} color="inherit">Edit Mapping</Button>
                <Button variant="contained" color="warning" onClick={handleBulkImportCommit}>Confirm and Commit Roster</Button>
              </>
            )}
          </DialogActions>
        </Dialog>

      </Box>
    </ThemeProvider>
  );
}