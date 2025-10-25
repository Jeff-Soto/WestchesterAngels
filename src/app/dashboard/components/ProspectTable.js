import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  Box,
  Typography
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  Star as StarIcon,
  Place as PlaceIcon
} from '@mui/icons-material'
import { statusLabels, statusColors } from '@/lib/mockData'

export default function ProspectTable({ prospects, onProspectClick, onStatusUpdate }) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [orderBy, setOrderBy] = useState('fitScore')
  const [order, setOrder] = useState('desc')

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const sortedProspects = [...prospects].sort((a, b) => {
    let aValue = a[orderBy]
    let bValue = b[orderBy]

    // Handle nested properties
    if (orderBy === 'location') {
      aValue = `${a.location.city}, ${a.location.state}`
      bValue = `${b.location.city}, ${b.location.state}`
    }

    if (orderBy === 'sectors') {
      aValue = a.sectors.join(', ')
      bValue = b.sectors.join(', ')
    }

    if (aValue < bValue) {
      return order === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return order === 'asc' ? 1 : -1
    }
    return 0
  })

  const paginatedProspects = sortedProspects.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'success'
    if (score >= 80) return 'primary'
    if (score >= 70) return 'info'
    if (score >= 60) return 'warning'
    return 'default'
  }

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'org'}
                  direction={orderBy === 'org' ? order : 'asc'}
                  onClick={() => handleSort('org')}
                >
                  Organization
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'location'}
                  direction={orderBy === 'location' ? order : 'asc'}
                  onClick={() => handleSort('location')}
                >
                  Location
                </TableSortLabel>
              </TableCell>
              <TableCell>Sectors</TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === 'fitScore'}
                  direction={orderBy === 'fitScore' ? order : 'asc'}
                  onClick={() => handleSort('fitScore')}
                >
                  Fit Score
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProspects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary">
                    No prospects found matching your filters
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedProspects.map((prospect) => (
                <TableRow 
                  key={prospect.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => onProspectClick(prospect)}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="500">
                      {prospect.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {prospect.org}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <PlaceIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {prospect.location.city}, {prospect.location.state}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {prospect.sectors.slice(0, 2).map((sector, idx) => (
                        <Chip 
                          key={idx}
                          label={sector} 
                          size="small" 
                          variant="outlined"
                        />
                      ))}
                      {prospect.sectors.length > 2 && (
                        <Chip 
                          label={`+${prospect.sectors.length - 2}`} 
                          size="small" 
                          variant="outlined"
                        />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={<StarIcon />}
                      label={prospect.fitScore}
                      color={getScoreColor(prospect.fitScore)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <FormControl 
                      size="small" 
                      onClick={(e) => e.stopPropagation()}
                      sx={{ minWidth: 150 }}
                    >
                      <Select
                        value={prospect.status}
                        onChange={(e) => {
                          e.stopPropagation()
                          onStatusUpdate(prospect.id, e.target.value)
                        }}
                      >
                        {Object.keys(statusLabels).map((key) => (
                          <MenuItem key={key} value={key}>
                            {statusLabels[key]}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation()
                          onProspectClick(prospect)
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={prospects.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </Paper>
  )
}

