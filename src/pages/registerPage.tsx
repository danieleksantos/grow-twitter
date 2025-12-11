import React, { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
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
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import api from '../services/api.ts'
import { ThemeSwitcher } from '../components/ThemeSwitcher.tsx'

const MySwal = withReactContent(Swal)

export function RegisterPage() {
  const navigate = useNavigate()
  const theme = useTheme()

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!name || !username || !password) {
      setError('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    setIsLoading(true)

    try {
      const userData = {
        name,
        username,
        password,
        imageUrl: imageUrl.trim() || undefined,
      }

      await api.post('/auth/register', userData)

      await MySwal.fire({
        title: 'Conta Criada!',
        text: 'Seu cadastro foi realizado com sucesso.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
      })

      navigate('/login')
    } catch (err) {
      let errorMessage = 'Ocorreu um erro inesperado ao tentar cadastrar.'
      if (isAxiosError(err)) {
        errorMessage =
          err.response?.data?.message ||
          'Falha no cadastro. Verifique se o nome de usuário já existe.'
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const soarUpKeyframes = {
    '0%': {
      opacity: 0,
      transform: 'translateY(100vh) scale(0.3) rotate(-10deg)',
    },
    '20%': {
      opacity: 0.5,
    },
    '100%': {
      opacity: 0.2,
      transform: 'translateY(-20vh) scale(0.2) rotate(10deg)',
    },
  }

  const birdCommonStyles = {
    position: 'absolute',
    color: theme.palette.primary.main,
    opacity: 0,
    zIndex: 0,
    pointerEvents: 'none',
  }

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
        <ThemeSwitcher />
      </Box>

      <Box
        sx={{
          ...birdCommonStyles,
          left: '10%',
          animation: 'soarUp 7s ease-in infinite',
          '@keyframes soarUp': soarUpKeyframes,
        }}
      >
        <Twitter sx={{ fontSize: 180 }} />
      </Box>

      <Box
        sx={{
          ...birdCommonStyles,
          left: '40%',
          bottom: '-10%',
          animation: 'soarUp 10s ease-in infinite',
          animationDelay: '3s',
          '@keyframes soarUp': soarUpKeyframes,
        }}
      >
        <Twitter sx={{ fontSize: 220 }} />
      </Box>

      <Box
        sx={{
          ...birdCommonStyles,
          right: '15%',
          animation: 'soarUp 8s ease-in infinite',
          animationDelay: '5s',
          '@keyframes soarUp': {
            ...soarUpKeyframes,
            '100%': {
              opacity: 0,
              transform:
                'translateY(-20vh) translateX(-50px) scale(0.5) rotate(5deg)',
            },
          },
        }}
      >
        <Twitter sx={{ fontSize: 150 }} />
      </Box>

      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            py: 4,
            position: 'relative',
            zIndex: 2, // Garante que o formulário fique na frente
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
              // Mantendo a animação de entrada do card
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
              Crie sua conta
            </Typography>

            {/* ... Restante do formulário (Inputs, Botão, Link) ... */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1, width: '100%' }}
            >
              {/* (Seus campos de TextField e Button aqui...) */}
              {/* Vou omitir para economizar espaço, mas mantenha o código original do formulário */}
              <TextField
                margin="normal"
                required
                fullWidth
                label="Nome Completo"
                name="name"
                autoComplete="name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                slotProps={{ input: { sx: { borderRadius: 2 } } }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                name="username"
                autoComplete="username"
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
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                slotProps={{ input: { sx: { borderRadius: 2 } } }}
              />
              <TextField
                margin="normal"
                fullWidth
                label="URL da Imagem (Opcional)"
                name="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
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
                }}
                disabled={isLoading || !name || !username || !password}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Cadastrar'
                )}
              </Button>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  underline="hover"
                >
                  {'Já tem uma conta? Entrar'}
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  )
}
