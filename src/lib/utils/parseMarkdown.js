/**
 * @fileoverview Simple markdown parser for rendering AI-generated content
 * Converts basic markdown syntax to React elements
 */

import React from 'react'
import { Typography, Box } from '@mui/material'

/**
 * Parse markdown text and convert to React elements
 * Supports: **bold**, __bold__, bullet lists, line breaks
 * @param {string} text - Markdown text
 * @returns {Array<React.ReactNode>} - Array of React elements
 */
export function parseMarkdown(text) {
  if (!text) return null

  const lines = text.split('\n')
  const elements = []
  let currentList = []

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <Box key={`list-${elements.length}`} component="ul" sx={{ pl: 3, mb: 1, mt: 0 }}>
          {currentList.map((item, idx) => (
            <Typography key={idx} variant="body2" component="li" sx={{ mb: 0.5 }}>
              {parseInlineMarkdown(item)}
            </Typography>
          ))}
        </Box>
      )
      currentList = []
    }
  }

  const parseInlineMarkdown = (line) => {
    const parts = []
    let currentIndex = 0
    
    // Match **bold** or __bold__
    const boldRegex = /(\*\*|__)(.+?)\1/g
    let match
    
    while ((match = boldRegex.exec(line)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        parts.push(line.substring(currentIndex, match.index))
      }
      
      // Add bold text
      parts.push(
        <Box key={`bold-${parts.length}`} component="strong" sx={{ fontWeight: 600 }}>
          {match[2]}
        </Box>
      )
      
      currentIndex = match.index + match[0].length
    }
    
    // Add remaining text
    if (currentIndex < line.length) {
      parts.push(line.substring(currentIndex))
    }
    
    return parts.length > 0 ? parts : line
  }

  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim()
    
    // Check if it's a list item (starts with *, -, or •, or numbered)
    if (/^[-*•]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      const listItem = trimmed.replace(/^[-*•]\d+\.\s+/, '').replace(/^[-*•]\s+/, '')
      currentList.push(listItem)
    } else {
      // Flush any pending list
      flushList()
      
      // Regular paragraph
      if (trimmed) {
        // Check if it's a heading (starts with ** or __ and ends with colon)
        const isHeading = /^(\*\*|__).*(\*\*|__):\s*$/.test(trimmed)
        
        if (isHeading) {
          // It's a heading - render as bold heading
          const headingText = trimmed.replace(/:\s*$/, '')
          elements.push(
            <Typography 
              key={`heading-${lineIndex}`} 
              variant="subtitle2" 
              component="div"
              sx={{ mb: 1, mt: lineIndex > 0 ? 2 : 0, fontWeight: 600 }}
            >
              {parseInlineMarkdown(headingText)}
            </Typography>
          )
        } else {
          // Regular paragraph
          elements.push(
            <Typography 
              key={`para-${lineIndex}`} 
              variant="body2" 
              component="div"
              sx={{ mb: 1.5 }}
            >
              {parseInlineMarkdown(trimmed)}
            </Typography>
          )
        }
      } else {
        // Empty line - add spacing
        elements.push(<Box key={`spacer-${lineIndex}`} sx={{ mb: 1 }} />)
      }
    }
  })

  // Flush any remaining list items
  flushList()

  return elements.length > 0 ? elements : null
}

