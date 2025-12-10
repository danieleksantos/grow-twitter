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
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -30%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: 3,
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
            borderBottom: '1px solid #eee',
          }}
        >
          <IconButton onClick={onClose} disabled={isLoading}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2 }}>
            Responder
          </Typography>
        </Box>

        <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
          <Avatar
            src={loggedUserImageUrl || undefined}
            alt={loggedUsername || ''}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Poste sua resposta"
            variant="standard"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
            InputProps={{ disableUnderline: true }}
          />
        </Box>

        <Divider />

        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          {isLoading && <CircularProgress size={24} sx={{ mr: 2 }} />}
          <Button
            variant="contained"
            onClick={handleReply}
            disabled={!content.trim() || isLoading}
            sx={{ borderRadius: 999, textTransform: 'none' }}
          >
            Responder
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
