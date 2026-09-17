import { Card, Group, Image, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { dataClient } from '../data/client'
import type { ContentData, ExplorePlace, Review, Stay } from '../data/types'
import { AppHeader } from '../components/Header'

export function MyPlacesPage() {
  const { favorites, seedFavorites } = useAuth()
  const [stays, setStays] = useState<Stay[]>([])
  const [places, setPlaces] = useState<ExplorePlace[]>([])

  useEffect(() => {
    void Promise.all([dataClient.getStays(), dataClient.getExplore(), dataClient.getMyPlaces()]).then(
      ([s, p, mine]) => {
        setStays(s)
        setPlaces(p)
        seedFavorites(mine)
      },
    )
  }, [seedFavorites])

  const favStays = stays.filter((s) => favorites.stays.includes(s.id))
  const favPlaces = places.filter((p) => favorites.places.includes(p.id))

  return (
    <Stack gap={0}>
      <AppHeader title="My Places" showBack backTo="/profile" />
      <Stack gap="md" p="md" pb={100}>
        <Title order={4}>Stays</Title>
        {favStays.length === 0 ? (
          <Text c="dimmed">No favorited stays yet.</Text>
        ) : (
          <SimpleGrid cols={2}>
            {favStays.map((stay) => (
              <Card key={stay.id} component={Link} to={`/stays/${stay.id}`} padding="xs" withBorder style={{ textDecoration: 'none', color: 'inherit' }}>
                <Image src={stay.imageUrl} h={90} alt={stay.name} />
                <Text fw={700} size="sm" mt={6}>
                  {stay.name}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        )}
        <Title order={4}>Explore</Title>
        {favPlaces.length === 0 ? (
          <Text c="dimmed">No favorited places yet.</Text>
        ) : (
          favPlaces.map((place) => (
            <Card key={place.id} component={Link} to={`/explore/${place.id}`} padding="sm" withBorder style={{ textDecoration: 'none', color: 'inherit' }}>
              <Group wrap="nowrap">
                <Image src={place.imageUrl} w={72} h={60} radius="md" alt={place.name} />
                <div>
                  <Text fw={700}>{place.name}</Text>
                  <Text size="sm" c="dimmed">
                    {place.address}
                  </Text>
                </div>
              </Group>
            </Card>
          ))
        )}
      </Stack>
    </Stack>
  )
}

export function MyReviewsPage() {
  const [reviews, setReviews] = useState<Review[] | null>(null)

  useEffect(() => {
    void dataClient.getReviews().then(setReviews)
  }, [])

  if (!reviews) return <Text p="xl">Loading…</Text>

  return (
    <Stack gap={0}>
      <AppHeader title="My Reviews" showBack backTo="/profile" />
      <Stack gap="md" p="md" pb={100}>
        {reviews.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No reviews yet.
          </Text>
        ) : (
          reviews.map((r) => (
            <Card key={r.id} padding="md" withBorder>
              <Text fw={800}>{r.placeName}</Text>
              <Text size="xs" c="dimmed">
                {r.date}
              </Text>
              <Text c="dtp">{'♥'.repeat(r.rating)}</Text>
              <Text size="sm" c="dimmed" mt={4}>
                {r.text}
              </Text>
            </Card>
          ))
        )}
      </Stack>
    </Stack>
  )
}

function ContentPage({
  title,
  children,
}: {
  title: string
  children: (content: ContentData) => React.ReactNode
}) {
  const [content, setContent] = useState<ContentData | null>(null)
  useEffect(() => {
    void dataClient.getContent().then(setContent)
  }, [])
  if (!content) return <Text p="xl">Loading…</Text>
  return (
    <Stack gap={0}>
      <AppHeader title={title} showBack backTo="/profile" />
      <Stack gap="md" p="md" pb={100}>
        {children(content)}
      </Stack>
    </Stack>
  )
}

export function ContactPage() {
  return (
    <ContentPage title="Contact Us">
      {(c) => (
        <>
          <Title order={3}>{c.contact.title}</Title>
          <Text c="dimmed">{c.contact.body}</Text>
          <Text component="a" href={`mailto:${c.contact.email}`} c="dtp">
            {c.contact.email}
          </Text>
          <Text component="a" href={c.contact.website} target="_blank" rel="noreferrer" c="dtp">
            {c.contact.website}
          </Text>
        </>
      )}
    </ContentPage>
  )
}

export function WorkWithUsPage() {
  return (
    <ContentPage title="Work with Us">
      {(c) => (
        <>
          <Title order={3}>{c.workWithUs.title}</Title>
          <Text c="dimmed" style={{ lineHeight: 1.55 }}>
            {c.workWithUs.body}
          </Text>
        </>
      )}
    </ContentPage>
  )
}

export function SettingsPage() {
  return (
    <ContentPage title="Settings">
      {(c) => (
        <>
          <Title order={3}>{c.settings.title}</Title>
          {c.settings.items.map((item) => (
            <Group key={item.id} justify="space-between">
              <Text>{item.label}</Text>
              <Text c="dimmed">{item.value}</Text>
            </Group>
          ))}
        </>
      )}
    </ContentPage>
  )
}

export function AboutPage() {
  return (
    <ContentPage title="About">
      {(c) => (
        <>
          <Title order={3}>{c.about.title}</Title>
          <Text c="dimmed" style={{ lineHeight: 1.55 }}>
            {c.about.body}
          </Text>
          <Text size="xs" c="dimmed">
            {c.copyright}
          </Text>
        </>
      )}
    </ContentPage>
  )
}
