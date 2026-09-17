import {
  Alert,
  Button,
  Checkbox,
  Group,
  Stack,
  Text,
  TextInput,
  PasswordInput,
} from '@mantine/core'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { notifications } from '@mantine/notifications'
import { AppHeader, BrandMark } from '../components/Header'
import { DEMO_EMAIL, DEMO_PASSWORD, type SessionRole } from '../data/session'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [role, setRole] = useState<SessionRole>('tourist')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password, role)
    setLoading(false)
    if (!result.ok) {
      setError(result.error ?? 'Login failed')
      return
    }
    if (role === 'business') navigate('/business-coming-soon')
    else navigate('/questionnaire')
  }

  return (
    <Stack gap="md" p="md" pb="xl">
      <AppHeader title="Log In" />
      <BrandMark large />
      <form onSubmit={onSubmit}>
        <Stack gap="md">
          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            type="email"
            required
            autoComplete="username"
          />
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
            autoComplete="current-password"
          />
          {error ? <Alert color="red">{error}</Alert> : null}
          <Group grow>
            <Button component={Link} to="/signup" variant="filled">
              Sign Up
            </Button>
            <Button type="submit" loading={loading}>
              Log In
            </Button>
          </Group>
          <Group gap="xl">
            <Checkbox
              label="Tourist"
              checked={role === 'tourist'}
              onChange={() => setRole('tourist')}
            />
            <Checkbox
              label="Business"
              checked={role === 'business'}
              onChange={() => setRole('business')}
            />
          </Group>
          <Button
            variant="transparent"
            color="dtp"
            justify="flex-start"
            px={0}
            onClick={() => notifications.show({ message: 'Contact support at hello@dtpsupport.com' })}
          >
            Forgot password?
          </Button>
          <Group grow>
            <Button variant="light" onClick={() => notifications.show({ message: 'Coming soon' })}>
              Facebook
            </Button>
            <Button variant="light" onClick={() => notifications.show({ message: 'Coming soon' })}>
              Google
            </Button>
          </Group>
          <Button variant="light" fullWidth onClick={() => notifications.show({ message: 'Coming soon' })}>
            Sign In with Apple
          </Button>
        </Stack>
      </form>
      <Text size="xs" c="dimmed" ta="center">
        Demo credentials are prefilled — tap Log In to continue.
      </Text>
      <Text size="xs" c="dimmed" ta="center">
        © 2026 DTP Support Services Corp.
      </Text>
    </Stack>
  )
}
