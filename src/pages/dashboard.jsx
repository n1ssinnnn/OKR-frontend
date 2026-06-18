import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  LinearProgress,
  IconButton,
  Badge,
} from '@mui/material';
import {
  Search,
  Notifications,
  BarChart,
  ShoppingCart,
  LocalMall,
  People,
  Settings,
  SpaceDashboard,
  Assessment,
  Message,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  BarChart as ReBarChart,
  Bar,
} from 'recharts';

// Precise Color Palette for the Premium Aesthetic
const colors = {
  bgMain: '#0F1115',
  bgCard: '#1A1D24',
  bgInner: '#22252E', // Flatter inner card background
  border: '#2A2D3A',
  textMain: '#FFFFFF',
  textMuted: '#8B92A5',
  
  // Premium Muted Accents
  teal: '#4ECDC4',
  orange: '#FFB86C',
  purple: '#A389F4',
  red: '#f9bee4',
  green: '#50E3C2',
};

// Data mapping for charts
const visitorInsightsData = [
  { name: 'Jan', volume: 200 },
  { name: 'Feb', volume: 150 },
  { name: 'Mar', volume: 420 },
  { name: 'Apr', volume: 300 },
  { name: 'May', volume: 510 },
  { name: 'Jun', volume: 460 },
  { name: 'Jul', volume: 380 },
  { name: 'Aug', volume: 490 },
  { name: 'Sep', volume: 440 },
  { name: 'Oct', volume: 390 },
  { name: 'Nov', volume: 520 },
  { name: 'Dec', volume: 400 },
];

const customerFulfillmentData = [
  { name: 'Jan', thisMonth: 310, lastMonth: 220 },
  { name: 'Feb', thisMonth: 240, lastMonth: 190 },
  { name: 'Mar', thisMonth: 410, lastMonth: 290 },
  { name: 'Apr', thisMonth: 330, lastMonth: 230 },
  { name: 'May', thisMonth: 490, lastMonth: 310 },
  { name: 'Jun', thisMonth: 430, lastMonth: 330 },
];

const levelBarData = [
  { name: '1', volume: 60 },
  { name: '2', volume: 80 },
  { name: '3', volume: 45 },
  { name: '4', volume: 35 },
  { name: '5', volume: 95 },
];

export default function Dashboard() {
  return (
    <Box
      sx={{
        display: 'flex',
        bgcolor: colors.bgMain,
        minHeight: '100vh',
        width: '100vw',
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        color: colors.textMain,
      }}
    >
      {/* LEFT SIDEBAR PANEL */}
      <Box
        sx={{
          width: 88,
          bgcolor: colors.bgMain,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 3.5,
          borderRight: `1px solid ${colors.border}`,
        }}
      >
        <Avatar
          sx={{
            bgcolor: colors.orange,
            color: '#000',
            width: 46,
            height: 46,
            mb: 5.5,
            fontWeight: 800,
            fontSize: '1.25rem',
          }}
        >
          S
        </Avatar>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3.5,
            flexGrow: 1,
            alignItems: 'center',
          }}
        >
          <IconButton
            sx={{
              color: colors.teal,
              bgcolor: 'rgba(78, 205, 196, 0.15)',
              borderRadius: 3,
              '&:hover': { bgcolor: 'rgba(78, 205, 196, 0.25)' },
            }}
          >
            <SpaceDashboard sx={{ fontSize: 26 }} />
          </IconButton>

          {[People, Assessment, ShoppingCart, Message, Settings].map(
            (Icon, idx) => (
              <IconButton
                key={idx}
                sx={{
                  color: colors.textMuted,
                  borderRadius: 3,
                  '&:hover': {
                    color: colors.teal,
                    bgcolor: 'rgba(78, 205, 196, 0.1)',
                  },
                }}
              >
                <Icon sx={{ fontSize: 26 }} />
              </IconButton>
            ),
          )}
        </Box>
      </Box>

      {/* DASHBOARD CONTENT BODY */}
      <Box
        sx={{
          flexGrow: 1,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          overflowX: 'hidden',
        }}
      >
        {/* TOP HEADER */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.03em',
                mb: 0.5,
              }}
            >
              Dashboard
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: colors.textMuted }}
            >
              Executive command center
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            <TextField
              placeholder="Search here..."
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: colors.textMuted, fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: 320,
                '& .MuiOutlinedInput-root': {
                  bgcolor: colors.bgCard,
                  borderRadius: 2,
                  '& fieldset': { border: 'none' },
                },
                '& input': { color: colors.textMain, fontSize: 14 },
              }}
            />

            <Badge
              badgeContent={4}
              sx={{
                '& .MuiBadge-badge': {
                  bgcolor: colors.red,
                  color: '#fff',
                  boxShadow: `0 0 0 2px ${colors.bgMain}`,
                },
              }}
            >
              <IconButton
                sx={{
                  bgcolor: colors.bgCard,
                  color: colors.textMuted,
                  borderRadius: 3,
                  p: 1.1,
                  '&:hover': { bgcolor: colors.border },
                }}
              >
                <Notifications />
              </IconButton>
            </Badge>

            <Avatar
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
              sx={{
                width: 44,
                height: 44,
              }}
            />
          </Box>
        </Box>

        {/* ROW 1: TODAY'S SALES & LEVEL */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card
              elevation={0}
              sx={{
                bgcolor: colors.bgCard,
                borderRadius: 4,
                p: 1.5,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    `radial-gradient(circle at top left, rgba(78, 205, 196, 0.08) 0, transparent 50%)`,
                  pointerEvents: 'none',
                }}
              />
              <CardContent sx={{ position: 'relative' }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: colors.textMain }}
                >
                  Today&apos;s Sales
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: colors.textMuted, mb: 3 }}
                >
                  Sales summary
                </Typography>

                <Grid container spacing={2.5}>
                  {[
                    {
                      icon: <BarChart sx={{ color: colors.orange, fontSize: 24 }} />,
                      val: '$5k',
                      label: 'Total Sales',
                      desc: '+10% from yesterday',
                      accent: colors.orange,
                    },
                    {
                      icon: <LocalMall sx={{ color: colors.teal, fontSize: 24 }} />,
                      val: '500',
                      label: 'Total Orders',
                      desc: '+8% from yesterday',
                      accent: colors.teal,
                    },
                    {
                      icon: <ShoppingCart sx={{ color: colors.red, fontSize: 24 }} />,
                      val: '9',
                      label: 'Products Sold',
                      desc: '+2% from yesterday',
                      accent: colors.red,
                    },
                    {
                      icon: <People sx={{ color: colors.green, fontSize: 24 }} />,
                      val: '12',
                      label: 'New Customers',
                      desc: '+3% from yesterday',
                      accent: colors.green,
                    },
                  ].map((card, idx) => (
                    <Grid item xs={12} sm={6} md={3} key={idx}>
                      <Box
                        sx={{
                          bgcolor: colors.bgInner,
                          p: 2.2,
                          borderRadius: 3,
                          border: `1px solid ${colors.border}`, // Flat, subtle border instead of shadow
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: 42,
                            height: 42,
                            borderRadius: 2.5,
                            bgcolor: 'rgba(255,255,255,0.03)', // Subtle icon background
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                          }}
                        >
                          {card.icon}
                        </Box>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            mb: 0.3,
                            color: colors.textMain,
                          }}
                        >
                          {card.val}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.textMuted,
                            fontWeight: 600,
                          }}
                        >
                          {card.label}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: card.accent,
                            fontWeight: 600,
                          }}
                        >
                          {card.desc}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card
              elevation={0}
              sx={{
                bgcolor: colors.bgCard,
                borderRadius: 4,
                height: '100%',
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 2, color: colors.textMain }}
                >
                  Level
                </Typography>
                <Box sx={{ height: 170, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={levelBarData}>
                      <ReTooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{
                          backgroundColor: colors.bgInner,
                          borderRadius: 8,
                          border: `1px solid ${colors.border}`,
                          color: colors.textMain,
                          fontSize: 12,
                        }}
                      />
                      <Bar
                        dataKey="volume"
                        fill={colors.teal}
                        radius={[6, 6, 0, 0]}
                        maxBarSize={18}
                      />
                    </ReBarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ROW 2: TOP PRODUCTS & CUSTOMER FULFILLMENT */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card elevation={0} sx={{ bgcolor: colors.bgCard, borderRadius: 4 }}>
              <CardContent sx={{ p: 3.5 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 3, color: colors.textMain }}
                >
                  Top Products
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {[
                    { id: '01', name: 'Home Decor Range', progress: 78, color: colors.orange },
                    { id: '02', name: 'Disney Princess Dress', progress: 62, color: colors.teal },
                    { id: '03', name: 'Bathroom Essentials', progress: 51, color: colors.purple },
                    { id: '04', name: 'Apple Smartwatch', progress: 29, color: colors.red },
                  ].map((row) => (
                    <Box
                      key={row.id}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '54px 2.2fr 3.2fr 80px',
                        alignItems: 'center',
                        borderBottom: `1px solid ${colors.border}`,
                        pb: 1.8,
                        columnGap: 1.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.textMuted,
                          fontWeight: 600,
                        }}
                      >
                        {row.id}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, color: colors.textMain }}
                      >
                        {row.name}
                      </Typography>

                      <Box sx={{ px: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={row.progress}
                          sx={{
                            height: 6,
                            borderRadius: 999,
                            bgcolor: colors.bgInner,
                            '& .MuiLinearProgress-bar': {
                              bgcolor: row.color,
                              borderRadius: 999,
                            },
                          }}
                        />
                      </Box>

                      {/* Pill-Shaped Flat Badges */}
                      <Box
                        sx={{
                          bgcolor: `${row.color}15`, // 15% opacity of the accent color
                          borderRadius: 999,
                          textAlign: 'center',
                          py: 0.4,
                          px: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: row.color,
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}
                        >
                          {row.progress}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card elevation={0} sx={{ bgcolor: colors.bgCard, borderRadius: 4 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 0.5, color: colors.textMain }}
                >
                  Customer Fulfillment
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: colors.textMuted }}
                >
                  Monthly comparison
                </Typography>

                <Box sx={{ height: 220, width: '100%', mt: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={customerFulfillmentData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorTeal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={colors.teal} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={colors.teal} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorLavender" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={colors.purple} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={colors.purple} stopOpacity={0} />
                        </linearGradient>
                      </defs>

                      <XAxis dataKey="name" stroke={colors.textMuted} fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke={colors.textMuted} fontSize={11} tickLine={false} axisLine={false} />
                      <ReTooltip
                        contentStyle={{
                          backgroundColor: colors.bgInner,
                          borderRadius: 8,
                          border: `1px solid ${colors.border}`,
                          color: colors.textMain,
                          fontSize: 12,
                        }}
                      />
                      <Area type="monotone" dataKey="thisMonth" stroke={colors.teal} strokeWidth={2.5} fillOpacity={1} fill="url(#colorTeal)" />
                      <Area type="monotone" dataKey="lastMonth" stroke={colors.purple} strokeWidth={2.5} fillOpacity={1} fill="url(#colorLavender)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ROW 3: EARNINGS GAUGE & VISITOR INSIGHTS */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Card
              elevation={0}
              sx={{
                bgcolor: colors.bgCard,
                borderRadius: 4,
                p: 1.5,
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: `radial-gradient(circle at top right, rgba(78, 205, 196, 0.1) 0, transparent 55%)`,
                  pointerEvents: 'none',
                }}
              />
              <CardContent sx={{ position: 'relative' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textMain }}>
                  Earnings
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textMuted, mb: 3 }}>
                  Total expense
                </Typography>

                <Typography variant="h3" sx={{ color: colors.textMain, mb: 0.8, fontWeight: 700 }}>
                  $6078.76
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textMuted, mb: 3.5 }}>
                  Profit is <Box component="span" sx={{ color: colors.teal, fontWeight: 600 }}>48% more</Box> than last month
                </Typography>

                {/* Gauge */}
                <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', mt: 1 }}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: 162,
                      height: 86,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}
                  >
                    {/* background arc */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 162,
                        height: 162,
                        borderRadius: '50%',
                        border: `14px solid ${colors.bgInner}`,
                      }}
                    />
                    {/* teal progress arc */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 162,
                        height: 162,
                        borderRadius: '50%',
                        border: `14px solid ${colors.teal}`,
                        borderBottomColor: 'transparent',
                        borderRightColor: 'transparent',
                        transform: 'rotate(35deg)',
                      }}
                    />
                    <Typography variant="h4" sx={{ fontWeight: 800, color: colors.textMain, mb: 1 }}>
                      80%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={8}>
            <Card elevation={0} sx={{ bgcolor: colors.bgCard, borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textMain, mb: 0.5 }}>
                  Visitor Insights
                </Typography>
                <Typography variant="body2" sx={{ color: colors.textMuted }}>
                  Traffic volume over the year
                </Typography>

                <Box sx={{ height: 230, width: '100%', mt: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={visitorInsightsData}
                      margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorInsights" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={colors.teal} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={colors.teal} stopOpacity={0} />
                        </linearGradient>
                      </defs>

                      <XAxis dataKey="name" stroke={colors.textMuted} fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke={colors.textMuted} fontSize={11} tickLine={false} axisLine={false} />
                      <ReTooltip
                        contentStyle={{
                          backgroundColor: colors.bgInner,
                          borderRadius: 8,
                          border: `1px solid ${colors.border}`,
                          color: colors.textMain,
                          fontSize: 12,
                        }}
                      />
                      <Area type="monotone" dataKey="volume" stroke={colors.teal} strokeWidth={2.5} fillOpacity={1} fill="url(#colorInsights)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}