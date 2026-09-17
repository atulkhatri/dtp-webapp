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
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { AppHeader, BrandMark, Copyright } from '../components/Header'
import type { SessionRole } from '../data/session'

export function SignUpPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<SessionRole>('tourist')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = await signup(name, email, password, role)
    if (!result.ok) {
      setError(result.error ?? 'Sign up failed')
      return
    }
    notifications.show({ message: 'Account created', color: 'dtp' })
    if (role === 'business') navigate('/business-coming-soon')
    else navigate('/questionnaire')
  }

  return (
    <Stack gap="md" p="md" pb="xl">
      <AppHeader title="Sign Up" showBack backTo="/login" />
      <BrandMark />
      <form onSubmit={onSubmit}>
        <Stack gap="md">
          <TextInput label="Name" value={name} onChange={(e) => setName(e.currentTarget.value)} required />
          <TextInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
          />
          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
          />
          <Group gap="xl">
            <Checkbox label="Tourist" checked={role === 'tourist'} onChange={() => setRole('tourist')} />
            <Checkbox label="Business" checked={role === 'business'} onChange={() => setRole('business')} />
          </Group>
          {error ? <Alert color="red">{error}</Alert> : null}
          <Button type="submit" fullWidth>
            Create account
          </Button>
          <Text size="sm" c="dimmed" ta="center">
            Already have an account? <Link to="/login">Log In</Link>
          </Text>
        </Stack>
      </form>
      <Copyright />
    </Stack>
  )
}
