import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SpeedInsights } from '@vercel/speed-insights/react'
import './index.css'
import App from './App.jsx'

if (typeof window !== 'undefined') {
  const ua = window.navigator.userAgent || '';
  const isWindows = /Windows/i.test(ua);
  document.body.classList.toggle('os-windows', isWindows);
  document.body.classList.toggle('os-mac', !isWindows);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <SpeedInsights />
  </StrictMode>,
)
