import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Paper,
  Grid,
} from '@mui/material'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

interface UserExplore {
  id: string
  name: string
  username: string
  imageUrl: string | null
  followersCount: number
  isFollowing: boolean
  latestTweet: {
    content: string
    createdAt: string
  } | null
}

export function ExplorePage() {
  const [users, setUsers] = useState<UserExplore[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users?page=1')
      setUsers(response.data.data)
    } catch (error) {
      console.error('Erro ao carregar explorar:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileClick = (username: string) => {
    navigate(`/profile/${username}`)
  }

  return (
    <Box>
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid #e0e0e0',
          position: 'sticky',
          top: 0,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 100,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Explorar Usuários
        </Typography>
      </Box>

      {/* Lista de Usuários */}
      {loading ? (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ p: 0 }}>
          {users.length === 0 && (
            <Typography
              sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}
            >
              Nenhum usuário encontrado.
            </Typography>
          )}

          {users.map((user) => (
            <Paper
              key={user.id}
              elevation={0}
              onClick={() => handleProfileClick(user.username)}
              sx={{
                p: 2,
                borderBottom: '1px solid #e0e0e0',
                borderRadius: 0,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: '#f5f5f5' },
              }}
            >
              <Grid container spacing={2}>
                {/* Avatar */}
                <Grid>
                  <Avatar
                    src={user.imageUrl || undefined}
                    alt={user.name}
                    sx={{ width: 48, height: 48 }}
                  />
                </Grid>

                {/* Conteúdo */}
                <Grid>
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      component="span"
                      sx={{ mr: 1 }}
                    >
                      {user.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="span"
                    >
                      @{user.username}
                    </Typography>

                    {user.isFollowing && (
                      <Typography
                        variant="caption"
                        sx={{
                          bgcolor: '#e1e8ed',
                          color: '#657786',
                          px: 1,
                          py: 0.2,
                          borderRadius: 1,
                          ml: 1,
                          fontWeight: 'bold',
                        }}
                      >
                        Seguindo
                      </Typography>
                    )}
                  </Box>

                  {user.latestTweet ? (
                    <Box sx={{ bgcolor: '#f5f8fa', p: 1.5, borderRadius: 2 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mb: 0.5 }}
                      >
                        Último post:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontStyle: 'italic',
                          display: '-webkit-box',
                          overflow: 'hidden',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                        }}
                      >
                        "{user.latestTweet.content}"
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Nenhum tweet recente.
                    </Typography>
                  )}

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    {user.followersCount} seguidores
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  )
}
