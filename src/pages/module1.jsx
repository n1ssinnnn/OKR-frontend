import React, { useState } from 'react';
import {
  Alert, Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  Divider, MenuItem, Paper, Stack, Tab, Tabs, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import Add from '@mui/icons-material/Add';
import UploadFile from '@mui/icons-material/UploadFile';
import { alpha } from '@mui/material/styles';
import { Page, PageHeader, PanelHeading, SearchField } from '../workspace/design.jsx';

export const INITIAL_PEOPLE = [
  { id: 1, name: 'Dr. Arisara (Advisor)', email: 'arisara@school.edu', role: 'Executive', department: 'Policy Strategy', managerId: 0 },
  { id: 2, name: 'Lead Engineer', email: 'lead.eng@school.edu', role: 'Manager', department: 'Engineering Hub', managerId: 1 },
  { id: 3, name: 'Campaign Director', email: 'director@school.edu', role: 'Manager', department: 'Marketing', managerId: 1 },
  { id: 4, name: 'LMS Developer', email: 'dev.lms@school.edu', role: 'Employee', department: 'Engineering Hub', managerId: 2 },
  { id: 5, name: 'AI Media Artist', email: 'ai.artist@school.edu', role: 'Employee', department: 'Media & PR', managerId: 3 },
  { id: 6, name: 'Policy Drafter', email: 'policy@school.edu', role: 'Employee', department: 'Policy Strategy', managerId: 1 },
];

const roles = ['Admin', 'Executive', 'Manager', 'Employee'];
const emptyPerson = { firstName: '', lastName: '', email: '', role: 'Employee', department: '', managerId: '' };

function readCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  const input = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  for (let index = 0; index < input.length; index++) {
    const character = input[index];
    if (character === '"') {
      if (quoted && input[index + 1] === '"') {
        cell += '"';
        index++;
      } else {
        quoted = !quoted;
      }
    } else if (!quoted && (character === ',' || character === '\n')) {
      row.push(cell.trim());
      cell = '';
      if (character === '\n') {
        if (row.some(Boolean)) rows.push(row);
        row = [];
      }
    } else {
      cell += character;
    }
  }
  if (quoted) throw new Error('The CSV contains an unfinished quoted field.');
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function normalizePerson(person, usedEmails) {
  const name = [person.firstName.trim(), person.lastName.trim()].filter(Boolean).join(' ');
  const email = person.email.trim().toLowerCase();
  const department = person.department.trim();
  const role = roles.find(item => item.toLowerCase() === person.role.trim().toLowerCase());
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !role || !department) {
    throw new Error('Enter a name, valid email, role, and department.');
  }
  if (usedEmails.has(email)) throw new Error(email + ' already appears in the directory or import.');
  usedEmails.add(email);
  return { id: crypto.randomUUID(), name, email, department, role, managerId: person.managerId || 0 };
}

function RoleBadge({ role }) {
  return <Chip size="small" variant="outlined" color={role === 'Executive' || role === 'Admin' ? 'secondary' : role === 'Manager' ? 'info' : 'default'} label={role} />;
}

function EmployeeTable({ users, onSelect }) {
  return (
    <TableContainer>
      <Table aria-label="Employee directory" sx={{ minWidth: 590, '& th': { color: 'text.secondary', fontWeight: 650, bgcolor: 'action.hover' } }}>
        <TableHead>
          <TableRow>
            <TableCell>Employee Name</TableCell>
            <TableCell>Corporate Email</TableCell>
            <TableCell>Role Tier</TableCell>
            <TableCell>Department</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id} hover>
              <TableCell>
                <Stack direction="row" sx={{ alignItems: 'center', gap: 1.25 }}>
                  <Avatar sx={{ width: 31, height: 31, fontSize: 13, bgcolor: 'action.selected', color: 'primary.main' }}>{user.name.charAt(0)}</Avatar>
                  {onSelect ? <Button color="inherit" size="small" onClick={() => onSelect(user)}
                    sx={{ textAlign: 'left', justifyContent: 'flex-start', p: 0 }}>{user.name}</Button>
                    : <Typography variant="body2" fontWeight={650}>{user.name}</Typography>}
                </Stack>
              </TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>{user.email}</TableCell>
              <TableCell><RoleBadge role={user.role} /></TableCell>
              <TableCell>{user.department}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function ReportingChart({ users }) {
  const ids = new Set(users.map(person => String(person.id)));
  const directReports = new Map();
  for (const person of users) {
    const managerId = String(person.managerId);
    if (!directReports.has(managerId)) directReports.set(managerId, []);
    directReports.get(managerId).push(person);
  }
  const roots = users.filter(person => !ids.has(String(person.managerId)));

  function branch(person, ancestors = new Set()) {
    const id = String(person.id);
    const lineage = new Set([...ancestors, id]);
    const children = (directReports.get(id) ?? []).filter(child => !lineage.has(String(child.id)));
    const accent = ['Executive', 'Admin'].includes(person.role) ? 'secondary' : person.role === 'Manager' ? 'info' : null;
    return (
      <Box component="li" key={person.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
        <Paper variant="outlined" sx={theme => ({
          display: 'flex', alignItems: 'center', px: 1.5, py: 1, width: { xs: 188, sm: 218 }, minHeight: 90,
          borderColor: accent ? alpha(theme.palette[accent].main, 0.6) : 'divider',
        })}>
          <Stack direction="row" sx={{ gap: 1.25, alignItems: 'center', minWidth: 0 }}>
            <Avatar aria-hidden="true" sx={theme => ({
              width: 32, height: 32, fontSize: 14, fontWeight: 700, flexShrink: 0,
              bgcolor: accent ? alpha(theme.palette[accent].main, 0.16) : 'action.selected',
              color: accent ? accent + '.main' : 'text.secondary',
            })}>{person.name.charAt(0)}</Avatar>
            <Box sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
              <Typography variant="body2" fontWeight={700} lineHeight={1.25}>{person.name}</Typography>
              <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 0.65 }}>{person.department}</Typography>
              <RoleBadge role={person.role} />
            </Box>
          </Stack>
        </Paper>
        {children.length > 0 && (
          <Box component="ul" role="list" sx={{
            display: 'flex', m: 0, p: 0, position: 'relative',
            '&::before': {
              content: '""', position: 'absolute', left: '50%', top: 0, height: 14,
              borderLeft: '1px solid var(--reporting-line)',
            },
            '& > li': {
              position: 'relative', px: { xs: 1, sm: 1.5 }, pt: '28px',
              '&::before, &::after': {
                content: '""', position: 'absolute', top: 14, width: '50%', height: 14,
                borderTop: '1px solid var(--reporting-line)',
              },
              '&::before': { right: '50%' },
              '&::after': { left: '50%', borderLeft: '1px solid var(--reporting-line)' },
              '&:first-of-type::before, &:last-of-type::after': { borderTop: 0 },
            },
          }}>
            {children.map(child => branch(child, lineage))}
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Paper variant="outlined">
      <PanelHeading title="Reporting chart" description="Direct reports appear side by side beneath their manager. Scroll sideways to explore wider branches." />
      {roots.length > 0 ? (
        <Box role="region" aria-label="Reporting hierarchy" tabIndex={0}
          sx={{ overflowX: 'auto', '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: '-2px' } }}>
          <Box component="ul" role="list" sx={theme => ({
            '--reporting-line': alpha(theme.palette.text.secondary, 0.5),
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            m: 0, p: { xs: 2, sm: 3 }, gap: 3, width: 'max-content', minWidth: '100%',
          })}>
            {roots.map(root => branch(root))}
          </Box>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>No reporting relationships to display.</Typography>
      )}
    </Paper>
  );
}

export default function OKRUserManagement({ currentUser, users: suppliedUsers, onUsersChange, teamLeads = {}, onTeamLeadChange, canRemove }) {
  const [localUsers, setLocalUsers] = useState(INITIAL_PEOPLE);
  const [view, setView] = useState('directory');
  const [search, setSearch] = useState('');
  const [dialog, setDialog] = useState(null);
  const [person, setPerson] = useState(null);
  const [form, setForm] = useState(emptyPerson);
  const [imported, setImported] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  const [reading, setReading] = useState(false);
  const users = suppliedUsers ?? localUsers;
  const canManage = ['Executive', 'Admin'].includes(currentUser?.role) && (!suppliedUsers || Boolean(onUsersChange));
  const matching = users.filter(item => [item.name, item.email, item.role, item.department].join(' ').toLowerCase().includes(search.trim().toLowerCase()));
  const emails = except => new Set(users.filter(item => item.id !== except).map(item => item.email.toLowerCase()));
  const departments = [...new Set(users.map(item => item.department))].sort();

  function managerOptions() {
    const excluded = new Set(person ? [person.id] : []);
    let previousSize = -1;
    while (excluded.size !== previousSize) {
      previousSize = excluded.size;
      users.forEach(item => { if (excluded.has(item.managerId)) excluded.add(item.id); });
    }
    return users.filter(item => item.role !== 'Employee' && !excluded.has(item.id));
  }

  function open(next, selected = null) {
    setError('');
    setImported([]);
    setPerson(selected);
    setForm(selected ? { ...selected, firstName: selected.name, lastName: '', managerId: selected.managerId || '' } : emptyPerson);
    setDialog(next);
  }

  async function importFile(event) {
    const file = event.target.files?.[0];
    if (!file || reading) return;
    setReading(true);
    setError('');
    setImported([]);
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error('Choose a CSV file smaller than 2 MB.');
      const [headers = [], ...records] = readCsv(await file.text());
      const column = label => headers.findIndex(item => item.toLowerCase() === label);
      const required = ['first name', 'email', 'role', 'department'];
      if (required.some(label => column(label) < 0) || !records.length) {
        throw new Error('Include First Name, Email, Role, and Department headers with at least one row.');
      }
      const used = emails();
      setImported(records.map((row, index) => {
        const get = label => row[column(label)] || '';
        try {
          return normalizePerson({ firstName: get('first name'), lastName: get('last name'), email: get('email'),
            role: get('role'), department: get('department') }, used);
        } catch (problem) {
          throw new Error('Row ' + (index + 2) + ': ' + problem.message);
        }
      }));
    } catch (problem) {
      setError(problem.message || 'Could not read this CSV.');
    } finally {
      setReading(false);
    }
  }

  async function submit(event) {
    event.preventDefault();
    if (!canManage || saving || reading) return;
    setSaving(true);
    setError('');
    try {
      if (dialog === 'delete') {
        if (!person || String(person.id) === String(currentUser?.id) || canRemove?.(person) === false) {
          throw new Error('Reassign this person’s goals and key results before removing them.');
        }
        const next = users.filter(item => item.id !== person.id)
          .map(item => item.managerId === person.id ? { ...item, managerId: person.managerId || 0 } : item);
        if (onUsersChange) await onUsersChange(next);
        else setLocalUsers(next);
        setNotice('Person removed from the directory.');
        setDialog(null);
        return;
      }
      if (dialog === 'edit' && person) {
        const patch = normalizePerson(form, emails(person.id));
        const next = users.map(item => item.id === person.id ? { ...item, ...patch, id: person.id } : item);
        if (onUsersChange) await onUsersChange(next);
        else setLocalUsers(next);
        setNotice('Directory details updated.');
        setDialog(null);
        return;
      }
      const additions = dialog === 'import' ? imported : [normalizePerson(form, emails())];
      if (!additions.length) return;
      const used = emails();
      if (additions.some(item => used.has(item.email))) throw new Error('An email in the import now exists in the directory. Review the CSV again.');
      const next = [...users, ...additions];
      if (onUsersChange) await onUsersChange(next);
      else setLocalUsers(next);
      setNotice(additions.length === 1 ? 'Person added to the directory.' : additions.length + ' people added to the directory.');
      setDialog(null);
      setSearch('');
      setView('directory');
    } catch (problem) {
      setError(problem.message || 'Could not save the directory.');
    } finally {
      setSaving(false);
    }
  }

  function field(name) {
    return { value: form[name], onChange: event => setForm(previous => ({ ...previous, [name]: event.target.value })) };
  }

  return (
    <Page>
      <PageHeader eyebrow="Organization" title="People" description="Find teammates, see their roles, and understand reporting lines."
        actions={canManage && <>
          <Button variant="outlined" startIcon={<UploadFile />} onClick={() => open('import')}>Import CSV</Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => open('add')}>Add person</Button>
        </>} />
      <Stack spacing={2}>
        {notice && <Alert severity="success" onClose={() => setNotice('')}>{notice}</Alert>}
        <Tabs value={view} onChange={(_, next) => setView(next)} aria-label="People views" variant="scrollable" sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Directory" value="directory" />
          <Tab label="Departments" value="departments" />
          <Tab label="Reporting chart" value="chart" />
        </Tabs>
        {view === 'directory' ? (
          <Stack spacing={1.5}>
            <SearchField label="Search name, email, role, or department" value={search} onChange={setSearch} />
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
              <PanelHeading title="Employee directory" description={matching.length + ' of ' + users.length + ' people' + (canManage ? ' · Select a name to edit' : '')} />
              <EmployeeTable users={matching} onSelect={canManage ? user => open('edit', user) : undefined} />
              {!matching.length && <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>No people match your search.</Typography>}
            </Paper>
          </Stack>
        ) : view === 'departments' ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 1.5 }}>
            {departments.map(department => {
              const members = users.filter(item => item.department === department);
              const leader = members.find(item => item.id === teamLeads[department])
                ?? (teamLeads[department] == null ? members.find(item => item.role === 'Manager') : undefined);
              return <Paper key={department} variant="outlined">
                <PanelHeading title={department} description={members.length + (members.length === 1 ? ' person' : ' people')} />
                <Stack spacing={1} sx={{ p: 2 }}>
                  {canManage && onTeamLeadChange ? (
                    <TextField select size="small" label="Team leader" value={leader?.id ?? ''} onChange={event => onTeamLeadChange(department, event.target.value)}>
                      <MenuItem value="">No team leader</MenuItem>
                      {members.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                    </TextField>
                  ) : <Typography variant="body2" color="text.secondary">Team leader: {leader?.name || 'Not assigned'}</Typography>}
                  <Stack direction="row" sx={{ gap: 0.75, flexWrap: 'wrap' }}>
                    {members.map(item => <Chip key={item.id} label={item.name} size="small" variant="outlined" />)}
                  </Stack>
                </Stack>
              </Paper>;
            })}
          </Box>
        ) : <ReportingChart users={users} />}
      </Stack>

      {dialog && canManage && (
        <Dialog open fullWidth maxWidth={dialog === 'import' ? 'md' : 'sm'} onClose={saving || reading ? undefined : () => setDialog(null)}>
          <Box component="form" onSubmit={submit}>
            <DialogTitle>{({ import: 'Import people', add: 'Add person', edit: 'Edit person', delete: 'Remove ' + person?.name + '?' })[dialog]}</DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                {dialog === 'delete' ? (
                  <Typography variant="body2" color="text.secondary">Their direct reports will move to their manager. If they have no manager, their direct reports will have no manager assigned.</Typography>
                ) : dialog === 'add' || dialog === 'edit' ? <>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <TextField required fullWidth label={dialog === 'edit' ? 'Employee name' : 'First name'} {...field('firstName')} />
                    {dialog === 'add' && <TextField fullWidth label="Last name" {...field('lastName')} />}
                  </Stack>
                  <TextField required type="email" label="Corporate email" {...field('email')} />
                  <TextField select label="Role" {...field('role')}>
                    {roles.map(role => <MenuItem key={role} value={role}>{role}</MenuItem>)}
                  </TextField>
                  <TextField required label="Department" {...field('department')} />
                  <TextField select label="Reports to" {...field('managerId')}>
                    <MenuItem value="">No manager</MenuItem>
                    {managerOptions().map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                  </TextField>
                </> : <>
                  <Typography variant="body2" color="text.secondary">Use a CSV with First Name, Email, Role, and Department. Last Name is optional. From Excel, save your sheet as CSV first.</Typography>
                  <Button component="label" startIcon={<UploadFile />} variant="outlined" disabled={saving || reading} sx={{ alignSelf: 'flex-start' }}>
                    {reading ? 'Reading CSV…' : 'Choose CSV'}
                    <input hidden type="file" accept=".csv,text/csv" onChange={importFile} />
                  </Button>
                  {imported.length > 0 && <>
                    <Typography variant="body2" fontWeight={650}>{imported.length} people ready to import</Typography>
                    <EmployeeTable users={imported.slice(0, 10)} />
                    {imported.length > 10 && <Typography variant="caption" color="text.secondary">Showing the first 10 people.</Typography>}
                  </>}
                </>}
                {error && <Alert severity="error">{error}</Alert>}
              </Stack>
            </DialogContent>
            <DialogActions>
              {dialog === 'edit' && String(person?.id) !== String(currentUser?.id) && canRemove?.(person) !== false &&
                <Button color="error" onClick={() => open('delete', person)} sx={{ mr: 'auto' }}>Remove person</Button>}
              <Button onClick={() => setDialog(null)} disabled={saving || reading}>Cancel</Button>
              <Button type="submit" variant="contained" color={dialog === 'delete' ? 'error' : 'primary'} disabled={saving || reading || (dialog === 'import' && !imported.length)}>
                {saving ? 'Saving…' : ({ import: 'Import people', add: 'Add to directory', edit: 'Save changes', delete: 'Remove person' })[dialog]}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      )}
    </Page>
  );
}
