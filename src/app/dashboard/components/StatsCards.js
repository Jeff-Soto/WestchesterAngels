import { Grid, Card, CardContent, Typography, Stack, Box } from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Star as StarIcon,
  Email as EmailIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material'

export default function StatsCards({ stats }) {
  const cards = [
    {
      title: 'Total Prospects',
      value: stats.totalProspects,
      icon: <DashboardIcon sx={{ fontSize: 40 }} />,
      color: 'primary.main',
      subtitle: `${stats.highFit} high-fit (80+)`
    },
    {
      title: 'Average Fit Score',
      value: stats.avgFitScore,
      icon: <StarIcon sx={{ fontSize: 40 }} />,
      color: 'primary.main',
      subtitle: 'Out of 100'
    },
    {
      title: 'Contacted',
      value: stats.contacted,
      icon: <EmailIcon sx={{ fontSize: 40 }} />,
      color: 'primary.main',
      subtitle: `${Math.round((stats.contacted / stats.totalProspects) * 100)}% of total`
    },
    {
      title: 'Conversion Rate',
      value: `${Math.round(((stats.byStatus?.interested || 0) / Math.max(stats.contacted, 1)) * 100)}%`,
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: 'primary.main',
      subtitle: 'Contacted → Interested'
    }
  ]

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cards.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <Card 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={2}>
                <Box sx={{ color: card.color }}>
                  {card.icon}
                </Box>
                <Box textAlign="right">
                  <Typography 
                    variant="h3" 
                    component="div"
                    sx={{ fontWeight: 'bold', color: card.color }}
                  >
                    {card.value}
                  </Typography>
                </Box>
              </Stack>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.subtitle}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

