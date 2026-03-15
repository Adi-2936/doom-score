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
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(16,16,16,0.9)',
        border: '1px solid rgba(124,58,237,0.4)',
        borderRadius: '10px',
        padding: '12px 20px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 0 30px rgba(124,58,237,0.2)'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#A855F7',
          boxShadow: '0 0 12px rgba(168,85,247,1)',
          flexShrink: 0
        }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{
            fontSize: '11px',
            color: '#555',
            letterSpacing: '2px',
            fontFamily: 'Courier New, monospace',
            textTransform: 'uppercase'
          }}>
            built by
          </span>
          <span style={{
            fontSize: '15px',
            color: '#A855F7',
            letterSpacing: '2px',
            fontFamily: 'Courier New, monospace',
            textTransform: 'uppercase',
            fontWeight: '500',
            textShadow: '0 0 20px rgba(168,85,247,0.6)'
          }}>
            Adithya Singh
          </span>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App