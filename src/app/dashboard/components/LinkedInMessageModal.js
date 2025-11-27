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
  IconButton
} from '@mui/material'
import {
  Close as CloseIcon,
  ContentCopy as CopyIcon,
  LinkedIn as LinkedInIcon,
  Check as CheckIcon
} from '@mui/icons-material'

export default function LinkedInMessageModal({ 
  open, 
  onClose, 
  prospect, 
  initialMessage,
  onMessageGenerated
}) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [personalizedReasons, setPersonalizedReasons] = useState('')
  const [copied, setCopied] = useState(false)

  // Load initial message data when modal opens
  useEffect(() => {
    if (open && initialMessage) {
      setMessage(initialMessage.message || '')
      setPersonalizedReasons(initialMessage.personalizedReasons || '')
      setError(null)
    }
  }, [open, initialMessage])

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setMessage('')
      setPersonalizedReasons('')
      setError(null)
      setLoading(false)
      setCopied(false)
    }
  }, [open])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleClose = () => {
    if (onMessageGenerated) {
      onMessageGenerated()
    }
    onClose()
  }

  if (!prospect) return null

  const linkedinUrl = prospect.linkedin?.startsWith('http') 
    ? prospect.linkedin 
    : `https://${prospect.linkedin}`

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" component="div">
              LinkedIn Message
            </Typography>
            <Typography variant="body2" color="text.secondary">
              For: {prospect.name} {prospect.org ? `(${prospect.org})` : ''}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
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
              Why this message is personalized:
            </Typography>
            <Typography variant="body2">
              {personalizedReasons}
            </Typography>
          </Alert>
        )}

        <Stack spacing={3}>
          {prospect.linkedin && (
            <Box>
              <Button
                variant="outlined"
                startIcon={<LinkedInIcon />}
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mb: 2 }}
              >
                Open LinkedIn Profile
              </Button>
            </Box>
          )}

          <TextField
            label="LinkedIn Message"
            fullWidth
            multiline
            rows={12}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="LinkedIn message content..."
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
              Copy this message and paste it into LinkedIn when connecting with {prospect.name}.
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={handleClose}
          disabled={loading}
        >
          Close
        </Button>
        <Button
          variant="outlined"
          startIcon={copied ? <CheckIcon /> : <CopyIcon />}
          onClick={handleCopy}
          disabled={loading || !message.trim()}
        >
          {copied ? 'Copied!' : 'Copy Message'}
        </Button>
        {prospect.linkedin && (
          <Button
            variant="contained"
            startIcon={<LinkedInIcon />}
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            disabled={loading}
          >
            Open LinkedIn
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

