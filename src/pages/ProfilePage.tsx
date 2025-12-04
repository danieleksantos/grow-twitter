import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Divider,
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

import { useAppSelector, useAppDispatch } from '../store/hooks.ts'
import api from '../services/api.ts'

interface UserProfile {
  id: string
  name: string
  username: string
  email: string
  imageUrl?: string
  coverUrl?: string
  followers: number
  following: number
  isFollowed: boolean
  tweetsCount: number
}

export function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const loggedUsername = useAppSelector((state) => state.auth.username)

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isOwnProfile = username === loggedUsername

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError(null)

      try {
        const endpoint = isOwnProfile ? '/users/me' : `/users/${username}`
        const response = await api.get(endpoint)
        setProfile(response.data.user || response.data)
      } catch (err: any) {
        console.error('Erro ao carregar perfil:', err)
        setError('Não foi possível carregar o perfil. Usuário não encontrado.')
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username, isOwnProfile])

  const handleFollowToggle = () => {
    if (!profile) return
    console.log(`Ação de Follow/Unfollow no usuário @${profile.username}`)
  }

  const ProfileContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )
    }

    if (error || !profile) {
      return (
        <Typography color="error" align="center" sx={{ py: 4 }}>
          {error || 'Perfil não disponível.'}
        </Typography>
      )
    }

    return (
      <Box>
        <Box
          sx={{
            height: 200,
            bgcolor: 'primary.main',
            backgroundImage: `url(${profile.coverUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              mt: -10,
            }}
          >
            <Box
              component="img"
              src={profile.imageUrl || '/default-avatar.png'}
              alt={profile.name}
              sx={{
                width: 130,
                height: 130,
                borderRadius: '50%',
                border: '4px solid white',
                bgcolor: 'background.paper',
              }}
            />

            {!isOwnProfile ? (
              <Button
                variant={profile.isFollowed ? 'outlined' : 'contained'}
                onClick={handleFollowToggle}
                sx={{ borderRadius: 999 }}
              >
                {profile.isFollowed ? 'Seguindo' : 'Seguir'}
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={() => console.log('Abrir modal de edição do perfil')}
                sx={{ borderRadius: 999 }}
              >
                Editar Perfil
              </Button>
            )}
          </Box>

          <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
            {profile.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            @{profile.username}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <Typography
                component="span"
                fontWeight="bold"
                color="text.primary"
              >
                {profile.following}
              </Typography>
              &nbsp;Seguindo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Typography
                component="span"
                fontWeight="bold"
                color="text.primary"
              >
                {profile.followers}
              </Typography>
              &nbsp;Seguidores
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mt: 2 }} />

        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            Lista de Tweets do usuário @{profile.username} será carregada aqui.
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <React.Fragment>
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid #e0e0e0',
          position: 'sticky',
          top: 0,
          bgcolor: 'background.paper',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Button
          onClick={() => navigate(-1)}
          size="small"
          sx={{ minWidth: 0, p: 0 }}
        >
          <ArrowBack />
        </Button>
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1 }}>
            {profile?.name || username}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {profile?.tweetsCount ?? 0} Tweets
          </Typography>
        </Box>
      </Box>

      <ProfileContent />
    </React.Fragment>
  )
}
