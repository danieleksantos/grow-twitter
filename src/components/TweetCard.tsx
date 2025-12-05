// src/components/TweetCard.tsx

import React, { useState } from 'react'
import type { Tweet } from '../types'
import api from '../services/api'
import { useAuth } from '../store/hooks'

// Importações do MUI
import { Box, Typography, Avatar, IconButton } from '@mui/material'
// Importações de Ícones do MUI
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined'

interface TweetCardProps {
  tweet: Tweet
}

export const TweetCard: React.FC<TweetCardProps> = ({
  tweet: initialTweet,
}) => {
  const [tweet, setTweet] = useState(initialTweet)
  const { isLoggedIn } = useAuth()

  const handleLikeToggle = async () => {
    if (!isLoggedIn) {
      alert('Você precisa estar logado para curtir um tweet.')
      return
    }

    // 1. Atualização Otimista
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
      // 2. Reversão de Estado em caso de falha
      setTweet(initialTweet)
      alert('Não foi possível realizar a ação. Tente novamente.')
    }
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
        padding: 2, // p: 2 (16px)
        marginBottom: 1, // mb: 1 (8px)
        borderRadius: 2, // borderRadius: 8px
        backgroundColor: '#fff',
        transition: 'background-color 0.2s',
        '&:hover': {
          backgroundColor: '#f9f9f9',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <Avatar
          src={tweet.user.imageUrl || '/default_avatar.png'}
          alt={`${tweet.user.name}'s avatar`}
          sx={{ width: 40, height: 40, mr: 1.5 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography
            variant="subtitle1"
            component="span"
            sx={{ fontWeight: 'bold', mr: 0.5 }}
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

      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Ícone de Comentário */}
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

        {/* Ícone de Like */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size="small"
            aria-label="like"
            onClick={handleLikeToggle}
            sx={{
              p: 0.5,
              color: tweet.isLikedByMe ? 'error.main' : 'text.secondary', // MUI usa 'error.main' para vermelho
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
    </Box>
  )
}
