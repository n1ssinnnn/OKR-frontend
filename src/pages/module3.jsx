import React, { useMemo, useState } from 'react';
import {
  Alert, Avatar, Box, Button, Checkbox, Chip, Collapse, CssBaseline, Dialog,
  DialogActions, DialogContent, DialogTitle, Divider, Drawer, FormControlLabel,
  IconButton, InputAdornment, LinearProgress, MenuItem, Paper, Snackbar, Stack,
  TextField, ThemeProvider, Tooltip, Typography, createTheme,
} from '@mui/material';
import Add from '@mui/icons-material/Add';
import AttachFile from '@mui/icons-material/AttachFile';
import Close from '@mui/icons-material/Close';
import DarkMode from '@mui/icons-material/DarkMode';
import DeleteOutline from '@mui/icons-material/DeleteOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LightMode from '@mui/icons-material/LightMode';
import LinkIcon from '@mui/icons-material/Link';
import Search from '@mui/icons-material/Search';
import Send from '@mui/icons-material/Send';
import TrackChanges from '@mui/icons-material/TrackChanges';

// Optional named exports let App.jsx own one shared dataset for Modules 3 and 4.
export const OKR_CYCLES = [{ id: 'h1-2026', name: 'H1 2026' }, { id: 'h2-2026', name: 'H2 2026' }];
const USERS = [
  { id: 1, name: 'Dr. Arisara (Advisor)', department: 'Policy Strategy' },
  { id: 2, name: 'Lead Engineer Team', department: 'Engineering Hub' },
  { id: 5, name: 'Campaign Director', department: 'Marketing' },
  { id: 4, name: 'Policy Drafter', department: 'Policy Strategy' },
  { id: 3, name: 'LMS Developer', department: 'Engineering Hub' },
  { id: 6, name: 'AI Media Artist', department: 'Marketing' },
];
const TYPES = ['NUMERIC', 'PERCENTAGE', 'BOOLEAN', 'MILESTONE'];
const STATUSES = ['On Track', 'At Risk', 'Off Track'];
const STATUS_COLORS = { 'On Track': 'success', 'At Risk': 'warning', 'Off Track': 'error', Completed: 'success' };
const newId = prefix => `${prefix}-${globalThis.crypto.randomUUID()}`;
const clone = value => JSON.parse(JSON.stringify(value));

function krProgress(kr) {
  if (kr.metricType === 'BOOLEAN') return Number(kr.currentValue) === 1 ? 100 : 0;
  if (kr.metricType === 'MILESTONE') {
    return kr.milestones?.length ? kr.milestones.filter(m => m.completed).length / kr.milestones.length * 100 : 0;
  }
  const span = Number(kr.targetValue) - Number(kr.startValue);
  const value = span === 0 ? (Number(kr.currentValue) === Number(kr.targetValue) ? 100 : 0)
    : (Number(kr.currentValue) - Number(kr.startValue)) / span * 100;
  return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
}

function objectiveProgress(keyResults = []) {
  const total = keyResults.reduce((sum, kr) => sum + Number(kr.weight || 0), 0);
  return total > 0 ? Math.round(keyResults.reduce((sum, kr) => sum + krProgress(kr) * Number(kr.weight || 0), 0) / total) : 0;
}

function normalizeObjective(objective) {
  const progress = objectiveProgress(objective.keyResults);
  return { ...objective, progress, status: progress === 100 ? 'Completed' : objective.status === 'Completed' ? 'On Track' : (objective.status || 'On Track') };
}

function numericKR(id, title, start, target, current, type = 'NUMERIC') {
  return { id, title, metricType: type, startValue: start, targetValue: target, currentValue: current, weight: 100, ownerId: null, milestones: [] };
}

export const INITIAL_OBJECTIVES = [
  { id: 'company-1', level: 'Company', parentId: null, title: 'Improve the institutional learning experience', ownerId: 1, ownerName: USERS[0].name, department: 'Company', keyResults: [numericKR('company-kr', 'Increase learner satisfaction', 0, 100, 72, 'PERCENTAGE')] },
  { id: 'o1', level: 'Team', parentId: 'company-1', title: 'Deploy LMS Core System & Infrastructure', ownerId: 2, ownerName: USERS[1].name, department: 'Engineering Hub', keyResults: [numericKR('kr1', 'Reduce API response time (ms)', 300, 100, 130)] },
  { id: 'o2', level: 'Team', parentId: 'company-1', title: 'Launch Marketing campaign', ownerId: 5, ownerName: USERS[2].name, department: 'Marketing', status: 'At Risk', keyResults: [numericKR('kr2', 'Reach 1,000,000 digital impressions', 0, 1000000, 600000)] },
  { id: 'o3', level: 'Team', parentId: 'company-1', title: 'Draft Strategic Policy Framework 2026', ownerId: 4, ownerName: USERS[3].name, department: 'Policy Strategy', keyResults: [numericKR('kr3', 'Complete policy review', 0, 100, 95, 'PERCENTAGE')] },
  { id: 'o4', level: 'Individual', parentId: 'o1', title: 'Build Interactive Learning UI Components', ownerId: 3, ownerName: USERS[4].name, department: 'Engineering Hub', keyResults: [numericKR('kr4', 'Deliver 10 accessible React components', 0, 10, 8)] },
  { id: 'o5', level: 'Individual', parentId: 'o2', title: 'Produce High-Impact AI Visual Media Assets', ownerId: 6, ownerName: USERS[5].name, department: 'Marketing', status: 'At Risk', keyResults: [numericKR('kr5', 'Deliver 25 campaign graphics', 0, 25, 10)] },
  { id: 'o6', level: 'Individual', parentId: null, title: 'Improve learning dashboard accessibility', ownerId: 3, ownerName: USERS[4].name, department: 'Engineering Hub', status: 'Off Track', keyResults: [{ id: 'kr6', title: 'Complete accessibility rollout', metricType: 'MILESTONE', startValue: 0, targetValue: 1, currentValue: 0, weight: 100, ownerId: 3, milestones: [{ id: 'm1', title: 'Audit the current interface', completed: true }, { id: 'm2', title: 'Fix keyboard navigation', completed: false }, { id: 'm3', title: 'Complete screen reader testing', completed: false }, { id: 'm4', title: 'Publish accessibility report', completed: false }] }] },
].map(o => normalizeObjective({ cycleId: 'h1-2026', status: 'On Track', description: '', notes: '', comments: [], attachments: [], references: [], ...o,
  keyResults: o.keyResults.map(kr => ({ ...kr, ownerId: kr.ownerId ?? o.ownerId })) }));

function isLeader(currentUser) {
  return ['Admin', 'Executive', 'Manager', 'Team Lead'].includes(currentUser?.role);
}
function canEdit(objective, currentUser) {
  if (['Admin', 'Executive'].includes(currentUser?.role)) return true;
  return ['Manager', 'Team Lead'].includes(currentUser?.role) && objective.level !== 'Company' && objective.department === currentUser?.department;
}
function isOwner(ownerId, currentUser) {
  return ownerId != null && currentUser?.id != null && String(ownerId) === String(currentUser.id);
}
function canUpdateKR(objective, kr, currentUser) {
  return canEdit(objective, currentUser) || isOwner(objective.ownerId, currentUser) || isOwner(kr.ownerId, currentUser);
}
function canContribute(objective, currentUser) {
  return canEdit(objective, currentUser) || isOwner(objective.ownerId, currentUser) || objective.keyResults.some(kr => isOwner(kr.ownerId, currentUser));
}
function safeUrl(value) {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; }
}
function readAttachment(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ id: newId('file'), name: file.name, size: file.size, mimeType: file.type, dataUrl: reader.result });
    reader.onerror = () => reject(new Error('Could not read this file.'));
    reader.readAsDataURL(file);
  });
}
function krSummary(kr) {
  if (kr.metricType === 'BOOLEAN') return Number(kr.currentValue) === 1 ? 'Achieved' : 'Not achieved';
  if (kr.metricType === 'MILESTONE') return `${kr.milestones?.filter(m => m.completed).length || 0} / ${kr.milestones?.length || 0} milestones`;
  const suffix = kr.metricType === 'PERCENTAGE' ? '%' : '';
  return `${Number(kr.currentValue).toLocaleString()}${suffix} / ${Number(kr.targetValue).toLocaleString()}${suffix}`;
}
function blankKR(ownerId) {
  return { id: newId('kr'), title: '', ownerId, metricType: 'NUMERIC', startValue: 0, targetValue: 100, currentValue: 0, weight: 100, milestones: [] };
}

/** Standalone: <OKRWorkspace currentUser={currentUser} />.
 * Shared state: pass objectives, cycles, users, and onObjectivesChange(next).
 * onObjectivesChange may return a Promise. There is no backend in this file.
 */
export default function OKRWorkspace({ currentUser = { role: 'Employee' }, objectives: suppliedObjectives,
  cycles = OKR_CYCLES, users = USERS, onObjectivesChange }) {
  const [demoObjectives, setDemoObjectives] = useState(INITIAL_OBJECTIVES);
  const [mode, setMode] = useState('dark');
  const [query, setQuery] = useState('');
  const [cycleId, setCycleId] = useState(cycles[0]?.id || '');
  const [status, setStatus] = useState('all');
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(null);
  const [progressForm, setProgressForm] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [comment, setComment] = useState('');
  const [note, setNote] = useState('');
  const [reference, setReference] = useState({ title: '', url: '' });
  const controlled = suppliedObjectives !== undefined;
  const objectives = controlled ? suppliedObjectives : demoObjectives;
  const writable = !controlled || typeof onObjectivesChange === 'function';
  const selected = objectives.find(o => o.id === selectedId);
  const sourceToDelete = objectives.find(o => o.id === deleteId);
  const cycleObjectives = objectives.filter(o => o.cycleId === cycleId);
  const filtered = cycleObjectives.filter(o => (status === 'all' || o.status === status) &&
    `${o.title} ${o.ownerName} ${o.department}`.toLowerCase().includes(query.trim().toLowerCase()));
  const departments = [...new Set(users.map(u => u.department))].filter(Boolean).sort();
  const isAdmin = ['Admin', 'Executive'].includes(currentUser?.role);
  const formDepartments = isAdmin ? departments : departments.filter(d => d === currentUser?.department);
  const formUsers = form ? users.filter(u => form.level === 'Company' || u.department === form.department) : [];
  const totalWeight = form?.keyResults.reduce((sum, kr) => sum + Number(kr.weight || 0), 0) || 0;
  const theme = useMemo(() => createTheme({
    palette: { mode, primary: { main: mode === 'dark' ? '#4ECDC4' : '#087F78' }, secondary: { main: '#A389F4' },
      background: { default: mode === 'dark' ? '#0F1115' : '#F4F7FE', paper: mode === 'dark' ? '#1A1D24' : '#FFFFFF' },
      divider: mode === 'dark' ? '#2A2D3A' : '#DCE3ED', text: { secondary: mode === 'dark' ? '#A1A9BC' : '#586477' } },
    typography: { fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif' }, shape: { borderRadius: 8 },
    components: { MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } } },
  }), [mode]);

  async function persist(next, message) {
    setSaving(true); setError('');
    try {
      if (onObjectivesChange) await onObjectivesChange(next);
      if (!controlled) setDemoObjectives(next);
      setNotice({ severity: 'success', text: message });
      return true;
    } catch { setError('Could not save your changes. Please try again.'); return false; }
    finally { setSaving(false); }
  }
  function selectObjective(objective) {
    setSelectedId(objective.id); setNote(objective.notes || ''); setComment(''); setReference({ title: '', url: '' }); setError('');
  }
  function openForm(objective) {
    if (!writable || !isLeader(currentUser) || (objective && !canEdit(objective, currentUser))) return;
    setError('');
    if (objective) setForm(clone(objective));
    else {
      const department = isAdmin ? (departments[0] || '') : currentUser.department;
      const owner = users.find(u => u.department === department);
      setForm({ id: newId('objective'), level: 'Team', parentId: null, cycleId, title: '', description: '',
        department, ownerId: owner?.id || '', ownerName: owner?.name || '', status: 'On Track', progress: 0,
        keyResults: [blankKR(owner?.id || '')], notes: '', comments: [], references: [], attachments: [] });
    }
  }
  function updateKR(id, patch) {
    setForm(previous => ({ ...previous, keyResults: previous.keyResults.map(kr => kr.id === id ? { ...kr, ...patch } : kr) }));
  }
  function updateDepartment(department, level = form.level) {
    const owner = users.find(u => level === 'Company' || u.department === department);
    setForm({ ...form, department, level, ownerId: owner?.id || '', ownerName: owner?.name || '',
      keyResults: form.keyResults.map(kr => ({ ...kr, ownerId: owner?.id || '' })) });
  }
  async function saveObjective(event) {
    event.preventDefault();
    if (!form || !writable || !canEdit(form, currentUser)) return;
    const existing = objectives.find(o => o.id === form.id);
    if (existing && !canEdit(existing, currentUser)) return;
    if (!form.title.trim()) { setError('Enter an objective title.'); return; }
    if (!cycles.some(c => c.id === form.cycleId)) { setError('Select an OKR cycle.'); return; }
    if (!formUsers.some(u => String(u.id) === String(form.ownerId))) { setError('Choose an owner in the selected department.'); return; }
    if (!form.keyResults.length || Math.abs(totalWeight - 100) > 0.001) { setError('Add at least one KR and make the KR weights total 100%.'); return; }
    for (const kr of form.keyResults) {
      if (!kr.title.trim() || !TYPES.includes(kr.metricType)) { setError('Every KR needs a title and a supported target type.'); return; }
      if (!Number.isFinite(Number(kr.weight)) || Number(kr.weight) < 0 || Number(kr.weight) > 100) { setError('KR weights must be between 0 and 100.'); return; }
      if (!formUsers.some(u => String(u.id) === String(kr.ownerId))) { setError('Every KR needs an owner in the selected department.'); return; }
      if (kr.metricType === 'MILESTONE') {
        if (!kr.milestones?.length || kr.milestones.some(m => !m.title.trim())) { setError('Add at least one named milestone for each milestone KR.'); return; }
      } else if (kr.metricType !== 'BOOLEAN') {
        if (![kr.startValue, kr.targetValue, kr.currentValue].every(v => v !== '' && Number.isFinite(Number(v))) || Number(kr.startValue) === Number(kr.targetValue)) {
          setError('Numeric and percentage KRs need finite start/current/target values, with different start and target values.'); return;
        }
        if (kr.metricType === 'PERCENTAGE' && [kr.startValue, kr.targetValue, kr.currentValue].some(v => Number(v) < 0 || Number(v) > 100)) { setError('Percentage values must be between 0 and 100.'); return; }
      }
    }
    if (existing && (existing.level !== form.level || existing.cycleId !== form.cycleId || existing.department !== form.department) &&
      (existing.parentId || objectives.some(o => o.parentId === existing.id))) {
      setError('This objective has alignment links. Remove its parent/child links in Module 4 before changing its level, cycle, or department.'); return;
    }
    const owner = users.find(u => String(u.id) === String(form.ownerId));
    const updated = normalizeObjective({ ...form, title: form.title.trim(), description: form.description.trim(), ownerId: owner.id, ownerName: owner.name,
      keyResults: form.keyResults.map(kr => ({ ...kr, title: kr.title.trim(), weight: Number(kr.weight), startValue: Number(kr.startValue), targetValue: Number(kr.targetValue), currentValue: Number(kr.currentValue) })) });
    const next = existing ? objectives.map(o => o.id === updated.id ? updated : o) : [updated, ...objectives];
    if (await persist(next, existing ? 'Objective updated.' : 'Objective created. Link it to a parent in Module 4.')) {
      setForm(null); setCycleId(updated.cycleId); setStatus('all'); setQuery('');
      if (selectedId === updated.id) setNote(updated.notes || '');
    }
  }
  async function saveProgress() {
    const original = objectives.find(o => o.id === progressForm?.id);
    if (!original || !writable) return;
    const keyResults = original.keyResults.map(kr => {
      const draft = progressForm.keyResults.find(k => k.id === kr.id);
      return draft && canUpdateKR(original, kr, currentUser) ? { ...kr, currentValue: Number(draft.currentValue), milestones: draft.milestones } : kr;
    });
    if (keyResults.some(kr => !Number.isFinite(kr.currentValue) || (kr.metricType === 'PERCENTAGE' && (kr.currentValue < 0 || kr.currentValue > 100)))) { setError('Enter a valid progress value. Percentage values must be between 0 and 100.'); return; }
    if (progressForm.keyResults.some(kr => !['BOOLEAN', 'MILESTONE'].includes(kr.metricType) && kr.currentValue === '')) { setError('Enter the current value for every numeric KR.'); return; }
    const updated = normalizeObjective({ ...original, keyResults });
    if (await persist(objectives.map(o => o.id === original.id ? updated : o), 'KR progress and weighted objective progress updated.')) setProgressForm(null);
  }
  async function contribute(patch, message) {
    if (!selected || !writable || !canContribute(selected, currentUser)) return false;
    return persist(objectives.map(o => o.id === selected.id ? { ...o, ...patch } : o), message);
  }
  async function postComment(event) {
    event.preventDefault();
    if (!comment.trim()) return;
    const added = { id: newId('comment'), author: currentUser?.name || 'User', createdAt: new Date().toISOString(), text: comment.trim() };
    if (await contribute({ comments: [...(selected.comments || []), added] }, 'Comment added.')) setComment('');
  }
  async function addReference(event) {
    event.preventDefault();
    const url = safeUrl(reference.url.trim());
    if (!url) { setError('Enter a valid http:// or https:// reference URL.'); return; }
    if (await contribute({ references: [...(selected.references || []), { id: newId('reference'), title: reference.title.trim() || url, url }] }, 'Reference added.')) setReference({ title: '', url: '' });
  }
  async function addAttachments(event) {
    const files = Array.from(event.target.files || []); event.target.value = '';
    if (!selected || !writable || !canContribute(selected, currentUser) || !files.length) return;
    if (files.some(file => file.size > 2 * 1024 * 1024) || (selected.attachments || []).length + files.length > 5) { setError('Attach up to 5 files per objective, with a maximum size of 2 MB per file.'); return; }
    setSaving(true); setError('');
    try {
      const attachments = await Promise.all(files.map(readAttachment));
      await contribute({ attachments: [...(selected.attachments || []), ...attachments] }, 'Evidence attached to this objective.');
    } catch { setError('Could not read the selected files.'); } finally { setSaving(false); }
  }
  async function deleteObjective() {
    if (!sourceToDelete || !writable || !canEdit(sourceToDelete, currentUser)) return;
    if (objectives.some(o => o.parentId === deleteId)) { setError('Unlink child objectives in Module 4 before deleting this objective.'); return; }
    if (await persist(objectives.filter(o => o.id !== deleteId), 'Objective deleted.')) { setDeleteId(null); setSelectedId(null); }
  }

  return (
    <ThemeProvider theme={theme}><CssBaseline />
      <Box sx={{ minHeight: '100%', bgcolor: 'background.default', color: 'text.primary', p: { xs: 2, md: 3 }, minWidth: 0 }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 2.5 }}>
            <Box>
              <Typography component="h1" sx={{ fontSize: { xs: 22, md: 25 }, fontWeight: 700, letterSpacing: '-0.04em' }}>Objectives & Key Results</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Manage goals and track measurable results.</Typography>
            </Box>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
              <Tooltip title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>
                <IconButton size="small" aria-label="Toggle color theme" onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>{mode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}</IconButton>
              </Tooltip>
              {writable && isLeader(currentUser) && <Button variant="contained" disableElevation startIcon={<Add />} onClick={() => openForm()}>New objective</Button>}
            </Stack>
          </Stack>
          {!controlled && <Alert severity="info" sx={{ mb: 2 }}>Demo data. Changes remain in this page until it is unmounted or refreshed.</Alert>}

          <Paper variant="outlined" sx={{ borderRadius: '12px', mb: 2.5, display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, overflow: 'hidden' }}>
            {[
              { label: 'Objectives', value: cycleObjectives.length },
              { label: 'Key Results', value: cycleObjectives.reduce((sum, o) => sum + o.keyResults.length, 0) },
              { label: 'Average progress', value: `${cycleObjectives.length ? Math.round(cycleObjectives.reduce((sum, o) => sum + o.progress, 0) / cycleObjectives.length) : 0}%` },
              { label: 'Completed', value: cycleObjectives.filter(o => o.progress === 100).length },
            ].map((metric, index) => <Stack key={metric.label} direction="row" sx={{ alignItems: 'baseline', gap: 1.25, px: 2.5, py: 1.75, borderLeft: index ? '1px solid' : 0, borderColor: 'divider' }}>
              <Typography sx={{ fontSize: 23, fontWeight: 700, letterSpacing: '-0.04em' }}>{metric.value}</Typography>
              <Typography variant="caption" color="text.secondary">{metric.label}</Typography>
            </Stack>)}
          </Paper>

          <Stack direction={{ xs: 'column', md: 'row' }} sx={{ gap: 1.5, mb: 2 }}>
            <TextField size="small" label="Search goals or owners" value={query} onChange={e => setQuery(e.target.value)} sx={{ flex: 1 }}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> } }} />
            <TextField select size="small" label="OKR cycle" value={cycleId} sx={{ minWidth: 150 }} onChange={e => setCycleId(e.target.value)}>
              {cycles.length === 0 && <MenuItem value="">No cycles</MenuItem>}{cycles.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </TextField>
            <TextField select size="small" label="Status" value={status} onChange={e => setStatus(e.target.value)} sx={{ minWidth: 150 }}>
              <MenuItem value="all">All statuses</MenuItem>{[...STATUSES, 'Completed'].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Stack>

          <Paper variant="outlined" sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>All objectives <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400, ml: 0.75 }}>({filtered.length})</Box></Typography>
              <Typography variant="caption" color="text.secondary">{cycles.find(c => c.id === cycleId)?.name || 'No cycle selected'}</Typography>
            </Stack>
            <Stack divider={<Divider />}>
              {filtered.map(objective => <Box component="article" key={objective.id} sx={{ px: { xs: 2, md: 2.5 }, py: 2, '&:hover': { bgcolor: 'action.hover' } }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 150px 140px' }, gap: { xs: 1.5, md: 3 }, alignItems: 'center' }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Box sx={{ width: 6, height: 6, flexShrink: 0, borderRadius: '50%', bgcolor: objective.level === 'Company' ? 'primary.main' : objective.level === 'Team' ? 'secondary.main' : '#DFA86B' }} />
                      <Typography variant="caption" color="text.secondary">{objective.level} · {objective.department}</Typography>
                    </Stack>
                    <Typography component="h2" sx={{ fontWeight: 600, fontSize: 15, lineHeight: 1.5, overflowWrap: 'anywhere' }}>{objective.title}</Typography>
                    <Stack direction="row" sx={{ alignItems: 'center', gap: 1, flexWrap: 'wrap', mt: 0.75 }}>
                      <Typography variant="caption" color="text.secondary">{objective.ownerName}</Typography>
                      <Box component="span" sx={{ color: 'text.disabled', fontSize: 11 }}>·</Box>
                      <Button size="small" endIcon={expandedIds.has(objective.id) ? <ExpandLess /> : <ExpandMore />} sx={{ p: 0, minWidth: 0, fontSize: 12, color: 'text.secondary', '& .MuiButton-endIcon': { ml: 0.25 } }} aria-expanded={expandedIds.has(objective.id)}
                        onClick={() => setExpandedIds(previous => { const next = new Set(previous); if (next.has(objective.id)) next.delete(objective.id); else next.add(objective.id); return next; })}>
                        {objective.keyResults.length} Key Results
                      </Button>
                    </Stack>
                  </Box>
                  <Box>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">Progress</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{objective.progress}%</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={objective.progress} aria-label={`${objective.title} progress`} sx={{ height: 4, borderRadius: 2 }} />
                  </Box>
                  <Stack direction={{ xs: 'row', md: 'column' }} sx={{ alignItems: { xs: 'center', md: 'flex-end' }, justifyContent: 'space-between', gap: 0.75 }}>
                    <Chip label={objective.status} color={STATUS_COLORS[objective.status] || 'default'} size="small" variant="outlined" sx={{ height: 23, fontSize: 11 }} />
                    <Button size="small" onClick={() => selectObjective(objective)} sx={{ minWidth: 0, px: 0.5, fontSize: 12 }}>View details</Button>
                  </Stack>
                </Box>
                <Collapse in={expandedIds.has(objective.id)}>
                  <Stack divider={<Divider />} sx={{ mt: 1.75, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: '8px', bgcolor: 'background.default' }}>
                    {objective.keyResults.map(kr => <Box key={kr.id} sx={{ py: 1, '&:first-of-type': { pt: 0 }, '&:last-of-type': { pb: 0 } }}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{kr.title}</Typography>
                        <Typography variant="caption" color="text.secondary">{krSummary(kr)} · Weight {kr.weight}%</Typography>
                      </Stack>
                      <LinearProgress variant="determinate" value={krProgress(kr)} sx={{ mt: 1, height: 3, borderRadius: 2 }} />
                    </Box>)}
                  </Stack>
                </Collapse>
              </Box>)}
            </Stack>
            {filtered.length === 0 && <Box sx={{ textAlign: 'center', py: 7, px: 2 }}>
              <TrackChanges sx={{ fontSize: 32, color: 'text.secondary' }} />
              <Typography sx={{ fontWeight: 600, mt: 1 }}>No objectives found</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Try another cycle or clear your filters.</Typography>
            </Box>}
          </Paper>
        </Box>
      </Box>


      <Drawer anchor="right" open={Boolean(selected)} onClose={() => { if (!saving) setSelectedId(null); }} slotProps={{ paper: { sx: { width: { xs: '100%', sm: 580 }, p: 3 } } }}>
        {selected && <Stack spacing={2.5}>
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}><Typography variant="h6" sx={{ fontWeight: 700 }}>Objective details</Typography><IconButton aria-label="Close objective details" disabled={saving} onClick={() => setSelectedId(null)}><Close /></IconButton></Stack>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{selected.title}</Typography>
          <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}><Chip label={selected.level} size="small" variant="outlined" /><Chip label={selected.status} color={STATUS_COLORS[selected.status] || 'default'} size="small" /></Stack>
          <Typography variant="body2" color="text.secondary">{selected.description || 'No description provided.'}</Typography>
          <Typography variant="body2">{selected.ownerName} · {selected.department}</Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>Weighted objective progress: {selected.progress}%</Typography>
          <LinearProgress variant="determinate" value={selected.progress} sx={{ height: 6, borderRadius: 3 }} />
          {error && !form && !progressForm && !deleteId && <Alert severity="error">{error}</Alert>}
          <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
            {writable && selected.keyResults.some(kr => canUpdateKR(selected, kr, currentUser)) && <Button disabled={saving} variant="contained" onClick={() => { setError(''); setProgressForm(clone(selected)); }}>Update progress</Button>}
            {writable && canEdit(selected, currentUser) && <><Button disabled={saving} startIcon={<EditOutlined />} variant="outlined" onClick={() => openForm(selected)}>Edit</Button><Button disabled={saving} color="error" startIcon={<DeleteOutline />} onClick={() => { setError(''); setDeleteId(selected.id); }}>Delete</Button></>}
          </Stack>
          <Divider /><Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Key Results</Typography>
          {selected.keyResults.map(kr => <Paper variant="outlined" key={kr.id} sx={{ p: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{kr.title}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", my: 1 }}>{kr.metricType} · {krSummary(kr)} · Weight {kr.weight}%</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>Owner: {users.find(u => String(u.id) === String(kr.ownerId))?.name || selected.ownerName}</Typography>
            <LinearProgress variant="determinate" value={krProgress(kr)} /><Typography variant="caption">{Math.round(krProgress(kr))}% complete</Typography>
          </Paper>)}
          <Divider /><Typography sx={{ fontWeight: 700 }}>Notes</Typography>
          <TextField multiline minRows={3} label="Objective notes" value={note} onChange={e => setNote(e.target.value)} disabled={saving || !writable || !canContribute(selected, currentUser)} />
          {writable && canContribute(selected, currentUser) && <Button disabled={saving || note === (selected.notes || '')} onClick={() => contribute({ notes: note }, 'Notes saved.')}>Save notes</Button>}
          <Divider /><Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}><Typography sx={{ fontWeight: 700 }}>Evidence</Typography>
            {writable && canContribute(selected, currentUser) && <Button component="label" startIcon={<AttachFile />} size="small" disabled={saving}>Attach files<input hidden type="file" multiple onChange={addAttachments} /></Button>}
          </Stack>
          <Typography variant="caption" color="text.secondary">Up to 5 files, 2 MB each. Files remain in the current page data until you connect storage.</Typography>
          {(selected.attachments || []).map(file => <Stack key={file.id} direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            {file.dataUrl?.startsWith('data:') ? <Button component="a" href={file.dataUrl} download={file.name} startIcon={<AttachFile />} sx={{ justifyContent: 'flex-start', overflowWrap: 'anywhere' }}>{file.name}</Button> : <Typography variant="body2">{file.name}</Typography>}
            {writable && canContribute(selected, currentUser) && <IconButton aria-label={`Remove attachment ${file.name}`} disabled={saving} onClick={() => contribute({ attachments: selected.attachments.filter(f => f.id !== file.id) }, 'Attachment removed from objective.')}><Close fontSize="small" /></IconButton>}
          </Stack>)}
          <Divider /><Typography sx={{ fontWeight: 700 }}>Reference links</Typography>
          {(selected.references || []).map(ref => <Stack key={ref.id} direction="row" sx={{ alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            {safeUrl(ref.url) ? <Button component="a" href={safeUrl(ref.url)} target="_blank" rel="noopener noreferrer" startIcon={<LinkIcon />} sx={{ justifyContent: 'flex-start', overflowWrap: 'anywhere' }}>{ref.title}</Button> : <Typography>{ref.title}</Typography>}
            {writable && canContribute(selected, currentUser) && <IconButton aria-label={`Remove reference ${ref.title}`} disabled={saving} onClick={() => contribute({ references: selected.references.filter(r => r.id !== ref.id) }, 'Reference removed.')}><Close fontSize="small" /></IconButton>}
          </Stack>)}
          {writable && canContribute(selected, currentUser) && <Stack component="form" onSubmit={addReference} sx={{ gap: 1.5 }}>
            <TextField label="Reference title" size="small" value={reference.title} onChange={e => setReference({ ...reference, title: e.target.value })} disabled={saving} />
            <TextField label="Reference URL" placeholder="https://…" size="small" required value={reference.url} onChange={e => setReference({ ...reference, url: e.target.value })} disabled={saving} />
            <Button type="submit" disabled={saving || !reference.url.trim()} startIcon={<Add />}>Add reference</Button>
          </Stack>}
          <Divider /><Typography sx={{ fontWeight: 700 }}>Comments</Typography>
          {(selected.comments || []).map(item => <Paper key={item.id} variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" sx={{ gap: 1, alignItems: "center", mb: 1 }}><Avatar sx={{ width: 28, height: 28, fontSize: 12 }}>{item.author?.charAt(0) || '?'}</Avatar><Typography variant="caption" sx={{ fontWeight: 700 }}>{item.author}</Typography></Stack>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{item.text}</Typography><Typography variant="caption" color="text.secondary">{new Date(item.createdAt).toLocaleString()}</Typography>
          </Paper>)}
          {writable && canContribute(selected, currentUser) && <Stack component="form" onSubmit={postComment} sx={{ gap: 1 }}>
            <TextField label="Add a comment" multiline minRows={2} value={comment} onChange={e => setComment(e.target.value)} disabled={saving} /><Button type="submit" startIcon={<Send />} disabled={saving || !comment.trim()}>Post comment</Button>
          </Stack>}
          <Typography variant="caption" color="text.secondary">Connect this objective to its parent in Module 4.</Typography>
        </Stack>}
      </Drawer>

      <Dialog open={Boolean(form)} onClose={() => { if (!saving) setForm(null); }} fullWidth maxWidth="md">
        <Box component="form" onSubmit={saveObjective}>
          <DialogTitle>{objectives.some(o => o.id === form?.id) ? 'Edit objective' : 'New objective'}</DialogTitle>
          <DialogContent dividers sx={{ maxHeight: '75vh' }}>{form && <Stack sx={{ gap: 2.5, pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Objective title" required value={form.title} disabled={saving} onChange={e => setForm({ ...form, title: e.target.value })} />
            <TextField label="Description" multiline minRows={2} value={form.description} disabled={saving} onChange={e => setForm({ ...form, description: e.target.value })} />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField select label="Level" value={form.level} disabled={saving} onChange={e => updateDepartment(e.target.value === 'Company' ? 'Company' : (formDepartments[0] || ''), e.target.value)}>
                {(isAdmin ? ['Company', 'Team', 'Individual'] : ['Team', 'Individual']).map(level => <MenuItem key={level} value={level}>{level}</MenuItem>)}
              </TextField>
              <TextField select label="Cycle" value={form.cycleId} disabled={saving} onChange={e => setForm({ ...form, cycleId: e.target.value })}>{cycles.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}</TextField>
              <TextField select label="Department" value={form.department} disabled={saving || form.level === 'Company'} onChange={e => updateDepartment(e.target.value)}>
                {(form.level === 'Company' ? ['Company'] : formDepartments).map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </TextField>
              <TextField select label="Objective owner" value={form.ownerId} disabled={saving} onChange={e => { const owner = users.find(u => String(u.id) === String(e.target.value)); setForm({ ...form, ownerId: owner.id, ownerName: owner.name }); }}>
                {formUsers.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
              </TextField>
              <TextField select label="Health status" value={form.status === 'Completed' ? 'On Track' : form.status} disabled={saving} onChange={e => setForm({ ...form, status: e.target.value })} helperText="Completed is calculated automatically at 100% progress.">
                {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Box>
            <Divider /><Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}><Typography variant="h6" sx={{ fontWeight: 700 }}>Key Results</Typography><Button startIcon={<Add />} disabled={saving} onClick={() => setForm({ ...form, keyResults: [...form.keyResults, { ...blankKR(form.ownerId), weight: 0 }] })}>Add KR</Button></Stack>
            <Alert severity={Math.abs(totalWeight - 100) <= 0.001 ? 'success' : 'warning'}>Total KR weight: {totalWeight}%. Weights must total 100%.</Alert>
            {form.keyResults.map((kr, index) => <Paper key={kr.id} variant="outlined" sx={{ p: 2 }}><Stack sx={{ gap: 2 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}><Typography sx={{ fontWeight: 700 }}>KR {index + 1}</Typography><IconButton aria-label={`Remove KR ${index + 1}`} disabled={saving || form.keyResults.length <= 1} onClick={() => setForm({ ...form, keyResults: form.keyResults.filter(k => k.id !== kr.id) })}><DeleteOutline /></IconButton></Stack>
              <TextField required label="Key Result title" size="small" value={kr.title} disabled={saving} onChange={e => updateKR(kr.id, { title: e.target.value })} />
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <TextField select label="Target type" size="small" value={kr.metricType} disabled={saving} onChange={e => updateKR(kr.id, { metricType: e.target.value, startValue: 0, targetValue: e.target.value === 'BOOLEAN' ? 1 : 100, currentValue: 0,
                  milestones: e.target.value === 'MILESTONE' ? (kr.milestones?.length ? kr.milestones : [{ id: newId('milestone'), title: '', completed: false }]) : [] })}>
                  {TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                </TextField>
                <TextField select label="KR owner" size="small" value={kr.ownerId ?? form.ownerId} disabled={saving} onChange={e => updateKR(kr.id, { ownerId: e.target.value })}>{formUsers.map(user => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}</TextField>
                <TextField required type="number" label="Weight (%)" size="small" value={kr.weight} disabled={saving} slotProps={{ htmlInput: { min: 0, max: 100, step: 'any' } }} onChange={e => updateKR(kr.id, { weight: e.target.value })} />
                {!['BOOLEAN', 'MILESTONE'].includes(kr.metricType) && <>
                  <TextField required type="number" label="Start value" size="small" value={kr.startValue} disabled={saving} slotProps={{ htmlInput: { step: 'any' } }} onChange={e => updateKR(kr.id, { startValue: e.target.value })} />
                  <TextField required type="number" label="Target value" size="small" value={kr.targetValue} disabled={saving} slotProps={{ htmlInput: { step: 'any' } }} onChange={e => updateKR(kr.id, { targetValue: e.target.value })} />
                  <TextField required type="number" label="Current value" size="small" value={kr.currentValue} disabled={saving} slotProps={{ htmlInput: { step: 'any' } }} onChange={e => updateKR(kr.id, { currentValue: e.target.value })} />
                </>}
              </Box>
              {kr.metricType === 'BOOLEAN' && <Typography variant="body2" color="text.secondary">This KR uses Not achieved / Achieved. Set its completion using Update progress.</Typography>}
              {kr.metricType === 'MILESTONE' && <Stack spacing={1}>{(kr.milestones || []).map((milestone, mi) => <Stack direction="row" spacing={1} key={milestone.id}>
                <TextField fullWidth required label={`Milestone ${mi + 1}`} size="small" value={milestone.title} disabled={saving} onChange={e => updateKR(kr.id, { milestones: kr.milestones.map(m => m.id === milestone.id ? { ...m, title: e.target.value } : m) })} />
                <IconButton aria-label={`Remove milestone ${mi + 1}`} disabled={saving || kr.milestones.length <= 1} onClick={() => updateKR(kr.id, { milestones: kr.milestones.filter(m => m.id !== milestone.id) })}><Close /></IconButton>
              </Stack>)}<Button size="small" startIcon={<Add />} disabled={saving} onClick={() => updateKR(kr.id, { milestones: [...(kr.milestones || []), { id: newId('milestone'), title: '', completed: false }] })}>Add milestone</Button></Stack>}
            </Stack></Paper>)}
          </Stack>}</DialogContent>
          <DialogActions sx={{ p: 2 }}><Button disabled={saving} onClick={() => setForm(null)}>Cancel</Button><Button type="submit" variant="contained" disabled={saving}>{saving ? 'Saving…' : 'Save objective'}</Button></DialogActions>
        </Box>
      </Dialog>

      <Dialog open={Boolean(progressForm)} onClose={() => { if (!saving) setProgressForm(null); }} fullWidth maxWidth="sm">
        <DialogTitle>Update KR progress</DialogTitle><DialogContent dividers><Stack sx={{ gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <Alert severity="info">Objective progress is the weighted average of its KRs. Decreasing targets and milestone completion are supported.</Alert>
          {progressForm?.keyResults.map(kr => {
            const original = objectives.find(o => o.id === progressForm.id);
            const disabled = saving || !original || !canUpdateKR(original, kr, currentUser);
            const change = patch => setProgressForm(previous => ({ ...previous, keyResults: previous.keyResults.map(k => k.id === kr.id ? { ...k, ...patch } : k) }));
            return <Paper key={kr.id} variant="outlined" sx={{ p: 2 }}><Typography sx={{ fontWeight: 700, mb: 1 }}>{kr.title}</Typography>
              {kr.metricType === 'BOOLEAN' ? <FormControlLabel label="Achieved" control={<Checkbox checked={Number(kr.currentValue) === 1} disabled={disabled} onChange={e => change({ currentValue: e.target.checked ? 1 : 0 })} />} /> :
                kr.metricType === 'MILESTONE' ? <Stack>{kr.milestones.map(m => <FormControlLabel key={m.id} label={m.title} control={<Checkbox checked={m.completed} disabled={disabled} onChange={e => change({ milestones: kr.milestones.map(item => item.id === m.id ? { ...item, completed: e.target.checked } : item) })} />} />)}</Stack> :
                  <TextField fullWidth label="Current value" type="number" size="small" value={kr.currentValue} disabled={disabled} onChange={e => change({ currentValue: e.target.value })} slotProps={{ htmlInput: { step: 'any' } }} helperText={`Start ${kr.startValue} · Target ${kr.targetValue}`} />}
              <Typography variant="caption" color="text.secondary">{Math.round(krProgress(kr))}% complete · Weight {kr.weight}%{disabled && !saving ? ' · View only' : ''}</Typography>
            </Paper>;
          })}
          <Typography sx={{ fontWeight: 700 }}>New objective progress: {objectiveProgress(progressForm?.keyResults)}%</Typography>
        </Stack></DialogContent><DialogActions sx={{ p: 2 }}><Button disabled={saving} onClick={() => setProgressForm(null)}>Cancel</Button><Button variant="contained" disabled={saving} onClick={saveProgress}>{saving ? 'Saving…' : 'Save progress'}</Button></DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteId)} onClose={() => { if (!saving) setDeleteId(null); }} fullWidth maxWidth="xs"><DialogTitle>Delete objective?</DialogTitle><DialogContent>
        <Typography variant="body2">Delete “{sourceToDelete?.title}” and its Key Results from the current dataset?</Typography>{error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </DialogContent><DialogActions><Button disabled={saving} onClick={() => setDeleteId(null)}>Cancel</Button><Button color="error" disabled={saving} onClick={deleteObjective}>Delete objective</Button></DialogActions></Dialog>
      <Snackbar open={Boolean(notice)} autoHideDuration={5000} onClose={() => setNotice(null)}><Alert variant="filled" severity={notice?.severity || 'success'} onClose={() => setNotice(null)}>{notice?.text}</Alert></Snackbar>
    </ThemeProvider>
  );
}
