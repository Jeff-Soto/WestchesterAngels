import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Stack,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material'
import {
  Close as CloseIcon,
  Send as SendIcon,
  Edit as EditIcon
} from '@mui/icons-material'

export default function EmailComposeModal({ 
  open, 
  onClose, 
  prospect, 
  initialEmail,
  onSend 
}) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [personalizedReasons, setPersonalizedReasons] = useState('')

  // Load initial email data when modal opens
  useEffect(() => {
    if (open && initialEmail) {
      setSubject(initialEmail.subject || '')
      setBody(initialEmail.body || '')
      setPersonalizedReasons(initialEmail.personalizedReasons || '')
      setError(null)
    }
  }, [open, initialEmail])

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setSubject('')
      setBody('')
      setPersonalizedReasons('')
      setError(null)
      setLoading(false)
    }
  }, [open])

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      setError('Subject and body are required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Call the onSend callback with the email data
      await onSend({
        subject: subject.trim(),
        body: body.trim()
      })
      
      // Close modal on success
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to send email')
    } finally {
      setLoading(false)
    }
  }

  if (!prospect) return null

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" component="div">
              Compose Email
            </Typography>
            <Typography variant="body2" color="text.secondary">
              To: {prospect.name} ({prospect.org})
            </Typography>
          </Box>
          <Button
            onClick={onClose}
            size="small"
            sx={{ minWidth: 'auto' }}
          >
            <CloseIcon />
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {personalizedReasons && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              Why this email is personalized:
            </Typography>
            <Typography variant="body2">
              {personalizedReasons}
            </Typography>
          </Alert>
        )}

        <Stack spacing={3}>
          <TextField
            label="Subject"
            fullWidth
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject line..."
            disabled={loading}
            InputProps={{
              startAdornment: <EditIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />

          <TextField
            label="Email Body"
            fullWidth
            multiline
            rows={12}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Email body content..."
            disabled={loading}
            sx={{
              '& .MuiInputBase-root': {
                fontFamily: 'monospace',
                fontSize: '0.9rem'
              }
            }}
          />

          <Box>
            <Typography variant="caption" color="text.secondary">
              You can edit the subject and body before sending. The email will be sent to {prospect.email}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          onClick={handleSend}
          disabled={loading || !subject.trim() || !body.trim()}
        >
          {loading ? 'Sending...' : 'Confirm & Send'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

