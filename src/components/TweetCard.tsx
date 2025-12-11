import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
  useTheme,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import type { Tweet, Comment } from '../types'
import api from '../services/api'
import { useAppSelector, useAuth } from '../store/hooks'
import { ReplyModal } from './ReplyModal'

const MySwal = withReactContent(Swal)

interface TweetCardProps {
  tweet: Tweet
  onDeleteSuccess?: (tweetId: string) => void
}

export const TweetCard: React.FC<TweetCardProps> = ({
  tweet: initialTweet,
  onDeleteSuccess,
}) => {
  const [tweet, setTweet] = useState(initialTweet)
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const loggedUserId = useAppSelector((state) => state.auth.id)
  const theme = useTheme()

  const [openReplyModal, setOpenReplyModal] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [loadingComments, setLoadingComments] = useState(false)

  const isMyTweet = loggedUserId === tweet.user.id

  const fetchComments = useCallback(async () => {
    setLoadingComments(true)
    try {
      const response = await api.get(`/tweets/${tweet.id}/comments`)
      setComments(response.data.data)
    } catch (error) {
      console.error('Erro ao buscar comentários', error)
    } finally {
      setLoadingComments(false)
    }
  }, [tweet.id])

  useEffect(() => {
    if (tweet.repliesCount > 0) {
      fetchComments()
    }
  }, [tweet.repliesCount, fetchComments])

  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isLoggedIn) return

    const isLiking = !tweet.isLikedByMe
    const newLikesCount = tweet.likesCount + (isLiking ? 1 : -1)

    setTweet((prev) => ({
      ...prev,
      isLikedByMe: isLiking,
      likesCount: newLikesCount,
    }))

    try {
      const url = `/tweets/${tweet.id}/like`
      if (isLiking) await api.post(url)
      else await api.delete(url)
    } catch {
      setTweet(initialTweet)
    }
  }

  const handleDeleteTweet = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isMyTweet) return

    const result = await MySwal.fire({
      title: 'Excluir tweet?',
      text: 'Essa ação não poderá ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f4212e',
      cancelButtonColor: '#1d9bf0',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      background: theme.palette.background.paper,
      color: theme.palette.text.primary,
      iconColor: '#f4212e',
      customClass: {
        popup: 'swal-custom-popup',
      },
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await api.delete(`/tweets/${tweet.id}`)

      MySwal.fire({
        title: 'Deletado!',
        text: 'Seu tweet foi removido.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
      })

      if (onDeleteSuccess) onDeleteSuccess(tweet.id)
    } catch (error) {
      console.error('Erro ao deletar:', error)
      MySwal.fire({
        title: 'Erro',
        text: 'Não foi possível deletar o tweet.',
        icon: 'error',
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
      })
    }
  }

  const handleOpenReply = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpenReplyModal(true)
  }

  const handleReplySuccess = () => {
    setTweet((prev) => ({ ...prev, repliesCount: prev.repliesCount + 1 }))
    fetchComments()
  }

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/profile/${tweet.user.username}`)
  }

  const formattedDate = new Date(tweet.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Box
      sx={{
        p: 2,
        cursor: 'pointer',
        transition: '0.2s',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Box onClick={handleProfileClick}>
          <Avatar
            src={tweet.user.imageUrl || undefined}
            alt={tweet.user.name}
            sx={{ width: 48, height: 48 }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 0.5,
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mr: 0.5 }}>
              {tweet.user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
              @{tweet.user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              · {formattedDate}
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ mb: 1.5, whiteSpace: 'pre-wrap' }}>
            {tweet.content}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              maxWidth: 400,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              <IconButton
                size="small"
                onClick={handleOpenReply}
                color="inherit"
              >
                <CommentOutlinedIcon fontSize="small" />
              </IconButton>
              <Typography variant="caption">
                {tweet.repliesCount || ''}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: tweet.isLikedByMe ? 'error.main' : 'text.secondary',
                '&:hover': { color: 'error.main' },
              }}
            >
              <IconButton
                size="small"
                onClick={handleLikeToggle}
                color="inherit"
              >
                {tweet.isLikedByMe ? (
                  <FavoriteIcon fontSize="small" />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
              </IconButton>
              <Typography variant="caption">
                {tweet.likesCount || ''}
              </Typography>
            </Box>

            {isMyTweet && (
              <IconButton
                size="small"
                onClick={handleDeleteTweet}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'error.main' },
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          {(loadingComments || comments.length > 0) && (
            <Box sx={{ mt: 2 }}>
              {loadingComments && comments.length === 0 ? (
                <CircularProgress size={20} />
              ) : (
                comments.map((comment) => (
                  <Box
                    key={comment.id}
                    sx={{ display: 'flex', gap: 1.5, mt: 2 }}
                  >
                    <Avatar
                      src={comment.user.imageUrl || undefined}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Box
                      sx={{
                        bgcolor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.05)'
                            : '#f5f8fa',
                        p: 1.5,
                        borderRadius: 3,
                        flexGrow: 1,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold">
                        {comment.user.name}
                      </Typography>
                      <Typography variant="body2">{comment.content}</Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          )}
        </Box>
      </Box>

      <ReplyModal
        open={openReplyModal}
        onClose={() => setOpenReplyModal(false)}
        tweetId={tweet.id}
        onReplySuccess={handleReplySuccess}
      />
    </Box>
  )
}
