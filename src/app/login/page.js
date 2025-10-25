import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack
} from '@mui/material'
import {
  Lock as LockIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  AdminPanelSettings as AdminIcon,
  Group as GroupIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material'

export default function LoginPage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <LockIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          Login
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Authentication will be implemented in Phase 1
        </Typography>
      </Box>

      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <SecurityIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h5">
              Passwordless Authentication
            </Typography>
          </Stack>

          <Typography color="text.secondary" paragraph>
            This application will use NextAuth.js with magic link authentication for secure, passwordless access.
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
              Implementation Plan:
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Email-based passwordless login"
                  secondary="No passwords to remember or manage"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Session management with NextAuth"
                  secondary="Secure, token-based authentication"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <LockIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Protected API routes"
                  secondary="Middleware-based route protection"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <AdminIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Role-based access control"
                  secondary="Admin and viewer permissions"
                />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ mt: 4, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <GroupIcon color="primary" />
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  Coming Soon
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Full authentication system will be available in Week 1, Day 3-4
                </Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Box mt={4} textAlign="center">
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          href="/"
          size="large"
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  )
}
