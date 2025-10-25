import { Grid, Paper, Typography, Box, Stack, LinearProgress } from '@mui/material'
import { PieChart as PieChartIcon, BarChart as BarChartIcon } from '@mui/icons-material'

export default function ChartsSection({ stats }) {
  // Get top 5 sectors
  const topSectors = Object.entries(stats.bySector || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([sector, count]) => ({
      sector,
      count,
      percentage: (count / stats.totalProspects) * 100
    }))

  // Get top 5 states
  const topStates = Object.entries(stats.byState || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([state, count]) => ({
      state,
      count,
      percentage: (count / stats.totalProspects) * 100
    }))

  const colors = ['#14E2BA', '#00B093', '#4DFFDB', '#0D9F85', '#6BFFE3']

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Score Distribution */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <BarChartIcon color="primary" />
            <Typography variant="h6">
              Score Distribution
            </Typography>
          </Stack>
          
          <Stack spacing={2}>
            {stats.scoreDistribution && stats.scoreDistribution.map((item, idx) => (
              <Box key={idx}>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">
                    {item.range}
                  </Typography>
                  <Typography variant="body2" fontWeight="500">
                    {item.count} prospects
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={(item.count / stats.totalProspects) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    backgroundColor: 'background.default',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: colors[idx % colors.length]
                    }
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Paper>
      </Grid>

      {/* Top Sectors */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <PieChartIcon color="primary" />
            <Typography variant="h6">
              Top Sectors
            </Typography>
          </Stack>
          
          <Stack spacing={2}>
            {topSectors.map((item, idx) => (
              <Box key={idx}>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">
                    {item.sector}
                  </Typography>
                  <Typography variant="body2" fontWeight="500">
                    {item.count} ({item.percentage.toFixed(1)}%)
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={item.percentage}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    backgroundColor: 'background.default',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: colors[idx % colors.length]
                    }
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Paper>
      </Grid>

      {/* Top States */}
      <Grid size={12}>
        <Paper sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <PieChartIcon color="primary" />
            <Typography variant="h6">
              Geographic Distribution
            </Typography>
          </Stack>
          
          <Grid container spacing={2}>
            {topStates.map((item, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" fontWeight="500">
                      {item.state}
                    </Typography>
                    <Typography variant="body2">
                      {item.count} ({item.percentage.toFixed(1)}%)
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={item.percentage}
                    sx={{
                      height: 6,
                      borderRadius: 1,
                      backgroundColor: 'background.default',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: colors[idx % colors.length]
                      }
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

