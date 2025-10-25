import ThemeRegistry from './ThemeRegistry'
import Footer from './components/Footer'
import { Box } from '@mui/material'

export const metadata = {
  title: 'AI Investor Prospecting Engine | Westchester Angels',
  description: 'Discover, enrich, and prioritize prospective investors using AI. Supporting early-stage startups in Westchester County and the Tri-State region.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <ThemeRegistry>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {children}
          </Box>
          <Footer />
        </ThemeRegistry>
      </body>
    </html>
  )
}

