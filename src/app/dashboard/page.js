'use client'

import { useState, useMemo, useEffect } from 'react'
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Stack,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Slider,
  Paper,
  Collapse,
  IconButton
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Star as StarIcon,
  Email as EmailIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  FileDownload as DownloadIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material'
import { generateMockProspects, calculateStats, getFilterOptions, statusLabels } from '@/lib/mockData'
import ProspectTable from './components/ProspectTable'
import StatsCards from './components/StatsCards'
import ProspectDetailModal from './components/ProspectDetailModal'
import ChartsSection from './components/ChartsSection'

export default function DashboardPage() {
  // Generate mock data (client-side only to avoid hydration errors)
  const [allProspects, setAllProspects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSectors, setSelectedSectors] = useState([])
  const [selectedStates, setSelectedStates] = useState([])
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [scoreRange, setScoreRange] = useState([0, 100])
  const [selectedProspect, setSelectedProspect] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [analyticsExpanded, setAnalyticsExpanded] = useState(false)

  // Generate data on client mount to avoid hydration mismatch
  // Using real tri-state angel investors (30 prospects)
  useEffect(() => {
    setAllProspects(generateMockProspects())
  }, [])

  // Get filter options
  const filterOptions = useMemo(() => getFilterOptions(allProspects), [allProspects])

  // Filter prospects
  const filteredProspects = useMemo(() => {
    return allProspects.filter(prospect => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        const matchesSearch = 
          prospect.name.toLowerCase().includes(search) ||
          prospect.org.toLowerCase().includes(search) ||
          prospect.email.toLowerCase().includes(search)
        if (!matchesSearch) return false
      }

      // Sector filter
      if (selectedSectors.length > 0) {
        const hasSector = prospect.sectors.some(s => selectedSectors.includes(s))
        if (!hasSector) return false
      }

      // State filter
      if (selectedStates.length > 0) {
        if (!selectedStates.includes(prospect.location.state)) return false
      }

      // Status filter
      if (selectedStatuses.length > 0) {
        if (!selectedStatuses.includes(prospect.status)) return false
      }

      // Score range filter
      if (prospect.fitScore < scoreRange[0] || prospect.fitScore > scoreRange[1]) {
        return false
      }

      return true
    })
  }, [allProspects, searchTerm, selectedSectors, selectedStates, selectedStatuses, scoreRange])

  // Calculate stats
  const stats = useMemo(() => calculateStats(filteredProspects), [filteredProspects])

  // Show loading state while data is being generated
  if (allProspects.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <Box sx={{ py: 8 }}>
          <Typography variant="h5" gutterBottom>
            Loading prospects...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Generating mock data for demo
          </Typography>
        </Box>
      </Container>
    )
  }

  // Handle prospect click
  const handleProspectClick = (prospect) => {
    setSelectedProspect(prospect)
    setDetailModalOpen(true)
  }

  // Handle status update
  const handleStatusUpdate = (prospectId, newStatus) => {
    // In real app, this would update the backend
    console.log(`Update prospect ${prospectId} status to ${newStatus}`)
  }

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedSectors([])
    setSelectedStates([])
    setSelectedStatuses([])
    setScoreRange([0, 100])
  }

  const hasActiveFilters = searchTerm || selectedSectors.length > 0 || 
    selectedStates.length > 0 || selectedStatuses.length > 0 || 
    scoreRange[0] !== 0 || scoreRange[1] !== 100

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Organization', 'Location', 'Sectors', 'Fit Score', 'Status', 'Email']
    const rows = filteredProspects.map(p => [
      p.name,
      p.org,
      `${p.location.city}, ${p.location.state}`,
      p.sectors.join('; '),
      p.fitScore,
      statusLabels[p.status],
      p.email
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prospects_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          alignItems={{ xs: 'flex-start', sm: 'center' }} 
          justifyContent="space-between" 
          spacing={2}
          mb={2}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <DashboardIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main' }} />
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '1.75rem', sm: '3rem' } }}>
                Investor Prospects
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Demo POC with mock data
              </Typography>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportToCSV}
              sx={{ 
                minWidth: { xs: 'auto', sm: 'auto' },
                px: { xs: 1.5, sm: 2 },
                '& .MuiButton-startIcon': { 
                  marginRight: { xs: 0, sm: 1 },
                  marginLeft: 0
                }
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Export CSV
              </Box>
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
              sx={{ 
                minWidth: { xs: 'auto', sm: 'auto' },
                px: { xs: 1.5, sm: 2 },
                '& .MuiButton-startIcon': { 
                  marginRight: { xs: 0, sm: 1 },
                  marginLeft: 0
                }
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Refresh
              </Box>
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Collapsible Analytics Section */}
      <Paper sx={{ mb: 3, overflow: 'hidden' }}>
        <Box 
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            cursor: 'pointer',
            backgroundColor: analyticsExpanded ? 'primary.main' : 'background.paper',
            color: analyticsExpanded ? 'primary.contrastText' : 'text.primary',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: analyticsExpanded ? 'primary.dark' : 'action.hover',
            }
          }}
          onClick={() => setAnalyticsExpanded(!analyticsExpanded)}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <BarChartIcon />
            <Box>
              <Typography variant="h6">
                Analytics Overview
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {analyticsExpanded ? 'Click to hide statistics and charts' : 'Click to view statistics and charts'}
              </Typography>
            </Box>
          </Stack>
          <IconButton sx={{ color: 'inherit' }}>
            {analyticsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={analyticsExpanded}>
          <Box sx={{ p: 3, pt: 2 }}>
            {/* Stats Cards */}
            <StatsCards stats={stats} />
            
            {/* Charts */}
            <ChartsSection stats={stats} />
          </Box>
        </Collapse>
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <FilterListIcon color="primary" />
          <Typography variant="h6">Filters</Typography>
          {hasActiveFilters && (
            <Chip 
              label="Clear All" 
              size="small" 
              onDelete={clearFilters}
              color="primary"
              variant="outlined"
            />
          )}
        </Stack>

         <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'flex-start' }}>
           {/* Search - Wider to accommodate placeholder text */}
           <Box sx={{ flex: '1 1 400px', minWidth: '250px' }}>
             <TextField
               label="Search"
               placeholder="Search by name, organization, or email..."
               variant="outlined"
               fullWidth
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               InputProps={{
                 startAdornment: (
                   <InputAdornment position="start">
                     <SearchIcon />
                   </InputAdornment>
                 ),
               }}
             />
           </Box>
           
           {/* Sectors Filter */}
           <Box sx={{ flex: '1 1 180px', minWidth: '150px' }}>
             <TextField
               select
               label="Sectors"
               variant="outlined"
               fullWidth
               SelectProps={{
                 multiple: true,
                 renderValue: (selected) => (
                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                     {selected.map((value) => (
                       <Chip 
                         key={value} 
                         label={value} 
                         size="small"
                         onDelete={(e) => {
                           e.stopPropagation()
                           setSelectedSectors(selectedSectors.filter(s => s !== value))
                         }}
                         onMouseDown={(e) => e.stopPropagation()}
                       />
                     ))}
                   </Box>
                 ),
               }}
               value={selectedSectors}
               onChange={(e) => setSelectedSectors(e.target.value)}
             >
               {filterOptions.sectors.map((option) => (
                 <MenuItem key={option} value={option}>
                   {option}
                 </MenuItem>
               ))}
             </TextField>
           </Box>
           
           {/* State Filter */}
           <Box sx={{ flex: '1 1 180px', minWidth: '150px' }}>
             <TextField
               select
               label="Location"
               variant="outlined"
               fullWidth
               SelectProps={{
                 multiple: true,
                 renderValue: (selected) => (
                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                     {selected.map((value) => (
                       <Chip 
                         key={value} 
                         label={value} 
                         size="small"
                         onDelete={(e) => {
                           e.stopPropagation()
                           setSelectedStates(selectedStates.filter(s => s !== value))
                         }}
                         onMouseDown={(e) => e.stopPropagation()}
                       />
                     ))}
                   </Box>
                 ),
               }}
               value={selectedStates}
               onChange={(e) => setSelectedStates(e.target.value)}
             >
               {filterOptions.states.map((option) => (
                 <MenuItem key={option} value={option}>
                   {option}
                 </MenuItem>
               ))}
             </TextField>
           </Box>
           
           {/* Status Filter */}
           <Box sx={{ flex: '1 1 180px', minWidth: '150px' }}>
             <TextField
               select
               label="Status"
               variant="outlined"
               fullWidth
               SelectProps={{
                 multiple: true,
                 renderValue: (selected) => (
                   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                     {selected.map((value) => (
                       <Chip 
                         key={value} 
                         label={statusLabels[value]} 
                         size="small"
                         onDelete={(e) => {
                           e.stopPropagation()
                           setSelectedStatuses(selectedStatuses.filter(s => s !== value))
                         }}
                         onMouseDown={(e) => e.stopPropagation()}
                       />
                     ))}
                   </Box>
                 ),
               }}
               value={selectedStatuses}
               onChange={(e) => setSelectedStatuses(e.target.value)}
             >
               {Object.entries(statusLabels).map(([key, value]) => (
                 <MenuItem key={key} value={key}>
                   {value}
                 </MenuItem>
               ))}
             </TextField>
           </Box>
           
           {/* Fit Score Slider */}
           <Box sx={{ flex: '1 1 180px', minWidth: '150px', pt: 1 }}>
             <Typography variant="body2" color="text.secondary" gutterBottom>
               Fit Score: {scoreRange[0]} - {scoreRange[1]}
             </Typography>
             <Slider
               value={scoreRange}
               onChange={(_, newValue) => setScoreRange(newValue)}
               valueLabelDisplay="auto"
               min={0}
               max={100}
               disableSwap
               sx={{ mt: 1 }}
             />
           </Box>
         </Box>
      </Paper>

      {/* Results */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Showing <strong>{filteredProspects.length}</strong> of <strong>{allProspects.length}</strong> prospects
          {hasActiveFilters && ' (filtered)'}
        </Typography>
      </Paper>

      {/* Prospect Table */}
      <ProspectTable 
        prospects={filteredProspects} 
        onProspectClick={handleProspectClick}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* Detail Modal */}
      <ProspectDetailModal
        prospect={selectedProspect}
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </Container>
  )
}
