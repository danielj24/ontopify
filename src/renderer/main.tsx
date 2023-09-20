import React from 'react'
import ReactDOM from 'react-dom/client'
import '@renderer/assets/index.css'
import App from '@renderer/App'

const root = document.getElementById('root') as Element

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
