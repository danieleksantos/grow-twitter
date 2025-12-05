import React, { useState } from 'react'
import { useNavigate, Navigate, Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Link,
} from '@mui/material'
import { Twitter } from '@mui/icons-material'

import api from '../services/api.ts'
import { login } from '../store/slices/authSlice.ts'
import { useAppDispatch, useAppSelector } from '../store/hooks.ts'

export function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isLoggedIn) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!username || !password) {
      setError('Por favor, preencha o campo de usuário e senha.')
      return
    }

    setIsLoading(true)

    try {
      const loginData = {
        username,
        password,
      }

      const response = await api.post('/auth/login', loginData)

      const { token, user } = response.data
      const userUsername = user.username

      dispatch(login({ token, username: userUsername }))

      navigate('/')
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        'Falha na autenticação. Verifique suas credenciais.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Twitter sx={{ fontSize: 50, color: 'primary.main', mb: 1 }} />
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Entrar no Growtwitter
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nome de Usuário"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          {error && (
            <Typography
              color="error"
              variant="body2"
              align="center"
              sx={{ mt: 2 }}
            >
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={isLoading || !username || !password}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Entrar'
            )}
          </Button>
          <Grid container justifyContent="center">
            <Grid>
              <Link component={RouterLink} to="/registerPage" variant="body2">
                {'Não tem uma conta? Cadastre-se'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}
