import React from 'react'
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material'
import { Home, Tag, Person, Logout } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

interface MobileMenuProps {
  handleLogout: () => void
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ handleLogout }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const username = useAppSelector((state) => state.auth.username)

  // Define qual aba está ativa baseada na URL
  const getCurrentValue = () => {
    if (location.pathname === '/') return 0
    if (location.pathname === '/explore') return 1
    if (location.pathname.includes('/profile')) return 2
    return 0
  }

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels={false} // Estilo limpo
        value={getCurrentValue()}
        onChange={(_, newValue) => {
          if (newValue === 0) navigate('/')
          if (newValue === 1) navigate('/explore')
          if (newValue === 2) navigate(`/profile/${username}`)
          if (newValue === 3) handleLogout()
        }}
      >
        <BottomNavigationAction label="Início" icon={<Home />} />
        <BottomNavigationAction label="Explorar" icon={<Tag />} />
        <BottomNavigationAction label="Perfil" icon={<Person />} />
        <BottomNavigationAction label="Sair" icon={<Logout color="error" />} />
      </BottomNavigation>
    </Paper>
  )
}
