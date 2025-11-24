import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Stack,
  Divider,
  IconButton,
  LinearProgress,
  Link,
  Paper,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  Close as CloseIcon,
  Star as StarIcon,
  Place as PlaceIcon,
  Email as EmailIcon,
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  InfoOutlined as InfoIcon
} from '@mui/icons-material'
import { statusLabels } from '@/lib/mockData'
import EmailComposeModal from './EmailComposeModal'
import LinkedInMessageModal from './LinkedInMessageModal'
import { generateMatchReasons } from '@/lib/utils/matchReasons'
import { estimateDistanceFromNYC, getDistanceDescription, getMetroScore } from '@/lib/utils/distance'
import { calculateRelevanceScore } from '@/lib/filtering/relevanceFilter'
import { parseMarkdown } from '@/lib/utils/parseMarkdown'

export default function ProspectDetailModal({ prospect, open, onClose, onStatusUpdate, onEmailSent }) {
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [generatingEmail, setGeneratingEmail] = useState(false)
  const [emailError, setEmailError] = useState(null)
  const [generatedEmail, setGeneratedEmail] = useState(null)
  const [linkedInModalOpen, setLinkedInModalOpen] = useState(false)
  const [generatingLinkedIn, setGeneratingLinkedIn] = useState(false)
  const [linkedInError, setLinkedInError] = useState(null)
  const [generatedLinkedInMessage, setGeneratedLinkedInMessage] = useState(null)
  const [aiExplanation, setAiExplanation] = useState(prospect?.aiMatchExplanation || null)
  const [generatingExplanation, setGeneratingExplanation] = useState(false)
  const [researchNotes, setResearchNotes] = useState(prospect?.researchNotes || null)
  const [generatingResearch, setGeneratingResearch] = useState(false)
  const [portfolioAnalysis, setPortfolioAnalysis] = useState(prospect?.portfolioAnalysis || null)
  // Local prospect state to allow immediate UI updates
  const [localProspect, setLocalProspect] = useState(prospect)
  const timelineRef = useRef(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  // Clear error and email state when modal closes
  useEffect(() => {
    if (!open) {
      setEmailError(null)
      setGeneratedEmail(null)
      setGeneratingEmail(false)
      setEmailModalOpen(false)
      setLinkedInError(null)
      setGeneratedLinkedInMessage(null)
      setGeneratingLinkedIn(false)
      setLinkedInModalOpen(false)
    }
  }, [open])

  // Update local prospect and AI data when prospect prop changes
  useEffect(() => {
    if (prospect) {
      setLocalProspect(prospect)
      setAiExplanation(prospect.aiMatchExplanation || null)
      setResearchNotes(prospect.researchNotes || null)
      setPortfolioAnalysis(prospect.portfolioAnalysis || null)
    }
  }, [prospect])

  // Use localProspect for display, fallback to prospect prop
  const displayProspect = localProspect || prospect

  const handleGenerateAIExplanation = async () => {
    setGeneratingExplanation(true)
    try {
      const response = await fetch('/api/ai/match-explanation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prospectId: displayProspect.id
        })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate AI explanation')
      }

      setAiExplanation(result.data.explanation)
    } catch (error) {
      console.error('Error generating AI explanation:', error)
      setEmailError(error.message || 'Failed to generate AI explanation')
    } finally {
      setGeneratingExplanation(false)
    }
  }

  const handleResearchProspect = async () => {
    setGeneratingResearch(true)
    try {
      const response = await fetch('/api/ai/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prospectId: displayProspect.id
        })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to research prospect')
      }

      setResearchNotes(result.data.researchNotes)
    } catch (error) {
      console.error('Error researching prospect:', error)
      setEmailError(error.message || 'Failed to research prospect')
    } finally {
      setGeneratingResearch(false)
    }
  }
  
  if (!displayProspect) return null

  const handleSendEmailClick = async () => {
    setGeneratingEmail(true)
    setEmailError(null)
    setGeneratedEmail(null)

    try {
      const response = await fetch('/api/email/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prospectId: displayProspect.id
        })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate email')
      }

      setGeneratedEmail(result.data)
      setEmailModalOpen(true)
    } catch (error) {
      console.error('Error generating email:', error)
      setEmailError(error.message || 'Failed to generate email')
    } finally {
      setGeneratingEmail(false)
    }
  }

  const handleEmailSend = async (emailData) => {
    // Update local prospect state immediately for responsive UI
    const now = new Date().toISOString()
    const currentProspect = localProspect || prospect
    const updatedProspect = {
      ...currentProspect,
      status: 'contacted',
      lastContactedAt: now
    }
    setLocalProspect(updatedProspect)
    
    // Update status in database
    if (onStatusUpdate) {
      await onStatusUpdate(currentProspect.id, 'contacted')
    }
    
    // Show success via callback
    if (onEmailSent) {
      onEmailSent(currentProspect.name)
    }
    
    // Close email modal
    setEmailModalOpen(false)
    setGeneratedEmail(null)
    
    // Auto-scroll to timeline after a brief delay to allow DOM update
    setTimeout(() => {
      if (timelineRef.current) {
        timelineRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        })
      }
    }, 100)
  }

  const handleGenerateLinkedInClick = async () => {
    setGeneratingLinkedIn(true)
    setLinkedInError(null)
    setGeneratedLinkedInMessage(null)

    try {
      const response = await fetch('/api/linkedin/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prospectId: displayProspect.id
        })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate LinkedIn message')
      }

      setGeneratedLinkedInMessage(result.data)
      setLinkedInModalOpen(true)
    } catch (error) {
      console.error('Error generating LinkedIn message:', error)
      setLinkedInError(error.message || 'Failed to generate LinkedIn message')
    } finally {
      setGeneratingLinkedIn(false)
    }
  }

  const handleLinkedInMessageGenerated = async () => {
    // Update local prospect state immediately for responsive UI
    const now = new Date().toISOString()
    const currentProspect = localProspect || prospect
    const updatedProspect = {
      ...currentProspect,
      status: 'contacted',
      lastContactedAt: now
    }
    setLocalProspect(updatedProspect)
    
    // Update status in database
    if (onStatusUpdate) {
      await onStatusUpdate(currentProspect.id, 'contacted')
    }
    
    // Auto-scroll to timeline after a brief delay to allow DOM update
    setTimeout(() => {
      if (timelineRef.current) {
        timelineRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        })
      }
    }, 100)
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'success'
    if (score >= 80) return 'primary'
    if (score >= 70) return 'info'
    if (score >= 60) return 'warning'
    return 'error' // Use error color for low scores to make them more visible
  }

  // Calculate feature scores based on actual prospect data
  const featureScores = {
    geoProximity: ['NY', 'NJ', 'CT', 'PA'].includes(displayProspect.location?.state || displayProspect.hqState) ? 100 : 60,
    stageMatch: (displayProspect.stagePreferences || []).some(s => ['Seed', 'Series A', 'Pre-Seed'].includes(s)) ? 100 : 75,
    recentActivity: displayProspect.lastContactedAt ? 85 : (displayProspect.updatedAt ? 70 : 50)
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h5" component="div">
              {displayProspect.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {displayProspect.org}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {/* Fit Score Section */}
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, bgcolor: 'background.default' }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            alignItems={{ xs: 'center', sm: 'center' }} 
            spacing={2} 
            mb={2}
          >
            <Box
              sx={{
                width: { xs: 80, sm: 90 },
                height: { xs: 80, sm: 90 },
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'primary.main',
                color: 'white',
                flexShrink: 0,
                padding: { xs: 1, sm: 1.5 }
              }}
            >
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                sx={{ 
                  fontSize: displayProspect.fitScore >= 100 
                    ? { xs: '1.75rem', sm: '2.5rem' }
                    : { xs: '2rem', sm: '3rem' },
                  lineHeight: 1
                }}
              >
                {displayProspect.fitScore}
              </Typography>
            </Box>
            <Box flex={1} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="h6" gutterBottom>
                Fit Score
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {displayProspect.whySummary}
              </Typography>
            </Box>
          </Stack>

          {/* Score Breakdown */}
          <Typography variant="subtitle2" sx={{ mt: 3, mb: 2 }}>
            Score Breakdown:
          </Typography>
          <Stack spacing={1.5}>
            {[
              { label: 'Geographic Proximity', value: featureScores.geoProximity },
              { label: 'Stage Match', value: featureScores.stageMatch },
              { label: 'Recent Activity', value: featureScores.recentActivity }
            ].map((feature, idx) => (
              <Box key={idx}>
                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2">{feature.label}</Typography>
                  <Typography variant="body2" fontWeight="500">
                    {Math.round(feature.value)}%
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.max(1, feature.value)} // Ensure at least 1% so bar is visible
                  color={getScoreColor(feature.value)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                    }
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Paper>

        {/* Why They Match Section */}
        {displayProspect.hqState && (
          <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" mb={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <InfoIcon />
                <Typography variant="h6" fontWeight="bold">
                  Why This Investor Is A Match
                </Typography>
              </Stack>
              {!aiExplanation && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleGenerateAIExplanation}
                  disabled={generatingExplanation}
                  startIcon={generatingExplanation ? <CircularProgress size={16} /> : null}
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'inherit',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                      borderColor: 'rgba(255, 255, 255, 0.7)'
                    }
                  }}
                >
                  {generatingExplanation ? 'Generating...' : '🤖 AI Analysis'}
                </Button>
              )}
            </Stack>
            <Stack spacing={1.5}>
              {generateMatchReasons({ ...displayProspect, aiMatchExplanation: aiExplanation }).map((reason, idx) => (
                <Stack 
                  key={idx} 
                  direction="row" 
                  spacing={1.5} 
                  alignItems="flex-start"
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: reason.highlight ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    border: reason.highlight ? '1px solid rgba(255, 255, 255, 0.3)' : 'none'
                  }}
                >
                  <Typography variant="h6" sx={{ fontSize: '1.2rem', lineHeight: 1 }}>
                    {reason.icon}
                  </Typography>
                  <Typography variant="body2" sx={{ flex: 1, fontWeight: reason.highlight ? 600 : 400 }}>
                    {reason.text}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            
            {/* Distance and Metro Score */}
            {displayProspect.hqState && (displayProspect.hqState === 'NY' || displayProspect.hqState === 'NJ' || displayProspect.hqState === 'CT' || displayProspect.hqState === 'PA') && (
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <PlaceIcon fontSize="small" />
                  <Typography variant="body2">
                    {displayProspect.hqCity || 'Location'}, {displayProspect.hqState}
                    {(() => {
                      const distance = estimateDistanceFromNYC(displayProspect.hqState, displayProspect.hqCity);
                      return distance !== null ? ` (${getDistanceDescription(distance)})` : '';
                    })()}
                  </Typography>
                  <Chip 
                    label={`Metro Score: ${getMetroScore(estimateDistanceFromNYC(displayProspect.hqState, displayProspect.hqCity))}`}
                    size="small"
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                      color: 'inherit',
                      fontWeight: 600
                    }}
                  />
                </Stack>
              </Box>
            )}
          </Paper>
        )}

        {/* Portfolio Analysis */}
        {portfolioAnalysis && (
          <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <TrendingUpIcon />
              <Typography variant="h6" fontWeight="bold">
                Portfolio Analysis
              </Typography>
            </Stack>
            {portfolioAnalysis.insights && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                {portfolioAnalysis.insights}
              </Typography>
            )}
            {portfolioAnalysis.commonCharacteristics && portfolioAnalysis.commonCharacteristics.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Common Characteristics:</Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                  {portfolioAnalysis.commonCharacteristics.map((char, idx) => (
                    <Chip key={idx} label={char} size="small" sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
                  ))}
                </Stack>
              </Box>
            )}
            {portfolioAnalysis.sectorFocus && (
              <Typography variant="body2">
                <strong>Sector Focus:</strong> {portfolioAnalysis.sectorFocus}
              </Typography>
            )}
          </Paper>
        )}

        {/* Research Notes */}
        {researchNotes && (
          <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, bgcolor: 'background.default' }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" mb={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <InfoIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Research Notes
                </Typography>
              </Stack>
              <Button
                size="small"
                variant="outlined"
                onClick={handleResearchProspect}
                disabled={generatingResearch}
                startIcon={generatingResearch ? <CircularProgress size={16} /> : null}
              >
                {generatingResearch ? 'Researching...' : '🔄 Refresh'}
              </Button>
            </Stack>
            <Box>
              {parseMarkdown(researchNotes)}
            </Box>
          </Paper>
        )}
        {!researchNotes && (
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              onClick={handleResearchProspect}
              disabled={generatingResearch}
              startIcon={generatingResearch ? <CircularProgress size={16} /> : <InfoIcon />}
              fullWidth
            >
              {generatingResearch ? 'Researching Prospect...' : '🤖 Generate Research Notes'}
            </Button>
          </Box>
        )}

        {/* Contact Information */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Contact Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon color="primary" fontSize="small" sx={{ flexShrink: 0 }} />
                  {displayProspect.email ? (
                    <Link 
                      href={`mailto:${displayProspect.email}`} 
                      underline="hover"
                      sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        wordBreak: 'break-all'
                      }}
                    >
                      {displayProspect.email}
                    </Link>
                  ) : (
                    <Typography variant="body2" color="text.secondary">N/A</Typography>
                  )}
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIcon color="primary" fontSize="small" sx={{ flexShrink: 0 }} />
                  <Typography variant="body2">{displayProspect.phone || 'N/A'}</Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LinkedInIcon color="primary" fontSize="small" sx={{ flexShrink: 0 }} />
                  {displayProspect.linkedin ? (
                    <Link 
                      href={displayProspect.linkedin.startsWith('http') ? displayProspect.linkedin : `https://${displayProspect.linkedin}`} 
                      target="_blank" 
                      underline="hover"
                    >
                      LinkedIn Profile
                    </Link>
                  ) : (
                    <Typography variant="body2" color="text.secondary">N/A</Typography>
                  )}
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LanguageIcon color="primary" fontSize="small" sx={{ flexShrink: 0 }} />
                  {displayProspect.website ? (
                    <Link href={displayProspect.website} target="_blank" underline="hover">
                      Company Website
                    </Link>
                  ) : (
                    <Typography variant="body2" color="text.secondary">N/A</Typography>
                  )}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Investment Details */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Investment Profile
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Location
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PlaceIcon color="primary" fontSize="small" />
                  <Typography>
                    {displayProspect.location.city}, {displayProspect.location.state}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Focus Sectors
                </Typography>
                {displayProspect.sectors && displayProspect.sectors.length > 0 ? (
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                    {displayProspect.sectors.map((sector, idx) => (
                      <Chip key={idx} label={sector} size="small" color="primary" variant="outlined" />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">N/A</Typography>
                )}
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Stage Preferences
                </Typography>
                {displayProspect.stagePreferences && displayProspect.stagePreferences.length > 0 ? (
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                    {displayProspect.stagePreferences.map((stage, idx) => (
                      <Chip key={idx} label={stage} size="small" color="primary" />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">N/A</Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Portfolio Companies */}
        <Divider sx={{ my: 3 }} />
        <Box>
          <Typography variant="h6" gutterBottom>
            Portfolio Companies
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            {displayProspect.portfolio && displayProspect.portfolio.length > 0 ? (
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                {displayProspect.portfolio.map((company, idx) => (
                  <Chip 
                    key={idx} 
                    icon={<BusinessIcon />}
                    label={company} 
                    size="small" 
                    variant="outlined"
                  />
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">N/A</Typography>
            )}
          </Paper>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Activity Timeline */}
        <Box ref={timelineRef}>
          <Typography variant="h6" gutterBottom>
            Activity Timeline
          </Typography>
          <Box sx={{ position: 'relative', pl: 3, py: 1 }}>
            {/* Vertical timeline line */}
            <Box
              sx={{
                position: 'absolute',
                left: 8,
                top: 0,
                bottom: 0,
                width: 2,
                bgcolor: 'divider',
                borderRadius: 1
              }}
            />
            
            <Stack spacing={2}>
              {displayProspect.createdAt && (
                <Box sx={{ position: 'relative' }}>
                  {/* Timeline dot */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -20,
                      top: 4,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      border: '2px solid',
                      borderColor: 'background.paper',
                      zIndex: 1
                    }}
                  />
                  <Typography variant="body2" fontWeight="500" gutterBottom>
                    Added to database
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(() => {
                      try {
                        const date = new Date(displayProspect.createdAt);
                        return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        });
                      } catch {
                        return 'N/A';
                      }
                    })()}
                  </Typography>
                </Box>
              )}
              
              {displayProspect.lastEnrichedAt && (
                <Box sx={{ position: 'relative' }}>
                  {/* Timeline dot */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -20,
                      top: 4,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: 'info.main',
                      border: '2px solid',
                      borderColor: 'background.paper',
                      zIndex: 1
                    }}
                  />
                  <Typography variant="body2" fontWeight="500" gutterBottom>
                    Last enriched
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(() => {
                      try {
                        const date = new Date(displayProspect.lastEnrichedAt);
                        return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        });
                      } catch {
                        return 'N/A';
                      }
                    })()}
                  </Typography>
                </Box>
              )}
              
              {(displayProspect.lastContactedAt || displayProspect.status === 'contacted') && (
                <Box sx={{ position: 'relative' }}>
                  {/* Timeline dot */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -20,
                      top: 4,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      border: '2px solid',
                      borderColor: 'background.paper',
                      zIndex: 1
                    }}
                  />
                  <Typography variant="body2" fontWeight="500" gutterBottom>
                    Last contacted
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(() => {
                      try {
                        if (displayProspect.lastContactedAt) {
                          const date = new Date(displayProspect.lastContactedAt);
                          if (!isNaN(date.getTime())) {
                            return date.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            });
                          }
                        }
                        // If no lastContactedAt but status is contacted, show "Just now" or current date
                        return new Date().toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        });
                      } catch {
                        return 'N/A';
                      }
                    })()}
                  </Typography>
                </Box>
              )}
              
              {/* Current status - always shown */}
              <Box sx={{ position: 'relative' }}>
                {/* Timeline dot */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: -20,
                    top: 4,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: displayProspect.status === 'contacted' ? 'success.main' : 
                             displayProspect.status === 'interested' ? 'info.main' : 
                             displayProspect.status === 'not_interested' ? 'error.main' : 'primary.main',
                    border: '2px solid',
                    borderColor: 'background.paper',
                    zIndex: 1
                  }}
                />
                <Typography variant="body2" fontWeight="500" gutterBottom>
                  Current status
                </Typography>
                <Chip 
                  label={statusLabels[displayProspect.status]} 
                  size="small" 
                  color={
                    displayProspect.status === 'contacted' ? 'success' : 
                    displayProspect.status === 'interested' ? 'info' : 
                    displayProspect.status === 'not_interested' ? 'error' : 'primary'
                  }
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Stack>
          </Box>
        </Box>

        {/* Notes Section - Only show if notes exist */}
        {displayProspect.notes && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <InfoIcon color="info" />
                <Typography variant="h6">
                  Notes
                </Typography>
              </Stack>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  bgcolor: 'info.lighter',
                  borderColor: 'info.main',
                  borderWidth: 1
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {displayProspect.notes}
                </Typography>
              </Paper>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, flexDirection: { xs: 'column-reverse', sm: 'row' }, gap: 1 }}>
        <Button 
          onClick={onClose}
          fullWidth={isMobile}
        >
          Close
        </Button>
        {(emailError || linkedInError) && (
          <Alert severity="error" sx={{ flex: 1 }}>
            {emailError || linkedInError}
          </Alert>
        )}
        {displayProspect.linkedin && (
          <Button 
            variant="contained" 
            color="primary"
            startIcon={generatingLinkedIn ? <CircularProgress size={20} /> : <LinkedInIcon />}
            onClick={handleGenerateLinkedInClick}
            disabled={generatingLinkedIn}
            fullWidth={isMobile}
          >
            {generatingLinkedIn ? 'Generating Message...' : 'Contact on LinkedIn'}
          </Button>
        )}
        {displayProspect.email && (
          <Button 
            variant="contained" 
            startIcon={generatingEmail ? <CircularProgress size={20} /> : <EmailIcon />}
            onClick={handleSendEmailClick}
            disabled={generatingEmail}
            fullWidth={isMobile}
          >
            {generatingEmail ? 'Generating Email...' : 'Send Email'}
          </Button>
        )}
      </DialogActions>

      {/* Email Compose Modal */}
      <EmailComposeModal
        open={emailModalOpen}
        onClose={() => {
          setEmailModalOpen(false)
          setGeneratedEmail(null)
        }}
        prospect={displayProspect}
        initialEmail={generatedEmail}
        onSend={handleEmailSend}
      />

      {/* LinkedIn Message Modal */}
      <LinkedInMessageModal
        open={linkedInModalOpen}
        onClose={() => {
          setLinkedInModalOpen(false)
          setGeneratedLinkedInMessage(null)
        }}
        prospect={displayProspect}
        initialMessage={generatedLinkedInMessage}
        onMessageGenerated={handleLinkedInMessageGenerated}
      />
    </Dialog>
  )
}

