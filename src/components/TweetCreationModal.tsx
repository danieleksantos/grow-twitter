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
import SendIcon from '@mui/icons-material/Send'
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
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: 3,
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
    } catch (err: any) {
      console.error('Erro ao postar tweet:', err)
      setError('Não foi possível postar o tweet. Verifique sua conexão.')
    } finally {
      setIsLoading(false)
    }
  }

  const MAX_CHARS = 280
  const charsRemaining = MAX_CHARS - content.length

  return (
    <Modal
      open={open}
      onClose={isLoading ? () => {} : onClose}
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
            onClick={isLoading ? () => {} : onClose}
            sx={{ mr: 2 }}
            disabled={isLoading}
          >
            <CloseIcon />
          </IconButton>
          <Typography id="tweet-modal-title" variant="h6">
            Tweetar
          </Typography>
        </Box>

        <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
          <Avatar src={avatarSrc} alt={loggedUsername || ''} />

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
              rows={6}
              disabled={isLoading}
              sx={{ '& .MuiInputBase-root:before': { borderBottom: 'none' } }}
            />
          </Box>
        </Box>

        <Divider sx={{ mx: 2 }} />

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
              color: charsRemaining < 20 ? 'error.main' : 'text.secondary',
            }}
          >
            {charsRemaining}
          </Typography>

          {error && (
            <Typography color="error" variant="body2" sx={{ mr: 2 }}>
              {error}
            </Typography>
          )}

          {isLoading && <CircularProgress size={20} sx={{ mr: 2 }} />}

          <Button
            variant="contained"
            onClick={handlePost}
            endIcon={<SendIcon />}
            sx={{ borderRadius: 999 }}
            disabled={isLoading || !content.trim()}
          >
            Tweetar
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
