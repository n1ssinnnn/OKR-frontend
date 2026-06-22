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

const initialOKRs = [
  {
    id: 'o1',
    level: 'Company',
    title: 'Increase Institutional Tech Adoption by 50%',
    department: 'Global',
    ownerId: 1,
    ownerName: 'Dr. Arisara',
    progress: 75,
    status: 'On Track',
    keyResults: [
      { id: 'kr1', title: 'Roll out gamification to all major departments', current: 3, target: 4, unit: 'Depts' },
    ],
    comments: []
  },
  {
    id: 'o2',
    level: 'Team',
    title: 'Deploy LMS Gamification Features',
    department: 'Engineering Hub',
    ownerId: 2,
    ownerName: 'Lead Engineer',
    progress: 40,
    status: 'At Risk',
    keyResults: [
      { id: 'kr2', title: 'Integrate achievement badges backend', current: 40, target: 100, unit: '%' },
    ],
    comments: [
      { id: 'c1', author: 'Dr. Arisara', role: 'Executive', text: 'We need to speed up the backend integration to meet the Q2 deadline.', timestamp: '2 days ago' }
    ]
  },
  {
    id: 'o3',
    level: 'Individual',
    title: 'Build Visual Learning Nodes UI',
    department: 'Engineering Hub',
    ownerId: 3, 
    ownerName: 'LMS Developer',
    progress: 90,
    status: 'On Track',
    keyResults: [
      { id: 'kr3', title: 'Complete 10 frontend React components', current: 9, target: 10, unit: 'Components' },
    ],
    comments: [
      { id: 'c2', author: 'Lead Engineer', role: 'Manager', text: 'Great progress! Let me know if you need help with the final component.', timestamp: '1 day ago' },
      { id: 'c3', author: 'LMS Developer', role: 'Employee', text: 'Thanks! Just wrapping up the CSS grid now.', timestamp: '5 hours ago' }
    ]
  }
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

  // --- STRICT RBAC PERMISSION ENGINES ---
  const canViewOkr = (okr) => {
    if (currentUser.role === 'Executive') return true;
    if (currentUser.role === 'Manager') return okr.level === 'Company' || okr.department === currentUser.department;
    if (currentUser.role === 'Employee') return okr.level === 'Company' || (okr.level === 'Team' && okr.department === currentUser.department) || (okr.level === 'Individual' && okr.ownerId === currentUser.id);
    return false;
  };

  const canEditOkr = (okr) => {
    if (currentUser.role === 'Executive') return true; 
    if (currentUser.role === 'Manager') return okr.level !== 'Company' && okr.department === currentUser.department;
    if (currentUser.role === 'Employee') return okr.level === 'Individual' && okr.ownerId === currentUser.id;
    return false;
  };

  const canCommentOnOkr = (okr) => {
    // Executives can comment on Team or Individual OKRs
    if (currentUser.role === 'Executive') return okr.level === 'Team' || okr.level === 'Individual';
    // Managers can comment on Individual OKRs in their department
    if (currentUser.role === 'Manager') return okr.level === 'Individual' && okr.department === currentUser.department;
    // Employees can reply to their own OKR
    if (currentUser.role === 'Employee') return okr.ownerId === currentUser.id;
    return false;
  };

  const getAvailableCreationLevels = () => {
    if (currentUser.role === 'Executive') return ['Company', 'Individual']; 
    if (currentUser.role === 'Manager') return ['Team', 'Individual'];
    if (currentUser.role === 'Employee') return ['Individual'];
    return [];
  };

  // --- ACTIONS ---
  const handleOpenDraft = () => {
    setDraftLevel(availableLevels[0] || 'Individual'); 
    setCreateModalOpen(true);
  };

  const handlePostComment = (okrId) => {
    const text = commentInputs[okrId];
    if (!text || text.trim() === '') return;

    const newComment = {
      id: `c_${Date.now()}`,
      author: currentUser.name,
      role: currentUser.role,
      text: text,
      timestamp: 'Just now'
    };

    setOkrs(prevOkrs => prevOkrs.map(okr => {
      if (okr.id === okrId) {
        return { ...okr, comments: [...okr.comments, newComment] };
      }
      return okr;
    }));

    setCommentInputs(prev => ({ ...prev, [okrId]: '' }));
  };

  // --- UI HELPERS ---
  const getStatusProps = (status) => {
    switch(status) { 
      case 'On Track': return { color: 'success', icon: <CheckCircle fontSize="small" /> }; 
      case 'At Risk': return { color: 'warning', icon: <WarningAmber fontSize="small" /> }; 
      case 'Behind': return { color: 'error', icon: <Flag fontSize="small" /> }; 
      default: return { color: 'primary', icon: null }; 
    }
  };

  const getLevelProps = (level) => {
    switch(level) {
      case 'Company': return { color: 'company', icon: <Domain fontSize="small" sx={{ mr: 0.5 }} /> };
      case 'Team': return { color: 'team', icon: <Groups fontSize="small" sx={{ mr: 0.5 }} /> };
      case 'Individual': return { color: 'individual', icon: <Person fontSize="small" sx={{ mr: 0.5 }} /> };
      default: return { color: 'primary', icon: null };
    }
  };

  const visibleOkrs = okrs.filter(canViewOkr);
  const availableLevels = getAvailableCreationLevels();
  const currentYearProgress = 47; 

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', p: 4, bgcolor: 'background.default', width: '100%' }}>
        
        {/* HEADER SECTION */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, maxWidth: 1000, mx: 'auto' }}>
          <Box>
            <Typography variant="h4" fontWeight={800} letterSpacing="-0.03em">Objectives & Key Results</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Track strategic goals and measurable outcomes.
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <IconButton onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} sx={{ bgcolor: 'background.paper' }}>
              {mode === 'dark' ? <LightMode color="warning" /> : <DarkMode color="primary" />}
            </IconButton>
            
            {availableLevels.length > 0 && (
              <Button variant="contained" startIcon={<Add />} onClick={handleOpenDraft} size="large" sx={{ borderRadius: 2 }}>
                Draft New OKR
              </Button>
            )}
          </Box>
        </Box>

        {/* FISCAL YEAR TIMELINE */}
        <Card 
          elevation={0} 
          sx={{ 
            maxWidth: 1000, mx: 'auto', mb: 4, p: 3, 
            bgcolor: 'background.paper', borderRadius: 3, 
            border: mode === 'dark' ? '1px solid #2A2D3A' : '1px solid #E2E8F0' 
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
              2026 FISCAL / ACADEMIC YEAR
            </Typography>
            <Typography variant="subtitle2" fontWeight={700} color="primary.main">
              Q2 ({currentYearProgress}% Complete)
            </Typography>
          </Box>
          
          <Box sx={{ position: 'relative', width: '100%', height: 32, bgcolor: mode === 'dark' ? '#22252E' : '#EDF2F7', borderRadius: 2, display: 'flex', overflow: 'visible', mt: 3 }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${currentYearProgress}%`, bgcolor: 'primary.main', opacity: 0.15, borderRadius: '8px 0 0 8px' }} />
            <Box sx={{ position: 'absolute', top: -10, bottom: -10, left: `${currentYearProgress}%`, width: 2, bgcolor: 'primary.main', zIndex: 10 }}>
              <Box sx={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', bgcolor: 'primary.main', color: mode === 'dark' ? '#000' : '#FFF', fontSize: '0.65rem', px: 1, py: 0.2, borderRadius: 1, fontWeight: 800, whiteSpace: 'nowrap' }}>
                TODAY
              </Box>
            </Box>

            <Box sx={{ flex: 1, borderRight: `1px dashed ${mode === 'dark' ? '#3A3D4A' : '#CBD5E1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}><Typography variant="caption" fontWeight={700} color="text.secondary">Q1</Typography></Box>
            <Box sx={{ flex: 1, borderRight: `1px dashed ${mode === 'dark' ? '#3A3D4A' : '#CBD5E1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}><Typography variant="caption" fontWeight={800} color="text.primary">Q2</Typography></Box>
            <Box sx={{ flex: 1, borderRight: `1px dashed ${mode === 'dark' ? '#3A3D4A' : '#CBD5E1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}><Typography variant="caption" fontWeight={700} color="text.secondary">Q3</Typography></Box>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}><Typography variant="caption" fontWeight={700} color="text.secondary">Q4</Typography></Box>
          </Box>
        </Card>

        {/* OKR ACCORDION LIST */}
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
          {visibleOkrs.length === 0 && (
            <Typography variant="body1" color="text.secondary" textAlign="center" mt={10}>
              No OKRs available to view.
            </Typography>
          )}

          {visibleOkrs.map((okr) => {
            const hasEditPermission = canEditOkr(okr);
            const hasCommentPermission = canCommentOnOkr(okr);
            const levelProps = getLevelProps(okr.level);
            const statusProps = getStatusProps(okr.status);

            return (
              <Accordion key={okr.id} disableGutters>
                {/* --- HEADER VISIBLE PORTION --- */}
                <AccordionSummary expandIcon={<ExpandMore />} sx={{ p: 3 }}>
                  <Grid container alignItems="center" spacing={3}>
                    <Grid item xs={12} md={5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                        <Chip label={okr.level.toUpperCase()} size="small" color={levelProps.color} sx={{ fontWeight: 800, fontSize: '0.65rem', height: 20 }} />
                        {!hasEditPermission && (
                          <Tooltip title="You do not have permission to edit this OKR">
                            <Lock fontSize="small" color="action" />
                          </Tooltip>
                        )}
                        {okr.comments.length > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <Forum fontSize="inherit" />
                            <Typography variant="caption" fontWeight={700}>{okr.comments.length}</Typography>
                          </Box>
                        )}
                      </Box>
                      <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3 }}>{okr.title}</Typography>
                    </Grid>
                    
                    <Grid item xs={6} md={3}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: `${levelProps.color}.main`, fontSize: '0.9rem', fontWeight: 'bold', color: '#fff' }}>
                          {okr.ownerName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600} color="text.primary">{okr.ownerName}</Typography>
                          <Typography variant="caption" color="text.secondary">{okr.department}</Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={6} md={4}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip icon={statusProps.icon} label={okr.status} color={statusProps.color} size="small" variant={mode === 'dark' ? 'outlined' : 'filled'} sx={{ fontWeight: 600, border: mode === 'dark' ? 'none' : undefined, bgcolor: mode === 'dark' ? `${theme.palette[statusProps.color].main}20` : undefined }} />
                          <Typography variant="h6" fontWeight={800}>{okr.progress}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={okr.progress} color={statusProps.color} sx={{ height: 8, borderRadius: 4, bgcolor: mode === 'dark' ? '#2A2D3A' : '#E2E8F0' }} />
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionSummary>

                {/* --- EXPANDED DETAILS & COMMENTS --- */}
                <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                  <Divider sx={{ mb: 3, borderColor: mode === 'dark' ? '#2A2D3A' : '#E2E8F0' }} />
                  
                  {/* KEY RESULTS */}
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrackChanges fontSize="small" /> KEY RESULTS
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {okr.keyResults.map((kr) => {
                      const krProgress = Math.round((kr.current / kr.target) * 100);
                      return (
                        <Box key={kr.id} sx={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 3, alignItems: 'center' }}>
                          <Typography variant="body1" fontWeight={500}>{kr.title}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ flexGrow: 1 }}>
                              <LinearProgress variant="determinate" value={krProgress} color="primary" sx={{ height: 6, borderRadius: 3, bgcolor: mode === 'dark' ? '#22252E' : '#EDF2F7' }} />
                            </Box>
                            <Typography variant="body2" fontWeight={600} sx={{ minWidth: 60, textAlign: 'right' }}>
                              {kr.current} / {kr.target} {kr.unit !== '%' && <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>{kr.unit}</Box>}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                  {hasEditPermission && (
                    <Button size="small" startIcon={<Add />} sx={{ mt: 3, mb: 1, textTransform: 'none' }}>Add Key Result</Button>
                  )}

                  {/* COMMENTS SECTION */}
                  <Box sx={{ mt: 4, bgcolor: mode === 'dark' ? '#14151f' : '#F8FAFC', borderRadius: 2, p: 2, border: `1px solid ${mode === 'dark' ? '#2A2D3A' : '#E2E8F0'}` }}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Forum fontSize="small" /> FEEDBACK & COMMENTS
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: hasCommentPermission ? 3 : 0 }}>
                      {okr.comments.length === 0 && (
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">No comments yet.</Typography>
                      )}
                      {okr.comments.map((comment) => (
                        <Box key={comment.id} sx={{ display: 'flex', gap: 2 }}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: comment.role === 'Executive' ? 'secondary.main' : comment.role === 'Manager' ? 'primary.main' : 'grey.600' }}>
                            {comment.author.charAt(0)}
                          </Avatar>
                          <Box sx={{ flexGrow: 1, bgcolor: mode === 'dark' ? '#22252E' : '#FFFFFF', p: 1.5, borderRadius: 2, border: `1px solid ${mode === 'dark' ? '#2A2D3A' : '#E2E8F0'}` }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="caption" fontWeight={700} color="text.primary">{comment.author}</Typography>
                                <Typography variant="caption" color="text.secondary">({comment.role})</Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary">{comment.timestamp}</Typography>
                            </Box>
                            <Typography variant="body2">{comment.text}</Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>

                    {/* NEW COMMENT INPUT */}
                    {hasCommentPermission && (
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: currentUser.role === 'Executive' ? 'secondary.main' : currentUser.role === 'Manager' ? 'primary.main' : 'grey.600' }}>
                          {currentUser.name.charAt(0)}
                        </Avatar>
                        <TextField 
                          size="small"
                          fullWidth
                          placeholder="Provide feedback..."
                          value={commentInputs[okr.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [okr.id]: e.target.value }))}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handlePostComment(okr.id);
                            }
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton color="primary" edge="end" onClick={() => handlePostComment(okr.id)} disabled={!commentInputs[okr.id]?.trim()}>
                                  <Send fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            ),
                            sx: { bgcolor: mode === 'dark' ? '#1A1D24' : '#FFFFFF' }
                          }}
                        />
                      </Box>
                    )}
                  </Box>

                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>

        {/* OKR CREATION MODAL */}
        <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: 'background.paper', borderRadius: 3 } }}>
          <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Draft New Objective</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Define a high-level qualitative goal based on your access permissions.
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
              <TextField 
                select 
                label="OKR Level" 
                value={draftLevel}
                onChange={(e) => setDraftLevel(e.target.value)}
                fullWidth 
                helperText="Your role determines which level of OKR you can create."
              >
                {availableLevels.map((lvl) => (
                  <MenuItem key={lvl} value={lvl}>{lvl} Objective</MenuItem>
                ))}
              </TextField>

              <TextField label="Objective Title" placeholder="e.g., Increase platform adoption" fullWidth variant="outlined" />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField select label="Timeframe" fullWidth SelectProps={{ native: true }}>
                    <option value="q1">Q1 2026</option>
                    <option value="q2">Q2 2026</option>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Assignee / Owner" disabled={draftLevel === 'Company' || draftLevel === 'Team'} defaultValue={draftLevel === 'Individual' ? currentUser.name : currentUser.department} fullWidth />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button onClick={() => setCreateModalOpen(false)} color="inherit">Cancel</Button>
            <Button variant="contained" onClick={() => setCreateModalOpen(false)}>Save & Continue</Button>
          </DialogActions>
        </Dialog>

      </Box>
    </ThemeProvider>
  );
}