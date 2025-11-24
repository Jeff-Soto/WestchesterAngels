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
        description: 'Automatically ingests GUST applications, extracts key information (market size, traction, founders, metrics), and scores startups based on your criteria. Flags top opportunities and creates summaries with risks and questions for the screening committee.',
        icon: <ScreenSearchIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      },
      {
        title: 'AI Pre-Screening Report Generator',
        description: 'For each startup that passes initial screening, automatically generates comprehensive reports including market size analysis, competition mapping, scalability potential, founder risk profiles, strengths/weaknesses, and recommendations.',
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
        description: 'During live pitches or from uploaded pitch decks/videos, AI listens and creates evaluation summaries, extracts key claims, fact-checks metrics, highlights risky assumptions, generates Q&A questions, and provides scoring aligned to Westchester Angels\' criteria.',
        icon: <AutoAwesomeIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      },
      {
        title: 'AI Q&A Assistant for Selection Committee',
        description: 'Committee members can ask questions like "What should we ask a biotech startup with limited revenue?" AI produces sector-specific question lists, red-flag checks, due diligence checklists, and suggested follow-up areas to help the committee sound sharper and more consistent.',
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
        description: 'Analyzes pitch materials, decks, websites, financials, and founder profiles to create comprehensive due diligence packages including market analysis, TAM/SAM/SOM, business model evaluation, founder background summaries, risks, compliance notes, technology overview, competitive landscape, and investment thesis fit.',
        icon: <DescriptionIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      },
      {
        title: 'AI Red-Flag Detector',
        description: 'Trained on past deals and startup failure statistics. Flags poor founder-market fit, unrealistic financial projections, missing traction, overstated TAM, weak competition analysis, and potential fraud indicators. A powerful differentiator in the pitch process.',
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
        description: 'Automatically tracks revenue/traction updates, news mentions, founder posts, industry shifts, and competitor funding events. Creates monthly summaries highlighting risks and opportunities, such as "Company X is down 20% MoM. Their competitor just raised $15M. Risk level increased."',
        icon: <DashboardIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      },
      {
        title: 'Founder Support AI Assistant',
        description: 'A dedicated AI assistant for founders in your portfolio. Helps with market research, pitch refinement, email writing, investor updates, competitive analysis, and hiring plans. This becomes a selling point: "Invest with Westchester Angels and gain access to an AI founder support system."',
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
        title: 'Angel Member Matching / Engagement Analyzer',
        description: 'AI models each angel investor\'s interests, sector comfort, ticket size, past investments, meeting attendance, and engagement level. Suggests which members would be most interested in each startup, optimizes DD team composition, and prevents investor fatigue.',
        icon: <PeopleIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      },
      {
        title: 'New Member Discovery Engine',
        description: 'Continuously scans LinkedIn, AngelList, SEC filings, startup events, podcasts, and local news to suggest potential new angel members. Extends your existing prospecting engine to help grow the angel group membership.',
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
        description: 'AI generates comprehensive monthly reports including deal flow summaries, due diligence reports, portfolio updates, funding events, upcoming events, and top recommended startups. Replaces manual reporting work and ensures consistent, timely updates.',
        icon: <SummarizeIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      },
      {
        title: 'AI-Driven CRM / Investor Relations',
        description: 'Automates follow-ups, check-ins, meeting summaries, reminders, and notes extraction from Zoom calls. All synced with the main dashboard to streamline investor relations and maintain consistent communication.',
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
        description: 'Allows leadership to model different fund sizes, fee structures, entry criteria, and expected returns based on historical angel performance. Helps plan future fund architecture as Westchester Angels transitions from an individual angel group to a full investment fund.',
        icon: <AccountBalanceIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      },
      {
        title: 'AI Investment Thesis Generator + Consistency Checker',
        description: 'Enter your investment thesis and AI evaluates whether new deals match it, whether the group is drifting from the thesis, and how to refine it. Extremely valuable during fund creation to maintain strategic focus and consistency.',
        icon: <PsychologyIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      }
    ]
  }
]

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

