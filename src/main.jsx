import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const SpeedInsights = lazy(() =>
  import('@vercel/speed-insights/react').then((mod) => ({ default: mod.SpeedInsights }))
)

if (typeof window !== 'undefined') {
  const ua = window.navigator.userAgent || '';
  const isWindows = /Windows/i.test(ua);
  document.body.classList.toggle('os-windows', isWindows);
  document.body.classList.toggle('os-mac', !isWindows);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Suspense fallback={null}>
      <SpeedInsights />
    </Suspense>
  </StrictMode>,
)
