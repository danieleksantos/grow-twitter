import { Box, Typography, Avatar } from '@mui/material'
import { useAppSelector } from '../store/hooks.ts'

export function HomePage() {
  const loggedUsername = useAppSelector((state) => state.auth.username)
  const loggedUserImageUrl = useAppSelector((state) => state.auth.imageUrl)

  return (
    <Box>
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid #e0e0e0',
          position: 'sticky',
          top: 0,
          bgcolor: 'background.paper',
          zIndex: 100,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Página Inicial
        </Typography>
      </Box>

      <Box
        sx={{
          p: 2,
          borderBottom: '10px solid #f7f9f9',
          display: 'flex',
          gap: 2,
        }}
      >
        <Avatar
          src={loggedUserImageUrl ?? undefined}
          alt={loggedUsername || ''}
        />
        <Typography color="text.secondary" sx={{ py: 1 }}>
          O que está acontecendo, @{loggedUsername}?
        </Typography>
      </Box>

      <Box sx={{ p: 4 }} align="center" color="text.secondary">
        Seu Feed de Tweets será carregado aqui.
      </Box>
    </Box>
  )
}
