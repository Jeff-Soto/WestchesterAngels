import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Stack,
  Divider,
  IconButton,
  LinearProgress,
  Link,
  Paper,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Close as CloseIcon,
  Star as StarIcon,
  Place as PlaceIcon,
  Email as EmailIcon,
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  InfoOutlined as InfoIcon
} from '@mui/icons-material'
import { statusLabels } from '@/lib/mockData'

export default function ProspectDetailModal({ prospect, open, onClose, onStatusUpdate }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  if (!prospect) return null

  const getScoreColor = (score) => {
    if (score >= 90) return 'success'
    if (score >= 80) return 'primary'
    if (score >= 70) return 'info'
    if (score >= 60) return 'warning'
    return 'default'
  }

  // Calculate feature scores (simulated breakdown)
  const featureScores = {
    sectorMatch: Math.min(100, prospect.fitScore + Math.random() * 10 - 5),
    geoProximity: ['NY', 'NJ', 'CT'].includes(prospect.location.state) ? 100 : 60,
    stageMatch: prospect.stagePreferences.includes('Seed') || prospect.stagePreferences.includes('Series A') ? 100 : 75,
    checkSizeMatch: 95,
    recentActivity: 85
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h5" component="div">
              {prospect.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {prospect.org}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {/* Fit Score Section */}
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, bgcolor: 'background.default' }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            alignItems={{ xs: 'center', sm: 'center' }} 
            spacing={2} 
            mb={2}
          >
            <Box
              sx={{
                width: { xs: 70, sm: 80 },
                height: { xs: 70, sm: 80 },
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'primary.main',
                color: 'white',
                flexShrink: 0
              }}
            >
              <Typography variant="h3" fontWeight="bold" sx={{ fontSize: { xs: '2rem', sm: '3rem' } }}>
                {prospect.fitScore}
              </Typography>
            </Box>
            <Box flex={1} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h6" gutterBottom>
                Fit Score
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {prospect.whySummary}
              </Typography>
            </Box>
          </Stack>

          {/* Score Breakdown */}
          <Typography variant="subtitle2" sx={{ mt: 3, mb: 2 }}>
            Score Breakdown:
          </Typography>
          <Stack spacing={1.5}>
            {[
              { label: 'Sector Match', value: featureScores.sectorMatch },
              { label: 'Geographic Proximity', value: featureScores.geoProximity },
              { label: 'Stage Match', value: featureScores.stageMatch },
              { label: 'Check Size Match', value: featureScores.checkSizeMatch },
              { label: 'Recent Activity', value: featureScores.recentActivity }
            ].map((feature, idx) => (
              <Box key={idx}>
                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2">{feature.label}</Typography>
                  <Typography variant="body2" fontWeight="500">
                    {Math.round(feature.value)}%
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={feature.value}
                  color={getScoreColor(feature.value)}
                />
              </Box>
            ))}
          </Stack>
        </Paper>

        {/* Contact Information */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Contact Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon color="primary" fontSize="small" sx={{ flexShrink: 0 }} />
                  <Link 
                    href={`mailto:${prospect.email}`} 
                    underline="hover"
                    sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      wordBreak: 'break-all'
                    }}
                  >
                    {prospect.email}
                  </Link>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIcon color="primary" fontSize="small" sx={{ flexShrink: 0 }} />
                  <Typography variant="body2">{prospect.phone}</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LinkedInIcon color="primary" fontSize="small" sx={{ flexShrink: 0 }} />
                  <Link href={`https://${prospect.linkedin}`} target="_blank" underline="hover">
                    LinkedIn Profile
                  </Link>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LanguageIcon color="primary" fontSize="small" sx={{ flexShrink: 0 }} />
                  <Link href={prospect.website} target="_blank" underline="hover">
                    Company Website
                  </Link>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Investment Details */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Investment Profile
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Location
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PlaceIcon color="primary" fontSize="small" />
                  <Typography>
                    {prospect.location.city}, {prospect.location.state}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Check Size Range
                </Typography>
                <Typography>
                  ${(prospect.checkSize.min / 1000).toFixed(0)}K - ${(prospect.checkSize.max / 1000000).toFixed(1)}M
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Focus Sectors
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                  {prospect.sectors.map((sector, idx) => (
                    <Chip key={idx} label={sector} size="small" color="primary" variant="outlined" />
                  ))}
                </Stack>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Stage Preferences
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                  {prospect.stagePreferences.map((stage, idx) => (
                    <Chip key={idx} label={stage} size="small" color="primary" />
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Portfolio Companies */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Portfolio Companies
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
              {prospect.portfolio.map((company, idx) => (
                <Chip 
                  key={idx} 
                  icon={<BusinessIcon />}
                  label={company} 
                  size="small" 
                  variant="outlined"
                />
              ))}
            </Stack>
          </Paper>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Activity Timeline */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Activity Timeline
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary={`Added to database`}
                secondary={new Date(prospect.createdAt).toLocaleDateString()}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`Last enriched`}
                secondary={new Date(prospect.lastEnrichedAt).toLocaleDateString()}
              />
            </ListItem>
            {prospect.lastContactedAt && (
              <ListItem>
                <ListItemText
                  primary={`Last contacted`}
                  secondary={new Date(prospect.lastContactedAt).toLocaleDateString()}
                />
              </ListItem>
            )}
            <ListItem>
              <ListItemText
                primary={`Current status`}
                secondaryTypographyProps={{ component: 'div' }}
                secondary={
                  <Chip 
                    label={statusLabels[prospect.status]} 
                    size="small" 
                    color="primary"
                    sx={{ mt: 0.5 }}
                  />
                }
              />
            </ListItem>
          </List>
        </Box>

        {/* Notes Section - Only show if notes exist */}
        {prospect.notes && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <InfoIcon color="info" />
                <Typography variant="h6">
                  Notes
                </Typography>
              </Stack>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  bgcolor: 'info.lighter',
                  borderColor: 'info.main',
                  borderWidth: 1
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {prospect.notes}
                </Typography>
              </Paper>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: 1 }}>
        <Button 
          onClick={onClose}
          fullWidth={isMobile}
        >
          Close
        </Button>
        <Button 
          variant="contained" 
          startIcon={<EmailIcon />}
          onClick={() => {
            window.location.href = `mailto:${prospect.email}`
          }}
          fullWidth={isMobile}
        >
          Send Email
        </Button>
      </DialogActions>
    </Dialog>
  )
}

