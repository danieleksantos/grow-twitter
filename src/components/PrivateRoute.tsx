import { useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { Container, CssBaseline, Grid, Box } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../store/hooks.ts'
import { logout } from '../store/slices/authSlice.ts'
import { Sidebar } from './Sidebar.tsx'
import { Trends } from './Trends.tsx'

const MAX_WIDTH = 'lg'

export default function PrivateRoute() {
  const isAuthenticated = useAppSelector((state) => state.auth.isLoggedIn)
  const loggedUsername = useAppSelector((state) => state.auth.username)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
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
    <Container maxWidth={MAX_WIDTH} disableGutters>
      <CssBaseline />

      <Grid container spacing={2}>
        <Grid size={{ xs: 3 }}>
          <Sidebar
            username={loggedUsername}
            handleLogout={handleLogout}
            onTweetPosted={handleNewTweetPosted}
          />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <Box
            sx={{
              borderLeft: '1px solid #e0e0e0',
              borderRight: '1px solid #e0e0e0',
              minHeight: '100vh',
            }}
          >
            <Outlet key={feedKey} />
          </Box>
        </Grid>

        <Grid size={{ xs: 3 }}>
          <Trends />
        </Grid>
      </Grid>
    </Container>
  )
}
