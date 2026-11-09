import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Inicio from './pages/Inicio'
import Productos from "./pages/Productos"
import Login from "./pages/Login"

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/login" element={<Login />}></Route>
      </Routes>

      <Footer />
    </BrowserRouter >
  )
}

export default App