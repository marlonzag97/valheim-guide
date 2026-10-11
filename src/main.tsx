import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './stil/tokens.css'
import { FortschrittProvider } from './fortschritt/store'
import { Router } from './app/Router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FortschrittProvider>
      <Router />
    </FortschrittProvider>
  </StrictMode>,
)
