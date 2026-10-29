import React from 'react'
import ReactDOM from 'react-dom/client'
import SiteRoutes from './SiteRoutes'
import { initTheme } from './lib/theme'
import './index.css'
import './work.css'

initTheme()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SiteRoutes />
  </React.StrictMode>,
)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js')
  })
}
