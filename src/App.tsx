import Navbar from './components/Navbar'
import Hero from './components/Hero'
import './styles/App.css'

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <div style={{color: 'red', fontSize: '24px', textAlign: 'center', marginTop: '20px'}}>
        TEST: App component is working!
      </div>
    </div>
  )
}

export default App