import { useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { Container, Grid, Box, useMediaQuery, useTheme } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../store/hooks.ts'
import { logout } from '../store/slices/authSlice.ts'
import { Sidebar } from './Sidebar.tsx'
import { Trends } from './Trends.tsx'
import { MobileMenu } from './MobileMenu.tsx'

const MAX_WIDTH = 'lg'

export default function PrivateRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isLoggedIn)
  const loggedUsername = useAppSelector((state) => state.auth.username)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const theme = useTheme()

  // Hook para saber se é mobile
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [feedKey, setFeedKey] = useState(0)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleNewTweetPosted = () => {
    setFeedKey((prevKey) => prevKey + 1)
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Container maxWidth={MAX_WIDTH} disableGutters>
        <Grid container spacing={2}>
          {/* ESQUERDA: Sidebar */}
          {/* size={{ xs: 'none' }} não existe, usamos display: none no sx */}
          <Grid
            size={{ sm: 2, md: 3 }} // Ocupa 2 colunas no tablet, 3 no desktop
            sx={{ display: { xs: 'none', sm: 'block' } }} // Esconde no mobile
          >
            <Sidebar
              username={loggedUsername}
              handleLogout={handleLogout}
              onTweetPosted={handleNewTweetPosted}
            />
          </Grid>

          {/* MEIO: Feed */}
          {/* size={{ xs: 12 }} ocupa tudo no mobile */}
          <Grid size={{ xs: 12, sm: 10, md: 6 }}>
            <Box
              sx={{
                borderLeft: { sm: 1 },
                borderRight: { sm: 1 },
                borderColor: 'divider',
                minHeight: '100vh',
                pb: { xs: 8, sm: 0 }, // Espaço para o menu mobile
              }}
            >
              <Outlet key={feedKey} />
            </Box>
          </Grid>

          {/* DIREITA: Trends */}
          {/* size={{ md: 3 }} só define tamanho para desktop */}
          <Grid
            size={{ md: 3 }}
            sx={{ display: { xs: 'none', md: 'block' } }} // Esconde em mobile e tablet
          >
            <Trends />
          </Grid>
        </Grid>
      </Container>

      {/* Menu Inferior */}
      {isMobile && <MobileMenu handleLogout={handleLogout} />}
    </Box>
  )
}
