import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Leaflet fixes for react-leaflet v5 + Vite
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default icons (required for react-leaflet v5)
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)

