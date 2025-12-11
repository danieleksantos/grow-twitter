import React, { useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Stack,
} from '@mui/material'

import { Home, Tag, Person, Twitter, Logout } from '@mui/icons-material'

import { TweetCreationModal } from './TweetCreationModal.tsx'
import { useAppSelector } from '../store/hooks.ts'
import { ThemeSwitcher } from './ThemeSwitcher.tsx'

interface SidebarProps {
  username: string | null
  handleLogout: () => void
  onTweetPosted: () => void
}

const navLinks = [
  { text: 'Página Inicial', icon: <Home sx={{ fontSize: 28 }} />, path: '/' },
  { text: 'Explorar', icon: <Tag sx={{ fontSize: 28 }} />, path: '/explore' },
]

export const Sidebar: React.FC<SidebarProps> = ({
  username,
  handleLogout,
  onTweetPosted,
}) => {
  const location = useLocation()
  const [openModal, setOpenModal] = useState(false)

  const { name, imageUrl } = useAppSelector((state) => state.auth)

  const links = [
    ...navLinks,
    {
      text: 'Perfil',
      icon: <Person sx={{ fontSize: 28 }} />,
      path: `/profile/${username}`,
    },
  ]

  return (
    <Box
      sx={{
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        px: 2,
        py: 1,
      }}
    >
      <Box>
        <Box
          sx={{
            pl: 1.5,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Twitter sx={{ fontSize: 35, color: 'primary.main' }} />

          <ThemeSwitcher />
        </Box>

        <List disablePadding>
          {links.map((item) => {
            const isActive = location.pathname === item.path

            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    borderRadius: 99,
                    py: 1.5,
                    px: 2.5,
                    transition: '0.2s',
                    bgcolor: isActive ? 'action.selected' : 'transparent',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 45,
                      color: isActive ? 'text.primary' : 'text.primary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      variant: 'h6',
                      fontWeight: isActive ? 800 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={() => setOpenModal(true)}
          sx={{
            mt: 2,
            py: 1.5,
            borderRadius: 99,
            fontWeight: 'bold',
            fontSize: '1.1rem',
            textTransform: 'none',
            boxShadow: 'none',
          }}
        >
          Tweetar
        </Button>
      </Box>

      <Stack spacing={2} sx={{ mb: 3 }}>
        <Box
          onClick={handleLogout}
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 1.5,
            borderRadius: 99,
            cursor: 'pointer',
            transition: '0.2s',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <Avatar
            src={imageUrl || undefined}
            alt={name || ''}
            sx={{ width: 40, height: 40, mr: 1.5 }}
          />

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight="bold" noWrap>
              {name || username}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              @{username}
            </Typography>
          </Box>

          <Logout color="action" />
        </Box>
      </Stack>

      <TweetCreationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onTweetPosted={onTweetPosted}
      />
    </Box>
  )
}
