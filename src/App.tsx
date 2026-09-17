import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './app/AuthContext'
import { AppRouter } from './app/AppRouter'
import { dtpTheme } from './styles/theme'
import './styles/app.css'

export default function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

  return (
    <MantineProvider theme={dtpTheme} defaultColorScheme="light">
      <Notifications position="bottom-center" zIndex={1000} />
      <BrowserRouter basename={basename}>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  )
}
