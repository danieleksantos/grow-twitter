import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import { ExplorePage } from './pages/ExplorePage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile/:username" element={<ProfilePage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="*" element={<h1>404 - Not Found</h1>} />
    </Routes>
  )
}
