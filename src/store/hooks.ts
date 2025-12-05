import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './index'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export const useAuth = () => {
  const authState = useAppSelector((state) => state.auth)

  return {
    isLoggedIn: authState.isLoggedIn,
    token: authState.token,
    username: authState.username,
    name: authState.name,
    imageUrl: authState.imageUrl,
  }
}
