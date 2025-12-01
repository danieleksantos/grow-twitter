import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import authReducer from './slices/authSlice'

const rootReducer = combineReducers({
  auth: authReducer,
})

export const persistedReducer = persistReducer(
  {
    key: 'growtwitter',
    storage,
  },
  rootReducer,
)
