import { Grid, Paper, Typography, Box, Stack, LinearProgress } from '@mui/material'
import { PieChart as PieChartIcon, BarChart as BarChartIcon, LocationOn as LocationIcon } from '@mui/icons-material'

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

  // Get top cities for pie chart (top 8 to keep it readable)
  const topCities = Object.entries(stats.byCity || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([city, count]) => ({
      city,
      count,
      percentage: (count / stats.totalProspects) * 100
    }))

  const colors = ['#14E2BA', '#00B093', '#4DFFDB', '#0D9F85', '#6BFFE3', '#26C9A3', '#33D6B3', '#40E3C3']

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
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <LocationIcon color="primary" />
            <Typography variant="h6">
              Geographic Distribution
            </Typography>
          </Stack>
          
          <Grid container spacing={2}>
            {topStates.map((item, idx) => (
              <Grid size={{ xs: 12, sm: 6 }} key={idx}>
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

      {/* Cities Pie Chart */}
      {topCities.length > 0 && (
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
              <PieChartIcon color="primary" />
              <Typography variant="h6">
                Cities Breakdown
              </Typography>
            </Stack>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
              {/* Pie Chart SVG */}
              <Box sx={{ flexShrink: 0 }}>
                <SimplePieChart 
                  data={topCities} 
                  colors={colors} 
                  totalCities={Object.keys(stats.byCity || {}).length}
                />
              </Box>
              
              {/* Legend */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack spacing={1.5}>
                  {topCities.map((item, idx) => (
                    <Stack key={idx} direction="row" alignItems="center" spacing={1.5}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          backgroundColor: colors[idx % colors.length],
                          flexShrink: 0
                        }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" noWrap>
                          {item.city}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight="500" sx={{ flexShrink: 0 }}>
                        {item.count} ({item.percentage.toFixed(1)}%)
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Paper>
        </Grid>
      )}
    </Grid>
  )
}

// Simple SVG Pie Chart Component
function SimplePieChart({ data, colors, totalCities }) {
  const size = 200
  const radius = 80
  const center = size / 2
  
  // Calculate total prospects for percentages (sum of all city counts)
  const totalProspects = data.reduce((sum, item) => sum + item.count, 0)
  
  // Calculate pie slices
  let currentAngle = -90 // Start from top
  const slices = data.map((item, idx) => {
    const percentage = (item.count / totalProspects) * 100
    const angle = (percentage / 100) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    
    // Convert to radians
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180
    
    // Calculate arc path
    const x1 = center + radius * Math.cos(startRad)
    const y1 = center + radius * Math.sin(startRad)
    const x2 = center + radius * Math.cos(endRad)
    const y2 = center + radius * Math.sin(endRad)
    
    const largeArcFlag = angle > 180 ? 1 : 0
    
    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ')
    
    currentAngle = endAngle
    
    return {
      path: pathData,
      color: colors[idx % colors.length],
      percentage
    }
  })
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((slice, idx) => (
          <path
            key={idx}
            d={slice.path}
            fill={slice.color}
            stroke="#fff"
            strokeWidth={2}
          />
        ))}
        {/* Center circle for donut effect */}
        <circle
          cx={center}
          cy={center}
          r={radius * 0.5}
          fill="#fff"
        />
        {/* Number of unique cities in center */}
        <text
          x={center}
          y={center - 5}
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
          fill="#14E2BA"
        >
          {totalCities}
        </text>
        <text
          x={center}
          y={center + 15}
          textAnchor="middle"
          fontSize="12"
          fill="#666"
        >
          Cities
        </text>
      </svg>
    </Box>
  )
}

