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
  Divider,
  useTheme,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import api from '../services/api'
import { useAppSelector } from '../store/hooks'

interface ReplyModalProps {
  open: boolean
  onClose: () => void
  tweetId: string
  onReplySuccess: () => void
}

export const ReplyModal: React.FC<ReplyModalProps> = ({
  open,
  onClose,
  tweetId,
  onReplySuccess,
}) => {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const theme = useTheme()

  const loggedUserImageUrl = useAppSelector((state) => state.auth.imageUrl)
  const loggedUsername = useAppSelector((state) => state.auth.username)

  const handleReply = async () => {
    if (!content.trim()) return

    setIsLoading(true)
    try {
      await api.post(`/tweets/${tweetId}/comments`, { content })

      setContent('')
      onReplySuccess()
      onClose()
    } catch (error) {
      console.error('Erro ao responder tweet:', error)
      alert('Erro ao enviar resposta.')
    } finally {
      setIsLoading(false)
    }
  }

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

  return (
    <Modal open={open} onClose={isLoading ? undefined : onClose}>
      <Box sx={modalStyle}>
        <Box
          sx={{
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <IconButton
            onClick={isLoading ? undefined : onClose}
            disabled={isLoading}
            sx={{ color: 'primary.main' }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" sx={{ ml: 2 }}>
            Responder
          </Typography>
        </Box>

        <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
          <Avatar
            src={loggedUserImageUrl || undefined}
            alt={loggedUsername || ''}
            sx={{ width: 48, height: 48 }}
          />
          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={8}
            placeholder="Poste sua resposta"
            variant="standard"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
            InputProps={{
              disableUnderline: true,
              style: {
                fontSize: '1.25rem',
                color: theme.palette.text.primary,
              },
            }}
          />
        </Box>

        <Divider sx={{ borderColor: 'divider' }} />

        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          {isLoading && <CircularProgress size={24} sx={{ mr: 2 }} />}

          <Button
            variant="contained"
            onClick={handleReply}
            disabled={!content.trim() || isLoading}
            sx={{
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 'bold',
              px: 3,
            }}
          >
            Responder
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
