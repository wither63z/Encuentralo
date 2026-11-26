import { ClerkProvider } from '@clerk/clerk-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { CLAVE_CLERK, CLERK_ACTIVO } from './config'
import './index.css'

const raiz = document.getElementById('root')
if (!raiz) throw new Error('No existe el elemento #root')

// Clerk solo envuelve la app si hay clave y no estamos en modo mock.
createRoot(raiz).render(
  <StrictMode>
    {CLERK_ACTIVO ? (
      <ClerkProvider publishableKey={CLAVE_CLERK}><App /></ClerkProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
)
