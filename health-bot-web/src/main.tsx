import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Explanation } from './pages/Explanation.tsx'
import { Explainer } from './pages/Explainer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/explanation" element={<Explanation />} />
        <Route path="/explainer" element={<Explainer />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
