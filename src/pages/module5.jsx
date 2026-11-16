import React, { useRef, useState } from 'react';
import {
  Alert, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, FormControlLabel, InputAdornment, LinearProgress,
  MenuItem, Paper, Stack, Tab, Tabs, TextField, Typography,
} from '@mui/material';
import EventNote from '@mui/icons-material/EventNote';
import Search from '@mui/icons-material/Search';
import {
  canEdit, canUpdateKR, isOwner, krProgress, normalizeObjective,
} from './module3.jsx';

const statuses = [
  { label: 'On Track', color: 'info' },
  { label: 'At Risk', color: 'warning' },
  { label: 'Off Track', color: 'error' },
  { label: 'Completed', color: 'success' },
];
const shortDate = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
const fullDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });

function getWeek() {
  const monday = new Date();
  monday.setHours(12, 0, 0, 0);
  monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const date = [monday.getFullYear(), monday.getMonth() + 1, monday.getDate()]
    .map(part => String(part).padStart(2, '0'))
    .join('-');
  return { date, label: shortDate.format(monday) + ' – ' + shortDate.format(sunday) };
}

function canCheckIn(objective, user) {
  return canEdit(objective, user) || isOwner(objective.ownerId, user) ||
    (objective.keyResults ?? []).some(result => isOwner(result.ownerId, user));
}

function canReview(entry, objective, user) {
  return canEdit(objective ?? entry, user);
}

function describeValue(result) {
  if (result.metricType === 'BOOLEAN') {
    return Number(result.currentValue) === 1 ? 'Achieved' : 'Not achieved';
  }
  if (result.metricType === 'MILESTONE') {
    const completed = (result.milestones ?? []).filter(item => item.completed);
    return completed.length ? completed.map(item => item.title).join(', ') : 'No milestones completed';
  }
  return String(result.currentValue ?? '—') + (result.metricType === 'PERCENTAGE' ? '%' : '');
}

function statusColor(status) {
  return statuses.find(item => item.label === status)?.color ?? 'default';
}

function StatusChip({ status }) {
  return <Chip size="small" label={status} color={statusColor(status)} variant="outlined" />;
}

function ResultFields({ result, original, disabled, onChange }) {
  if (result.metricType === 'BOOLEAN') {
    return (
      <FormControlLabel
        label="Achieved"
        control={<Checkbox checked={Number(result.currentValue) === 1} disabled={disabled}
          onChange={event => onChange({ currentValue: event.target.checked ? 1 : 0 })} />}
      />
    );
  }

  if (result.metricType === 'MILESTONE') {
    return (result.milestones ?? []).map(milestone => (
      <FormControlLabel
        key={milestone.id}
        label={milestone.title}
        control={<Checkbox checked={Boolean(milestone.completed)} disabled={disabled}
          onChange={event => onChange({
            milestones: result.milestones.map(item => item.id === milestone.id
              ? { ...item, completed: event.target.checked }
              : item),
          })} />}
      />
    ));
  }

  return (
    <TextField
      label="Current value"
      size="small"
      type="number"
      value={result.currentValue ?? ''}
      disabled={disabled}
      onChange={event => onChange({ currentValue: event.target.value })}
      helperText={'Previous ' + describeValue(original) + ' · Target ' + result.targetValue +
        (result.metricType === 'PERCENTAGE' ? '%' : '')}
      slotProps={{ htmlInput: { step: 'any' } }}
    />
  );
}

function CheckInDialog({ objective, currentUser, week, onSave, onClose }) {
  const [original] = useState(objective);
  const [entryId] = useState(() => crypto.randomUUID());
  const [results, setResults] = useState(() => objective.keyResults ?? []);
  const [status, setStatus] = useState(objective.status || 'On Track');
  const [summary, setSummary] = useState('');
  const [blockers, setBlockers] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);
  const maySetStatus = canEdit(objective, currentUser) || isOwner(objective.ownerId, currentUser);
  const previous = normalizeObjective(original);
  const next = normalizeObjective({
    ...objective,
    status: maySetStatus ? status : objective.status,
    keyResults: results,
  });

  function updateResult(id, patch) {
    setResults(items => items.map(item => item.id === id ? { ...item, ...patch } : item));
  }

  async function submit(event) {
    event.preventDefault();
    if (pending.current) return;
    if (objective !== original || !canCheckIn(objective, currentUser)) {
      setError('This objective changed. Close the form and open it again to load the latest values.');
      return;
    }
    const keyResults = [];
    const changes = [];
    for (const [index, draft] of results.entries()) {
      const before = original.keyResults[index];
      if (!canUpdateKR(objective, before, currentUser)) {
        keyResults.push(before);
        continue;
      }
      let updated = draft;
      if (draft.metricType !== 'MILESTONE') {
        const value = Number(draft.currentValue);
        if (draft.currentValue == null || String(draft.currentValue).trim() === '' || !Number.isFinite(value)) {
          setError('Enter a valid current value for ' + draft.title + '.');
          return;
        }
        if (draft.metricType === 'PERCENTAGE' && (value < 0 || value > 100)) {
          setError('Enter a value from 0 to 100 for ' + draft.title + '.');
          return;
        }
        updated = { ...draft, currentValue: value };
      }
      keyResults.push(updated);
      const previousValue = describeValue(before);
      const currentValue = describeValue(updated);
      if (previousValue !== currentValue) {
        changes.push({ id: updated.id, title: updated.title, previousValue, currentValue });
      }
    }
    const updated = normalizeObjective({ ...next, keyResults });
    if (!summary.trim() && !blockers.trim() && !changes.length && updated.status === previous.status) {
      setError('Add a note or blocker, or update a result or status before saving.');
      return;
    }

    const now = new Date();
    const entry = {
      id: entryId,
      objectiveId: objective.id,
      objectiveTitle: objective.title,
      department: objective.department,
      level: objective.level,
      cycleId: objective.cycleId,
      weekStart: week.date,
      submittedAt: now.toISOString(),
      submittedBy: { id: currentUser.id, name: currentUser.name || 'OKR contributor' },
      previousProgress: previous.progress,
      previousStatus: previous.status,
      progress: updated.progress,
      status: updated.status,
      summary: summary.trim(),
      blockers: blockers.trim(),
      changes,
      feedback: [],
    };

    pending.current = true;
    setSaving(true);
    setError('');
    try {
      await onSave({ objective: updated, entry });
      onClose();
    } catch {
      setError('The check-in could not be saved. Your draft is still here. Try again.');
    } finally {
      pending.current = false;
      setSaving(false);
    }
  }

  return (
    <Dialog open fullWidth maxWidth="sm" onClose={saving ? undefined : onClose}>
      <Box component="form" onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', minHeight: 0,
        '& .MuiButton-root': { textTransform: 'none' } }}>
        <DialogTitle>Weekly check-in</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Box>
              <Typography fontWeight={700}>{objective.title}</Typography>
              <Typography variant="body2" color="text.secondary">Week of {week.label}</Typography>
            </Box>
            <Paper variant="outlined" sx={{ p: 1.5 }}>
              <Typography variant="body2" fontWeight={600}>
                Objective progress {previous.progress}% → {next.progress}%
              </Typography>
              <LinearProgress variant="determinate" value={next.progress}
                aria-label="Estimated objective progress" sx={{ mt: 1, borderRadius: 2 }} />
            </Paper>
            {results.map((result, index) => (
              <Stack key={result.id} spacing={1}>
                <Typography variant="body2" fontWeight={600}>{result.title}</Typography>
                <ResultFields result={result} original={original.keyResults[index]}
                  disabled={saving || !canUpdateKR(objective, result, currentUser)}
                  onChange={patch => updateResult(result.id, patch)} />
              </Stack>
            ))}
            <TextField select label="Status" value={next.status}
              disabled={saving || !maySetStatus || next.progress === 100}
              onChange={event => setStatus(event.target.value)}>
              {statuses.map(item => (
                <MenuItem key={item.label} value={item.label} disabled={item.label === 'Completed'}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField label="Weekly update" multiline minRows={2} value={summary} disabled={saving}
              onChange={event => setSummary(event.target.value)} placeholder="What moved forward this week?" />
            <TextField label="Blockers" multiline minRows={2} value={blockers} disabled={saving}
              onChange={event => setBlockers(event.target.value)} placeholder="What needs attention or support?" />
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={saving}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving}>{saving ? 'Saving…' : 'Save check-in'}</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

function FeedbackDialog({ entry, currentUser, onSave, onClose }) {
  const [commentId] = useState(() => crypto.randomUUID());
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const pending = useRef(false);

  async function submit(event) {
    event.preventDefault();
    if (pending.current || !message.trim()) return;
    pending.current = true;
    setSaving(true);
    setError('');
    try {
      await onSave({
        entryId: entry.id,
        feedback: {
          id: commentId,
          author: { id: currentUser.id, name: currentUser.name || 'Manager' },
          createdAt: new Date().toISOString(),
          message: message.trim(),
        },
      });
      onClose();
    } catch {
      setError('Feedback could not be saved. Try again.');
    } finally {
      pending.current = false;
      setSaving(false);
    }
  }

  return (
    <Dialog open fullWidth maxWidth="sm" onClose={saving ? undefined : onClose}>
      <Box component="form" onSubmit={submit} sx={{ display: 'flex', flexDirection: 'column', minHeight: 0,
        '& .MuiButton-root': { textTransform: 'none' } }}>
        <DialogTitle>Manager feedback</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2" color="text.secondary">{entry.objectiveTitle}</Typography>
            <TextField autoFocus label="Feedback" multiline minRows={3} value={message}
              disabled={saving} onChange={event => setMessage(event.target.value)} />
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={saving}>Cancel</Button>
          <Button variant="contained" type="submit" disabled={saving || !message.trim()}>
            {saving ? 'Saving…' : 'Save feedback'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

function HistoryEntry({ entry, onFeedback }) {
  return (
    <Box component="li" sx={{ position: 'relative', listStyle: 'none', pl: 2.5, pb: 2,
      borderLeft: '1px solid', borderColor: 'divider',
      '&::before': { content: '""', position: 'absolute', left: -4.5, top: 18, width: 8,
        height: 8, bgcolor: 'primary.main', borderRadius: '50%' } }}>
      <Paper component="article" variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2 }}>
        <Stack spacing={1.25} sx={{ overflowWrap: 'anywhere' }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
            <Typography component="h3" variant="subtitle2" fontWeight={700}>{entry.objectiveTitle}</Typography>
            <StatusChip status={entry.status} />
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {entry.submittedBy.name} · {fullDate.format(new Date(entry.submittedAt))}
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            Progress {entry.previousProgress}% → {entry.progress}%
            {entry.previousStatus !== entry.status && ' · ' + entry.previousStatus + ' → ' + entry.status}
          </Typography>
          {(entry.changes ?? []).map(change => (
            <Typography key={change.id} variant="body2" color="text.secondary">
              {change.title}: {change.previousValue} → {change.currentValue}
            </Typography>
          ))}
          {entry.summary && <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{entry.summary}</Typography>}
          {entry.blockers && <Alert severity="warning" variant="outlined" sx={{ whiteSpace: 'pre-wrap' }}>
            <strong>Blockers</strong><br />{entry.blockers}
          </Alert>}
          {(entry.feedback ?? []).map(item => (
            <Box key={item.id} sx={{ borderLeft: '2px solid', borderColor: 'primary.main', pl: 1.5, py: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                {item.author.name} · {fullDate.format(new Date(item.createdAt))}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{item.message}</Typography>
            </Box>
          ))}
          {onFeedback && <Button size="small" onClick={onFeedback} sx={{ alignSelf: 'flex-start' }}>
            Add feedback
          </Button>}
        </Stack>
      </Paper>
    </Box>
  );
}

export default function OKRCheckIns({
  currentUser, objectives = [], cycles = [], checkIns = [], onSaveCheckIn, onSaveFeedback,
}) {
  const [tab, setTab] = useState('weekly');
  const [search, setSearch] = useState('');
  const [cycle, setCycle] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const [feedbackId, setFeedbackId] = useState(null);
  const [notice, setNotice] = useState('');
  const week = getWeek();
  const query = search.trim().toLowerCase();
  const matchesCycle = item => cycle === 'all' || String(item.cycleId) === cycle;
  const scopedObjectives = objectives.filter(item => canCheckIn(item, currentUser) && matchesCycle(item));
  const displayedObjectives = scopedObjectives.filter(item =>
    (item.title + ' ' + (item.ownerName ?? '')).toLowerCase().includes(query));
  const byId = new Map(objectives.map(item => [item.id, item]));
  const visibleEntries = checkIns.filter(entry => {
    const objective = byId.get(entry.objectiveId);
    return canReview(entry, objective, currentUser) ||
      isOwner(entry.submittedBy.id, currentUser) ||
      (objective && canCheckIn(objective, currentUser));
  });
  const history = visibleEntries.filter(entry => matchesCycle(entry) &&
    (entry.objectiveTitle + ' ' + entry.submittedBy.name).toLowerCase().includes(query))
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  const checkedIn = new Set(visibleEntries
    .filter(entry => entry.weekStart === week.date)
    .map(entry => entry.objectiveId));
  const checkedInCount = scopedObjectives.filter(item => checkedIn.has(item.id)).length;
  const selected = byId.get(selectedId);
  const feedbackEntry = visibleEntries.find(entry => entry.id === feedbackId);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto',
      '& .MuiButton-root, & .MuiTab-root': { textTransform: 'none' } }}>
      <Stack spacing={2}>
        <Box>
          <Typography component="h1" sx={{ fontSize: { xs: 22, md: 25 }, fontWeight: 700, letterSpacing: '-0.04em' }}>
            Progress &amp; Check-ins
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {checkedInCount} of {scopedObjectives.length} objectives checked in · Week of {week.label}
          </Typography>
        </Box>
        {notice && <Alert severity="success" onClose={() => setNotice('')}>{notice}</Alert>}

        <Paper variant="outlined" sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, borderRadius: 2 }}>
          {statuses.map(item => (
            <Stack key={item.label} direction="row" sx={{ alignItems: 'baseline', gap: 1, px: 2, py: 1.5 }}>
              <Typography fontSize={22} fontWeight={700} color={item.color + '.main'}>
                {scopedObjectives.filter(objective => (objective.status || 'On Track') === item.label).length}
              </Typography>
              <Typography variant="caption" color="text.secondary">{item.label}</Typography>
            </Stack>
          ))}
        </Paper>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField label="Search objectives or people" size="small" value={search}
            onChange={event => setSearch(event.target.value)} sx={{ flex: 1 }}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> } }} />
          <TextField select size="small" label="OKR cycle" value={cycle} onChange={event => setCycle(event.target.value)}
            sx={{ minWidth: { sm: 180 } }}>
            <MenuItem value="all">All cycles</MenuItem>
            {cycles.map(item => <MenuItem key={item.id} value={String(item.id)}>{item.name}</MenuItem>)}
          </TextField>
        </Stack>

        <Tabs value={tab} onChange={(_, value) => setTab(value)} aria-label="Check-in views"
          sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab id="weekly-tab" aria-controls="weekly-panel" value="weekly" label="Weekly check-in" />
          <Tab id="history-tab" aria-controls="history-panel" value="history" label="History" />
        </Tabs>

        {tab === 'weekly' && (
          <Paper id="weekly-panel" role="tabpanel" aria-labelledby="weekly-tab" variant="outlined" sx={{ borderRadius: 2 }}>
            {!displayedObjectives.length && (
              <Typography color="text.secondary" sx={{ p: 3 }}>No objectives match your filters.</Typography>
            )}
            <Stack divider={<Divider />}>
              {displayedObjectives.map(item => (
                <Stack key={item.id} direction={{ xs: 'column', sm: 'row' }}
                  sx={{ px: 2, py: 1.75, gap: 1.5, alignItems: { sm: 'center' } }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography component="h2" variant="subtitle2" fontWeight={700}>{item.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {[item.ownerName, item.department, checkedIn.has(item.id) ? 'Checked in this week' : 'Due this week']
                        .filter(Boolean).join(' · ')}
                    </Typography>
                  </Box>
                  <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="body2" fontWeight={600}>{item.progress ?? 0}%</Typography>
                    <StatusChip status={item.status || 'On Track'} />
                    {onSaveCheckIn && <Button size="small" startIcon={<EventNote />}
                      onClick={() => setSelectedId(item.id)}>Check in</Button>}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Paper>
        )}

        {tab === 'history' && (
          <Box id="history-panel" role="tabpanel" aria-labelledby="history-tab">
            {history.length ? (
              <Box component="ol" sx={{ m: 0, pl: 0.75 }}>
                {history.map(entry => (
                  <HistoryEntry key={entry.id} entry={entry}
                    onFeedback={onSaveFeedback && canReview(entry, byId.get(entry.objectiveId), currentUser)
                      ? () => setFeedbackId(entry.id) : undefined} />
                ))}
              </Box>
            ) : (
              <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography color="text.secondary">No check-ins match your filters.</Typography>
              </Paper>
            )}
          </Box>
        )}
      </Stack>

      {selected && onSaveCheckIn && (
        <CheckInDialog key={selected.id} objective={selected} currentUser={currentUser} week={week}
          onClose={() => setSelectedId(null)}
          onSave={async payload => {
            await onSaveCheckIn(payload);
            setTab('history');
            setSearch('');
            setNotice('Check-in saved. Objective progress is up to date.');
          }} />
      )}
      {feedbackEntry && onSaveFeedback && canReview(feedbackEntry, byId.get(feedbackEntry.objectiveId), currentUser) && (
        <FeedbackDialog key={feedbackEntry.id} entry={feedbackEntry} currentUser={currentUser}
          onClose={() => setFeedbackId(null)}
          onSave={async payload => {
            await onSaveFeedback(payload);
            setNotice('Feedback saved.');
          }} />
      )}
    </Box>
  );
}
