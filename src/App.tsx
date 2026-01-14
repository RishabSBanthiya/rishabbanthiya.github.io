import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Hero from './components/Hero'
import './styles/App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
