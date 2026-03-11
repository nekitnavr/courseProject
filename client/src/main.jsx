import 'bootstrap/dist/css/bootstrap.min.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from './components/ThemeProvider.jsx'
import AuthProvider from './components/AuthProvider.jsx'
import AlertProvider from './components/AlertProvider.jsx'
import AppRoutes from './components/AppRoutes.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AlertProvider>
          <AuthProvider>
            <AppRoutes/>
          </AuthProvider>
        </AlertProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
