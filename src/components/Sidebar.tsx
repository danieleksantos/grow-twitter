import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Avatar,
} from '@mui/material'
import {
  ExitToApp,
  Twitter,
  Home,
  Search,
  AccountCircle,
  Create,
} from '@mui/icons-material'

import { TweetCreationModal } from './TweetCreationModal.tsx'
import { useAppSelector } from '../store/hooks.ts'

interface NavLinkItem {
  text: string
  icon: React.ReactElement
  path: string
}

interface SidebarProps {
  username: string | null
  handleLogout: () => void
  onTweetPosted: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  username,
  handleLogout,
  onTweetPosted,
}) => {
  const theme = useTheme()

  const [openModal, setOpenModal] = useState(false)

  const loggedUserImageUrl = useAppSelector((state) => state.auth.imageUrl)
  const loggedUserName = useAppSelector((state) => state.auth.name)

  const avatarSrc = loggedUserImageUrl ?? undefined

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const navLinks: NavLinkItem[] = [
    { text: 'Página Inicial', icon: <Home />, path: '/' },
    { text: 'Explorar', icon: <Search />, path: '/explore' },
    { text: 'Perfil', icon: <AccountCircle />, path: `/profile/${username}` },
  ]

  return (
    <Box
      sx={{
        height: '100vh',
        borderRight: `1px solid ${theme.palette.divider}`,
        position: 'sticky',
        top: 0,
        pt: 2,
        px: 1.5,
        maxWidth: 260,
      }}
    >
      <Twitter sx={{ fontSize: 40, color: 'primary.main', ml: 1, mb: 1 }} />

      <List>
        {navLinks.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={RouterLink} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        <Box sx={{ p: 1, mt: 1 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{ borderRadius: 999, py: 1.5 }}
            startIcon={<Create />}
            onClick={() => setOpenModal(true)}
          >
            Tweetar
          </Button>
        </Box>
      </List>

      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover', borderRadius: 999 },
        }}
        onClick={handleLogout}
      >
        <Avatar
          src={avatarSrc}
          alt={username || ''}
          sx={{ width: 40, height: 40 }}
        />

        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}
        >
          <Typography variant="body2" fontWeight="bold" noWrap>
            {loggedUserName || username}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            @{username}
          </Typography>
        </Box>

        <ExitToApp color="action" sx={{ ml: 1 }} />
      </Box>

      <TweetCreationModal
        open={openModal}
        onClose={handleCloseModal}
        onTweetPosted={onTweetPosted}
      />
    </Box>
  )
}
