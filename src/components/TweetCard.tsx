import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

import type { Tweet, Comment } from '../types'
import api from '../services/api'
import { useAppSelector, useAuth } from '../store/hooks'
import { ReplyModal } from './ReplyModal'

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

  const handleLikeToggle = async () => {
    if (!isLoggedIn) {
      alert('Você precisa estar logado para curtir um tweet.')
      return
    }

    const isLiking = !tweet.isLikedByMe
    const newLikesCount = tweet.likesCount + (isLiking ? 1 : -1)

    setTweet((prev) => ({
      ...prev,
      isLikedByMe: isLiking,
      likesCount: newLikesCount,
    }))

    try {
      const url = `/tweets/${tweet.id}/like`

      if (isLiking) {
        await api.post(url)
      } else {
        await api.delete(url)
      }
    } catch (error) {
      console.error('Erro ao curtir/descurtir o tweet:', error)
      setTweet(initialTweet)
      alert('Não foi possível realizar a ação. Tente novamente.')
    }
  }

  const handleDeleteTweet = async () => {
    if (!isMyTweet) {
      alert('Você só pode deletar seus próprios tweets.')
      return
    }

    if (!window.confirm('Tem certeza que deseja deletar este tweet?')) {
      return
    }

    try {
      await api.delete(`/tweets/${tweet.id}`)

      if (onDeleteSuccess) {
        onDeleteSuccess(tweet.id)
      }
    } catch (error) {
      console.error('Erro ao deletar o tweet:', error)
      alert('Não foi possível deletar o tweet. Tente novamente.')
    }
  }

  const handleOpenReply = () => {
    setOpenReplyModal(true)
  }

  const handleReplySuccess = () => {
    setTweet((prev) => ({ ...prev, repliesCount: prev.repliesCount + 1 }))
    fetchComments()
  }

  const handleProfileClick = () => {
    navigate(`/profile/${tweet.user.username}`)
  }

  const formattedDate = new Date(tweet.createdAt).toLocaleDateString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  })

  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        padding: 2,
        marginBottom: 1,
        borderRadius: 2,
        backgroundColor: '#fff',
        transition: 'background-color 0.2s',
        '&:hover': {
          backgroundColor: '#f9f9f9',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 1.5,
          cursor: 'pointer',
        }}
        onClick={handleProfileClick}
      >
        <Avatar
          src={tweet.user.imageUrl || undefined}
          alt={`${tweet.user.name}'s avatar`}
          sx={{ width: 40, height: 40, mr: 1.5 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography
            variant="subtitle1"
            component="span"
            sx={{
              fontWeight: 'bold',
              mr: 0.5,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {tweet.user.name}
          </Typography>
          <Typography
            variant="body2"
            component="span"
            color="text.secondary"
            sx={{ mr: 1 }}
          >
            @{tweet.user.username}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {formattedDate}
          </Typography>
        </Box>
      </Box>

      <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
        {tweet.content}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'text.secondary',
            }}
          >
            <IconButton
              size="small"
              onClick={handleOpenReply}
              sx={{ p: 0.5, '&:hover': { color: 'primary.main' } }}
            >
              <CommentOutlinedIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {tweet.repliesCount > 0 ? tweet.repliesCount : ''}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="small"
              onClick={handleLikeToggle}
              sx={{
                p: 0.5,
                color: tweet.isLikedByMe ? 'error.main' : 'text.secondary',
                '&:hover': {
                  backgroundColor: tweet.isLikedByMe
                    ? 'error.light'
                    : 'action.hover',
                },
              }}
            >
              {tweet.isLikedByMe ? (
                <FavoriteIcon fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {tweet.likesCount > 0 ? tweet.likesCount : ''}
            </Typography>
          </Box>
        </Box>

        {isMyTweet && (
          <IconButton
            size="small"
            onClick={handleDeleteTweet}
            sx={{
              p: 0.5,
              color: 'text.secondary',
              '&:hover': {
                color: 'error.main',
                backgroundColor: 'error.light',
              },
            }}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {(loadingComments || comments.length > 0) && (
        <Box sx={{ mt: 2, pl: 0 }}>
          {loadingComments && comments.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
              <CircularProgress size={20} />
            </Box>
          ) : (
            comments.map((comment) => (
              <Box
                key={comment.id}
                sx={{
                  display: 'flex',
                  gap: 1.5,
                  mt: 1.5,
                  position: 'relative',
                }}
              >
                <Avatar
                  src={comment.user.imageUrl || undefined}
                  sx={{ width: 32, height: 32 }}
                />

                <Box
                  sx={{
                    bgcolor: '#f5f8fa',
                    p: 1.5,
                    borderRadius: 3,
                    flexGrow: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{ mr: 1 }}
                    >
                      {comment.user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      @{comment.user.username}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{comment.content}</Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      )}

      <ReplyModal
        open={openReplyModal}
        onClose={() => setOpenReplyModal(false)}
        tweetId={tweet.id}
        onReplySuccess={handleReplySuccess}
      />
    </Box>
  )
}
