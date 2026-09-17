import { Button, Stack, Text, Title } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { AppHeader } from '../components/Header'

export function BusinessComingSoonPage() {
  const { continueAsTourist } = useAuth()
  const navigate = useNavigate()

  return (
    <Stack gap={0}>
      <AppHeader title="Business" showBack backTo="/login" />
      <Stack gap="md" p="xl" ta="center" align="center">
        <Text style={{ fontSize: '2.5rem' }}>🏢</Text>
        <Title order={2}>Business tools coming soon</Title>
        <Text c="dimmed" maw={340}>
          Hospitality analytics and partner dashboards are not part of this demo yet. Continue as a tourist to explore
          the traveller experience.
        </Text>
        <Button
          fullWidth
          onClick={() => {
            continueAsTourist()
            navigate('/questionnaire')
          }}
        >
          Continue as Tourist
        </Button>
      </Stack>
    </Stack>
  )
}
