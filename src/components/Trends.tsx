import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  useTheme,
  Skeleton,
  Stack,
} from '@mui/material'
import {
  MoreHoriz,
  FavoriteBorder,
  Favorite,
  ChatBubbleOutline,
} from '@mui/icons-material'
import { alpha } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'

import api from '../services/api'
import type { Tweet, User } from '../types'
import { ReplyModal } from './ReplyModal'
import { useAuth } from '../store/hooks'

export const Trends: React.FC = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { isLoggedIn } = useAuth()

  const [latestTweets, setLatestTweets] = useState<Tweet[]>([])
  const [newUsers, setNewUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [replyTweetId, setReplyTweetId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [tweetsRes, usersRes] = await Promise.all([
          api.get('/tweets', {
            params: { type: 'global', page: 1 },
          }),
          api.get('/users?page=1'),
        ])

        setLatestTweets(tweetsRes.data.data.slice(0, 3))
        setNewUsers(usersRes.data.data.slice(0, 2))
      } catch (error) {
        console.error('Erro ao carregar Trends:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleGoToProfile = (username: string) => {
    navigate(`/profile/${username}`)
  }

  const handleLike = async (e: React.MouseEvent, tweet: Tweet) => {
    e.stopPropagation()
    if (!isLoggedIn) return

    const isLiking = !tweet.isLikedByMe
    const newLikesCount = tweet.likesCount + (isLiking ? 1 : -1)

    setLatestTweets((prev) =>
      prev.map((t) =>
        t.id === tweet.id
          ? { ...t, isLikedByMe: isLiking, likesCount: newLikesCount }
          : t,
      ),
    )

    try {
      const url = `/tweets/${tweet.id}/like`
      if (isLiking) await api.post(url)
      else await api.delete(url)
    } catch (error) {
      setLatestTweets((prev) =>
        prev.map((t) =>
          t.id === tweet.id
            ? { ...t, isLikedByMe: !isLiking, likesCount: tweet.likesCount }
            : t,
        ),
      )
    }
  }

  const handleReplyOpen = (e: React.MouseEvent, tweetId: string) => {
    e.stopPropagation()
    setReplyTweetId(tweetId)
  }

  const handleReplySuccess = () => {
    if (!replyTweetId) return
    setLatestTweets((prev) =>
      prev.map((t) =>
        t.id === replyTweetId ? { ...t, repliesCount: t.repliesCount + 1 } : t,
      ),
    )
  }

  return (
    <Box
      sx={{
        pl: 3,
        py: 2,
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: { xs: 'none', md: 'block' },
        overflowY: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Box
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? '#16181c' : '#f7f9f9',
          borderRadius: 4,
          overflow: 'hidden',
          mb: 3,
          border: `1px solid ${
            theme.palette.mode === 'light' ? '#eee' : 'transparent'
          }`,
        }}
      >
        <Typography variant="h6" fontWeight={800} sx={{ px: 2, py: 1.5 }}>
          Trending Topics
        </Typography>

        <List disablePadding>
          {loading ? (
            [1, 2, 3].map((i) => (
              <ListItem key={i} sx={{ px: 2, py: 1 }}>
                <Box sx={{ width: '100%' }}>
                  <Skeleton width="40%" height={20} />
                  <Skeleton width="80%" height={20} />
                </Box>
              </ListItem>
            ))
          ) : latestTweets.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ px: 2, pb: 2, color: 'text.secondary' }}
            >
              Nenhuma atividade recente.
            </Typography>
          ) : (
            latestTweets.map((tweet) => (
              <ListItem key={tweet.id} disablePadding>
                <ListItemButton
                  onClick={() => handleGoToProfile(tweet.user.username)}
                  sx={{
                    px: 2,
                    py: 1.5,
                    display: 'block',
                    '&:hover': {
                      bgcolor:
                        theme.palette.mode === 'dark'
                          ? alpha(theme.palette.common.white, 0.03)
                          : alpha(theme.palette.common.black, 0.03),
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {tweet.user.name} · Assunto do Momento
                    </Typography>
                    <MoreHoriz
                      fontSize="small"
                      sx={{ color: 'text.secondary', fontSize: 16 }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{
                      mb: 1,
                      display: '-webkit-box',
                      overflow: 'hidden',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 3,
                      lineHeight: 1.4,
                    }}
                  >
                    {tweet.content}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={3}
                    alignItems="center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Box
                      onClick={(e) => handleLike(e, tweet)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: tweet.isLikedByMe
                          ? 'error.main'
                          : 'text.secondary',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        '&:hover': { color: 'error.main' },
                      }}
                    >
                      {tweet.isLikedByMe ? (
                        <Favorite sx={{ fontSize: 14, mr: 0.5 }} />
                      ) : (
                        <FavoriteBorder sx={{ fontSize: 14, mr: 0.5 }} />
                      )}
                      {tweet.likesCount || 0}
                    </Box>
                    <Box
                      onClick={(e) => handleReplyOpen(e, tweet.id)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.secondary',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      <ChatBubbleOutline sx={{ fontSize: 14, mr: 0.5 }} />
                      {tweet.repliesCount || 0}
                    </Box>
                  </Stack>
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </Box>

      <Box
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? '#16181c' : '#f7f9f9',
          borderRadius: 4,
          overflow: 'hidden',
          mb: 3,
          border: `1px solid ${
            theme.palette.mode === 'light' ? '#eee' : 'transparent'
          }`,
        }}
      >
        <Typography variant="h6" fontWeight={800} sx={{ px: 2, py: 1.5 }}>
          Últimos a entrarem na rede
        </Typography>

        <List disablePadding>
          {loading ? (
            [1, 2].map((i) => (
              <ListItem key={i} sx={{ px: 2 }}>
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{ mr: 1 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                </Box>
              </ListItem>
            ))
          ) : newUsers.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ px: 2, pb: 2, color: 'text.secondary' }}
            >
              Ninguém novo por aqui.
            </Typography>
          ) : (
            newUsers.map((user) => (
              <ListItem
                key={user.id}
                alignItems="center"
                sx={{
                  px: 2,
                  py: 1.5,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
                onClick={() => handleGoToProfile(user.username)}
              >
                <ListItemAvatar>
                  <Avatar
                    src={user.imageUrl || undefined}
                    alt={user.name}
                    sx={{ width: 40, height: 40 }}
                  />
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight="bold" noWrap>
                      {user.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary" noWrap>
                      @{user.username}
                    </Typography>
                  }
                  sx={{ my: 0, flexGrow: 1, mr: 1 }}
                />

                <Button
                  variant="contained"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleGoToProfile(user.username)
                  }}
                  sx={{
                    bgcolor: theme.palette.text.primary,
                    color: theme.palette.background.default,
                    borderRadius: 99,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    minWidth: 70,
                    '&:hover': {
                      bgcolor: theme.palette.text.primary,
                      opacity: 0.9,
                    },
                  }}
                >
                  Ver
                </Button>
              </ListItem>
            ))
          )}
        </List>

        <Box
          sx={{
            p: 2,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' },
          }}
          onClick={() => navigate('/explore')}
        >
          <Typography color="primary" variant="body2">
            Mostrar mais
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 2, pb: 4 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ lineHeight: 1.6 }}
        >
          Termos de Serviço Política de Privacidade Política de Cookies
          Acessibilidade Informações de anúncios © 2025 Growtwitter, Inc.
        </Typography>
      </Box>

      <ReplyModal
        open={!!replyTweetId}
        onClose={() => setReplyTweetId(null)}
        tweetId={replyTweetId || ''}
        onReplySuccess={handleReplySuccess}
      />
    </Box>
  )
}
