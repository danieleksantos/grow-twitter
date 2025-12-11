import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Avatar,
  Button,
  IconButton,
  useTheme,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { isAxiosError } from 'axios'

import api from '../services/api'
import { TweetCard } from '../components/TweetCard'
import { useAppSelector } from '../store/hooks'
import type { Tweet, User } from '../types'
import { EditProfileModal } from '../components/EditProfileModal'

interface ProfileData extends User {
  followersCount: number
  followingCount: number
  tweetsCount: number
  id: string
  tweets: Tweet[]
}

interface ProfileState {
  user: ProfileData | null
  tweets: Tweet[]
  isFollowing: boolean
}

interface ProfileApiResponse {
  success: boolean
  data: ProfileData & { isFollowing?: boolean }
}

export const ProfilePage: React.FC = () => {
  const { username: urlUsername } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const theme = useTheme()

  const loggedUsername = useAppSelector((state) => state.auth.username)
  const isViewingOwnProfile = urlUsername === loggedUsername

  const [profile, setProfile] = useState<ProfileState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isActionLoading, setIsActionLoading] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleEditSuccess = (newName: string, newImageUrl: string | null) => {
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            user: {
              ...prev.user!,
              name: newName,
              imageUrl: newImageUrl,
            },
          }
        : null,
    )
  }

  const handleTweetDelete = useCallback((tweetId: string) => {
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            tweets: prev.tweets.filter((t) => t.id !== tweetId),
            user: prev.user
              ? {
                  ...prev.user,
                  tweetsCount: Math.max(0, prev.user.tweetsCount - 1),
                }
              : null,
          }
        : null,
    )
  }, [])

  const fetchProfileData = useCallback(async () => {
    if (!urlUsername) {
      setError('Username não encontrado na URL.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const profileResponse = await api.get<ProfileApiResponse>(
        `/users/${urlUsername}`,
      )

      const apiData = profileResponse.data.data
      const userData: ProfileData = apiData

      const isFollowing = apiData.isFollowing === true
      const tweets: Tweet[] = apiData.tweets || []

      setProfile({
        user: userData,
        tweets,
        isFollowing,
      })
    } catch (err) {
      console.error('Erro ao carregar o perfil:', err)

      let message = 'Falha ao carregar o perfil.'

      if (isAxiosError(err)) {
        if (err.response?.status === 404) {
          message = `Erro 404: Usuário @${urlUsername} não encontrado.`
        } else if (err.response?.data?.message) {
          message = err.response.data.message
        }
      }

      setError(message)
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }, [urlUsername])

  const handleFollowToggle = useCallback(async () => {
    if (!profile || isViewingOwnProfile || isActionLoading || !profile.user?.id)
      return

    const userIdToFollow = profile.user.id
    const newIsFollowing = !profile.isFollowing

    setIsActionLoading(true)

    setProfile((prev) =>
      prev
        ? {
            ...prev,
            isFollowing: newIsFollowing,
            user: {
              ...prev.user!,
              followersCount:
                prev.user!.followersCount + (newIsFollowing ? 1 : -1),
            },
          }
        : null,
    )

    try {
      if (newIsFollowing) {
        await api.post(`/users/${userIdToFollow}/follow`)
      } else {
        await api.delete(`/users/${userIdToFollow}/follow`)
      }
    } catch (error) {
      console.error('Erro ao seguir/deixar de seguir:', error)

      let statusCode = 0
      if (isAxiosError(error)) {
        statusCode = error.response?.status || 0
      }

      if (
        (statusCode === 409 && newIsFollowing) ||
        (statusCode === 404 && !newIsFollowing)
      ) {
        fetchProfileData()
        return
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              isFollowing: !newIsFollowing,
              user: {
                ...prev.user!,
                followersCount:
                  prev.user!.followersCount - (newIsFollowing ? 1 : -1),
              },
            }
          : null,
      )

      fetchProfileData()
    } finally {
      setIsActionLoading(false)
    }
  }, [profile, isViewingOwnProfile, fetchProfileData, isActionLoading])

  useEffect(() => {
    fetchProfileData()
  }, [urlUsername, fetchProfileData])

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )
    }

    if (error || !profile || !profile.user) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          {error || 'Dados do perfil indisponíveis.'}
        </Alert>
      )
    }

    const { user, tweets, isFollowing } = profile

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    return (
      <>
        {/* Capa */}
        <Box sx={{ height: 200, bgcolor: 'primary.main' }} />

        <Box sx={{ p: 2, mt: -8, position: 'relative' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <Avatar
              src={user.imageUrl || undefined}
              alt={user.name}
              sx={{
                width: 134,
                height: 134,
                border: `4px solid ${theme.palette.background.default}`,
                cursor: 'pointer',
                transition: 'filter 0.2s',
                '&:hover': { filter: 'brightness(0.95)' },
              }}
            />

            {isViewingOwnProfile ? (
              <Button
                variant="outlined"
                onClick={() => setIsEditModalOpen(true)}
                sx={{
                  borderRadius: 999,
                  textTransform: 'none',
                  px: 2,
                  py: 0.5,
                  fontWeight: 'bold',
                  borderColor: 'divider',
                  color: 'text.primary',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                Editar Perfil
              </Button>
            ) : (
              <Button
                variant={isFollowing ? 'outlined' : 'contained'}
                color={isFollowing ? 'inherit' : 'primary'}
                onClick={handleFollowToggle}
                disabled={isActionLoading}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                sx={{
                  borderRadius: 999,
                  textTransform: 'none',
                  px: 3,
                  py: 0.8,
                  fontWeight: 'bold',
                  minWidth: 120,
                  ...(isFollowing && {
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'error.light',
                      borderColor: 'error.main',
                      color: 'error.main',
                    },
                  }),
                }}
              >
                {isActionLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : isFollowing ? (
                  isHovering ? (
                    'Deixar de seguir'
                  ) : (
                    'Seguindo'
                  )
                ) : (
                  'Seguir'
                )}
              </Button>
            )}
          </Box>

          <Typography variant="h5" fontWeight={800} sx={{ mt: 1 }}>
            {user.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            @{user.username}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2.5 }}>
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              <Typography fontWeight="bold" color="text.primary">
                {user.followingCount}
              </Typography>
              <Typography color="text.secondary">Seguindo</Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              <Typography fontWeight="bold" color="text.primary">
                {user.followersCount}
              </Typography>
              <Typography color="text.secondary">Seguidores</Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            borderBottom: 1,
            borderColor: 'divider',
            mt: 1,
          }}
        >
          <Box
            sx={{
              flex: 1,
              textAlign: 'center',
              p: 2,
              cursor: 'pointer',
              fontWeight: 'bold',
              position: 'relative',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            Tweets
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 56,
                height: 4,
                bgcolor: 'primary.main',
                borderRadius: 2,
              }}
            />
          </Box>
          <Box
            sx={{
              flex: 1,
              textAlign: 'center',
              p: 2,
              color: 'text.secondary',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            Respostas
          </Box>
          <Box
            sx={{
              flex: 1,
              textAlign: 'center',
              p: 2,
              color: 'text.secondary',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            Curtidas
          </Box>
        </Box>

        <Box>
          {tweets.length === 0 ? (
            <Typography
              color="text.secondary"
              sx={{ p: 5, textAlign: 'center' }}
            >
              {isViewingOwnProfile
                ? 'Você ainda não postou nenhum tweet.'
                : `@${user.username} ainda não postou tweets.`}
            </Typography>
          ) : (
            tweets.map((tweet) => (
              <Box key={tweet.id}>
                <TweetCard tweet={tweet} onDeleteSuccess={handleTweetDelete} />
                <Divider />
              </Box>
            ))
          )}
        </Box>
      </>
    )
  }

  return (
    <Box sx={{ pb: 10 }}>
      <Box
        sx={{
          px: 2,
          py: 1,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
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
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ mr: 2, color: 'text.primary' }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h6" fontWeight="bold" lineHeight={1.2}>
            {profile?.user?.name || urlUsername}
          </Typography>
          {profile?.user && (
            <Typography variant="caption" color="text.secondary">
              {profile.user.tweetsCount} Tweets
            </Typography>
          )}
        </Box>
      </Box>

      {renderContent()}

      <EditProfileModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialName={profile?.user?.name || ''}
        initialImageUrl={profile?.user?.imageUrl || ''}
        onSuccess={handleEditSuccess}
      />
    </Box>
  )
}
