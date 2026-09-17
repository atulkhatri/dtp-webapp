import { Button, Divider, FileButton, Group, Stack, Switch, Text, TextInput, Title } from '@mantine/core'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { dataClient } from '../data/client'
import type { Review } from '../data/types'
import { AppHeader } from '../components/Header'

interface ProfilePageProps {
  onMenu: () => void
}

export function ProfilePage({ onMenu }: ProfilePageProps) {
  const { user, updateUser } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    void dataClient.getReviews().then(setReviews)
  }, [])

  if (!user) return <Text p="xl">Loading…</Text>

  return (
    <Stack gap={0}>
      <AppHeader title="Profile" showMenu onMenu={onMenu} onEdit={() => navigate('/profile/edit')} />
      <Stack gap="sm" p="md" pb={100}>
        <Field label="Name" value={user.name} />
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Travel Document
          </Text>
          <Button component={Link} to="/profile/travel-document" variant="light" size="compact-sm" radius="xl">
            Open
          </Button>
        </Group>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Vaccination Card
          </Text>
          <Button component={Link} to="/profile/vaccination" variant="light" size="compact-sm" radius="xl">
            Open
          </Button>
        </Group>
        <Field label="Country of Residence" value={user.countryOfResidence} />
        <Divider />
        <Field label="Destination" value={user.destination} />
        <Field label="Preferred Travel Type" value={user.preferredTravelType} />
        <Divider />
        <Group justify="space-between">
          <Text>Location Sharing</Text>
          <Switch
            checked={user.locationSharing}
            onChange={(e) => updateUser({ locationSharing: e.currentTarget.checked })}
            color="dtp"
          />
        </Group>
        <Group justify="space-between">
          <Text>Notifications</Text>
          <Switch
            checked={user.notifications}
            onChange={(e) => updateUser({ notifications: e.currentTarget.checked })}
            color="dtp"
          />
        </Group>
        <Divider />
        <Title order={4}>Reviews</Title>
        {reviews.length === 0 ? (
          <Text c="dimmed">No reviews yet.</Text>
        ) : (
          reviews.slice(0, 2).map((r) => (
            <Stack key={r.id} gap={4}>
              <Text fw={700}>{r.placeName}</Text>
              <Text c="dtp">{'♥'.repeat(r.rating)}</Text>
              <Text size="sm" c="dimmed">
                {r.text}
              </Text>
            </Stack>
          ))
        )}
        <Button component={Link} to="/my-reviews" variant="light" fullWidth>
          See all reviews
        </Button>
      </Stack>
    </Stack>
  )
}

export function ProfileEditPage() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [occupation, setOccupation] = useState(user?.occupation ?? '')
  const navigate = useNavigate()

  if (!user) return <Text p="xl">Loading…</Text>

  return (
    <Stack gap={0}>
      <AppHeader title="Edit Profile" showBack backTo="/profile" />
      <Stack gap="md" p="md" pb={100}>
        <TextInput label="Name" value={name} onChange={(e) => setName(e.currentTarget.value)} />
        <TextInput label="Occupation" value={occupation} onChange={(e) => setOccupation(e.currentTarget.value)} />
        <Button
          onClick={() => {
            updateUser({ name, occupation })
            navigate('/profile')
          }}
        >
          Save
        </Button>
      </Stack>
    </Stack>
  )
}

export function TravelDocumentPage() {
  const [fileName, setFileName] = useState<string | null>(null)
  return (
    <Stack gap={0}>
      <AppHeader title="Travel Document" showBack backTo="/profile" />
      <Stack gap="md" p="md" pb={100}>
        <Text c="dimmed">Passport status for this demo: Verified (mock).</Text>
        <CardBanner>Passport · Singapore · Valid</CardBanner>
        <FileButton onChange={(file) => setFileName(file?.name ?? null)}>
          {(props) => (
            <Button {...props} variant="light">
              Upload
            </Button>
          )}
        </FileButton>
        {fileName ? (
          <Text size="xs" c="dimmed">
            Selected: {fileName} (stored locally only)
          </Text>
        ) : null}
      </Stack>
    </Stack>
  )
}

export function VaccinationPage() {
  const { user } = useAuth()
  const [fileName, setFileName] = useState<string | null>(null)
  return (
    <Stack gap={0}>
      <AppHeader title="Vaccination Card" showBack backTo="/profile" />
      <Stack gap="md" p="md" pb={100}>
        <Text c="dimmed">Status: {user?.vaccinationStatus ?? 'Unknown'}</Text>
        <CardBanner color="#2e9b6c">{user?.vaccinationStatus ?? 'Not set'}</CardBanner>
        <FileButton onChange={(file) => setFileName(file?.name ?? null)}>
          {(props) => (
            <Button {...props} variant="light">
              Upload
            </Button>
          )}
        </FileButton>
        {fileName ? (
          <Text size="xs" c="dimmed">
            Selected: {fileName} (stored locally only)
          </Text>
        ) : null}
      </Stack>
    </Stack>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <Text fw={700}>{value}</Text>
    </div>
  )
}

function CardBanner({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      style={{
        borderRadius: 12,
        padding: '28px 18px',
        background: color ?? '#78b1c2',
        color: '#fff',
        fontWeight: 800,
        fontSize: '1.1rem',
      }}
    >
      {children}
    </div>
  )
}
