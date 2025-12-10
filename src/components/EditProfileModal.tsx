import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Modal,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
  Avatar,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'
import api from '../services/api'
import { useAppDispatch } from '../store/hooks'
// Importe a action que atualiza o Auth no Redux (para o Sidebar atualizar na hora)
// Supondo que você tenha um setCredentials ou updateUserInfo no authSlice
import { updateUserInfo } from '../store/slices/authSlice'

interface EditProfileModalProps {
  open: boolean
  onClose: () => void
  initialName: string
  initialImageUrl: string | null
  onSuccess: (newName: string, newImageUrl: string | null) => void
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 0,
  outline: 'none',
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onClose,
  initialName,
  initialImageUrl,
  onSuccess,
}) => {
  const dispatch = useAppDispatch()

  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Preenche os campos quando o modal abre
  useEffect(() => {
    if (open) {
      setName(initialName || '')
      setImageUrl(initialImageUrl || '')
    }
  }, [open, initialName, initialImageUrl])

  const handleSave = async () => {
    if (!name.trim()) return alert('O nome não pode ser vazio.')

    setIsLoading(true)
    try {
      const response = await api.put('/users', {
        name,
        imageUrl: imageUrl.trim() || null, // Envia null se estiver vazio
      })

      const updatedUser = response.data.data

      // 1. Atualiza o Redux (para Sidebar e Header refletirem a mudança)
      dispatch(
        updateUserInfo({
          name: updatedUser.name,
          imageUrl: updatedUser.imageUrl,
        }),
      )

      // 2. Avisa o componente pai (ProfilePage) para atualizar os dados locais
      onSuccess(updatedUser.name, updatedUser.imageUrl)

      onClose()
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      alert('Erro ao atualizar perfil. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={isLoading ? undefined : onClose}>
      <Box sx={modalStyle}>
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #eee',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={onClose} disabled={isLoading} sx={{ mr: 1 }}>
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" fontWeight="bold">
              Editar Perfil
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={isLoading || !name.trim()}
            startIcon={!isLoading && <SaveIcon />}
            sx={{ borderRadius: 999, textTransform: 'none' }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Salvar'
            )}
          </Button>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Preview da Imagem */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={imageUrl || undefined}
                alt="Preview"
                sx={{
                  width: 100,
                  height: 100,
                  border: '4px solid #fff',
                  boxShadow: 1,
                }}
              />
              {/* Overlay visual opcional para indicar que é a imagem */}
            </Box>
          </Box>

          <TextField
            label="Nome"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 3 }}
            disabled={isLoading}
          />

          <TextField
            label="URL da Imagem de Perfil"
            fullWidth
            variant="outlined"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            helperText="Cole o link direto de uma imagem (ex: https://i.imgur.com/...)"
            disabled={isLoading}
          />
        </Box>
      </Box>
    </Modal>
  )
}
