import React, { useState } from 'react'
import {
  Box,
  Avatar,
  TextField,
  Button,
  Modal,
  Typography,
  IconButton,
  CircularProgress,
  useTheme,
  Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { isAxiosError } from 'axios'

import { useAppSelector } from '../store/hooks.ts'
import api from '../services/api.ts'

interface TweetCreationModalProps {
  open: boolean
  onClose: () => void
  onTweetPosted: () => void
}

export const TweetCreationModal: React.FC<TweetCreationModalProps> = ({
  open,
  onClose,
  onTweetPosted,
}) => {
  const theme = useTheme()

  const loggedUsername = useAppSelector((state) => state.auth.username)
  const loggedUserImageUrl = useAppSelector((state) => state.auth.imageUrl)
  const avatarSrc = loggedUserImageUrl ?? undefined

  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const modalStyle = {
    position: 'absolute' as const,
    top: '10%',
    left: '50%',
    transform: 'translate(-50%, 0)',
    width: { xs: '95%', sm: 600 },
    bgcolor: 'background.paper',
    color: 'text.primary',
    borderRadius: 4,
    boxShadow: 24,
    p: 0,
    outline: 'none',
  }

  const handlePost = async () => {
    if (!content.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      await api.post('/tweets', { content })

      setContent('')
      onTweetPosted()
      onClose()
    } catch (err) {
      console.error('Erro ao postar tweet:', err)

      let errorMessage = 'Não foi possível postar. Tente novamente.'

      if (isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const MAX_CHARS = 280
  const charsRemaining = MAX_CHARS - content.length

  return (
    <Modal
      open={open}
      onClose={isLoading ? undefined : onClose}
      aria-labelledby="tweet-modal-title"
    >
      <Box sx={modalStyle}>
        <Box
          sx={{
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <IconButton
            onClick={isLoading ? undefined : onClose}
            sx={{ mr: 2, color: 'primary.main' }}
            disabled={isLoading}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
          <Avatar
            src={avatarSrc}
            alt={loggedUsername || ''}
            sx={{ width: 48, height: 48 }}
          />

          <Box sx={{ flexGrow: 1 }}>
            <TextField
              multiline
              fullWidth
              variant="standard"
              placeholder="O que está acontecendo?"
              value={content}
              onChange={(e) => {
                const text = e.target.value
                if (text.length <= MAX_CHARS) {
                  setContent(text)
                }
              }}
              minRows={4}
              maxRows={10}
              disabled={isLoading}
              slotProps={{
                input: {
                  disableUnderline: true,
                  style: {
                    fontSize: '1.25rem',
                    color: theme.palette.text.primary,
                  },
                },
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ mx: 2, borderColor: 'divider' }} />

        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              mr: 2,
              fontWeight: 'bold',
              color: charsRemaining < 20 ? 'error.main' : 'text.secondary',
            }}
          >
            {charsRemaining}
          </Typography>

          {error && (
            <Typography color="error" variant="caption" sx={{ mr: 2 }}>
              {error}
            </Typography>
          )}

          {isLoading && <CircularProgress size={20} sx={{ mr: 2 }} />}

          <Button
            variant="contained"
            onClick={handlePost}
            sx={{
              borderRadius: 999,
              px: 3,
              fontWeight: 'bold',
            }}
            disabled={isLoading || !content.trim()}
          >
            Tweetar
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
