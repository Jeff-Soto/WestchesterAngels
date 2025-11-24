import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Stack
} from '@mui/material'
import {
  Search as SearchIcon,
  SmartToy as SmartToyIcon,
  FilterList as FilterListIcon,
  Email as EmailIcon,
  Assessment as AssessmentIcon,
  Upload as UploadIcon,
  Timeline as TimelineIcon,
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
          sx={{ mb: 6 }}
        >
          Discover, verify, and prioritize prospective investors using multi-source data and AI
        </Typography>
      </Box>

      <Grid container spacing={3} mb={6}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                CSV Import & Normalization
              </Typography>
              <Typography color="text.secondary">
                Upload investor data from multiple sources. Automatic normalization and data enrichment with flexible column mapping
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <SmartToyIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                AI-Powered Scoring
              </Typography>
              <Typography color="text.secondary">
                Intelligent relevance scoring (0-100) based on geography, investor type, stage preferences, and contactability
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <FilterListIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Advanced Filtering
              </Typography>
              <Typography color="text.secondary">
                Filter by status, sectors, location, fit score, and more. Semantic search for natural language queries
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <EmailIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                AI Email Generation
              </Typography>
              <Typography color="text.secondary">
                Generate personalized outreach emails with AI-powered match explanations and prospect insights
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <AssessmentIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Portfolio Analysis
              </Typography>
              <Typography color="text.secondary">
                AI-powered analysis of investment patterns, sector focus, and portfolio characteristics
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <TimelineIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Activity Tracking
              </Typography>
              <Typography color="text.secondary">
                Track prospect status, contact history, and engagement timeline with visual activity logs
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
            View Dashboard
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
          ✨ Manage your investor pipeline • AI-powered insights • Advanced filtering & search
        </Typography>
      </Box>
    </Container>
  )
}
