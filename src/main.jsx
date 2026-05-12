import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'

import Navbar from './components/navbar'
import Home from './pages/home'
import Events from './pages/events'
import Products from './pages/products'
import Collabs from './pages/collabs'
import Stores from './pages/stores'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/products" element={<Products />} />
        <Route path="/collabs" element={<Collabs />} />
        <Route path="/stores" element={<Stores />} />
      </Routes>

    </Router>
  </StrictMode>
)
