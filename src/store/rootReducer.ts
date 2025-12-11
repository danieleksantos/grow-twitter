import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import authReducer from './slices/authSlice'
import themeReducer from './slices/themeSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
})

export const persistedReducer = persistReducer(
  {
    key: 'growtwitter',
    storage,
    whitelist: ['auth', 'theme'],
  },
  rootReducer,
)
