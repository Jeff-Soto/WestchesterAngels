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
  ArrowForward as ArrowForwardIcon,
  AutoAwesome as AutoAwesomeIcon
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
          AI Investor Acquisition Agent
        </Typography>
        
        <Typography 
          variant="h5" 
          color="text.secondary" 
          gutterBottom
          sx={{ mb: 6 }}
        >
          Your intelligent AI Agent for enriching, scoring, and engaging high-value prospective investors.
        </Typography>
      </Box>

      <Grid container spacing={3} mb={6}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                CSV Intake & Enrichment Agent
              </Typography>
              <Typography color="text.secondary">
                Upload investor lists from OpenVC, AngelMatch, spreadsheets, or internal sources. AI automatically
                normalizes fields, enriches missing info, and standardizes data for high-quality analysis.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <SmartToyIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                AI Scoring & Relevance Agent
              </Typography>
              <Typography color="text.secondary">
                Intelligent fit scoring (0–100) based on geography, investor type, stage preferences, sector alignment,
                and contactability, with reasoning that explains why each investor is a strong match.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <FilterListIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                AI Search & Filtering Agent
              </Typography>
              <Typography color="text.secondary">
                Filter by status, sector, location, fit score, and more. Use semantic search to ask natural-language
                queries like “NYC fintech investors with recent activity.”
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <EmailIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                AI Outreach Agent
              </Typography>
              <Typography color="text.secondary">
                Generate personalized email and LinkedIn outreach tailored to each investor’s background, portfolio,
                and focus areas—saving hours of manual research and drafting.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <AssessmentIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                AI Portfolio Insights Agent
              </Typography>
              <Typography color="text.secondary">
                Analyze past investments to spot patterns in sectors, geographies, and deal profiles, helping refine
                your investor acquisition and dealflow strategy.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <TimelineIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Activity & Pipeline Tracking Agent
              </Typography>
              <Typography color="text.secondary">
                Track prospect status, outreach history, replies, and conversions with a visual timeline from “New”
                to “Contacted” to “Interested.”
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
            startIcon={<AutoAwesomeIcon />}
            href="/ai-solutions"
          >
            AI Solutions
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
