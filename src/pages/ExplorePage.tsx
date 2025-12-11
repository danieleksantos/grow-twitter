import React, { useEffect, useState, useCallback } from 'react'
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Pagination,
  Stack,
  useTheme,
  Chip,
  alpha,
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
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const theme = useTheme()
  const navigate = useNavigate()

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get(`/users?page=${page}`)

      setUsers(response.data.data)

      const { total, limit } = response.data.meta
      const calculatedPages = Math.ceil(total / limit)
      setTotalPages(calculatedPages)
    } catch (error) {
      console.error('Erro ao carregar explorar:', error)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleProfileClick = (username: string) => {
    navigate(`/profile/${username}`)
  }

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Box sx={{ pb: 4, width: '100%', position: 'relative' }}>
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
        <Typography variant="h6" fontWeight="bold">
          Explorar Usuários
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ p: 0 }}>
          {users.length === 0 ? (
            <Typography
              sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}
            >
              Nenhum usuário encontrado.
            </Typography>
          ) : (
            <>
              {users.map((user) => (
                <Box
                  key={user.id}
                  onClick={() => handleProfileClick(user.username)}
                  sx={{
                    p: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    gap: 2,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Avatar
                    src={user.imageUrl || undefined}
                    alt={user.name}
                    sx={{ width: 48, height: 48 }}
                  />

                  <Box sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 0.5,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        component="span"
                        sx={{
                          mr: 1,
                          '&:hover': { textDecoration: 'underline' },
                        }}
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
                        <Chip
                          label="Seguindo"
                          size="small"
                          sx={{
                            ml: 1,
                            height: 20,
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            bgcolor:
                              theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.1)'
                                : '#eff3f4',
                            color: 'text.secondary',
                          }}
                        />
                      )}
                    </Box>

                    {user.latestTweet ? (
                      <Box
                        sx={{
                          mt: 1,
                          p: 1.5,
                          borderRadius: 3,
                          bgcolor:
                            theme.palette.mode === 'dark'
                              ? alpha(theme.palette.common.white, 0.05)
                              : alpha(theme.palette.common.black, 0.03),
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          sx={{ mb: 0.5, fontWeight: 'bold' }}
                        >
                          Último Tweet:
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.primary"
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
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: 'block' }}
                      >
                        Nenhum tweet recente.
                      </Typography>
                    )}

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1.5, display: 'block' }}
                    >
                      {user.followersCount} seguidores
                    </Typography>
                  </Box>
                </Box>
              ))}

              {totalPages > 1 && (
                <Stack spacing={2} alignItems="center" sx={{ py: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: 'text.primary',
                      },
                    }}
                  />
                </Stack>
              )}
            </>
          )}
        </Box>
      )}
    </Box>
  )
}
