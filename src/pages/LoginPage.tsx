import React, { useState } from 'react'
import { useNavigate, Navigate, Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Link,
  Paper,
  useTheme,
} from '@mui/material'
import { Twitter } from '@mui/icons-material'
import { isAxiosError } from 'axios'

import api from '../services/api.ts'
import { login } from '../store/slices/authSlice.ts'
import { useAppDispatch, useAppSelector } from '../store/hooks.ts'
import { ThemeSwitcher } from '../components/ThemeSwitcher.tsx'

export function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const theme = useTheme()
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
      setError('Por favor, preencha todos os campos.')
      return
    }

    setIsLoading(true)

    try {
      const loginData = { username, password }
      const response = await api.post('/auth/login', loginData)

      const { token, user } = response.data
      const { id, username: userUsername, name, imageUrl } = user

      dispatch(login({ token, id, username: userUsername, name, imageUrl }))

      navigate('/')
    } catch (err) {
      if (isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.message ||
          'Falha na autenticação. Verifique suas credenciais.'
        setError(errorMessage)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Ocorreu um erro inesperado.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
        <ThemeSwitcher />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          left: 0,
          zIndex: 0,
          pointerEvents: 'none',
          color: theme.palette.primary.main,
          opacity: 0.4,
          animation: 'flyAcrossScreen 8s linear infinite',
          '@keyframes flyAcrossScreen': {
            '0%': {
              opacity: 0,
              transform: 'translate(-20vw, 50px) scale(0.3) rotate(-15deg)',
            },
            '20%': {
              opacity: 0.4,
            },
            '50%': {
              opacity: 0.6,
              transform: 'translate(50vw, -50px) scale(1) rotate(0deg)',
            },
            '80%': {
              opacity: 0.4,
            },
            '100%': {
              opacity: 0,
              transform: 'translate(120vw, -100px) scale(0.3) rotate(15deg)',
            },
          },
        }}
      >
        <Twitter sx={{ fontSize: 250 }} />
      </Box>

      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              border: 1,
              borderColor: 'divider',
              borderRadius: 4,
              bgcolor: 'background.paper',
              animation: 'fadeInUp 0.6s ease-out',
              '@keyframes fadeInUp': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            <Twitter sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />

            <Typography
              component="h1"
              variant="h5"
              fontWeight="bold"
              sx={{ mb: 3 }}
            >
              Entrar no Growtwitter
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1, width: '100%' }}
            >
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
                slotProps={{ input: { sx: { borderRadius: 2 } } }}
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
                slotProps={{ input: { sx: { borderRadius: 2 } } }}
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
                size="large"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 99,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
                disabled={isLoading || !username || !password}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Entrar'
                )}
              </Button>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Link
                  component={RouterLink}
                  to="/register"
                  variant="body2"
                  underline="hover"
                >
                  {'Não tem uma conta? Cadastre-se'}
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}
