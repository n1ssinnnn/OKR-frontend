import React, { useMemo, useState } from 'react';
import {
  Alert, Avatar, Box, Button, Chip, CssBaseline, Dialog, DialogActions,
  DialogContent, DialogTitle, Divider, Drawer, IconButton, InputAdornment,
  LinearProgress, MenuItem, Paper, Snackbar, Stack, TextField, ThemeProvider,
  ToggleButton, ToggleButtonGroup, Tooltip, Typography, createTheme,
} from '@mui/material';
import AccountTree from '@mui/icons-material/AccountTree';
import Apartment from '@mui/icons-material/Apartment';
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Close from '@mui/icons-material/Close';
import DarkMode from '@mui/icons-material/DarkMode';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Groups from '@mui/icons-material/Groups';
import LightMode from '@mui/icons-material/LightMode';
import LinkIcon from '@mui/icons-material/Link';
import LinkOff from '@mui/icons-material/LinkOff';
import PersonOutlined from '@mui/icons-material/PersonOutlined';
import Search from '@mui/icons-material/Search';
import VerifiedOutlined from '@mui/icons-material/VerifiedOutlined';
import ViewList from '@mui/icons-material/ViewList';

// Module 4 only: objective alignment. Replace this demo data with your API data.
// Keep these IDs stable across Modules 2, 3, and 4 when sharing real objectives.
const DEMO_CYCLES = [{ id: 'h1-2026', name: 'H1 2026' }, { id: 'h2-2026', name: 'H2 2026' }];
const DEMO_OBJECTIVES = [
  { id: 'company-1', cycleId: 'h1-2026', parentId: null, level: 'Company', title: 'Improve the institutional learning experience', description: 'Connect reliable learning technology, outreach, and clear policy to our company goals.', ownerId: 1, ownerName: 'Dr. Arisara (Advisor)', department: 'Company', progress: 72, status: 'On Track' },
  { id: 'o1', cycleId: 'h1-2026', parentId: 'company-1', level: 'Team', title: 'Deploy LMS Core System & Infrastructure', description: 'Deliver a reliable learning platform for institutional rollouts.', ownerId: 2, ownerName: 'Lead Engineer Team', department: 'Engineering Hub', progress: 85, status: 'On Track' },
  { id: 'o2', cycleId: 'h1-2026', parentId: 'company-1', level: 'Team', title: 'Launch Marketing campaign', description: 'Grow institutional awareness through coordinated digital outreach.', ownerId: 5, ownerName: 'Campaign Director', department: 'Marketing', progress: 60, status: 'At Risk' },
  { id: 'o3', cycleId: 'h1-2026', parentId: 'company-1', level: 'Team', title: 'Draft Strategic Policy Framework 2026', description: 'Prepare clear policy for institutional adoption.', ownerId: 4, ownerName: 'Policy Drafter', department: 'Policy Strategy', progress: 95, status: 'On Track' },
  { id: 'o4', cycleId: 'h1-2026', parentId: 'o1', level: 'Individual', title: 'Build Interactive Learning UI Components', description: 'Deliver accessible and responsive learning interfaces.', ownerId: 3, ownerName: 'LMS Developer', department: 'Engineering Hub', progress: 80, status: 'On Track' },
  { id: 'o5', cycleId: 'h1-2026', parentId: 'o2', level: 'Individual', title: 'Produce High-Impact AI Visual Media Assets', description: 'Create the visual assets needed for the marketing campaign.', ownerId: 6, ownerName: 'AI Media Artist', department: 'Marketing', progress: 40, status: 'At Risk' },
  { id: 'o6', cycleId: 'h1-2026', parentId: null, level: 'Individual', title: 'Improve learning dashboard accessibility', description: 'This demo objective has no parent yet. Link it to an Engineering Hub team objective.', ownerId: 3, ownerName: 'LMS Developer', department: 'Engineering Hub', progress: 25, status: 'Off Track' },
];

const LEVELS = {
  Company: { color: '#4ECDC4', icon: Apartment, parent: null },
  Team: { color: '#A389F4', icon: Groups, parent: 'Company' },
  Individual: { color: '#FFB86C', icon: PersonOutlined, parent: 'Team' },
};
const STATUS_COLORS = { 'On Track': 'success', 'At Risk': 'warning', 'Off Track': 'error', Completed: 'success' };

function progressOf(objective) {
  const value = Number(objective.progress);
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}

// Validate the actual objective chain, rather than the people who assigned work.
// A visited set also makes malformed/circular API data safe to inspect.
function alignmentIssue(objective, byId) {
  let node = objective;
  const visited = new Set();
  while (node) {
    if (visited.has(node.id)) return 'Circular alignment detected.';
    visited.add(node.id);
    if (!LEVELS[node.level]) return 'Unknown objective level.';
    if (node.level === 'Company') return node.parentId ? 'Company objectives must be root goals.' : null;
    if (!node.parentId) return `${node.level} objective “${node.title}” needs a ${LEVELS[node.level].parent} parent.`;
    const parent = byId.get(node.parentId);
    if (!parent) return 'The linked parent objective no longer exists.';
    if (parent.cycleId !== node.cycleId) return 'Parent and child must belong to the same OKR cycle.';
    if (parent.level !== LEVELS[node.level].parent) return 'Use the Company → Team → Individual hierarchy.';
    if (node.level === 'Individual' && parent.department !== node.department) return 'Individual and Team objectives must belong to the same department.';
    node = parent;
  }
  return 'The alignment chain is incomplete.';
}

function parentIsValid(child, parent) {
  return Boolean(parent && child.id !== parent.id &&
    child.cycleId === parent.cycleId && LEVELS[child.level]?.parent === parent.level &&
    (child.level !== 'Individual' || child.department === parent.department));
}

function canManage(objective, currentUser) {
  if (!objective || objective.level === 'Company') return false;
  if (['Admin', 'Executive'].includes(currentUser?.role)) return true;
  return ['Manager', 'Team Lead'].includes(currentUser?.role) &&
    objective.department === currentUser?.department;
}

function ObjectiveCard({ objective, issue, selected, onSelect, childCount, collapsed, onToggle, compact }) {
  const level = LEVELS[objective.level] || LEVELS.Individual;
  const Icon = level.icon;
  return (
    <Paper variant="outlined" sx={{
      width: compact ? '100%' : 250, minWidth: compact ? 0 : 250,
      borderRadius: '10px', borderColor: selected ? 'primary.main' : 'divider',
      borderLeft: `3px solid ${level.color}`, overflow: 'hidden',
    }}>
      <Box component="button" type="button" onClick={onSelect}
        aria-label={`View objective: ${objective.title}`}
        sx={{ display: 'block', width: '100%', p: 1.5, textAlign: 'left', color: 'text.primary',
          bgcolor: 'transparent', border: 0, cursor: 'pointer', font: 'inherit',
          '&:hover': { bgcolor: 'action.hover' }, '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 } }}>
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1 }}>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", color: theme => theme.palette.mode === 'dark' ? level.color : ({ Company: '#087F78', Team: '#7046C4', Individual: '#9D5900' }[objective.level] || '#586477') }}>
            <Icon sx={{ fontSize: 16 }} /><Typography variant="caption" sx={{ fontWeight: 700 }}>{objective.level}</Typography>
          </Stack>
          {issue ? <Chip size="small" variant="outlined" label="Needs alignment" color="warning" sx={{ height: 20, fontSize: 10 }} /> :
            <Tooltip title="Aligned to company"><CheckCircleOutlined sx={{ fontSize: 16, color: 'success.main' }} aria-label="Aligned" /></Tooltip>}
        </Stack>
        <Typography sx={{ fontWeight: 600, fontSize: 13, lineHeight: 1.5, overflowWrap: 'anywhere' }}>{objective.title}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.75 }}>
          {objective.ownerName}
        </Typography>
        <Stack direction="row" sx={{ justifyContent: "space-between", mt: 1.25, mb: 0.75 }}>
          <Typography variant="caption" color="text.secondary">{objective.status || 'No status'}</Typography>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>{progressOf(objective)}%</Typography>
        </Stack>
        <LinearProgress variant="determinate" value={progressOf(objective)} aria-label={`${objective.title} progress`}
          sx={{ height: 4, borderRadius: 4, '& .MuiLinearProgress-bar': { bgcolor: level.color } }} />
      </Box>
      {childCount > 0 && <Button fullWidth size="small" onClick={onToggle}
        aria-expanded={!collapsed} startIcon={collapsed ? <ChevronRight /> : <ExpandMore />}
        sx={{ borderTop: '1px solid', borderColor: 'divider', borderRadius: 0, color: 'text.secondary', fontSize: 11 }}>
        {collapsed ? 'Show' : 'Hide'} {childCount} linked {childCount === 1 ? 'objective' : 'objectives'}
      </Button>}
    </Paper>
  );
}

/**
 * Place this file at src/pages/module4.jsx.
 * Standalone demo: <OKRAlignment currentUser={currentUser} />
 * Shared data: pass objectives, cycles, and onObjectivesChange(nextObjectives).
 * The callback may return a Promise; failed saves leave the current data intact.
 * IDs, parentId, and cycleId use strings. Team/Individual goals need department.
 */
export default function OKRAlignment({ currentUser = { role: 'Employee' }, objectives: suppliedObjectives,
  cycles = DEMO_CYCLES, onObjectivesChange }) {
  const [demoObjectives, setDemoObjectives] = useState(DEMO_OBJECTIVES);
  const [mode, setMode] = useState('dark');
  const [view, setView] = useState('map');
  const [cycleId, setCycleId] = useState(cycles[0]?.id || '');
  const [department, setDepartment] = useState('all');
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState(new Set());
  const [selectedId, setSelectedId] = useState(null);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [linkForm, setLinkForm] = useState(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const controlled = suppliedObjectives !== undefined;
  const objectives = controlled ? suppliedObjectives : demoObjectives;
  const writable = !controlled || typeof onObjectivesChange === 'function';
  const theme = useMemo(() => createTheme({
    palette: { mode, primary: { main: mode === 'dark' ? '#4ECDC4' : '#087F78' },
      secondary: { main: '#A389F4' },
      background: { default: mode === 'dark' ? '#0F1115' : '#F4F7FE', paper: mode === 'dark' ? '#1A1D24' : '#FFFFFF' },
      divider: mode === 'dark' ? '#2A2D3A' : '#DCE3ED',
      text: { secondary: mode === 'dark' ? '#A1A9BC' : '#586477' } },
    typography: { fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' },
    shape: { borderRadius: 8 },
    components: { MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } } },
  }), [mode]);

  const byId = useMemo(() => new Map(objectives.map(o => [o.id, o])), [objectives]);
  const cycleObjectives = objectives.filter(o => o.cycleId === cycleId);
  const issues = new Map(cycleObjectives.map(o => [o.id, alignmentIssue(o, byId)]));
  const problems = cycleObjectives.filter(o => issues.get(o.id));
  const nonCompany = cycleObjectives.filter(o => o.level !== 'Company');
  const aligned = nonCompany.filter(o => !issues.get(o.id)).length;
  const alignmentRate = nonCompany.length ? Math.round(aligned / nonCompany.length * 100) : 0;
  const departments = [...new Set(cycleObjectives.filter(o => o.level !== 'Company').map(o => o.department))].filter(Boolean).sort();
  const selected = byId.get(selectedId);
  const editable = cycleObjectives.filter(o => canManage(o, currentUser));
  const source = byId.get(linkForm?.sourceId);
  const candidates = source ? objectives.filter(o => parentIsValid(source, o) && !alignmentIssue(o, byId)) : [];

  // Filters keep ancestors visible so every displayed connection retains context.
  const matches = cycleObjectives.filter(o =>
    (department === 'all' || o.department === department) &&
    `${o.title} ${o.ownerName} ${o.department}`.toLowerCase().includes(query.trim().toLowerCase()));
  const visibleIds = new Set();
  matches.forEach(objective => {
    let node = objective;
    const visited = new Set();
    while (node && node.cycleId === cycleId && !visited.has(node.id)) {
      visited.add(node.id);
      visibleIds.add(node.id);
      const parent = byId.get(node.parentId);
      node = parentIsValid(node, parent) ? parent : null;
    }
  });
  const visible = cycleObjectives.filter(o => visibleIds.has(o.id));
  const childrenOf = id => visible.filter(o => o.parentId === id && parentIsValid(o, byId.get(id)));
  const roots = visible.filter(o => !parentIsValid(o, byId.get(o.parentId)));
  const companyRoots = roots.filter(o => o.level === 'Company');
  const looseRoots = roots.filter(o => o.level !== 'Company');
  const filtering = Boolean(query.trim() || department !== 'all');

  function openLink(objective = editable[0]) {
    if (!objective || !writable || !canManage(objective, currentUser)) return;
    setFormError('');
    setLinkForm({ sourceId: objective.id, parentId: objective.parentId || '' });
  }

  async function commitParent(parentId) {
    if (!source || !writable || !canManage(source, currentUser)) {
      setFormError('You do not have permission to change this alignment.');
      return;
    }
    if (parentId && (!parentIsValid(source, byId.get(parentId)) || alignmentIssue(byId.get(parentId), byId))) {
      setFormError('Choose an aligned parent at the correct level, department, and cycle.');
      return;
    }
    const next = objectives.map(o => o.id === source.id ? { ...o, parentId: parentId || null } : o);
    setSaving(true);
    setFormError('');
    try {
      if (onObjectivesChange) await onObjectivesChange(next);
      if (!controlled) setDemoObjectives(next);
      // Reveal the updated path, even when the parent branch was collapsed.
      setCollapsed(new Set());
      setLinkForm(null);
      setNotice({ severity: 'success', text: parentId ? 'Objective alignment updated.' : 'Parent link removed. The objective now needs alignment.' });
    } catch {
      setFormError('Could not save the alignment. Please try again.');
    } finally { setSaving(false); }
  }

  function toggleBranch(id) {
    setCollapsed(previous => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function renderBranch(objective) {
    const children = childrenOf(objective.id);
    const isCollapsed = !filtering && collapsed.has(objective.id);
    return (
      <Box sx={{ display: 'flex', flexDirection: view === 'map' ? 'row' : 'column', alignItems: view === 'map' ? 'center' : 'stretch', minWidth: 0 }}>
        <ObjectiveCard objective={objective} issue={issues.get(objective.id)} selected={selectedId === objective.id}
          compact={view === 'tree'} childCount={children.length} collapsed={isCollapsed}
          onToggle={() => toggleBranch(objective.id)} onSelect={() => setSelectedId(objective.id)} />
        {children.length > 0 && !isCollapsed && <Box component="ul" sx={view === 'map' ? {
          listStyle: 'none', m: 0, ml: '28px', p: 0, position: 'relative',
          '&::before': { content: '""', position: 'absolute', width: 28, left: -28, top: '50%', borderTop: '1px solid', borderColor: 'divider' },
          '& > li': { position: 'relative', pl: '28px', py: 1.25,
            '&::before': { content: '""', position: 'absolute', left: 0, top: '50%', width: 28, borderTop: '1px solid', borderColor: 'divider' },
            '&::after': { content: '""', position: 'absolute', left: 0, top: 0, bottom: 0, borderLeft: '1px solid', borderColor: 'divider' },
            '&:first-of-type::after': { top: '50%' }, '&:last-of-type::after': { bottom: '50%' },
            '&:only-of-type::after': { display: 'none' } },
        } : { listStyle: 'none', m: 0, mt: 1.5, ml: { xs: 1, sm: 3 }, pl: 2, borderLeft: '1px solid', borderColor: 'divider', '& > li': { mb: 1.5 } }}>
          {children.map(child => <Box component="li" key={child.id}>{renderBranch(child)}</Box>)}
        </Box>}
      </Box>
    );
  }

  const path = [];
  if (selected) {
    let node = selected;
    const visited = new Set();
    while (node && !visited.has(node.id)) {
      visited.add(node.id); path.unshift(node);
      const parent = byId.get(node.parentId);
      node = parentIsValid(node, parent) ? parent : null;
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100%', bgcolor: 'background.default', p: { xs: 2, md: 3 }, color: 'text.primary', minWidth: 0 }}>
        <Box sx={{ maxWidth: 1500, mx: 'auto' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 2.5 }}>
            <Box>
              <Typography component="h1" sx={{ fontSize: { xs: 22, md: 25 }, fontWeight: 700, letterSpacing: '-0.04em' }}>OKR Alignment</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>See how each goal supports the bigger picture.</Typography>
            </Box>
            <Stack direction="row" sx={{ gap: 1, alignItems: "center", flexWrap: "wrap" }}>
              <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
                <IconButton size="small" aria-label="Toggle color theme" onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
                  {mode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
                </IconButton>
              </Tooltip>
              <Button variant="text" startIcon={<VerifiedOutlined />} onClick={() => setVerificationOpen(true)}>Verify alignment</Button>
              {writable && editable.length > 0 && <Button variant="contained" disableElevation startIcon={<LinkIcon />} onClick={() => openLink()}>Link objective</Button>}
            </Stack>
          </Stack>

          {!controlled && <Alert severity="info" sx={{ mb: 2 }}>Demo data. Changes remain in this page until it is unmounted or refreshed.</Alert>}
          <Paper variant="outlined" sx={{ borderRadius: '12px', mb: 2.5, display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, overflow: 'hidden' }}>
            {[
              { label: 'Company goals', value: cycleObjectives.filter(o => o.level === 'Company').length },
              { label: 'Team & individual', value: nonCompany.length },
              { label: 'Fully aligned', value: `${alignmentRate}%` },
              { label: 'Need alignment', value: problems.length },
            ].map((metric, index) => <Stack key={metric.label} direction="row" sx={{ alignItems: 'baseline', gap: 1.25, px: 2.5, py: 1.75, borderLeft: index ? '1px solid' : 0, borderColor: 'divider' }}>
              <Typography sx={{ fontSize: 23, fontWeight: 700, letterSpacing: '-0.04em', color: metric.label === 'Need alignment' && problems.length ? 'warning.main' : 'text.primary' }}>{metric.value}</Typography>
              <Typography variant="caption" color="text.secondary">{metric.label}</Typography>
            </Stack>)}
          </Paper>

          <Box sx={{ mb: 2 }}>
            <Stack direction={{ xs: 'column', lg: 'row' }} sx={{ gap: 1.5 }}>
              <TextField label="Search goals or owners" size="small" value={query} onChange={e => setQuery(e.target.value)}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> } }}
                sx={{ flex: 1, minWidth: 180 }} />
              <TextField select label="OKR cycle" size="small" value={cycleId} sx={{ minWidth: 150 }}
                onChange={e => { setCycleId(e.target.value); setDepartment('all'); setSelectedId(null); setCollapsed(new Set()); }}>
                {cycles.length === 0 && <MenuItem value="">No cycles</MenuItem>}
                {cycles.map(cycle => <MenuItem value={cycle.id} key={cycle.id}>{cycle.name}</MenuItem>)}
              </TextField>
              <TextField select label="Department" size="small" value={department} onChange={e => setDepartment(e.target.value)} sx={{ minWidth: 185 }}>
                <MenuItem value="all">All departments</MenuItem>
                {departments.map(name => <MenuItem value={name} key={name}>{name}</MenuItem>)}
              </TextField>
              <ToggleButtonGroup exclusive size="small" value={view} onChange={(_, value) => value && setView(value)} aria-label="Alignment view">
                <ToggleButton value="map" sx={{ gap: 0.75, textTransform: 'none', px: 1.5 }}><AccountTree fontSize="small" />Map</ToggleButton>
                <ToggleButton value="tree" sx={{ gap: 0.75, textTransform: 'none', px: 1.5 }}><ViewList fontSize="small" />Tree</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Box>

          <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1, px: 2.5, py: 1.5 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{view === 'map' ? 'Company → Team → Individual' : 'Objective hierarchy'}</Typography>
                <Typography variant="caption" color="text.secondary">{filtering ? `${matches.length} matching objectives; ancestors included for context.` : 'Select an objective to inspect its alignment.'}</Typography>
              </Box>
              <Button size="small" disabled={filtering || collapsed.size === 0} onClick={() => setCollapsed(new Set())}>Expand all</Button>
            </Stack>
            <Divider />
            <Box tabIndex={0} role="region" aria-label="Objective alignment diagram" sx={{ overflowX: 'auto', p: { xs: 2, md: 3 }, minHeight: 280, bgcolor: 'background.default' }}>
              {visible.length === 0 ? <Stack sx={{ alignItems: "center", py: 7, gap: 1 }}>
                <AccountTree sx={{ fontSize: 40, color: 'text.secondary' }} />
                <Typography sx={{ fontWeight: 700 }}>{cycleObjectives.length ? 'No matching objectives' : 'No objectives in this cycle'}</Typography>
                <Typography variant="body2" color="text.secondary">{cycleObjectives.length ? 'Try another search or department.' : 'Create objectives in Module 3, then connect them here.'}</Typography>
                {filtering && <Button onClick={() => { setQuery(''); setDepartment('all'); }}>Clear filters</Button>}
              </Stack> : <Box sx={{ width: view === 'map' ? 'max-content' : '100%', minWidth: '100%' }}>
                {companyRoots.map(o => <Box key={o.id} sx={{ mb: 3 }}>{renderBranch(o)}</Box>)}
                {looseRoots.length > 0 && <Box sx={{ mt: companyRoots.length ? 3 : 0 }}>
                  <Typography variant="subtitle2" color="warning.main" sx={{ mb: 2 }}>Objectives without a valid parent</Typography>
                  {looseRoots.map(o => <Box key={o.id} sx={{ mb: 2 }}>{renderBranch(o)}</Box>)}
                </Box>}
              </Box>}
            </Box>
          </Paper>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
            Alignment checks structure and complete parent chains. Review whether each goal meaningfully supports its parent.
          </Typography>
        </Box>
      </Box>

      <Drawer anchor="right" open={Boolean(selected)} onClose={() => setSelectedId(null)} slotProps={{ paper: { sx: { width: { xs: '100%', sm: 440 }, p: 3 } } }}>
        {selected && <Stack sx={{ gap: 2.5 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Objective details</Typography>
            <IconButton aria-label="Close objective details" onClick={() => setSelectedId(null)}><Close /></IconButton>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Chip label={selected.level} size="small" variant="outlined" />
            <Chip label={selected.status || 'No status'} size="small" color={STATUS_COLORS[selected.status] || 'default'} />
          </Stack>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{selected.title}</Typography>
          <Typography variant="body2" color="text.secondary">{selected.description || 'No description provided.'}</Typography>
          <Stack direction="row" sx={{ gap: 1.5, alignItems: "center" }}>
            <Avatar sx={{ bgcolor: 'primary.main', color: 'background.default' }}>{selected.ownerName?.charAt(0) || '?'}</Avatar>
            <Box><Typography variant="body2" sx={{ fontWeight: 600 }}>{selected.ownerName}</Typography><Typography variant="caption" color="text.secondary">{selected.department}</Typography></Box>
          </Stack>
          <Box><Typography variant="body2" sx={{ mb: 1 }}>Progress: {progressOf(selected)}%</Typography><LinearProgress value={progressOf(selected)} variant="determinate" /></Box>
          <Divider />
          <Typography variant="subtitle2">Alignment path</Typography>
          {path.map((o, index) => <Box key={o.id} sx={{ pl: index * 2, borderLeft: '2px solid', borderColor: LEVELS[o.level]?.color || 'divider' }}>
            <Typography variant="caption" color="text.secondary">{o.level}</Typography><Typography variant="body2">{o.title}</Typography>
          </Box>)}
          <Alert severity={alignmentIssue(selected, byId) ? 'warning' : 'success'}>{alignmentIssue(selected, byId) || 'This objective has a valid alignment chain to Company level.'}</Alert>
          {writable && canManage(selected, currentUser) && <Button variant="contained" startIcon={<LinkIcon />} onClick={() => openLink(selected)}>{selected.parentId ? 'Manage parent link' : 'Link to a parent'}</Button>}
          <Typography variant="caption" color="text.secondary">Progress and objective content are managed in Module 3.</Typography>
        </Stack>}
      </Drawer>

      <Dialog open={Boolean(linkForm)} onClose={() => { if (!saving) setLinkForm(null); }} fullWidth maxWidth="sm">
        <DialogTitle>Link objective to a parent</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField select fullWidth label="Child objective" value={linkForm?.sourceId || ''} disabled={saving}
              onChange={e => { const o = byId.get(e.target.value); setLinkForm({ sourceId: o.id, parentId: o.parentId || '' }); setFormError(''); }}>
              {editable.map(o => <MenuItem key={o.id} value={o.id}>{o.title}</MenuItem>)}
            </TextField>
            <TextField select fullWidth label={`Parent ${LEVELS[source?.level]?.parent || 'objective'}`}
              value={candidates.some(o => o.id === linkForm?.parentId) ? linkForm.parentId : ''} disabled={saving}
              onChange={e => { setLinkForm({ ...linkForm, parentId: e.target.value }); setFormError(''); }}
              helperText="Only aligned parents in the same cycle and at the correct level are available.">
              <MenuItem value="" disabled>Select a parent objective</MenuItem>
              {candidates.map(o => <MenuItem key={o.id} value={o.id}>{o.title}</MenuItem>)}
            </TextField>
            {candidates.length === 0 && <Alert severity="info">No eligible parent exists. Create the required Company or Team objective and align it first.</Alert>}
            <Alert severity="info">Unlinking a team also leaves its individual objectives without a complete company alignment chain.</Alert>
            {formError && <Alert severity="error" role="alert">{formError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, flexWrap: 'wrap', gap: 1 }}>
          {source?.parentId && <Button color="warning" startIcon={<LinkOff />} disabled={saving} onClick={() => commitParent(null)}>Remove link</Button>}
          <Box sx={{ flexGrow: 1 }} />
          <Button disabled={saving} onClick={() => setLinkForm(null)}>Cancel</Button>
          <Button variant="contained" disabled={saving || !candidates.some(o => o.id === linkForm?.parentId) || linkForm?.parentId === source?.parentId}
            onClick={() => commitParent(linkForm.parentId)}>{saving ? 'Saving…' : 'Save alignment'}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={verificationOpen} onClose={() => setVerificationOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Alignment verification</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Checks every objective in {cycles.find(c => c.id === cycleId)?.name || 'this cycle'}, including goals hidden by search or department filters.</Typography>
          {cycleObjectives.length === 0 ? <Alert severity="info">There are no objectives to verify in this cycle.</Alert> : problems.length === 0 ?
            <Alert severity="success" icon={<CheckCircleOutlined />}>All {cycleObjectives.length} objectives have valid alignment chains.</Alert> :
            <Stack sx={{ gap: 2 }}>{problems.map(o => <Paper key={o.id} variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{o.title}</Typography>
              <Typography variant="body2" color="text.secondary">{issues.get(o.id)}</Typography>
              {writable && canManage(o, currentUser) && <Button size="small" startIcon={<LinkIcon />} sx={{ mt: 1 }} onClick={() => { setVerificationOpen(false); openLink(o); }}>Fix alignment</Button>}
            </Paper>)}</Stack>}
        </DialogContent>
        <DialogActions><Button onClick={() => setVerificationOpen(false)}>Close</Button></DialogActions>
      </Dialog>
      <Snackbar open={Boolean(notice)} autoHideDuration={5000} onClose={() => setNotice(null)}>
        <Alert onClose={() => setNotice(null)} severity={notice?.severity || 'success'} variant="filled">{notice?.text}</Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
