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
  Paper
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Star as StarIcon,
  Email as EmailIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  FileDownload as DownloadIcon,
  Refresh as RefreshIcon
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

  // Generate data on client mount to avoid hydration mismatch
  useEffect(() => {
    setAllProspects(generateMockProspects(75))
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
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <DashboardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h3" component="h1">
                Investor Prospects
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Demo POC with mock data
              </Typography>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportToCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts */}
      <ChartsSection stats={stats} />

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
                       <Chip key={value} label={value} size="small" />
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
                       <Chip key={value} label={value} size="small" />
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
                       <Chip key={value} label={statusLabels[value]} size="small" />
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
