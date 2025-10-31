import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Chip,
  Stack
} from '@mui/material'
import {
  Search as SearchIcon,
  SmartToy as SmartToyIcon,
  FilterList as FilterListIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material'

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography 
          variant="h1" 
          component="h1" 
          gutterBottom
          sx={{
            color: 'primary.main',
            mb: 2
          }}
        >
          AI Investor Prospecting Engine
        </Typography>
        
        <Typography 
          variant="h5" 
          color="text.secondary" 
          gutterBottom
          sx={{ mb: 4 }}
        >
          Discover, verify, and prioritize prospective investors using multi-source data and AI
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" gap={1}>
          <Chip label="Next.js 15" color="primary" />
          <Chip label="React 19" color="primary" />
          <Chip label="Material UI" color="primary" variant="outlined" />
          <Chip label="MongoDB" color="primary" variant="outlined" />
          <Chip label="OpenAI" color="primary" variant="outlined" />
        </Stack>
      </Box>

      <Grid container spacing={4} mb={6}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <SearchIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Multi-Source Collection
              </Typography>
              <Typography color="text.secondary">
                Public lists, firm pages, and CSV uploads — no expensive APIs
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <SmartToyIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                AI Verification
              </Typography>
              <Typography color="text.secondary">
                Intelligent data validation, scoring, and human-in-the-loop quality checks
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <FilterListIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Smart Filtering
              </Typography>
              <Typography color="text.secondary">
                Real-time filtering by sector, geography, verification status, and fit score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box textAlign="center" mb={6}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          justifyContent="center"
        >
          <Button 
            variant="contained" 
            size="large"
            endIcon={<ArrowForwardIcon />}
            href="/dashboard"
          >
            View Live Demo
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            href="/login"
          >
            Login (Coming Soon)
          </Button>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          ✨ Demo POC with 30 real NYC/tri-state investors • Full filtering & search • Interactive UI
        </Typography>
      </Box>

      <Card sx={{ bgcolor: 'background.default', textAlign: 'center' }}>
        <CardContent sx={{ py: 4 }}>
          <Typography variant="h6" gutterBottom>
            Development Environment
          </Typography>
          <Typography color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
            Next.js 15.5 • React 19 • Material UI • MongoDB • OpenAI
          </Typography>
        </CardContent>
      </Card>
    </Container>
  )
}
