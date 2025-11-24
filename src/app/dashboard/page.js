'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
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
  IconButton,
  Snackbar,
  Alert as MuiAlert
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
  BarChart as BarChartIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material'
import { getFilterOptions, statusLabels, calculateStats } from '@/lib/mockData'
import ProspectTable from './components/ProspectTable'
import StatsCards from './components/StatsCards'
import ProspectDetailModal from './components/ProspectDetailModal'
import ChartsSection from './components/ChartsSection'
import CsvUploadModal from './components/CsvUploadModal'
import Chatbot from './components/Chatbot'

export default function DashboardPage() {
  const [allProspects, setAllProspects] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSectors, setSelectedSectors] = useState([])
  const [selectedStates, setSelectedStates] = useState([])
  const [selectedCities, setSelectedCities] = useState([])
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [scoreRange, setScoreRange] = useState([0, 100])
  const [selectedProspect, setSelectedProspect] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [analyticsExpanded, setAnalyticsExpanded] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [csvUploadOpen, setCsvUploadOpen] = useState(false)
  // Track which select dropdowns are open
  const [openSelects, setOpenSelects] = useState({
    status: false,
    sectors: false,
    states: false,
    cities: false
  })

  // Helper function to apply all filters
  const applyFilters = useCallback((prospects, filters) => {
    let filtered = [...prospects]

    // Search filter - try semantic search first if OpenAI is available, fallback to keyword search
    if (filters.searchTerm) {
      const search = filters.searchTerm.trim()
      
      // If search term is complex (multiple words or seems like intent), try semantic search
      const useSemanticSearch = search.split(/\s+/).length > 1 || 
                                search.includes('investor') || 
                                search.includes('angel') || 
                                search.includes('sector') ||
                                search.includes('location')
      
      if (useSemanticSearch && process.env.NEXT_PUBLIC_ENABLE_SEMANTIC_SEARCH !== 'false') {
        // Semantic search will be handled client-side via API call
        // For now, fallback to keyword search
        const searchWords = search.toLowerCase().split(/\s+/)
        filtered = filtered.filter(prospect => {
          const nameLower = prospect.name.toLowerCase()
          const orgLower = prospect.org.toLowerCase()
          const emailLower = prospect.email.toLowerCase()
          const sectorsLower = prospect.sectors?.join(' ').toLowerCase() || ''
          const locationLower = `${prospect.location.city} ${prospect.location.state}`.toLowerCase()
          
          const matchesSearch = searchWords.some(word => 
            nameLower.includes(word) || 
            orgLower.includes(word) || 
            emailLower.includes(word) ||
            sectorsLower.includes(word) ||
            locationLower.includes(word)
          )
          
          return matchesSearch
        })
      } else {
        // Simple keyword search
        const searchLower = search.toLowerCase()
        filtered = filtered.filter(prospect => {
          const nameLower = prospect.name.toLowerCase()
          const orgLower = prospect.org.toLowerCase()
          const emailLower = prospect.email.toLowerCase()
          
          return nameLower.includes(searchLower) || 
                 orgLower.includes(searchLower) || 
                 emailLower.includes(searchLower)
        })
      }
    }

    // Sector filter
    if (filters.selectedSectors.length > 0) {
      filtered = filtered.filter(p => 
        p.sectors.some(s => filters.selectedSectors.includes(s))
      )
    }

    // State filter
    if (filters.selectedStates.length > 0) {
      filtered = filtered.filter(p => 
        filters.selectedStates.includes(p.location.state)
      )
    }

    // City filter (applied after state filter)
    if (filters.selectedCities.length > 0) {
      filtered = filtered.filter(p => {
        const cityStateKey = `${p.location.city}, ${p.location.state}`;
        return filters.selectedCities.includes(cityStateKey);
      })
    }

    // Status filter
    if (filters.selectedStatuses.length > 0) {
      filtered = filtered.filter(p => 
        filters.selectedStatuses.includes(p.status)
      )
    }

    // Score range filter
    filtered = filtered.filter(p => 
      p.fitScore >= filters.scoreRange[0] && p.fitScore <= filters.scoreRange[1]
    )

    return filtered
  }, [])

  // Fetch all prospects once on mount (no filtering)
  useEffect(() => {
    const fetchProspects = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/prospects')
        if (!response.ok) {
          throw new Error('Failed to fetch prospects')
        }
        
        const result = await response.json()
        if (result.success) {
          console.log('Fetched prospects:', result.data.length)
          console.log('First prospect:', result.data[0])
          setAllProspects(result.data || [])
        } else {
          throw new Error(result.error || 'Failed to fetch prospects')
        }
      } catch (err) {
        console.error('Error fetching prospects:', err)
        setError(err.message)
        setAllProspects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProspects()
  }, []) // Only fetch once on mount

  // Calculate stats from filtered prospects (client-side)
  useEffect(() => {
    if (allProspects.length === 0) {
      setStats(null)
      return
    }

    // Apply all filters to calculate stats
    const filtered = applyFilters(allProspects, {
      searchTerm,
      selectedSectors,
      selectedStates,
      selectedCities,
      selectedStatuses,
      scoreRange
    })

    // Calculate stats from filtered prospects
    const calculatedStats = calculateStats(filtered)
    setStats(calculatedStats)
  }, [allProspects, searchTerm, selectedSectors, selectedStates, selectedStatuses, scoreRange])

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  // Get filter options
  const filterOptions = useMemo(() => getFilterOptions(allProspects), [allProspects])

  // Apply all filters client-side for smooth filtering
  const filteredProspects = useMemo(() => {
    return applyFilters(allProspects, {
      searchTerm,
      selectedSectors,
      selectedStates,
      selectedCities,
      selectedStatuses,
      scoreRange
    })
  }, [allProspects, searchTerm, selectedSectors, selectedStates, selectedCities, selectedStatuses, scoreRange, applyFilters])

  // Show loading state
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <Box sx={{ py: 8 }}>
          <Typography variant="h5" gutterBottom>
            Loading prospects...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fetching data from API
          </Typography>
        </Box>
      </Container>
    )
  }

  // Show error state
  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <Box sx={{ py: 8 }}>
          <Typography variant="h5" gutterBottom color="error">
            Error loading prospects
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error}
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
  const handleStatusUpdate = async (prospectId, newStatus) => {
    // Store previous status for potential rollback
    const previousProspect = allProspects.find(p => p.id === prospectId)
    const previousStatus = previousProspect?.status || 'new'

    // Update local state immediately for responsive UI
    setAllProspects(prevProspects => 
      prevProspects.map(p => 
        p.id === prospectId ? { ...p, status: newStatus } : p
      )
    )

    // Update database
    try {
      const response = await fetch(`/api/prospects/${prospectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update status')
      }

      // Success - status is already updated in local state
    } catch (error) {
      console.error('Error updating prospect status:', error)
      // Revert local state on error
      setAllProspects(prevProspects => 
        prevProspects.map(p => 
          p.id === prospectId ? { ...p, status: previousStatus } : p
        )
      )
      // Show error to user
      showSnackbar(`Failed to update status: ${error.message}`, 'error')
    }
  }

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedSectors([])
    setSelectedStates([])
    setSelectedCities([])
    setSelectedStatuses([])
    setScoreRange([0, 100])
  }

  const hasActiveFilters = searchTerm || selectedSectors.length > 0 || 
    selectedStates.length > 0 || selectedCities.length > 0 || selectedStatuses.length > 0 || 
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
                Manage and track your investor pipeline
              </Typography>
            </Box>
          </Stack>
          
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={() => setCsvUploadOpen(true)}
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
                Import CSV
              </Box>
            </Button>
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
            {stats && <StatsCards stats={stats} />}
            
            {/* Charts */}
            {stats && <ChartsSection stats={stats} />}
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

         {/* First Row: Search and Fit Score (50% each) */}
         <Box sx={{ display: 'flex', gap: 3, mb: 3, alignItems: 'flex-start' }}>
           {/* Search - 50% width */}
           <Box sx={{ flex: '0 0 calc(50% - 12px)', minWidth: 0 }}>
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
           
           {/* Fit Score Slider - 50% width */}
           <Box sx={{ 
             flex: '0 0 calc(50% - 12px)', 
             minWidth: 0,
             display: 'flex',
             flexDirection: 'column',
             justifyContent: 'flex-start',
             pt: 0.5 // Small padding to align with TextField label
           }}>
             <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1 }}>
               Fit Score: {scoreRange[0]} - {scoreRange[1]}
             </Typography>
             <Box sx={{ px: 1, width: '100%', boxSizing: 'border-box' }}>
               <Slider
                 value={scoreRange}
                 onChange={(_, newValue) => setScoreRange(newValue)}
                 valueLabelDisplay="auto"
                 min={0}
                 max={100}
                 disableSwap
               />
             </Box>
           </Box>
         </Box>

         {/* Second Row: Other Filters (25% each) */}
         <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
           {/* Status Filter */}
           <Box sx={{ flex: '0 0 calc(25% - 18px)', minWidth: '150px' }}>
             <TextField
               select
               label="Status"
               variant="outlined"
               fullWidth
               InputLabelProps={{
                 shrink: true
               }}
               sx={{
                 '& .MuiInputLabel-root': {
                   color: selectedStatuses.length === 0 ? 'rgba(0, 0, 0, 0.6)' : undefined,
                   '&.Mui-focused': {
                     color: selectedStatuses.length === 0 ? 'rgba(0, 0, 0, 0.6)' : undefined
                   }
                 },
                 '& .MuiOutlinedInput-root': {
                   '& fieldset': {
                     borderColor: selectedStatuses.length === 0 ? 'rgba(0, 0, 0, 0.23)' : undefined
                   },
                   '&:hover fieldset': {
                     borderColor: selectedStatuses.length === 0 ? 'rgba(0, 0, 0, 0.23)' : undefined
                   },
                   '&.Mui-focused fieldset': {
                     borderColor: selectedStatuses.length === 0 ? 'rgba(0, 0, 0, 0.23)' : undefined
                   }
                 }
               }}
               InputProps={{
                 sx: {
                   '& .MuiSelect-select': {
                     color: selectedStatuses.length === 0 ? 'rgba(0, 0, 0, 0.6)' : 'inherit'
                   }
                 }
               }}
               SelectProps={{
                 multiple: true,
                 displayEmpty: true,
                 open: openSelects.status,
                 onOpen: () => setOpenSelects(prev => ({ ...prev, status: true })),
                 onClose: () => setOpenSelects(prev => ({ ...prev, status: false })),
                 renderValue: (selected) => {
                   if (!selected || selected.length === 0) {
                     return <em style={{ color: 'rgba(0, 0, 0, 0.6)', fontStyle: 'normal' }}>All statuses</em>
                   }
                   return (
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
                   )
                 },
               }}
               value={selectedStatuses}
               onChange={(e) => {
                 setSelectedStatuses(e.target.value)
                 // Close the select after selection
                 setTimeout(() => setOpenSelects(prev => ({ ...prev, status: false })), 100)
               }}
             >
               {Object.entries(statusLabels).map(([key, value]) => (
                 <MenuItem key={key} value={key}>
                   {value}
                 </MenuItem>
               ))}
             </TextField>
           </Box>
           
           {/* Sectors Filter */}
           <Box sx={{ flex: '0 0 calc(25% - 18px)', minWidth: '150px' }}>
             <TextField
               select
               label="Sectors"
               variant="outlined"
               fullWidth
               InputLabelProps={{
                 shrink: true
               }}
               sx={{
                 '& .MuiInputLabel-root': {
                   color: selectedSectors.length === 0 ? 'rgba(0, 0, 0, 0.6)' : undefined,
                   '&.Mui-focused': {
                     color: selectedSectors.length === 0 ? 'rgba(0, 0, 0, 0.6)' : undefined
                   }
                 },
                 '& .MuiOutlinedInput-root': {
                   '& fieldset': {
                     borderColor: selectedSectors.length === 0 ? 'rgba(0, 0, 0, 0.23)' : undefined
                   },
                   '&:hover fieldset': {
                     borderColor: selectedSectors.length === 0 ? 'rgba(0, 0, 0, 0.23)' : undefined
                   },
                   '&.Mui-focused fieldset': {
                     borderColor: selectedSectors.length === 0 ? 'rgba(0, 0, 0, 0.23)' : undefined
                   }
                 }
               }}
               InputProps={{
                 sx: {
                   '& .MuiSelect-select': {
                     color: selectedSectors.length === 0 ? 'rgba(0, 0, 0, 0.6)' : 'inherit'
                   }
                 }
               }}
               SelectProps={{
                 multiple: true,
                 displayEmpty: true,
                 open: openSelects.sectors,
                 onOpen: () => setOpenSelects(prev => ({ ...prev, sectors: true })),
                 onClose: () => setOpenSelects(prev => ({ ...prev, sectors: false })),
                 renderValue: (selected) => {
                   if (!selected || selected.length === 0) {
                     return <em style={{ color: 'rgba(0, 0, 0, 0.6)', fontStyle: 'normal' }}>All sectors</em>
                   }
                   return (
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
                   )
                 },
               }}
               value={selectedSectors}
               onChange={(e) => {
                 setSelectedSectors(e.target.value)
                 // Close the select after selection
                 setTimeout(() => setOpenSelects(prev => ({ ...prev, sectors: false })), 100)
               }}
             >
               {filterOptions.sectors.map((option) => (
                 <MenuItem key={option} value={option}>
                   {option}
                 </MenuItem>
               ))}
             </TextField>
           </Box>
           
           {/* State Filter */}
           <Box sx={{ flex: '0 0 calc(25% - 18px)', minWidth: '150px' }}>
             <TextField
               select
               label="State"
               variant="outlined"
               fullWidth
               InputLabelProps={{
                 shrink: true
               }}
               sx={{
                 '& .MuiInputLabel-root': {
                   color: selectedStates.length === 0 ? 'rgba(0, 0, 0, 0.6)' : undefined,
                   '&.Mui-focused': {
                     color: selectedStates.length === 0 ? 'rgba(0, 0, 0, 0.6)' : undefined
                   }
                 },
                 '& .MuiOutlinedInput-root': {
                   '& fieldset': {
                     borderColor: selectedStates.length === 0 ? 'rgba(0, 0, 0, 0.23)' : undefined
                   },
                   '&:hover fieldset': {
                     borderColor: selectedStates.length === 0 ? 'rgba(0, 0, 0, 0.23)' : undefined
                   },
                   '&.Mui-focused fieldset': {
                     borderColor: selectedStates.length === 0 ? 'rgba(0, 0, 0, 0.23)' : undefined
                   }
                 }
               }}
               InputProps={{
                 sx: {
                   '& .MuiSelect-select': {
                     color: selectedStates.length === 0 ? 'rgba(0, 0, 0, 0.6)' : 'inherit'
                   }
                 }
               }}
               SelectProps={{
                 multiple: true,
                 displayEmpty: true,
                 open: openSelects.states,
                 onOpen: () => setOpenSelects(prev => ({ ...prev, states: true })),
                 onClose: () => setOpenSelects(prev => ({ ...prev, states: false })),
                 renderValue: (selected) => {
                   if (!selected || selected.length === 0) {
                     return <em style={{ color: 'rgba(0, 0, 0, 0.6)', fontStyle: 'normal' }}>All states</em>
                   }
                   return (
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
                   )
                 },
               }}
               value={selectedStates}
               onChange={(e) => {
                 const newStates = e.target.value;
                 setSelectedStates(newStates);
                 // Clear cities that are not in the newly selected states
                 if (newStates.length === 0) {
                   setSelectedCities([]);
                 } else {
                   setSelectedCities(prevCities => 
                     prevCities.filter(cityState => {
                       const state = cityState.split(', ')[1];
                       return newStates.includes(state);
                     })
                   );
                 }
                 // Close the select after selection
                 setTimeout(() => setOpenSelects(prev => ({ ...prev, states: false })), 100)
               }}
             >
               {filterOptions.states.map((option) => (
                 <MenuItem key={option} value={option}>
                   {option}
                 </MenuItem>
               ))}
             </TextField>
           </Box>
           
           {/* City Filter */}
           <Box sx={{ flex: '0 0 calc(25% - 18px)', minWidth: '150px' }}>
             <TextField
               select
               label="City"
               variant="outlined"
               fullWidth
               InputLabelProps={{
                 shrink: true
               }}
               disabled={selectedStates.length === 0 && filterOptions.cities.length === 0}
               helperText={selectedStates.length > 0 ? `Showing cities from selected states` : filterOptions.cities.length === 0 ? 'No city data available' : ''}
               sx={{
                 '& .MuiInputLabel-root': {
                   color: selectedCities.length === 0 ? 'rgba(0, 0, 0, 0.6)' : undefined,
                   '&.Mui-focused': {
                     color: selectedCities.length === 0 ? 'rgba(0, 0, 0, 0.6)' : undefined
                   }
                 },
                 '& .MuiOutlinedInput-root': {
                   '& fieldset': {
                     borderColor: selectedCities.length === 0 ? 'rgba(0, 0, 0, 0.23)' : undefined
                   },
                   '&:hover fieldset': {
                     borderColor: selectedCities.length === 0 ? 'rgba(0, 0, 0, 0.23)' : undefined
                   },
                   '&.Mui-focused fieldset': {
                     borderColor: selectedCities.length === 0 ? 'rgba(0, 0, 0, 0.23)' : undefined
                   }
                 }
               }}
               InputProps={{
                 sx: {
                   '& .MuiSelect-select': {
                     color: selectedCities.length === 0 ? 'rgba(0, 0, 0, 0.6)' : 'inherit'
                   }
                 }
               }}
               SelectProps={{
                 multiple: true,
                 displayEmpty: true,
                 open: openSelects.cities,
                 onOpen: () => setOpenSelects(prev => ({ ...prev, cities: true })),
                 onClose: () => setOpenSelects(prev => ({ ...prev, cities: false })),
                 renderValue: (selected) => {
                   if (!selected || selected.length === 0) {
                     return <em style={{ color: 'rgba(0, 0, 0, 0.6)', fontStyle: 'normal' }}>All cities</em>
                   }
                   return (
                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                       {selected.map((value) => (
                         <Chip 
                           key={value} 
                           label={value} 
                           size="small"
                           onDelete={(e) => {
                             e.stopPropagation()
                             setSelectedCities(selectedCities.filter(c => c !== value))
                           }}
                           onMouseDown={(e) => e.stopPropagation()}
                         />
                       ))}
                     </Box>
                   )
                 },
               }}
               value={selectedCities}
               onChange={(e) => {
                 setSelectedCities(e.target.value)
                 // Close the select after selection
                 setTimeout(() => setOpenSelects(prev => ({ ...prev, cities: false })), 100)
               }}
             >
               {(() => {
                 // Filter cities based on selected states
                 let availableCities = filterOptions.cities;
                 if (selectedStates.length > 0) {
                   availableCities = filterOptions.cities.filter(cityState => {
                     const state = cityState.split(', ')[1];
                     return selectedStates.includes(state);
                   });
                 }
                 return availableCities.map((option) => (
                   <MenuItem key={option} value={option}>
                     {option}
                   </MenuItem>
                 ));
               })()}
             </TextField>
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
        onEmailSent={(prospectName) => showSnackbar(`Email sent successfully to ${prospectName}!`, 'success')}
      />

      {/* CSV Upload Modal */}
      <CsvUploadModal
        open={csvUploadOpen}
        onClose={() => setCsvUploadOpen(false)}
        onImportSuccess={(count, saved) => {
          showSnackbar(
            `Successfully imported ${count} prospects${saved ? ` (${saved} saved to database)` : ''}`,
            'success'
          )
          // Optionally refresh prospects list
          // fetchProspects() // Uncomment if you have a fetchProspects function
        }}
      />

      {/* Success Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

      {/* AI Chatbot Assistant */}
      <Chatbot />
    </Container>
  )
}
