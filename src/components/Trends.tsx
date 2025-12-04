import { Box, Typography, Paper, Link as MuiLink } from '@mui/material'

const TRENDING_TOPICS = [
  { category: 'Música', topic: 'Assunto sobre Música', posts: '15.4K' },
  {
    category: 'Assunto do Momento em Brasil',
    topic: 'Assunto do Momento',
    posts: '20.7K',
  },
  { category: 'Tecnologia', topic: 'IA Generativa', posts: '8.1M' },
  { category: 'Esportes', topic: 'Nova contratação do time X', posts: '50K' },
  { category: 'Entretenimento', topic: 'Estreia da nova série', posts: '1.2M' },
]

export const Trends = () => (
  <Paper
    sx={{
      mt: 2,
      borderRadius: 4,
      position: 'sticky',
      top: 20,
      bgcolor: '#f7f9f9',
      overflow: 'hidden',
    }}
  >
    <Box
      sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        O que está acontecendo agora?
      </Typography>
    </Box>

    <Box>
      {TRENDING_TOPICS.map((trend, index) => (
        <Box
          key={index}
          sx={{
            p: 2,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            '&:hover': { bgcolor: '#eceff1' },
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {trend.category}
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>
            {trend.topic}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {trend.posts} Tweets
          </Typography>
        </Box>
      ))}
    </Box>

    <Box sx={{ p: 2 }}>
      <MuiLink
        component="button"
        variant="body2"
        sx={{ display: 'block', color: 'primary.main' }}
      >
        Mostrar mais
      </MuiLink>
    </Box>
  </Paper>
)
