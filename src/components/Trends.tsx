import React from 'react'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  useTheme,
} from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SearchIcon from '@mui/icons-material/Search'
import { alpha } from '@mui/material/styles'

export const Trends: React.FC = () => {
  const theme = useTheme()

  const topics = [
    {
      category: 'Música',
      topic: 'Assunto sobre Música',
      tweets: '15.4K Tweets',
    },
    {
      category: 'Assunto do Momento em Brasil',
      topic: 'Assunto do Momento',
      tweets: '20.7K Tweets',
    },
    { category: 'Tecnologia', topic: 'IA Generativa', tweets: '8.1M Tweets' },
    {
      category: 'Esportes',
      topic: 'Nova contratação do time X',
      tweets: '50K Tweets',
    },
    {
      category: 'Entretenimento',
      topic: 'Estreia da nova série',
      tweets: '1.2M Tweets',
    },
  ]

  return (
    <Box
      sx={{
        pl: 3,
        py: 1,
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: { xs: 'none', md: 'block' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: theme.palette.mode === 'dark' ? '#202327' : '#eff3f4',
          borderRadius: 99,
          p: 1.5,
          mb: 2,
        }}
      >
        <SearchIcon sx={{ color: 'text.secondary', mr: 2 }} />
        <Typography color="text.secondary">Buscar no Growtwitter</Typography>
      </Box>

      <Box
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? '#16181c' : '#f7f9f9', // Fundo do Card
          borderRadius: 4,
          overflow: 'hidden',
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight={800} sx={{ p: 2 }}>
          O que está acontecendo
        </Typography>

        <List disablePadding>
          {topics.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                sx={{
                  display: 'block',
                  px: 2,
                  '&:hover': {
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.common.white, 0.03)
                        : alpha(theme.palette.common.black, 0.03),
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    {item.category}
                  </Typography>
                  <MoreHorizIcon
                    fontSize="small"
                    sx={{ color: 'text.secondary', fontSize: 16 }}
                  />
                </Box>

                <Typography variant="body2" fontWeight={700} sx={{ my: 0.5 }}>
                  {item.topic}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  {item.tweets}
                </Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box
          sx={{
            p: 2,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <Typography color="primary" variant="body2">
            Mostrar mais
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
