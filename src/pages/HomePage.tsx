import React, { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { useAuth } from '../store/hooks'
import { TweetCard } from '../components/TweetCard'
import type { Tweet } from '../types'

import { Box, Typography, Divider, CircularProgress } from '@mui/material'

export const HomePage: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(true)

  const { isLoggedIn } = useAuth()

  const isInitialLoad = !tweets.length && loading

  const handleTweetDelete = useCallback((tweetId: string) => {
    setTweets((prevTweets) => prevTweets.filter((t) => t.id !== tweetId))
  }, [])

  const fetchFeed = async () => {
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
  }
  useEffect(() => {
    fetchFeed()
  }, [isLoggedIn])

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
    <Box
      sx={{
        width: '100%',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid #eee',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: 'background.default',
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
        <Typography color="text.secondary" sx={{ p: 2 }}>
          Seu feed está vazio. Comece a seguir outros usuários!
        </Typography>
      )}

      <Box className="tweet-list">
        {tweets.map((tweet) => (
          <Box key={tweet.id}>
            <TweetCard tweet={tweet} onDeleteSuccess={handleTweetDelete} />
            <Divider sx={{ my: 0 }} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
