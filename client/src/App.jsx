import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoginSignup from './components/Login|SignUp'

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Home />
        <About />
        <LoginSignup />
      </div>
      <Footer />
    </div>
  )
}

export default App