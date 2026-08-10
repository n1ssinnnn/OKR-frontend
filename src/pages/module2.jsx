import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  MenuItem,
  Avatar,
} from "@mui/material";

<<<<<<< HEAD
export default function SettingsPage({ currentUser }) {
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("Dark");
=======
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
    description: 'Coordinate digital outreach strategy across primary channels to achieve nationwide institutional engagement.',
    department: 'Phak Phrom Soep',
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
>>>>>>> parent of ec7c145 (A little bit change in module 1 and 2)

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Settings
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Manage your account preferences and application settings.
      </Typography>

      <Grid container spacing={3}>
        {/* Profile */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profile
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Avatar sx={{ width: 60, height: 60 }}>
                  {currentUser?.name?.charAt(0) || "U"}
                </Avatar>

                <Box>
                  <Typography fontWeight={600}>
                    {currentUser?.name || "Unknown User"}
                  </Typography>
                  <Typography color="text.secondary">
                    {currentUser?.email || "No Email"}
                  </Typography>
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Full Name"
                defaultValue={currentUser?.name}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Email"
                defaultValue={currentUser?.email}
                disabled
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preferences
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={notifications}
                    onChange={(e) =>
                      setNotifications(e.target.checked)
                    }
                  />
                }
                label="Enable Notifications"
              />

              <TextField
                select
                fullWidth
                label="Theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                sx={{ mt: 2 }}
              >
                <MenuItem value="Light">Light</MenuItem>
                <MenuItem value="Dark">Dark</MenuItem>
              </TextField>
            </CardContent>
          </Card>
        </Grid>

        {/* Security */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Button variant="contained">
                Change Password
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, textAlign: "right" }}>
            <Button variant="contained" size="large">
              Save Changes
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}