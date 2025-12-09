import React, { useState } from 'react'
import type { Tweet } from '../types'
import api from '../services/api'
import { useAppSelector } from '../store/hooks'
import { useAuth } from '../store/hooks'
import { useNavigate } from 'react-router-dom'

import { Box, Typography, Avatar, IconButton } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

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
  const isMyTweet = loggedUserId === tweet.user.id

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
          src={tweet.user.imageUrl || '/default_avatar.png'}
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
            <IconButton size="small" aria-label="comments" sx={{ p: 0.5 }}>
              <CommentOutlinedIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption" sx={{ ml: 0.5 }}>
              {tweet.repliesCount}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="small"
              aria-label="like"
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
              {tweet.likesCount}
            </Typography>
          </Box>
        </Box>

        {isMyTweet && (
          <IconButton
            size="small"
            aria-label="delete"
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
    </Box>
  )
}
