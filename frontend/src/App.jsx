import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Upload from './pages/Upload'
import Feed from './pages/Feed'
import Library from './pages/Library'
import Stats from './pages/Stats'
import NavBar from './components/NavBar'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div style={{ marginLeft: '90px' }}>
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/library" element={<Library />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App