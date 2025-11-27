'use client'

import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Stack,
  Divider,
  Chip,
  Paper
} from '@mui/material'
import {
  AutoAwesome as AutoAwesomeIcon,
  Assessment as AssessmentIcon,
  ManageSearch as ScreenSearchIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Description as DescriptionIcon,
  Warning as WarningIcon,
  Dashboard as DashboardIcon,
  SupportAgent as SupportAgentIcon,
  People as PeopleIcon,
  PersonSearch as PersonSearchIcon,
  Summarize as SummarizeIcon,
  BusinessCenter as BusinessCenterIcon,
  AccountBalance as AccountBalanceIcon,
  Psychology as PsychologyIcon,
  AccountTree as WorkflowIcon,
  RecordVoiceOver as RecordVoiceOverIcon,
  Gavel as GavelIcon,
  Analytics as AnalyticsIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  RocketLaunch as RocketLaunchIcon
} from '@mui/icons-material'

const solutions = [
  {
    category: 'Deal Flow Automation',
    categoryIcon: <WorkflowIcon />,
    ctaLabel: 'Add to Roadmap',
    items: [
      {
        title: 'AI Startup Application Screener',
        description: 'Automatically processes GUST applications, extracts critical signals (market, traction, founders, metrics), scores each startup, and highlights top opportunities with key risks and committee-ready insights.',
        icon: <ScreenSearchIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      },
      {
        title: 'AI Pre-Screening Report Generator',
        description: 'Generates detailed screening reports with market analysis, competition mapping, scalability assessment, founder risk profiles, strengths, weaknesses, and clear recommendations.',
        icon: <AssessmentIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      }
    ]
  },
  {
    category: 'Investor Meeting Enhancements',
    categoryIcon: <RecordVoiceOverIcon />,
    ctaLabel: 'Add to Roadmap',
    items: [
      {
        title: 'AI Pitch Analyzer',
        description: 'Analyzes live pitches or uploaded pitch decks/videos, producing summaries, extracting claims, verifying metrics, surfacing red flags, generating Q&A prompts, and scoring alignment with your investment criteria.',
        icon: <AutoAwesomeIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      },
      {
        title: 'AI Q&A Assistant for Selection Committee',
        description: 'Committee members can ask scenario-based questions (e.g., biotech with limited revenue). AI produces tailored question lists, red-flag checks, due-diligence checklists, and follow-up suggestions to improve consistency.',
        icon: <QuestionAnswerIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      }
    ]
  },
  {
    category: 'Due Diligence Automation',
    categoryIcon: <GavelIcon />,
    ctaLabel: 'Add to Roadmap',
    items: [
      {
        title: 'AI Due Diligence Report Generator',
        description: 'Reviews pitch materials, decks, websites, financials, and founder data to create full due-diligence reports including market sizing, TAM/SAM/SOM, business model evaluation, founder background, risks, compliance, technology overview, and competitive landscape.',
        icon: <DescriptionIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      },
      {
        title: 'AI Red-Flag Detector',
        description: 'Identifies founder-market concerns, unrealistic projections, missing traction, inflated TAM, weak competitive moats, and fraud indicators based on historical patterns and failure statistics.',
        icon: <WarningIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      }
    ]
  },
  {
    category: 'Portfolio Monitoring & Support',
    categoryIcon: <AnalyticsIcon />,
    ctaLabel: 'Add to Roadmap',
    items: [
      {
        title: 'AI Portfolio Performance Dashboard',
        description: 'Monitors KPIs, traction, news mentions, industry movements, and competitor funding. Generates monthly insights highlighting risks, opportunities, and meaningful changes in portfolio health.',
        icon: <DashboardIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      },
      {
        title: 'Founder Support AI Assistant',
        description: 'An AI assistant available to portfolio founders for research, pitch refinement, investor updates, hiring plans, and competitive analysis—adding tangible value to Westchester Angels’ support offering.',
        icon: <SupportAgentIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      }
    ]
  },
  {
    category: 'Membership Growth & Engagement',
    categoryIcon: <GroupIcon />,
    ctaLabel: 'Add to Roadmap',
    items: [
      {
        title: 'Angel Member Engagement Analyzer',
        description: 'Analyzes each member’s interests, sector expertise, past investments, ticket size, and activity to recommend ideal matches for each deal and optimize DD team composition.',
        icon: <PeopleIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      },
      {
        title: 'New Member Discovery Engine',
        description: 'Scans LinkedIn, AngelList, SEC filings, startup events, and regional news to identify potential new angel members and expand your investor network.',
        icon: <PersonSearchIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      }
    ]
  },
  {
    category: 'Administrative & Operational AI',
    categoryIcon: <SettingsIcon />,
    ctaLabel: 'Add to Roadmap',
    items: [
      {
        title: 'Automated Monthly Reporting',
        description: 'Produces monthly reports covering deal flow, due diligence progress, portfolio updates, funding movements, recommended startups, and upcoming events—replacing manual reporting.',
        icon: <SummarizeIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      },
      {
        title: 'AI-Driven CRM & Investor Relations',
        description: 'Automates follow-ups, check-ins, meeting summaries, reminders, and Zoom call note extraction—syncing directly into your dashboard for consistent communication.',
        icon: <BusinessCenterIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      }
    ]
  },
  {
    category: 'Strategic Fund-Transition AI Tools',
    categoryIcon: <TrendingUpIcon />,
    ctaLabel: 'Add to Roadmap',
    items: [
      {
        title: 'AI Fund Model Simulator',
        description: 'Simulates fund sizes, fee structures, entry criteria, and expected returns based on historical performance to support the transition into an investment fund.',
        icon: <AccountBalanceIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      },
      {
        title: 'AI Investment Thesis Consistency Checker',
        description: 'Evaluates new deals against your investment thesis, detects drift, and recommends refinements—ensuring alignment during the transition from angel network to fund.',
        icon: <PsychologyIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      }
    ]
  }
];

export default function AISolutionsPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Typography 
          variant="h1" 
          component="h1" 
          gutterBottom
          sx={{
            color: 'primary.main',
            mb: 2,
            fontSize: { xs: '2rem', sm: '3rem' }
          }}
        >
          Additional AI Solutions
        </Typography>
        
        <Typography 
          variant="h5" 
          color="text.secondary" 
          gutterBottom
          sx={{ mb: 1, fontSize: { xs: '1.1rem', sm: '1.5rem' } }}
        >
          Tailored for Westchester Angels
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            maxWidth: '800px', 
            mx: 'auto',
            mb: 2,
            fontWeight: 500,
            fontSize: { xs: '0.95rem', sm: '1.05rem' }
          }}
        >
          Built to support your transition from an angel network to a fully scalable investment fund.
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ maxWidth: '800px', mx: 'auto' }}
        >
          High-value, realistic, fund-friendly AI solutions based on your existing process, website, and operational workflow. These tools align 1:1 with your current operations to maximize efficiency and impact.
        </Typography>
      </Box>

      {/* Solutions by Category */}
      {solutions.map((category, categoryIndex) => (
        <Box key={category.category} mb={6}>
          {/* Category Header */}
          <Box mb={3}>
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={2} 
              mb={1.5}
              sx={{ 
                color: 'primary.main',
                '& svg': { 
                  fontSize: 32,
                  transition: 'all 0.3s ease',
                  filter: 'drop-shadow(0 0 0px rgba(20, 226, 186, 0))'
                },
                '&:hover svg': {
                  filter: 'drop-shadow(0 0 8px rgba(20, 226, 186, 0.5))',
                  transform: 'scale(1.05)'
                }
              }}
            >
              {category.categoryIcon}
              <Typography 
                variant="h4" 
                component="h2"
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  transition: 'color 0.3s ease'
                }}
              >
                {category.category}
              </Typography>
            </Stack>
            {category.ctaLabel && (
              <Chip
                label={category.ctaLabel}
                size="small"
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  height: 24,
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }}
              />
            )}
          </Box>
          
          <Divider sx={{ mb: 4 }} />

          {/* Solution Cards */}
          <Grid container spacing={3}>
            {category.items.map((solution, solutionIndex) => (
              <Grid 
                size={{ xs: 12, sm: 6, md: 6 }} 
                key={`${categoryIndex}-${solutionIndex}`}
              >
                <Card 
                  sx={{ 
                    height: '100%', 
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { 
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)'
                    } 
                  }}
                >
                  <CardContent sx={{ py: 3, px: 3 }}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      {solution.icon}
                    </Box>
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      gutterBottom
                      sx={{ 
                        textAlign: 'center',
                        mb: 2,
                        fontWeight: 600,
                        fontSize: { xs: '1.25rem', sm: '1.5rem' }
                      }}
                    >
                      {solution.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ 
                        textAlign: 'left',
                        lineHeight: 1.7
                      }}
                    >
                      {solution.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {/* Future Vision Section */}
      <Box mt={10} mb={6}>
        <Paper 
          sx={{ 
            p: 4, 
            background: 'linear-gradient(135deg, rgba(20, 226, 186, 0.05) 0%, rgba(20, 226, 186, 0.15) 100%)',
            border: '1px solid',
            borderColor: 'primary.main',
            borderRadius: 2
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <RocketLaunchIcon sx={{ color: 'primary.main', fontSize: 32 }} />
            <Typography 
              variant="h4" 
              component="h2"
              sx={{ 
                color: 'primary.main',
                fontSize: { xs: '1.5rem', sm: '2rem' },
                fontWeight: 600
              }}
            >
              Long-Term AI Vision for Westchester Angels
            </Typography>
          </Stack>
          
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <AutoAwesomeIcon sx={{ color: 'primary.main', fontSize: 28, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Unified Investment OS
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Combining deal flow, due diligence, investor relations, and portfolio tracking into a single intelligent platform.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <VisibilityIcon sx={{ color: 'primary.main', fontSize: 28, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Real-Time Market Intelligence Engine
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monitoring founders, competitors, and sectors to provide actionable insights and early warning signals.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <AnalyticsIcon sx={{ color: 'primary.main', fontSize: 28, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    AI-Driven Fund Operations
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Including LP reporting, compliance automation, and predictive analytics for strategic decision-making.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  )
}

