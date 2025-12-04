import React from 'react'
import { Box, Avatar, Typography, IconButton, useTheme } from '@mui/material'
import {
  FavoriteBorder,
  Favorite as FavoriteIcon,
  ChatBubbleOutline,
  Loop,
  Share,
} from '@mui/icons-material'

import type { Tweet } from '../interfaces/Tweet.ts'

interface TweetCardProps {
  tweet: Tweet
  onLike: (tweetId: string) => void
  isLiked: boolean
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
}

export const TweetCard: React.FC<TweetCardProps> = ({
  tweet,
  onLike,
  isLiked,
}) => {
  const theme = useTheme()

  const avatarSrc = tweet.user.imageUrl ?? undefined

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    onLike(tweet.id)
  }

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        gap: 1.5,
        borderBottom: `1px solid ${theme.palette.divider}`,
        cursor: 'pointer',
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Box>
        <Avatar
          src={avatarSrc}
          alt={tweet.user.username}
          sx={{ width: 48, height: 48 }}
        />
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mr: 0.5 }}>
            {tweet.user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
            @{tweet.user.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            · {formatDate(tweet.createdAt)}
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mb: 1 }}>
          {tweet.content}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '80%',
            mt: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" color="primary">
              <ChatBubbleOutline fontSize="inherit" />
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              {tweet.repliesCount > 0 ? tweet.repliesCount : ''}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" color="success">
              <Loop fontSize="inherit" />
            </IconButton>
            <Typography variant="caption" color="text.secondary"></Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="small"
              onClick={handleLike}
              color={isLiked ? 'error' : 'default'}
            >
              {isLiked ? (
                <FavoriteIcon fontSize="inherit" />
              ) : (
                <FavoriteBorder fontSize="inherit" />
              )}
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              {tweet.likesCount > 0 ? tweet.likesCount : ''}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" color="primary">
              <Share fontSize="inherit" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
