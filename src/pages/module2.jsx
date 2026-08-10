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
  MenuItem,
  Tooltip,
  Card,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  AvatarGroup,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  ExpandMore,
  Add,
  DarkMode,
  LightMode,
  TrackChanges,
  AccountTree,
  OpenInNew,
  ViewList,
  Send,
  PersonPin,
} from '@mui/icons-material';

// --- DIRECTORY USERS MATCHING YOUR ORGANIZATION MAP ---
const directoryUsers = [
  { id: 1, name: 'Dr. Arisara (Advisor)', role: 'Executive', department: 'Policy Strategy', initial: 'D' },
  { id: 2, name: 'Lead Engineer Team', role: 'Team Lead', department: 'Engineering Hub', reportsTo: 'Dr. Arisara (Advisor)', initial: 'L' },
  { id: 3, name: 'Campaign Director Team', role: 'Team Lead', department: 'Marketing', reportsTo: 'Dr. Arisara (Advisor)', initial: 'C' },
  { id: 4, name: 'Policy Drafter Team', role: 'Team Lead', department: 'Policy Strategy', reportsTo: 'Dr. Arisara (Advisor)', initial: 'P' },
  { id: 5, name: 'LMS Developer', role: 'Employee', department: 'Engineering Hub', reportsTo: 'Lead Engineer', initial: 'L' },
  { id: 6, name: 'AI Media Artist', role: 'Employee', department: 'Marketing', reportsTo: 'Campaign Director', initial: 'A' },
];

// --- OKRs REFLECTING THE EXACT DELEGATION HIERARCHY ---
const initialOKRs = [
  {
    id: 'o1',
    level: 'Team',
    title: 'Deploy LMS Core System & Infrastructure',
    description: 'Ensure system stability, zero downtime, and high throughput backend architecture for institutional rollouts.',
    department: 'Engineering Hub',
    ownerId: 2,
    ownerName: 'Lead Engineer Team',
    assignedBy: 'Dr. Arisara (Advisor)',
    assignedByRole: 'Executive',
    assignedByInitial: 'D',
    startDate: '2026-01-01',
    dueDate: '2026-06-30',
    progress: 85,
    status: 'On Track',
    tasksCount: 8,
    keyResults: [
      { id: 'kr1', title: 'Maintain 99.9% server uptime', current: 99, target: 100, unit: '%' },
      { id: 'kr2', title: 'Reduce API response time to under 100ms', current: 80, target: 100, unit: '%' }
    ],
    comments: []
  },
  {
    id: 'o2',
    level: 'Team',
    title: 'Launch National Phak Phrom Soep Campaign',
    title: 'Launch Marketing campaign',
    description: 'Coordinate digital outreach strategy across primary channels to achieve nationwide institutional engagement.',
    department: 'Phak Phrom Soep',
    department: 'Marketing',
    ownerId: 3,
    ownerName: 'Campaign Director',
    assignedBy: 'Dr. Arisara (Advisor)',
    assignedByRole: 'Executive',
    assignedByInitial: 'D',
    startDate: '2026-02-01',
    dueDate: '2026-08-31',
    progress: 60,
    status: 'At Risk',
    tasksCount: 12,
    keyResults: [
      { id: 'kr3', title: 'Reach 1,000,000 total digital impressions', current: 600000, target: 1000000, unit: 'Views' }
    ],
    comments: [
      { id: 'c1', author: 'Dr. Arisara (Advisor)', text: 'Please sync with AI Media Artist to finalize campaign assets.', timestamp: '1 day ago' }
    ]
  },
  {
    id: 'o3',
    level: 'Team',
    title: 'Draft Strategic Policy Framework 2026',
    description: 'Synthesize institutional requirements into actionable policy drafts for upcoming legislative approval.',
    department: 'Policy Strategy',
    ownerId: 4,
    ownerName: 'Policy Drafter',
    assignedBy: 'Dr. Arisara (Advisor)',
    assignedByRole: 'Executive',
    assignedByInitial: 'D',
    startDate: '2026-01-15',
    dueDate: '2026-05-30',
    progress: 95,
    status: 'On Track',
    tasksCount: 4,
    keyResults: [
      { id: 'kr4', title: 'Complete draft whitepaper sections', current: 4, target: 4, unit: 'Sections' }
    ],
    comments: []
  },
  {
    id: 'o4',
    level: 'Individual',
    title: 'Build Interactive Learning UI Components',
    description: 'Implement responsive React user interface components and visual interactive charts for student dashboards.',
    department: 'Engineering Hub',
    ownerId: 5,
    ownerName: 'LMS Developer',
    assignedBy: 'Lead Engineer Team',
    assignedByRole: 'Team Lead',
    assignedByInitial: 'L',
    startDate: '2026-03-01',
    dueDate: '2026-06-15',
    progress: 75,
    status: 'On Track',
    tasksCount: 5,
    keyResults: [
      { id: 'kr5', title: 'Deliver 10 React components', current: 8, target: 10, unit: 'Components' }
    ],
    comments: []
  },
  {
    id: 'o5',
    level: 'Individual',
    title: 'Produce High-Impact AI Visual Media Assets',
    description: 'Generate key visuals, promotional banners, and social media art using generative AI workflows.',
    department: 'Phak Phrom Soep',
    department: 'Marketing',
    ownerId: 6,
    ownerName: 'AI Media Artist',
    assignedBy: 'Campaign Director Team',
    assignedByRole: 'Team Lead',
    assignedByInitial: 'C',
    startDate: '2026-03-15',
    dueDate: '2026-07-01',
    progress: 40,
    status: 'At Risk',
    tasksCount: 7,
    keyResults: [
      { id: 'kr6', title: 'Deliver 25 finalized campaign graphics', current: 10, target: 25, unit: 'Assets' }
    ],
    comments: []
  }
];

export default function OKRTrackingEngine() {
  const [mode, setMode] = useState('dark');
  const [viewMode, setViewMode] = useState('flow'); // 'flow' or 'list'
  const [currentUser, setCurrentUser] = useState(directoryUsers[0]); // Default to Executive Dr. Arisara
  const [okrs, setOkrs] = useState(initialOKRs);
  const [commentInputs, setCommentInputs] = useState({});
  const [selectedFlowOkr, setSelectedFlowOkr] = useState(null);

  // Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newOkr, setNewOkr] = useState({
    title: '',
    description: '',
    assignedToId: directoryUsers[1].id,
    dueDate: '2026-06-30'
  });

  // --- THEME ---
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === 'dark' ? {
        background: { default: '#0F1115', paper: '#1A1D24' },
        primary: { main: '#4ECDC4' },
        secondary: { main: '#A389F4' },
        success: { main: '#22C55E' },
        warning: { main: '#EAB308' },
        error: { main: '#EF4444' },
      } : {
        background: { default: '#F4F7FE', paper: '#FFFFFF' },
        primary: { main: '#2563EB' },
        secondary: { main: '#9333EA' },
        success: { main: '#16A34A' },
        warning: { main: '#CA8A04' },
        error: { main: '#DC2626' },
      })
    },
    typography: { fontFamily: '"Inter", sans-serif' },
    shape: { borderRadius: 12 },
  }), [mode]);

  // --- GROUPING FOR FLOWCHART (Assignor -> Assigned OKRs) ---
  const assignorGroups = useMemo(() => {
    const groups = {};
    okrs.forEach(okr => {
      const assignorName = okr.assignedBy;
      if (!groups[assignorName]) {
        groups[assignorName] = {
          assignorName: okr.assignedBy,
          assignorRole: okr.assignedByRole,
          initial: okr.assignedByInitial || okr.assignedBy.charAt(0),
          okrs: [],
          avgProgress: 0,
        };
      }
      groups[assignorName].okrs.push(okr);
    });

    Object.keys(groups).forEach(key => {
      const g = groups[key];
      const sum = g.okrs.reduce((acc, curr) => acc + curr.progress, 0);
      g.avgProgress = Math.round(sum / g.okrs.length);
    });

    return Object.values(groups);
  }, [okrs]);

  // --- HANDLERS ---
  const handleCreateOkr = () => {
    if (!newOkr.title) return;
    const assignee = directoryUsers.find(u => u.id === Number(newOkr.assignedToId));

    const createdOkr = {
      id: `o_${Date.now()}`,
      level: assignee?.role === 'Employee' ? 'Individual' : 'Team',
      title: newOkr.title,
      description: newOkr.description || 'No detailed scope provided.',
      department: assignee?.department || currentUser.department,
      ownerId: assignee?.id,
      ownerName: assignee?.name || 'Unassigned',
      assignedBy: currentUser.name,
      assignedByRole: currentUser.role,
      assignedByInitial: currentUser.initial,
      startDate: '2026-04-01',
      dueDate: newOkr.dueDate,
      progress: 0,
      status: 'On Track',
      tasksCount: 1,
      keyResults: [],
      comments: []
    };

    setOkrs(prev => [createdOkr, ...prev]);
    setCreateModalOpen(false);
    setNewOkr({ title: '', description: '', assignedToId: directoryUsers[1].id, dueDate: '2026-06-30' });
  };

  const handlePostComment = (okrId) => {
    const text = commentInputs[okrId];
    if (!text || text.trim() === '') return;

    const newComment = {
      id: `c_${Date.now()}`,
      author: currentUser.name,
      text: text,
      timestamp: 'Just now'
    };

    setOkrs(prevOkrs => prevOkrs.map(okr => {
      if (okr.id === okrId) {
        const updated = { ...okr, comments: [...okr.comments, newComment] };
        if (selectedFlowOkr?.id === okrId) setSelectedFlowOkr(updated);
        return updated;
      }
      return okr;
    }));

    setCommentInputs(prev => ({ ...prev, [okrId]: '' }));
  };

  const getBarColor = (progress) => {
    if (progress >= 75) return '#22C55E';
    if (progress >= 40) return '#EAB308';
    return '#EF4444';
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', p: 4, bgcolor: 'background.default', width: '100%' }}>
        
        {/* HEADER & SWITCHERS */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, maxWidth: 1200, mx: 'auto' }}>
          <Box>
            <Typography variant="h5" fontWeight={800} letterSpacing="-0.02em">
              Organization OKR Alignment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Delegation chain mapping for {currentUser.department} & active teams
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* USER SIMULATOR SELECTOR */}
            <FormControl size="small" sx={{ minWidth: 200, bgcolor: 'background.paper', borderRadius: 2 }}>
              <InputLabel id="user-select-label"><PersonPin fontSize="small" /> Active User</InputLabel>
              <Select
                labelId="user-select-label"
                value={currentUser.id}
                label="Active User"
                onChange={(e) => setCurrentUser(directoryUsers.find(u => u.id === e.target.value))}
              >
                {directoryUsers.map(u => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Paper elevation={0} sx={{ border: `1px solid ${mode === 'dark' ? '#2A2D3A' : '#CBD5E1'}`, borderRadius: 2, p: 0.5, bgcolor: 'background.paper' }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, val) => val && setViewMode(val)}
                size="small"
              >
                <ToggleButton value="flow" sx={{ textTransform: 'none', px: 2, gap: 1, fontWeight: 700 }}>
                  <AccountTree fontSize="small" /> Flowchart Tree
                </ToggleButton>
                <ToggleButton value="list" sx={{ textTransform: 'none', px: 2, gap: 1, fontWeight: 700 }}>
                  <ViewList fontSize="small" /> List View
                </ToggleButton>
              </ToggleButtonGroup>
            </Paper>

            <IconButton onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} sx={{ bgcolor: 'background.paper', border: `1px solid ${mode === 'dark' ? '#2A2D3A' : '#CBD5E1'}` }}>
              {mode === 'dark' ? <LightMode color="warning" /> : <DarkMode color="primary" />}
            </IconButton>

            <Button variant="contained" startIcon={<Add />} onClick={() => setCreateModalOpen(true)} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
              Draft & Assign OKR
            </Button>
          </Box>
        </Box>

        {/* --- FLOWCHART CANVAS VIEW --- */}
        {viewMode === 'flow' && (
          <Box sx={{ maxWidth: 1200, mx: 'auto', py: 2 }}>
            {assignorGroups.map((group, gIndex) => (
              <Box key={gIndex} sx={{ position: 'relative', display: 'flex', alignItems: 'center', mb: 6 }}>
                
                {/* LEFT NODE: ASSIGNOR CARD */}
                <Card
                  elevation={2}
                  sx={{
                    width: 290,
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    border: '2px solid #4ECDC4',
                    flexShrink: 0,
                    zIndex: 2,
                    boxShadow: mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.05)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                    <Avatar sx={{ width: 46, height: 46, bgcolor: 'secondary.main', color: '#FFF', fontWeight: 800 }}>
                      {group.initial}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                        {group.assignorName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        {group.assignorRole} &bull; {group.okrs.length} OKRs Delegated
                      </Typography>
                    </Box>
                  </Box>

                  {/* AVERAGE PROGRESS */}
                  <Box sx={{ position: 'relative', height: 20, bgcolor: mode === 'dark' ? '#2A2D3A' : '#E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
                    <Box 
                      sx={{ 
                        height: '100%', 
                        width: `${group.avgProgress}%`, 
                        bgcolor: getBarColor(group.avgProgress), 
                        transition: 'width 0.5s ease'
                      }}
                    />
                    <Typography 
                      variant="caption" 
                      fontWeight={900} 
                      sx={{ 
                        position: 'absolute', 
                        top: '50%', 
                        left: '50%', 
                        transform: 'translate(-50%, -50%)', 
                        color: mode === 'dark' ? '#FFF' : '#000',
                        fontSize: '0.7rem'
                      }}
                    >
                      {group.avgProgress}% Avg
                    </Typography>
                  </Box>
                </Card>

                {/* SVG CONNECTOR LINES */}
                <Box sx={{ width: 80, flexShrink: 0, position: 'relative', alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
                  <svg style={{ width: '100%', height: '100%', position: 'absolute', overflow: 'visible' }}>
                    <defs>
                      {/* Arrow head */}
                      <marker id={`arrow-${gIndex}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill={mode === 'dark' ? '#475569' : '#94A3B8'} />
                      </marker>
                    </defs>
                    {group.okrs.length > 1 && (
                      <>
                        {/* Horizontal line from Assignor to spine */}
                        <path d="M 0 50 L 35 50" fill="none" stroke={mode === 'dark' ? '#475569' : '#94A3B8'} strokeWidth="2.5"/>

                         {/* Vertical spine */}
                        <path d={`
                                M 35 15
                                L 35 85
                                `}
                              fill="none"
                              stroke={mode === 'dark' ? '#475569' : '#94A3B8'}
                              strokeWidth="2.5"
                        />
                      </>
                    )}
                    {group.okrs.map((_, i) => {
                      const total = group.okrs.length;
                      const endY = total === 1 ? '50%' : `${((i / (total - 1)) * 80) + 10}%`;
                      return (
                        <path
                          key={i}
                          d={`M 0,50% C 40,50% 40,${endY} 80,${endY}`}
                          fill="none"
                          stroke={mode === 'dark' ? '#475569' : '#94A3B8'}
                          strokeWidth="2.5"
                        />
                      );
                    })}
                  </svg>
                </Box>

                {/* RIGHT NODES: ASSIGNED OBJECTIVES */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flexGrow: 1 }}>
                  {group.okrs.map((okr) => {
                    const assigneeUser = directoryUsers.find(u => u.name === okr.ownerName);
                    return (
                      <Card
                        key={okr.id}
                        elevation={1}
                        onClick={() => setSelectedFlowOkr(okr)}
                        sx={{
                          p: 2.5,
                          pb: 0,
                          bgcolor: 'background.paper',
                          borderRadius: 3,
                          border: `1px solid ${mode === 'dark' ? '#2A2D3A' : '#E2E8F0'}`,
                          cursor: 'pointer',
                          overflow: 'hidden',
                          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="h6" fontWeight={800} sx={{ fontSize: '1.05rem', lineHeight: 1.3, pr: 2 }}>
                            {okr.title}
                          </Typography>
                          <IconButton size="small"><OpenInNew fontSize="inherit" /></IconButton>
                        </Box>

                        {/* ASSIGNEE & METADATA */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Tooltip title={`Assigned to ${okr.ownerName} (${okr.department})`}>
                              <AvatarGroup max={2}>
                                <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', color: '#000', fontSize: '0.75rem', fontWeight: 800 }}>
                                  {assigneeUser?.initial || okr.ownerName.charAt(0)}
                                </Avatar>
                              </AvatarGroup>
                            </Tooltip>
                            <Chip label={okr.ownerName} size="small" sx={{ fontWeight: 700 }} />
                            <Chip label={okr.department} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                          </Box>

                          <Typography variant="caption" color="text.secondary" fontWeight={700}>
                            {okr.keyResults.length} KRs &bull; {okr.tasksCount} Tasks
                          </Typography>
                        </Box>

                        {/* BOTTOM PROGRESS BAR */}
                        <Box sx={{ position: 'relative', height: 22, mx: -2.5, bgcolor: mode === 'dark' ? '#2A2D3A' : '#E2E8F0', overflow: 'hidden' }}>
                          <Box 
                            sx={{ 
                              height: '100%', 
                              width: `${okr.progress}%`, 
                              bgcolor: getBarColor(okr.progress)
                            }}
                          />
                          <Typography 
                            variant="caption" 
                            fontWeight={900} 
                            sx={{ 
                              position: 'absolute', 
                              top: '50%', 
                              left: 12, 
                              transform: 'translateY(-50%)', 
                              color: mode === 'dark' ? '#FFF' : '#000',
                              fontSize: '0.75rem'
                            }}
                          >
                            *{okr.progress}%
                          </Typography>
                        </Box>
                      </Card>
                    );
                  })}
                </Box>

              </Box>
            ))}
          </Box>
        )}

        {/* --- LIST VIEW --- */}
        {viewMode === 'list' && (
          <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            {okrs.map((okr) => (
              <Accordion key={okr.id} sx={{ mb: 2, borderRadius: '12px !important', overflow: 'hidden' }}>
                <AccordionSummary expandIcon={<ExpandMore />} sx={{ p: 2.5 }}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" fontWeight={800}>{okr.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Assigned by {okr.assignedBy} &rarr; <strong>{okr.ownerName}</strong> ({okr.department})
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Chip label={okr.status} color={okr.progress >= 75 ? 'success' : 'warning'} size="small" />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" fontWeight={800}>{okr.progress}% Complete</Typography>
                      <LinearProgress variant="determinate" value={okr.progress} sx={{ height: 6, borderRadius: 3, mt: 0.5 }} />
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails sx={{ borderTop: `1px solid ${mode === 'dark' ? '#2A2D3A' : '#E2E8F0'}`, p: 3 }}>
                  <OkrDetailContent 
                    okr={okr} 
                    mode={mode} 
                    commentInputs={commentInputs}
                    setCommentInputs={setCommentInputs}
                    handlePostComment={handlePostComment}
                  />
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}

        {/* INSPECTOR DIALOG */}
        <Dialog open={Boolean(selectedFlowOkr)} onClose={() => setSelectedFlowOkr(null)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: 'background.paper', borderRadius: 3 } }}>
          {selectedFlowOkr && (
            <>
              <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ pr: 2 }}>{selectedFlowOkr.title}</Box>
                <Chip label={`${selectedFlowOkr.progress}%`} color={selectedFlowOkr.progress >= 75 ? 'success' : 'warning'} size="small" sx={{ fontWeight: 800 }} />
              </DialogTitle>
              <DialogContent dividers>
                <OkrDetailContent 
                  okr={selectedFlowOkr} 
                  mode={mode} 
                  commentInputs={commentInputs}
                  setCommentInputs={setCommentInputs}
                  handlePostComment={handlePostComment}
                />
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={() => setSelectedFlowOkr(null)} variant="outlined">Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* DRAFT & ASSIGN MODAL */}
        <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: 'background.paper', borderRadius: 3 } }}>
          <DialogTitle sx={{ fontWeight: 800 }}>Draft & Assign Objective</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField 
                label="Objective Title" 
                fullWidth 
                value={newOkr.title}
                onChange={(e) => setNewOkr({ ...newOkr, title: e.target.value })}
              />
              <TextField 
                label="Description of Work" 
                multiline
                rows={3}
                fullWidth 
                value={newOkr.description}
                onChange={(e) => setNewOkr({ ...newOkr, description: e.target.value })}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField 
                    select 
                    label="Assignee (Got Assigned)" 
                    fullWidth 
                    value={newOkr.assignedToId}
                    onChange={(e) => setNewOkr({ ...newOkr, assignedToId: e.target.value })}
                  >
                    {directoryUsers.filter(u => u.id !== currentUser.id).map(u => (
                      <MenuItem key={u.id} value={u.id}>{u.name} ({u.department})</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField 
                    label="Assignor (Assigned By)" 
                    disabled 
                    value={currentUser.name} 
                    fullWidth 
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateOkr}>Assign OKR</Button>
          </DialogActions>
        </Dialog>

      </Box>
    </ThemeProvider>
  );
}

// --- DETAIL CONTENT ---
function OkrDetailContent({ okr, mode, commentInputs, setCommentInputs, handlePostComment }) {
  return (
    <>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" sx={{ p: 2, bgcolor: mode === 'dark' ? '#14151f' : '#F8FAFC' }}>
            <Typography variant="caption" color="text.secondary" display="block">ASSIGNMENT DELEGATION</Typography>
            <Typography variant="body2" fontWeight={700}>
              {okr.assignedBy} <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>assigned to</Box> {okr.ownerName}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" sx={{ p: 2, bgcolor: mode === 'dark' ? '#14151f' : '#F8FAFC' }}>
            <Typography variant="caption" color="text.secondary" display="block">DEPARTMENT & SCHEDULE</Typography>
            <Typography variant="body2" fontWeight={700}>
              {okr.department} &bull; Due {okr.dueDate}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="subtitle2" color="text.secondary" fontWeight={800} sx={{ mb: 1 }}>
        DESCRIPTION OF WORK
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6 }}>
        {okr.description}
      </Typography>

      <Typography variant="subtitle2" color="text.secondary" fontWeight={800} sx={{ mb: 1 }}>
        KEY RESULTS
      </Typography>
      {okr.keyResults.map((kr) => (
        <Box key={kr.id} sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" fontWeight={600}>{kr.title}</Typography>
            <Typography variant="body2" fontWeight={700}>{kr.current} / {kr.target} {kr.unit}</Typography>
          </Box>
          <LinearProgress variant="determinate" value={(kr.current / kr.target) * 100} sx={{ height: 6, borderRadius: 3 }} />
        </Box>
      ))}

      {/* FEEDBACK THREAD */}
      <Box sx={{ mt: 3, p: 2, bgcolor: mode === 'dark' ? '#14151f' : '#F8FAFC', borderRadius: 2 }}>
        <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2 }}>
          Feedback & Directives
        </Typography>
        {okr.comments.map((comment) => (
          <Box key={comment.id} sx={{ mb: 1.5, p: 1.5, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid #E2E8F0' }}>
            <Typography variant="caption" fontWeight={700}>{comment.author}: </Typography>
            <Typography variant="body2" component="span">{comment.text}</Typography>
          </Box>
        ))}
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <TextField 
            size="small" 
            fullWidth 
            placeholder="Add feedback..." 
            value={commentInputs[okr.id] || ''}
            onChange={(e) => setCommentInputs(prev => ({ ...prev, [okr.id]: e.target.value }))}
          />
          <IconButton color="primary" onClick={() => handlePostComment(okr.id)}><Send fontSize="small" /></IconButton>
        </Box>
      </Box>
    </>
  );
}