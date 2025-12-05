// src/pages/HomePage.tsx

import React, { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../store/hooks' // Importa useAuth do store/hooks
import { TweetCard } from '../components/TweetCard'
import type { Tweet } from '../types'
import { TweetCreationModal } from '../components/TweetCreationModal' // Importa o modal pronto

// Importações do MUI
import { Box, Typography, Divider, CircularProgress, Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

// -------------------------------------------------------------------
// Componente Principal: HomePage (Pronto para a Coluna Central)
// -------------------------------------------------------------------
export const HomePage: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { isLoggedIn } = useAuth()

  // Condição para mostrar o loader apenas na primeira carga
  const isInitialLoad = !tweets.length && loading

  const fetchFeed = async () => {
    // Como está em PrivateRoute, isLoggedIn deve ser true, mas mantemos a checagem
    if (!isLoggedIn) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const response = await api.get('/tweets')
      setTweets(response.data.data)
    } catch (error) {
      console.error('Erro ao carregar o feed:', error)
      // O interceptor do api.ts deve cuidar do logout em caso de 401
      setTweets([])
    } finally {
      setLoading(false)
    }
  }

  // Função para recarregar o feed após postagem bem-sucedida
  const handleTweetPosted = () => {
    // Notifica o PrivateRoute (via setFeedKey) para recarregar o feed,
    // e o Home recarrega via fetchFeed
    // A lógica de setFeedKey já está no seu PrivateRoute, então basta chamarmos fetchFeed()
    fetchFeed()
  }

  useEffect(() => {
    fetchFeed()
  }, [isLoggedIn])

  // Se, por alguma razão, o PrivateRoute falhar, mostramos uma tela simples (embora improvável)
  if (!isLoggedIn) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Erro de Autenticação. Por favor, refaça o login.
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        // Removemos bordas e width, pois o PrivateRoute já define a coluna
        width: '100%',
        position: 'relative',
      }}
    >
      {/* 1. Cabeçalho Fixo (Página Inicial) */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid #eee',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: 'background.default',
        }}
      >
        <Typography variant="h6" component="h1" fontWeight="bold">
          Página Inicial
        </Typography>
      </Box>

      {/* 2. Indicadores de Carregamento e Feed Vazio */}
      {isInitialLoad && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && tweets.length === 0 && (
        <Typography color="text.secondary" sx={{ p: 2 }}>
          Seu feed está vazio. Comece a seguir outros usuários!
        </Typography>
      )}

      {/* 3. Lista de Tweets (Feed) */}
      <Box className="tweet-list">
        {tweets.map((tweet) => (
          <Box key={tweet.id}>
            {/* TweetCard precisa de uma margem interna, ou os divisores o farão */}
            <TweetCard tweet={tweet} />
            {/* A imagem de referência tem divisores sutis entre tweets */}
            <Divider sx={{ my: 0 }} />
          </Box>
        ))}
      </Box>

      {/* 4. FAB (Botão Tweetar Flutuante) */}
      <Fab
        color="primary"
        aria-label="tweetar"
        onClick={() => setIsModalOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          // Ajustamos o right para que o botão fique no canto da coluna central
          // O valor '16px' é um bom ponto de partida no canto da tela, mas pode
          // precisar de ajuste dependendo do tamanho da coluna Trends.
          right: 16,
          zIndex: 1000,
        }}
      >
        <AddIcon />
      </Fab>

      {/* 5. Modal de Criação de Tweet */}
      <TweetCreationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTweetPosted={handleTweetPosted}
      />
    </Box>
  )
}
