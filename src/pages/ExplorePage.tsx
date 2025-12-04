import { Box, Typography } from '@mui/material'

const EXPLORE_ITEMS = [
  {
    category: 'Assunto do Momento em Tecnologia',
    topic: 'Inteligência Artificial Generativa',
    tweets: '50.4K Tweets',
  },
  {
    category: 'Esportes - Tópico Importante',
    topic: 'Finais da Copa Growdev',
    tweets: '12.8K Tweets',
  },
  {
    category: 'Música - Artista Novo',
    topic: 'Lançamento do álbum "Typescript"',
    tweets: '24.9K Tweets',
  },
  {
    category: 'Cinema - Lançamento da Semana',
    topic: 'A Ascensão do Front-End',
    tweets: '8.1K Tweets',
  },
  {
    category: 'Entretenimento - Série em Alta',
    topic: 'O Mistério da Stack MERN',
    tweets: '45.7K Tweets',
  },
  {
    category: 'Assunto do Momento em Porto Alegre',
    topic: 'Feira de TI no Sul',
    tweets: '3.2K Tweets',
  },
  {
    category: 'Daphne - Principal Assunto do Momento',
    topic: 'Novos Requisitos do Projeto',
    tweets: '99.9K Tweets',
  },
]

export function ExplorePage() {
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
          Explorar
        </Typography>
      </Box>

      <Box>
        {EXPLORE_ITEMS.map((item, index) => (
          <Box
            key={index}
            sx={{
              p: 2,
              borderBottom: `1px solid #e0e0e0`,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {item.category}
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {item.topic}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.tweets}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
