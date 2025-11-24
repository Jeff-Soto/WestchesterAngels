import { useState, useRef, useEffect } from 'react'
import {
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Chip
} from '@mui/material'
import { parseMarkdown } from '@/lib/utils/parseMarkdown'
import {
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as ChatbotIcon,
  Minimize as MinimizeIcon
} from '@mui/icons-material'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI assistant for the Westchester Angels Investor Prospecting Engine. I can help you understand how to use the system, find investors, use AI features, and more. What would you like to know?"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (open && !minimized) {
      inputRef.current?.focus()
    }
  }, [open, minimized])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('/api/ai/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages
        })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to get response')
      }

      setMessages(prev => [...prev, { role: 'assistant', content: result.data.response }])
    } catch (error) {
      console.error('Error getting chatbot response:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or check your OpenAI API key configuration."
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickQuestions = [
    "How do I search for investors?",
    "What AI features are available?",
    "How do I import a CSV?",
    "What is the fit score?",
    "How do I generate research notes?"
  ]

  const handleQuickQuestion = async (question) => {
    // Auto-submit the question directly
    setMessages(prev => [...prev, { role: 'user', content: question }])
    setLoading(true)

    try {
      const response = await fetch('/api/ai/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
          conversationHistory: messages
        })
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to get response')
      }

      setMessages(prev => [...prev, { role: 'assistant', content: result.data.response }])
    } catch (error) {
      console.error('Error getting chatbot response:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or check your OpenAI API key configuration."
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="chatbot"
        onClick={() => {
          setOpen(true)
          setMinimized(false)
        }}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          boxShadow: 3
        }}
      >
        <ChatbotIcon />
      </Fab>

      {/* Chatbot Dialog */}
      <Dialog
        open={open}
        onClose={() => {}} // Prevent closing on backdrop click
        maxWidth="sm"
        fullWidth={false}
        disableEscapeKeyDown={false}
        hideBackdrop={true}
        PaperProps={{
          sx: {
            position: 'fixed',
            bottom: minimized ? 'auto' : 80,
            right: minimized ? 24 : 24,
            left: 'auto',
            m: minimized ? 0 : 0,
            maxHeight: minimized ? 'auto' : '70vh',
            height: minimized ? 'auto' : '600px',
            width: minimized ? 'auto' : '450px',
            display: 'flex',
            flexDirection: 'column',
            margin: 0,
            pointerEvents: 'auto',
            boxShadow: 6
          }
        }}
        sx={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 1300
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1
        }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ChatbotIcon color="primary" />
            <Typography variant="h6">AI Assistant</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <IconButton
              size="small"
              onClick={() => setMinimized(!minimized)}
              aria-label={minimized ? 'expand' : 'minimize'}
            >
              <MinimizeIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        {!minimized && (
          <>
            <DialogContent dividers sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              <Stack spacing={2}>
                {messages.map((message, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        maxWidth: '80%',
                        bgcolor: message.role === 'user' ? 'primary.main' : 'background.paper',
                        color: message.role === 'user' ? 'primary.contrastText' : 'text.primary'
                      }}
                    >
                      {message.role === 'assistant' ? (
                        <Box>
                          {parseMarkdown(message.content)}
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                          {message.content}
                        </Typography>
                      )}
                    </Paper>
                  </Box>
                ))}
                
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Paper elevation={1} sx={{ p: 2 }}>
                      <CircularProgress size={20} />
                    </Paper>
                  </Box>
                )}

                {/* Quick Questions */}
                {messages.length === 1 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" gutterBottom sx={{ display: 'block', textAlign: 'center' }}>
                      Quick questions:
                    </Typography>
                    <Stack 
                      direction="row" 
                      spacing={1} 
                      flexWrap="wrap" 
                      justifyContent="center"
                      sx={{ gap: 1, mt: 1 }}
                    >
                      {quickQuestions.map((question, idx) => (
                        <Chip
                          key={idx}
                          label={question}
                          size="small"
                          onClick={() => handleQuickQuestion(question)}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                <div ref={messagesEndRef} />
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 1 }}>
              <TextField
                inputRef={inputRef}
                fullWidth
                placeholder="Ask me anything about the system..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                variant="outlined"
                size="small"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={handleSend}
                      disabled={!input.trim() || loading}
                      color="primary"
                      edge="end"
                    >
                      {loading ? <CircularProgress size={20} /> : <SendIcon />}
                    </IconButton>
                  )
                }}
              />
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  )
}

