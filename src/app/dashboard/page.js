import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  List,
  ListItem,
  ListItemText,
  Alert,
  Stack
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Star as StarIcon,
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
  Construction as ConstructionIcon
} from '@mui/icons-material'

export default function DashboardPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box mb={4}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            Dashboard
          </Typography>
        </Stack>
        <Typography variant="h6" color="text.secondary">
          Investor prospect management dashboard
        </Typography>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <DashboardIcon color="primary" />
                <Typography variant="h6" component="h2">
                  Prospects
                </Typography>
              </Stack>
              <Typography color="text.secondary" gutterBottom>
                View and manage investor prospects
              </Typography>
              <Typography 
                variant="h2" 
                color="primary.main" 
                sx={{ my: 2, fontWeight: 'bold' }}
              >
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Prospects
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <StarIcon color="primary" />
                <Typography variant="h6" component="h2">
                  Avg Score
                </Typography>
              </Stack>
              <Typography color="text.secondary" gutterBottom>
                Average fit score across all prospects
              </Typography>
              <Typography 
                variant="h2" 
                color="primary.main" 
                sx={{ my: 2, fontWeight: 'bold' }}
              >
                --
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fit Score (0-100)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <EmailIcon color="primary" />
                <Typography variant="h6" component="h2">
                  Outreach
                </Typography>
              </Stack>
              <Typography color="text.secondary" gutterBottom>
                Email campaigns sent this month
              </Typography>
              <Typography 
                variant="h2" 
                color="primary.main" 
                sx={{ my: 2, fontWeight: 'bold' }}
              >
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Emails Sent
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <ConstructionIcon color="warning" />
            <Typography variant="h5">
              Development Status
            </Typography>
          </Stack>

          <Alert severity="info" sx={{ mb: 3 }}>
            The dashboard is currently under development. Full functionality will be available after completing the infrastructure setup.
          </Alert>

          <Typography variant="h6" gutterBottom>
            Implementation Checklist:
          </Typography>
          
          <List>
            <ListItem>
              <ListItemText 
                primary="Database setup (MongoDB Atlas)" 
                secondary="Configure collections, indexes, and connection"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="API integrations (Crunchbase, OpenAI)" 
                secondary="Set up API clients and authentication"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Authentication system (NextAuth.js)" 
                secondary="Implement passwordless magic link login"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Data pipeline and cron jobs" 
                secondary="Automated weekly data refresh and enrichment"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="UI components and filtering" 
                secondary="Build prospect table, filters, and detail views"
              />
            </ListItem>
          </List>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Current Phase: Week 1 - Infrastructure Setup
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box mt={4} textAlign="center">
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          href="/"
          size="large"
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  )
}
