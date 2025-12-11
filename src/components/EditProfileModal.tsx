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
  useTheme,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { isAxiosError } from 'axios'

import api from '../services/api'
import { useAppDispatch } from '../store/hooks'
import { updateUserInfo } from '../store/slices/authSlice'

const MySwal = withReactContent(Swal)

interface EditProfileModalProps {
  open: boolean
  onClose: () => void
  initialName: string
  initialImageUrl: string | null
  onSuccess: (newName: string, newImageUrl: string | null) => void
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onClose,
  initialName,
  initialImageUrl,
  onSuccess,
}) => {
  const dispatch = useAppDispatch()
  const theme = useTheme()

  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setName(initialName || '')
      setImageUrl(initialImageUrl || '')
    }
  }, [open, initialName, initialImageUrl])

  const handleSave = async () => {
    if (!name.trim()) {
      MySwal.fire({
        title: 'Atenção',
        text: 'O nome não pode ser vazio.',
        icon: 'warning',
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        confirmButtonColor: theme.palette.primary.main,
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await api.put('/users', {
        name,
        imageUrl: imageUrl.trim() || null,
      })

      const updatedUser = response.data.data

      dispatch(
        updateUserInfo({
          name: updatedUser.name,
          imageUrl: updatedUser.imageUrl,
        }),
      )

      onSuccess(updatedUser.name, updatedUser.imageUrl)
      onClose()

      MySwal.fire({
        title: 'Atualizado!',
        text: 'Seu perfil foi atualizado com sucesso.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
      })
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)

      let errorMsg = 'Não foi possível atualizar o perfil.'
      if (isAxiosError(error) && error.response?.data?.message) {
        errorMsg = error.response.data.message
      }

      MySwal.fire({
        title: 'Erro',
        text: errorMsg,
        icon: 'error',
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        confirmButtonColor: theme.palette.error.main,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 500 },
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: 24,
    p: 0,
    outline: 'none',
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
            borderBottom: 1,
            borderColor: 'divider',
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
            sx={{
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 'bold',
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Salvar'
            )}
          </Button>
        </Box>

        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={imageUrl || undefined}
                alt="Preview"
                sx={{
                  width: 100,
                  height: 100,
                  border: `4px solid ${theme.palette.background.paper}`,
                  boxShadow: 3,
                }}
              />
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
            slotProps={{
              input: {
                sx: { borderRadius: 2 },
              },
            }}
          />

          <TextField
            label="URL da Imagem de Perfil"
            fullWidth
            variant="outlined"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            helperText="Cole o link direto de uma imagem (ex: https://i.imgur.com/...)"
            disabled={isLoading}
            slotProps={{
              input: {
                sx: { borderRadius: 2 },
              },
            }}
          />
        </Box>
      </Box>
    </Modal>
  )
}
