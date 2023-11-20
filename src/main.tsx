import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './main.css'
import Nav from './components/Nav/Nav.tsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <main>
        <Nav />
        <App />
      </main>
    </BrowserRouter>
  </React.StrictMode>
)
