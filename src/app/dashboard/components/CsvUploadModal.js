'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  Stack,
  TextField
} from '@mui/material'
import {
  CloudUpload as UploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material'

/**
 * CSV Upload Modal Component
 * 
 * Allows users to upload CSV files and import prospects.
 * 
 * Usage:
 *   <CsvUploadModal
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     onImportSuccess={(count) => {
 *       // Refresh prospects list
 *       fetchProspects()
 *     }}
 *   />
 */
export default function CsvUploadModal({ open, onClose, onImportSuccess }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [source, setSource] = useState('angelmatch') // Default to AngelMatch
  // Always apply filter and save to database
  const saveToDb = true
  const applyFilter = true

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file')
        setFile(null)
        return
      }
      setFile(selectedFile)
      setError(null)
      setSuccess(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('source', source)

      const url = new URL('/api/import/csv', window.location.origin)
      if (saveToDb) {
        url.searchParams.set('saveToDb', 'true')
      }
      if (!applyFilter) {
        url.searchParams.set('filter', 'false')
      }

      const response = await fetch(url.toString(), {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to import CSV')
      }

      setSuccess({
        count: data.count,
        saved: data.saved,
        message: data.message,
        filterStats: data.filterStats
      })

      // Call success callback if provided
      if (onImportSuccess) {
        onImportSuccess(data.count, data.saved)
      }
      
      // Refresh the page to show new data from database
      // In the future, we could just refetch instead of full reload
      if (data.saved && data.saved > 0) {
        setTimeout(() => {
          window.location.reload()
        }, 2000) // Give user time to see success message
      }

      // Reset file after successful upload
      setFile(null)
      
    } catch (err) {
      setError(err.message || 'An error occurred while uploading the file')
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    if (!uploading) {
      setFile(null)
      setError(null)
      setSuccess(null)
      onClose()
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Import Prospects from CSV
      </DialogTitle>
      
      <DialogContent>
        <Stack spacing={3}>
          {/* File Selection */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Select a CSV file to import. Supports AngelMatch, OpenVC, and Manual formats.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <input
                accept=".csv"
                style={{ display: 'none' }}
                id="csv-file-input"
                type="file"
                onChange={handleFileSelect}
                disabled={uploading}
              />
              <label htmlFor="csv-file-input">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadIcon />}
                  disabled={uploading}
                  fullWidth
                >
                  {file ? file.name : 'Choose CSV File'}
                </Button>
              </label>
            </Box>
            {file && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                File size: {(file.size / 1024).toFixed(2)} KB
              </Typography>
            )}
          </Box>

          {/* Source Selection */}
          <TextField
            label="Source Type"
            select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            SelectProps={{
              native: true,
            }}
            disabled={uploading}
            helperText="Type of data source (for tracking)"
          >
            <option value="openvc">OpenVC</option>
            <option value="angelmatch">AngelMatch</option>
            <option value="manual">Manual Upload</option>
          </TextField>


          {/* Upload Progress */}
          {uploading && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Uploading and processing CSV...
              </Typography>
              <LinearProgress sx={{ mt: 1 }} />
            </Box>
          )}

          {/* Error Message */}
          {error && (
            <Alert severity="error" icon={<ErrorIcon />}>
              {error}
            </Alert>
          )}

          {/* Success Message */}
          {success && (
            <Alert severity="success" icon={<CheckCircleIcon />}>
              <Typography variant="body2" fontWeight="bold">
                Import Successful!
              </Typography>
              <Typography variant="body2">
                {success.message}
              </Typography>
              {success.saved !== undefined && (
                <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                  {success.saved} prospects saved to database
                </Typography>
              )}
              {success.filterStats && (
                <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                  <Typography variant="caption" fontWeight="bold" display="block" gutterBottom>
                    Filtering Statistics:
                  </Typography>
                  <Typography variant="caption" display="block">
                    Total imported: {success.filterStats.total}
                  </Typography>
                  <Typography variant="caption" display="block">
                    Relevant prospects: {success.filterStats.filtered} ({success.filterStats.percentage}%)
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Filtered out: {success.filterStats.removed}
                  </Typography>
                </Box>
              )}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          {success ? 'Close' : 'Cancel'}
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!file || uploading || !!success}
          startIcon={<UploadIcon />}
        >
          {uploading ? 'Importing...' : 'Import CSV'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

