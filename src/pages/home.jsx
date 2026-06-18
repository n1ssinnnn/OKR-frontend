import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LayersIcon from '@mui/icons-material/Layers';
import CodeIcon from '@mui/icons-material/Code';
import CpuIcon from '@mui/icons-material/Memory';
import ShieldIcon from '@mui/icons-material/Shield';

const services = [
  { icon: <LayersIcon sx={{ color: '#f59e0b', fontSize: 32 }} />, title: 'UI/UX Design', desc: 'Crafting intuitive user experiences via design sprints, wireframing, and interactive prototypes.' },
  { icon: <CodeIcon sx={{ color: '#60a5fa', fontSize: 32 }} />, title: 'Web & App Development', desc: 'Engineering heavy-duty applications built on optimized architecture and seamless performance.' },
  { icon: <CpuIcon sx={{ color: '#c084fc', fontSize: 32 }} />, title: 'Generative AI Solutions', desc: 'Unlocking custom AI agents and machine learning architectures customized to business workflows.' },
  { icon: <ShieldIcon sx={{ color: '#34d399', fontSize: 32 }} />, title: 'Cloud & DevOps Services', desc: 'Scaling operations cleanly with continuous deployment models and strict security layers.' }
];

export default function Home() {
  return (
    <Box sx={{ bgcolor: '#0b0f19', color: '#f3f4f6', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* 1. FLOATING GLASS NAVBAR */}
      <AppBar position="fixed" sx={{ bgcolor: 'rgba(11, 15, 25, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1f2937', boxShadow: 'none' }}>
        <Toolbar sx={{ maxWidth: '1280px', width: '100%', mx: 'auto', justifyContent: 'space-between', height: 80 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff', letterSpacing: '-0.05em' }}>
            Nickel<Box component="span" sx={{ color: '#f59e0b' }}>fox</Box>
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, alignItems: 'center' }}>
            <Button sx={{ color: '#d1d5db', textTransform: 'none', '&:hover': { color: '#fff' } }}>Services</Button>
            <Button sx={{ color: '#d1d5db', textTransform: 'none', '&:hover': { color: '#fff' } }}>Success Stories</Button>
            <Button sx={{ color: '#d1d5db', textTransform: 'none', '&:hover': { color: '#fff' } }}>About</Button>
            <Button variant="contained" sx={{ bgcolor: '#f59e0b', color: '#0f172a', borderRadius: '9999px', fontWeight: 'bold', px: 3, py: 1, textTransform: 'none', '&:hover': { bgcolor: '#d97706' } }}>
              Let's Talk
            </Button>
          </Box>
          <Button sx={{ display: { xs: 'block', md: 'none' }, color: '#fff' }}><MenuIcon /></Button>
        </Toolbar>
      </AppBar>

      {/* 2. DYNAMIC TYPOGRAPHY HERO SECTION */}
      <Container maxWidth="lg" sx={{ pt: 28, pb: 16, position: 'relative' }}>
        {/* Luxury Tech Ambient Glows */}
        <Box sx={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, bgcolor: 'rgba(245, 158, 11, 0.05)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: '5%', right: '5%', width: 400, height: 400, bgcolor: 'rgba(59, 130, 246, 0.05)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />

        <Box sx={{ maxWidth: 850, zIndex: 1, position: 'relative' }}>
          <Typography variant="subtitle2" sx={{ color: '#f59e0b', fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase', mb: 2.5 }}>
            Empowering Ideas with Technology
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '4.8rem' }, fontWeight: 800, color: '#fff', lineHeight: 1.1, mb: 4, tracking: '-0.03em' }}>
            Architecting Seamless <br />
            <Box component="span" sx={{ color: '#9ca3af' }}>Digital Ecosystems.</Box>
          </Typography>
          <Typography variant="body1" sx={{ color: '#9ca3af', fontSize: '1.25rem', lineHeight: 1.6, mb: 6, maxWidth: 650 }}>
            We define the digital experience of Startups & Fortune 500 firms through robust, scalable, and beautifully customized software solutions.
          </Typography>
          <Button variant="outlined" sx={{ color: '#fff', borderColor: '#374151', borderRadius: '9999px', px: 4, py: 1.8, textTransform: 'none', fontSize: '1rem', '&:hover': { bgcolor: '#1f2937', borderColor: '#4b5563' } }}>
            Explore Our Work &nbsp; →
          </Button>
        </Box>
      </Container>

      {/* 3. BENTO SERVICES GRID */}
      <Box sx={{ bgcolor: '#080b12', py: 14, borderTop: '1px solid #1f2937' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 10 }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#fff', mb: 2, letterSpacing: '-0.02em' }}>Innovative Solutions</Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', maxWidth: 450, fontSize: '1rem', lineHeight: 1.5 }}>Our numbers and strategy speak for themselves. We deliver software built for scale.</Typography>
          </Box>

          <Grid container spacing={4}>
            {services.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ bgcolor: '#0b0f19', border: '1px solid rgba(31, 41, 55, 0.7)', borderRadius: 5, height: '100%', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', '&:hover': { borderColor: '#4b5563', transform: 'translateY(-6px)' } }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ bgcolor: '#111827', p: 2, borderRadius: 4, width: 'fit-content', mb: 4 }}>
                      {item.icon}
                    </Box>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>{item.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#9ca3af', lineHeight: 1.65, fontSize: '0.9rem' }}>{item.desc}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

    </Box>
  );
}