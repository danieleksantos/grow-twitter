import React, { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { useAuth } from '../store/hooks'
import { TweetCard } from '../components/TweetCard'
import type { Tweet } from '../types'

import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  useTheme,
} from '@mui/material'

export const HomePage: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(true)
  const theme = useTheme()
  const { isLoggedIn } = useAuth()

  const isInitialLoad = !tweets.length && loading

  const handleTweetDelete = useCallback((tweetId: string) => {
    setTweets((prevTweets) => prevTweets.filter((t) => t.id !== tweetId))
  }, [])

  const fetchFeed = useCallback(async () => {
    if (!isLoggedIn) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const response = await api.get('/tweets')
      setTweets(response.data.data)
    } catch (error) {
      console.error('Erro ao carregar o feed:', error)
      setTweets([])
    } finally {
      setLoading(false)
    }
  }, [isLoggedIn])

  useEffect(() => {
    fetchFeed()
  }, [fetchFeed])

  if (!isLoggedIn) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Erro de Autenticação. Por favor, refaça o login.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor:
            theme.palette.mode === 'dark'
              ? 'rgba(0,0,0,0.7)'
              : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Typography variant="h6" component="h1" fontWeight="bold">
          Página Inicial
        </Typography>
      </Box>

      {isInitialLoad && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && tweets.length === 0 && (
        <Typography color="text.secondary" sx={{ p: 3, textAlign: 'center' }}>
          Seu feed está vazio. Siga pessoas para ver tweets!
        </Typography>
      )}

      <Box>
        {tweets.map((tweet) => (
          <React.Fragment key={tweet.id}>
            <TweetCard tweet={tweet} onDeleteSuccess={handleTweetDelete} />
            <Divider />
          </React.Fragment>
        ))}
      </Box>
    </Box>
  )
}
