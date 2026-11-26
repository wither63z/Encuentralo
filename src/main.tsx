import { ClerkProvider } from '@clerk/clerk-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { CLAVE_CLERK, CLERK_ACTIVO, CLERK_URL_TRAS_SALIR } from './config'
import './index.css'

const raiz = document.getElementById('root')
if (!raiz) throw new Error('No existe el elemento #root')

// Clerk solo envuelve la app si hay clave y no estamos en modo mock.
// afterSignOutUrl es la prop global vigente (https://clerk.com/docs/reference/components/clerk-provider).
// Localización: @clerk/localizations NO está instalado; para textos en español instalarlo y pasar
// localization={esES} (https://clerk.com/docs/guides/customizing-clerk/localization).
createRoot(raiz).render(
  <StrictMode>
    {CLERK_ACTIVO ? (
      <ClerkProvider publishableKey={CLAVE_CLERK} afterSignOutUrl={CLERK_URL_TRAS_SALIR}><App /></ClerkProvider>
    ) : (
      <App />
    )}
  </StrictMode>,
)
