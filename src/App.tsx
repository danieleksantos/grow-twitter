import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { useSelector } from 'react-redux'

import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { ExplorePage } from './pages/ExplorePage'
import { RegisterPage } from './pages/registerPage.tsx'
import PrivateRoute from './components/PrivateRoute.tsx'
import type { RootState } from './store'

import themes from './theme'

export function App() {
  const mode = useSelector((state: RootState) => state.theme.mode)

  return (
    <ThemeProvider theme={themes[mode]}>
      <CssBaseline />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/explore" element={<ExplorePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  )
}
