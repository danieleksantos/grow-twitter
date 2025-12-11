import React from 'react'
import { IconButton, useTheme, Tooltip } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../store/slices/themeSlice'
import type { RootState } from '../store/index'

export const ThemeSwitcher: React.FC = () => {
  const theme = useTheme()
  const dispatch = useDispatch()

  const currentMode = useSelector((state: RootState) => state.theme.mode)

  return (
    <Tooltip
      title={`Mudar para tema ${currentMode === 'light' ? 'Escuro' : 'Claro'}`}
    >
      <IconButton
        onClick={() => dispatch(toggleTheme())}
        color="inherit"
        sx={{ ml: 1 }}
      >
        {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  )
}
