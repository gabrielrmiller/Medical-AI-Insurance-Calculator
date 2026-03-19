import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { Explanation } from './pages/Explanation.tsx'
import { Explainer } from './pages/Explainer.tsx'

function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    // Ensures Calculator/Explanation navigation always resets to top.
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, search])

  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/explanation" element={<Explanation />} />
        <Route path="/explainer" element={<Explainer />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
