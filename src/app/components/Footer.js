import { Box, Container, Typography, Link, Stack } from '@mui/material'

export default function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: '#3F3F3F',
        color: '#A5A5A5',
        py: 4,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={4}
          justifyContent="space-between"
          alignItems={{ xs: 'center', sm: 'flex-start' }}
        >
          <Box textAlign={{ xs: 'center', sm: 'left' }}>
            <Typography 
              variant="h6" 
              sx={{ color: '#14E2BA', mb: 1, fontWeight: 600 }}
            >
              Westchester Angels
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              AI Investor Prospecting Engine
            </Typography>
            <Typography variant="body2">
              Supporting early-stage startups in the Tri-State region
            </Typography>
          </Box>

          <Box textAlign={{ xs: 'center', sm: 'left' }}>
            <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Stack spacing={0.5}>
              <Link href="/" underline="hover" sx={{ color: '#A5A5A5', '&:hover': { color: '#14E2BA' } }}>
                Home
              </Link>
              <Link href="/dashboard" underline="hover" sx={{ color: '#A5A5A5', '&:hover': { color: '#14E2BA' } }}>
                Dashboard
              </Link>
              <Link href="/login" underline="hover" sx={{ color: '#A5A5A5', '&:hover': { color: '#14E2BA' } }}>
                Login
              </Link>
            </Stack>
          </Box>

          <Box textAlign={{ xs: 'center', sm: 'left' }}>
            <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1, fontWeight: 600 }}>
              Resources
            </Typography>
            <Stack spacing={0.5}>
              <Link 
                href="https://westchesterangels.com" 
                target="_blank"
                underline="hover" 
                sx={{ color: '#A5A5A5', '&:hover': { color: '#14E2BA' } }}
              >
                Main Website
              </Link>
              <Link href="/api/health" underline="hover" sx={{ color: '#A5A5A5', '&:hover': { color: '#14E2BA' } }}>
                API Status
              </Link>
            </Stack>
          </Box>
        </Stack>

        <Box 
          sx={{ 
            mt: 4, 
            pt: 3, 
            borderTop: '1px solid #666666',
            textAlign: 'center' 
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} Westchester Angels. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

