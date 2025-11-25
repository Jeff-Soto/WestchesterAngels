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
  SmartToy as ChatbotIcon
} from '@mui/icons-material'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I’m your AI Agent for the Westchester Angels Investor Platform. I can help you find and analyze investors, explain fit scores, generate outreach, and guide you through all AI-powered features. What would you like to do?"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

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
      {/* Floating Action Button - Only show when chatbot is closed */}
      {!open && (
        <Fab
          color="primary"
          aria-label="chatbot"
        onClick={() => {
          setOpen(true)
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
      )}

      {/* Chatbot Dialog */}
      {open && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            left: 'auto',
            width: '450px',
            height: '600px',
            maxHeight: '70vh',
            zIndex: 1300,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Paper
            elevation={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              maxHeight: '100%',
              pointerEvents: 'auto',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 2,
              pb: 1,
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <ChatbotIcon color="primary" />
                <Typography variant="h6">AI Assistant</Typography>
              </Stack>
              <IconButton
                size="small"
                onClick={() => setOpen(false)}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
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
                </Box>

                <Box sx={{ p: 2, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
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
                </Box>
          </Paper>
        </Box>
      )}
    </>
  )
}

