import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Upload from './pages/Upload'
import Feed from './pages/Feed'
import Library from './pages/Library'
import Stats from './pages/Stats'
import Login from './pages/Login'
import Register from './pages/Register'
import Welcome from './pages/Welcome'
import NavBar from './components/NavBar'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('doomscore_token'))

  const handleLogin = () => setIsLoggedIn(true)
  const handleLogout = () => {
    localStorage.removeItem('doomscore_token')
    localStorage.removeItem('doomscore_user')
    setIsLoggedIn(false)
  }

  function ProtectedRoute({ children }) {
    return isLoggedIn ? children : <Navigate to="/login" />
  }

  function AuthRoute({ children }) {
    return !isLoggedIn ? children : <Navigate to="/welcome" />
  }

  return (
    <BrowserRouter>
      {isLoggedIn && <NavBar onLogout={handleLogout} />}
      <div className={isLoggedIn ? 'main-content' : ''}>
        <Routes>
          <Route path="/login" element={<AuthRoute><Login onLogin={handleLogin} /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><Register onLogin={handleLogin} /></AuthRoute>} />
          <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
          <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/stats" element={<ProtectedRoute><Stats /></ProtectedRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App