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

export default function SettingsPage({ currentUser }) {
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("Dark");

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