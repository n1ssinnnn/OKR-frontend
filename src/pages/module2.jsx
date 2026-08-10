import React, { useState, useMemo } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
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
} from '@mui/material';
import {
  ExpandMore,
  Add,
  DarkMode,
  LightMode,
  AccountTree,
  OpenInNew,
  ViewList,
  Send,
  GridView,
  Groups,
  ShowChart,
  Settings,
  GpsFixed,
  ChecklistRtl,
  ArrowUpward,
  ErrorOutline,
  ChatBubbleOutline,
  MapOutlined,
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
    title: 'Launch Marketing campaign',
    description: 'Coordinate digital outreach strategy across primary channels to achieve nationwide institutional engagement.',
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

const NAV_ITEMS = [
  { label: 'Dashboard', icon: GridView },
  { label: 'Teams', icon: Groups },
  { label: 'Alignment', icon: AccountTree },
  { label: 'KPIs', icon: ShowChart },
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

  // --- THEME (tokens lifted from the HTML reference: near-black canvas, teal signature accent) ---
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === 'dark' ? {
        background: { default: '#0b0e14', paper: '#161b22' },
        primary: { main: '#2dd4bf', contrastText: '#0b0e14' },
        secondary: { main: '#818cf8' },
        success: { main: '#34d399' },
        warning: { main: '#fbbf24' },
        error: { main: '#f87171' },
        divider: '#1e293b',
        text: { primary: '#e2e8f0', secondary: '#64748b' },
      } : {
        background: { default: '#f4f7fe', paper: '#ffffff' },
        primary: { main: '#0d9488', contrastText: '#ffffff' },
        secondary: { main: '#6366f1' },
        success: { main: '#16a34a' },
        warning: { main: '#ca8a04' },
        error: { main: '#dc2626' },
        divider: '#e2e8f0',
        text: { primary: '#0f172a', secondary: '#64748b' },
      })
    },
    typography: {
      fontFamily: '"Inter", "ui-sans-serif", "system-ui", sans-serif',
      button: { textTransform: 'none' },
    },
    shape: { borderRadius: 14 },
  }), [mode]);

  const isDark = mode === 'dark';
  const surface2 = isDark ? '#0f141c' : '#f8fafc'; // secondary sunken surface (chips, inputs)
  const borderColor = isDark ? '#1e293b' : '#e2e8f0';
  const railBg = isDark ? '#0b0e14' : '#ffffff';

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

  // --- ALIGNMENT SUMMARY DATA (for the list view side panel) ---
  const RADIAL_COLORS = ['#2dd4bf', '#818cf8', '#fbbf24', '#f87171', '#34d399'];
  const deptProgress = useMemo(() => {
    const map = {};
    okrs.forEach(o => {
      if (!map[o.department]) map[o.department] = { sum: 0, count: 0 };
      map[o.department].sum += o.progress;
      map[o.department].count += 1;
    });
    return Object.entries(map).map(([name, v], i) => ({
      name,
      value: Math.round(v.sum / v.count),
      fill: RADIAL_COLORS[i % RADIAL_COLORS.length],
    }));
  }, [okrs]);

  const avgProgressAll = useMemo(() => {
    if (!okrs.length) return 0;
    return Math.round((okrs.reduce((a, o) => a + o.progress, 0) / okrs.length) * 10) / 10;
  }, [okrs]);

  const atRiskCount = useMemo(() => okrs.filter(o => o.status === 'At Risk').length, [okrs]);
  const riskLevel = atRiskCount === 0 ? 'None' : atRiskCount === 1 ? 'Low' : atRiskCount <= 3 ? 'Moderate' : 'High';
  const riskColor = riskLevel === 'None' ? '#34d399' : riskLevel === 'Low' ? '#fbbf24' : '#f87171';

  const activityFeed = useMemo(() => {
    const items = [];
    const byProgress = [...okrs].sort((a, b) => b.progress - a.progress);
    if (byProgress[0]) {
      items.push({ type: 'progress', text: `${byProgress[0].title} progress updated to ${byProgress[0].progress}%`, meta: 'Just now' });
    }
    okrs.filter(o => o.status === 'At Risk').forEach(o => {
      items.push({ type: 'risk', text: `${o.title} flagged as At Risk`, meta: '5 hours ago' });
    });
    okrs.forEach(o => o.comments.forEach(c => {
      items.push({ type: 'comment', text: `${c.author} commented on ${o.title}`, meta: c.timestamp });
    }));
    return items.slice(0, 5);
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

  // Status -> token mapping (mirrors the emerald/amber pill treatment from the HTML)
  const statusToken = (status) => {
    if (status === 'On Track') return { color: theme.palette.success.main, bg: isDark ? 'rgba(52,211,153,0.1)' : 'rgba(22,163,74,0.08)', border: isDark ? 'rgba(52,211,153,0.25)' : 'rgba(22,163,74,0.2)' };
    return { color: theme.palette.warning.main, bg: isDark ? 'rgba(251,191,36,0.1)' : 'rgba(202,138,4,0.08)', border: isDark ? 'rgba(251,191,36,0.25)' : 'rgba(202,138,4,0.2)' };
  };

  const barGradient = (progress) => {
    if (progress >= 75) return 'linear-gradient(90deg, #10b981, #34d399)';
    if (progress >= 40) return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
    return 'linear-gradient(90deg, #ef4444, #f87171)';
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', width: '100%', bgcolor: 'background.default', fontFamily: 'Inter, sans-serif' }}>

        {/* ---------------- SIDEBAR RAIL ---------------- */}
        <Box
          sx={{
            width: 232,
            flexShrink: 0,
            bgcolor: railBg,
            borderRight: `1px solid ${borderColor}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Box sx={{ height: 64, display: 'flex', alignItems: 'center', px: 3, gap: 1.5 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: '10px', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontWeight: 900, color: '#0b0e14', fontSize: '1.1rem' }}>O</Typography>
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.02rem', letterSpacing: '-0.01em' }}>
                OKR Intelligence
              </Typography>
            </Box>

            <Box sx={{ px: 1.5, mt: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {NAV_ITEMS.map((item, i) => {
                const Icon = item.icon;
                const active = i === 0;
                return (
                  <Box
                    key={item.label}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1, borderRadius: '10px',
                      fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                      color: active ? 'primary.main' : 'text.secondary',
                      bgcolor: active ? (isDark ? 'rgba(45,212,191,0.1)' : 'rgba(13,148,136,0.08)') : 'transparent',
                      transition: 'all .15s ease',
                      '&:hover': { bgcolor: active ? undefined : (isDark ? '#1e293b' : '#f1f5f9'), color: active ? undefined : 'text.primary' },
                    }}
                  >
                    <Icon sx={{ fontSize: 18 }} />
                    {item.label}
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Box sx={{ p: 2, borderTop: `1px solid ${borderColor}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1, py: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: '0.65rem', fontWeight: 800 }}>
                {currentUser.initial}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography noWrap sx={{ fontSize: '0.75rem', fontWeight: 700 }}>{currentUser.name}</Typography>
                <Typography noWrap sx={{ fontSize: '0.65rem', color: 'primary.main' }}>{currentUser.role}</Typography>
              </Box>
              <IconButton size="small" onClick={() => setMode(isDark ? 'light' : 'dark')} sx={{ color: 'text.secondary' }}>
                {isDark ? <LightMode sx={{ fontSize: 15 }} /> : <DarkMode sx={{ fontSize: 15 }} />}
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* ---------------- MAIN REGION ---------------- */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* HEADER */}
          <Box sx={{
            height: 80, px: 4, flexShrink: 0, borderBottom: `1px solid ${borderColor}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3,
          }}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.01em' }}>
                Organization OKR Alignment
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>
                Delegation chain mapping for {currentUser.department} & active teams
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              {/* ACTIVE USER SWITCHER */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.08em', color: 'text.secondary', textTransform: 'uppercase' }}>
                  Active User
                </Typography>
                <FormControl size="small">
                  <Select
                    value={currentUser.id}
                    onChange={(e) => setCurrentUser(directoryUsers.find(u => u.id === e.target.value))}
                    sx={{
                      fontSize: '0.78rem', fontWeight: 600, bgcolor: surface2, borderRadius: '10px',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: isDark ? '#475569' : '#94a3b8' },
                      minWidth: 210,
                    }}
                  >
                    {directoryUsers.map(u => (
                      <MenuItem key={u.id} value={u.id} sx={{ fontSize: '0.8rem' }}>
                        {u.name} ({u.role})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* VIEW TOGGLE */}
              <Paper elevation={0} sx={{ bgcolor: surface2, border: `1px solid ${borderColor}`, borderRadius: '12px', p: 0.5 }}>
                <ToggleButtonGroup value={viewMode} exclusive onChange={(e, val) => val && setViewMode(val)} size="small">
                  <ToggleButton
                    value="flow"
                    sx={{
                      textTransform: 'none', px: 2, py: 0.7, gap: 1, fontWeight: 700, fontSize: '0.75rem', border: 'none', borderRadius: '9px !important',
                      color: 'text.secondary',
                      '&.Mui-selected': { bgcolor: isDark ? '#334155' : '#fff', color: 'text.primary', boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)' },
                    }}
                  >
                    <AccountTree sx={{ fontSize: 15 }} /> Flowchart Tree
                  </ToggleButton>
                  <ToggleButton
                    value="list"
                    sx={{
                      textTransform: 'none', px: 2, py: 0.7, gap: 1, fontWeight: 700, fontSize: '0.75rem', border: 'none', borderRadius: '9px !important',
                      color: 'text.secondary',
                      '&.Mui-selected': { bgcolor: isDark ? '#334155' : '#fff', color: 'text.primary', boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)' },
                    }}
                  >
                    <ViewList sx={{ fontSize: 15 }} /> List View
                  </ToggleButton>
                </ToggleButtonGroup>
              </Paper>

              {/* PRIMARY ACTION */}
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setCreateModalOpen(true)}
                sx={{
                  borderRadius: '12px', fontWeight: 800, fontSize: '0.8rem', px: 2.5, py: 1.1,
                  boxShadow: isDark ? '0 0 20px rgba(45,212,191,0.25)' : '0 2px 8px rgba(13,148,136,0.25)',
                  '&:hover': { boxShadow: isDark ? '0 0 24px rgba(45,212,191,0.35)' : '0 4px 12px rgba(13,148,136,0.3)' },
                }}
              >
                Draft & Assign OKR
              </Button>
            </Box>
          </Box>

          {/* SCROLLABLE CONTENT */}
          <Box sx={{
            flex: 1, overflowY: 'auto', px: 4, py: 4,
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': { background: isDark ? '#1e293b' : '#cbd5e1', borderRadius: 10 },
          }}>

            {/* --- FLOWCHART CANVAS VIEW --- */}
            {viewMode === 'flow' && (
              <Box sx={{ maxWidth: 1240, mx: 'auto' }}>
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', color: 'text.secondary', textTransform: 'uppercase', mb: 2.5 }}>
                  Active Objectives ({okrs.length})
                </Typography>

                {assignorGroups.map((group, gIndex) => (
                  <Box key={gIndex} sx={{ position: 'relative', display: 'flex', alignItems: 'center', mb: 6 }}>

                    {/* LEFT NODE: ASSIGNOR CARD */}
                    <Card
                      elevation={0}
                      sx={{
                        width: 280, p: 2.5, bgcolor: 'background.paper', borderRadius: '16px',
                        border: `1.5px solid ${theme.palette.primary.main}55`, flexShrink: 0, zIndex: 2,
                        boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 16px rgba(15,23,42,0.06)',
                      }}
                    >
<<<<<<< HEAD
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, mb: 2 }}>
                        <Avatar sx={{ width: 42, height: 42, bgcolor: 'secondary.main', fontWeight: 800, fontSize: '0.85rem' }}>
                          {group.initial}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography noWrap sx={{ fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.25 }}>
                            {group.assignorName}
=======
                      {group.avgProgress}% Avg
                    </Typography>
                  </Box>
                </Card>

                {/* SVG CONNECTOR LINES */}
                <Box sx={{ width: 90, flexShrink: 0, position: 'relative', alignSelf: 'stretch', }}>
                  <svg width="100%" height="100%" viewBox="0 0 90 100" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', }}>
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

                      // Position of each branch
                      const endY = total === 1 ? 50 : 15 + (i / (total - 1)) * 70;

                      return (
                        <path 
                          key={i}
                          d={`
                            M ${total === 1 ? 0 : 35} ${endY}
                            L 90 ${endY}
                          `}
                          fill="none"
                          stroke={mode === 'dark' ? '#475569' : '#94A3B8'}
                          strokeWidth="2.5"
                          markerEnd={`url(#arrow-${gIndex})`}
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
>>>>>>> 8a409e2b7725edb23cb4b0b1e29f419b2210bec9
                          </Typography>
                          <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary', fontWeight: 600 }}>
                            {group.assignorRole} &bull; {group.okrs.length} OKRs Delegated
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ position: 'relative', height: 18, bgcolor: surface2, borderRadius: '8px', overflow: 'hidden' }}>
                        <Box sx={{ height: '100%', width: `${group.avgProgress}%`, background: barGradient(group.avgProgress), transition: 'width .5s ease' }} />
                        <Typography sx={{
                          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                          fontWeight: 800, fontSize: '0.62rem', color: isDark ? '#fff' : '#0f172a',
                        }}>
                          {group.avgProgress}% Avg
                        </Typography>
                      </Box>
                    </Card>

                    {/* SVG CONNECTORS */}
                    <Box sx={{ width: 70, flexShrink: 0, position: 'relative', alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
                      <svg style={{ width: '100%', height: '100%', position: 'absolute', overflow: 'visible' }}>
                        {group.okrs.map((_, i) => {
                          const total = group.okrs.length;
                          const endY = total === 1 ? '50%' : `${((i / (total - 1)) * 80) + 10}%`;
                          return (
                            <path
                              key={i}
                              d={`M 0,50% C 35,50% 35,${endY} 70,${endY}`}
                              fill="none"
                              stroke={isDark ? '#334155' : '#cbd5e1'}
                              strokeWidth="2"
                            />
                          );
                        })}
                      </svg>
                    </Box>

                    {/* RIGHT NODES: ASSIGNED OBJECTIVES */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
                      {group.okrs.map((okr) => {
                        const assigneeUser = directoryUsers.find(u => u.name === okr.ownerName);
                        const token = statusToken(okr.status);
                        return (
                          <Card
                            key={okr.id}
                            elevation={0}
                            onClick={() => setSelectedFlowOkr(okr)}
                            sx={{
                              p: 2.5, bgcolor: 'background.paper', borderRadius: '16px',
                              border: `1px solid ${borderColor}`, cursor: 'pointer', overflow: 'hidden',
                              transition: 'border-color .15s ease, transform .15s ease',
                              '&:hover': { borderColor: token.color, transform: 'translateY(-1px)' },
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
                              <Chip
                                label={okr.status}
                                size="small"
                                sx={{
                                  height: 20, fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.04em',
                                  textTransform: 'uppercase', color: token.color, bgcolor: token.bg,
                                  border: `1px solid ${token.border}`,
                                }}
                              />
                              <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', fontWeight: 600 }}>
                                Assigned by <Box component="span" sx={{ color: 'text.primary' }}>{okr.assignedBy}</Box>
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                              <Typography sx={{ fontWeight: 800, fontSize: '1.02rem', lineHeight: 1.3 }}>
                                {okr.title}
                              </Typography>
                              <IconButton size="small" sx={{ color: 'text.secondary', mt: -0.5 }}>
                                <OpenInNew sx={{ fontSize: 15 }} />
                              </IconButton>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                                <Tooltip title={`Assigned to ${okr.ownerName} (${okr.department})`}>
                                  <Avatar sx={{ width: 26, height: 26, bgcolor: 'primary.main', color: '#0b0e14', fontSize: '0.65rem', fontWeight: 800 }}>
                                    {assigneeUser?.initial || okr.ownerName.charAt(0)}
                                  </Avatar>
                                </Tooltip>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{okr.ownerName}</Typography>
                                <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.secondary', opacity: 0.5 }} />
                                <Chip label={okr.department} size="small" sx={{ height: 22, fontSize: '0.68rem', fontWeight: 600, bgcolor: surface2, color: 'text.secondary' }} />
                              </Box>

                              <Box sx={{ display: 'flex', gap: 2, fontSize: '0.68rem', color: 'text.secondary', fontWeight: 600 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <GpsFixed sx={{ fontSize: 13, color: token.color }} /> {okr.keyResults.length} KRs
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <ChecklistRtl sx={{ fontSize: 13, color: 'secondary.main' }} /> {okr.tasksCount} Tasks
                                </Box>
                              </Box>
                            </Box>

                            <Box sx={{ position: 'relative', height: 8, bgcolor: surface2, borderRadius: '6px', overflow: 'hidden' }}>
                              <Box sx={{ height: '100%', width: `${okr.progress}%`, background: barGradient(okr.progress), borderRadius: '6px' }} />
                            </Box>
                            <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: 'text.secondary', mt: 0.75, textAlign: 'right' }}>
                              {okr.progress}% Complete
                            </Typography>
                          </Card>
                        );
                      })}
                    </Box>
                  </Box>
                ))}
              </Box>
              )}            

            {/* --- LIST VIEW (mirrors the HTML reference: 8-col objective feed + 4-col insight rail) --- */}
            {viewMode === 'list' && (
              <Box sx={{ maxWidth: 1320, mx: 'auto' }}>
                <Grid container spacing={4}>

                  {/* LEFT: OBJECTIVE CARD FEED */}
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', color: 'text.secondary', textTransform: 'uppercase' }}>
                        Active Objectives ({okrs.length})
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>Sort by:</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>
                          Progress <ExpandMore sx={{ fontSize: 14 }} />
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      {okrs.map((okr) => {
                        const token = statusToken(okr.status);
                        const assigneeUser = directoryUsers.find(u => u.name === okr.ownerName);
                        return (
                          <Card
                            key={okr.id}
                            elevation={0}
                            onClick={() => setSelectedFlowOkr(okr)}
                            sx={{
                              p: 3, bgcolor: 'background.paper', border: `1px solid ${borderColor}`,
                              borderRadius: '18px', cursor: 'pointer', position: 'relative', overflow: 'hidden',
                              transition: 'border-color .15s ease',
                              '&:hover': { borderColor: `${token.color}66` },
                              '&:hover .okr-open-icon': { opacity: 1 },
                            }}
                          >
                            <IconButton
                              className="okr-open-icon"
                              size="small"
                              sx={{ position: 'absolute', top: 14, right: 14, opacity: 0, transition: 'opacity .15s ease', color: token.color }}
                            >
                              <OpenInNew sx={{ fontSize: 15 }} />
                            </IconButton>

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                              <Box sx={{ flex: 1, pr: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
                                  <Chip
                                    label={okr.status}
                                    size="small"
                                    sx={{
                                      height: 20, fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.04em',
                                      textTransform: 'uppercase', color: token.color, bgcolor: token.bg, border: `1px solid ${token.border}`,
                                    }}
                                  />
                                  <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', fontWeight: 600 }}>
                                    Assigned by <Box component="span" sx={{ color: 'text.primary' }}>{okr.assignedBy}</Box>
                                  </Typography>
                                </Box>
                                <Typography sx={{ fontSize: '1.08rem', fontWeight: 800, lineHeight: 1.3 }}>
                                  {okr.title}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1.5 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar sx={{ width: 24, height: 24, bgcolor: `${token.color}33`, color: token.color, fontSize: '0.62rem', fontWeight: 800, border: `1px solid ${token.color}55` }}>
                                      {assigneeUser?.initial || okr.ownerName.charAt(0)}
                                    </Avatar>
                                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 600 }}>{okr.ownerName}</Typography>
                                  </Box>
                                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.secondary', opacity: 0.5 }} />
                                  <Chip label={okr.department} size="small" sx={{ height: 24, fontSize: '0.7rem', fontWeight: 600, bgcolor: surface2, color: 'text.secondary' }} />
                                </Box>
                              </Box>
                              <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                                <Typography sx={{ fontSize: '1.6rem', fontWeight: 900, lineHeight: 1 }}>{okr.progress}%</Typography>
                                <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary', letterSpacing: '-0.02em', textTransform: 'uppercase', fontWeight: 700 }}>
                                  Complete
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ height: 8, width: '100%', bgcolor: surface2, borderRadius: '6px', overflow: 'hidden', mb: 2 }}>
                              <Box sx={{ height: '100%', width: `${okr.progress}%`, background: barGradient(okr.progress), borderRadius: '6px' }} />
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.6rem', border: `2px solid ${isDark ? '#161b22' : '#fff'}` } }}>
                                <Avatar sx={{ bgcolor: 'primary.main', color: '#0b0e14', fontWeight: 800 }}>{assigneeUser?.initial || okr.ownerName.charAt(0)}</Avatar>
                                <Avatar sx={{ bgcolor: 'secondary.main', fontWeight: 800 }}>{okr.assignedByInitial}</Avatar>
                              </AvatarGroup>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.7rem', color: 'text.secondary', fontWeight: 600 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <GpsFixed sx={{ fontSize: 13, color: token.color }} /> {okr.keyResults.length} KRs
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <ChecklistRtl sx={{ fontSize: 13, color: 'secondary.main' }} /> {okr.tasksCount} Tasks
                                </Box>
                              </Box>
                            </Box>
                          </Card>
                        );
                      })}
                    </Box>
                  </Grid>

                  {/* RIGHT: INSIGHT RAIL */}
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                      {/* ALIGNMENT SUMMARY */}
                      <Card elevation={0} sx={{ p: 3, bgcolor: 'background.paper', border: `1px solid ${borderColor}`, borderRadius: '18px' }}>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, mb: 1.5 }}>Alignment Summary</Typography>
                        <Box sx={{ height: 200, position: 'relative' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                              innerRadius="35%"
                              outerRadius="100%"
                              data={deptProgress}
                              startAngle={90}
                              endAngle={-270}
                            >
                              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                              <RadialBar
                                background={{ fill: surface2 }}
                                dataKey="value"
                                cornerRadius={8}
                                clockWise
                              />
                            </RadialBarChart>
                          </ResponsiveContainer>
                          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                            <Typography sx={{ fontSize: '1.4rem', fontWeight: 900 }}>{avgProgressAll}%</Typography>
                            <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase' }}>Avg</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mt: 1 }}>
                          {deptProgress.map((d) => (
                            <Box key={d.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: d.fill }} />
                                <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', fontWeight: 600 }}>{d.name}</Typography>
                              </Box>
                              <Typography sx={{ fontSize: '0.72rem', fontWeight: 800 }}>{d.value}%</Typography>
                            </Box>
                          ))}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
                          <Box sx={{ flex: 1, p: 1.5, bgcolor: surface2, borderRadius: '12px', border: `1px solid ${borderColor}` }}>
                            <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', mb: 0.5 }}>Avg Progress</Typography>
                            <Typography sx={{ fontSize: '1.1rem', fontWeight: 900 }}>{avgProgressAll}%</Typography>
                          </Box>
                          <Box sx={{ flex: 1, p: 1.5, bgcolor: surface2, borderRadius: '12px', border: `1px solid ${borderColor}` }}>
                            <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary', fontWeight: 800, textTransform: 'uppercase', mb: 0.5 }}>Risk Level</Typography>
                            <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, color: riskColor }}>{riskLevel}</Typography>
                          </Box>
                        </Box>
                      </Card>

                      {/* DELEGATION CHAIN */}
                      <Card elevation={0} sx={{ p: 3, bgcolor: 'background.paper', border: `1px solid ${borderColor}`, borderRadius: '18px' }}>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, mb: 2 }}>Delegation Chain</Typography>
                        <Box sx={{
                          display: 'flex', flexDirection: 'column', gap: 2.5, position: 'relative',
                          '&::before': { content: '""', position: 'absolute', left: 11, top: 16, bottom: 16, width: '2px', bgcolor: borderColor },
                        }}>
                          {assignorGroups.map((g, i) => (
                            <Box key={g.assignorName} sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative' }}>
                              <Avatar sx={{
                                width: 24, height: 24, fontSize: '0.6rem', fontWeight: 800, zIndex: 1,
                                bgcolor: RADIAL_COLORS[i % RADIAL_COLORS.length], color: '#0b0e14', border: `2px solid ${isDark ? '#161b22' : '#fff'}`,
                              }}>
                                {g.initial}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 800 }}>{g.assignorName}</Typography>
                                <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>{g.assignorRole} &bull; {g.okrs.length} OKR{g.okrs.length > 1 ? 's' : ''} Delegated</Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                        <Button
                          fullWidth
                          onClick={() => setViewMode('flow')}
                          startIcon={<MapOutlined sx={{ fontSize: 14 }} />}
                          sx={{
                            mt: 3, py: 1, borderRadius: '10px', border: `1px solid ${borderColor}`, color: 'text.secondary',
                            fontSize: '0.7rem', fontWeight: 800, '&:hover': { color: 'text.primary', borderColor: isDark ? '#475569' : '#94a3b8' },
                          }}
                        >
                          View Full Tree Map
                        </Button>
                      </Card>

                      {/* RECENT UPDATES */}
                      <Card elevation={0} sx={{ p: 3, bgcolor: 'background.paper', border: `1px solid ${borderColor}`, borderRadius: '18px' }}>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, mb: 2 }}>Recent Updates</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {activityFeed.map((item, i) => {
                            const Icon = item.type === 'progress' ? ArrowUpward : item.type === 'risk' ? ErrorOutline : ChatBubbleOutline;
                            const color = item.type === 'progress' ? theme.palette.success.main : item.type === 'risk' ? theme.palette.warning.main : theme.palette.secondary.main;
                            return (
                              <Box key={i} sx={{ display: 'flex', gap: 1.5 }}>
                                <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <Icon sx={{ fontSize: 12, color }} />
                                </Box>
                                <Box>
                                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, lineHeight: 1.4 }}>{item.text}</Typography>
                                  <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', mt: 0.25 }}>{item.meta}</Typography>
                                </Box>
                              </Box>
                            );
                          })}
                          {activityFeed.length === 0 && (
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>No recent activity yet.</Typography>
                          )}
                        </Box>
                      </Card>

                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Box>

        {/* INSPECTOR DIALOG */}
        <Dialog
          open={Boolean(selectedFlowOkr)}
          onClose={() => setSelectedFlowOkr(null)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { bgcolor: 'background.paper', borderRadius: '18px', border: `1px solid ${borderColor}` } }}
        >
          {selectedFlowOkr && (
            <>
              <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ pr: 2 }}>{selectedFlowOkr.title}</Box>
                <Chip
                  label={`${selectedFlowOkr.progress}%`}
                  sx={{
                    fontWeight: 800,
                    color: statusToken(selectedFlowOkr.status).color,
                    bgcolor: statusToken(selectedFlowOkr.status).bg,
                    border: `1px solid ${statusToken(selectedFlowOkr.status).border}`,
                  }}
                />
              </DialogTitle>
              <DialogContent dividers sx={{ borderColor }}>
                <OkrDetailContent
                  okr={selectedFlowOkr}
                  isDark={isDark}
                  surface2={surface2}
                  borderColor={borderColor}
                  commentInputs={commentInputs}
                  setCommentInputs={setCommentInputs}
                  handlePostComment={handlePostComment}
                />
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={() => setSelectedFlowOkr(null)} variant="outlined" sx={{ borderRadius: '10px', fontWeight: 700 }}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* DRAFT & ASSIGN MODAL */}
        <Dialog
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { bgcolor: 'background.paper', borderRadius: '18px', border: `1px solid ${borderColor}` } }}
        >
        
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
                    label="Assignee"
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
                  <TextField label="Assignor (Assigned By)" disabled value={currentUser.name} fullWidth />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setCreateModalOpen(false)} sx={{ fontWeight: 700 }}>Cancel</Button>
            <Button variant="contained" onClick={handleCreateOkr} sx={{ borderRadius: '10px', fontWeight: 800 }}>Assign OKR</Button>
          </DialogActions>
        </Dialog>

      </Box>
    </ThemeProvider>
  );
}

// --- DETAIL CONTENT ---
function OkrDetailContent({ okr, isDark, surface2, borderColor, commentInputs, setCommentInputs, handlePostComment }) {
  return (
    <>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" sx={{ p: 2, bgcolor: surface2, borderColor, borderRadius: '12px' }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: 'text.secondary', letterSpacing: '0.05em' }}>ASSIGNMENT DELEGATION</Typography>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, mt: 0.5 }}>
              {okr.assignedBy} <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>assigned to</Box> {okr.ownerName}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card variant="outlined" sx={{ p: 2, bgcolor: surface2, borderColor, borderRadius: '12px' }}>
            <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: 'text.secondary', letterSpacing: '0.05em' }}>DEPARTMENT & SCHEDULE</Typography>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, mt: 0.5 }}>
              {okr.department} &bull; Due {okr.dueDate}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: 'text.secondary', letterSpacing: '0.05em', mb: 1 }}>
        DESCRIPTION OF WORK
      </Typography>
      <Typography sx={{ fontSize: '0.85rem', mb: 3, lineHeight: 1.6 }}>
        {okr.description}
      </Typography>

      <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: 'text.secondary', letterSpacing: '0.05em', mb: 1 }}>
        KEY RESULTS
      </Typography>
      {okr.keyResults.map((kr) => (
        <Box key={kr.id} sx={{ mb: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>{kr.title}</Typography>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 700 }}>{kr.current} / {kr.target} {kr.unit}</Typography>
          </Box>
          <Box sx={{ height: 6, borderRadius: 3, bgcolor: surface2, overflow: 'hidden' }}>
            <Box sx={{ height: '100%', width: `${Math.min(100, (kr.current / kr.target) * 100)}%`, background: 'linear-gradient(90deg, #2dd4bf, #5eead4)' }} />
          </Box>
        </Box>
      ))}

      {/* FEEDBACK THREAD */}
      <Box sx={{ mt: 3, p: 2, bgcolor: surface2, borderRadius: '12px', border: `1px solid ${borderColor}` }}>
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, mb: 2 }}>
          Feedback & Directives
        </Typography>
        {okr.comments.map((comment) => (
          <Box key={comment.id} sx={{ mb: 1.5, p: 1.5, bgcolor: 'background.paper', borderRadius: '10px', border: `1px solid ${borderColor}` }}>
            <Typography component="span" sx={{ fontSize: '0.78rem', fontWeight: 800 }}>{comment.author}: </Typography>
            <Typography component="span" sx={{ fontSize: '0.78rem' }}>{comment.text}</Typography>
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