import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './app/AuthContext'
import { ToastProvider } from './app/ToastContext'
import { AppRouter } from './app/AppRouter'
import './styles/tokens.css'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <AuthProvider>
        <ToastProvider>
          <AppRouter />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
