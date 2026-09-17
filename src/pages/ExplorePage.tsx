import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Chip,
  Group,
  Image,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { dataClient } from '../data/client'
import type { ExplorePlace } from '../data/types'
import { AppHeader } from '../components/Header'
import { MapView } from '../components/MapView'

interface ExplorePageProps {
  onMenu: () => void
}

export function ExplorePage({ onMenu }: ExplorePageProps) {
  const [places, setPlaces] = useState<ExplorePlace[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const navigate = useNavigate()

  useEffect(() => {
    void Promise.all([dataClient.getExplore(), dataClient.getExploreCategories()]).then(([p, c]) => {
      setPlaces(p)
      setCategories(c)
    })
  }, [])

  const filtered = useMemo(() => {
    return places.filter((place) => {
      const catOk = category === 'All' || place.categories.includes(category) || place.category === category
      const q = query.trim().toLowerCase()
      const textOk =
        !q ||
        place.name.toLowerCase().includes(q) ||
        place.description.toLowerCase().includes(q) ||
        place.address.toLowerCase().includes(q)
      return catOk && textOk
    })
  }, [places, category, query])

  return (
    <Stack gap={0}>
      <AppHeader title="Explore" showMenu onMenu={onMenu} />
      <div style={{ position: 'relative' }}>
        <Image
          src="https://images.unsplash.com/photo-1559511260-66a654ae982a?w=900&q=80"
          alt="Vancouver"
          h={160}
          fit="cover"
        />
        <Text
          fw={800}
          size="lg"
          c="white"
          style={{
            position: 'absolute',
            left: 16,
            bottom: 14,
            textShadow: '0 2px 10px rgba(0,0,0,.45)',
          }}
        >
          Discover the best of Vancouver
        </Text>
      </div>
      <Stack gap="md" p="md" pb={100}>
        <TextInput placeholder="Search nearby" value={query} onChange={(e) => setQuery(e.currentTarget.value)} />
        <Chip.Group multiple={false} value={category} onChange={(v) => setCategory(String(v))}>
          <Group gap="xs">
            {categories.map((c) => (
              <Chip key={c} value={c} color="dtp" variant="filled">
                {c}
              </Chip>
            ))}
          </Group>
        </Chip.Group>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {filtered.length} places
          </Text>
          <Button variant="light" size="compact-md" onClick={() => navigate('/explore/map')}>
            View Map
          </Button>
        </Group>

        {filtered.length === 0 ? (
          <Stack align="center" py="xl">
            <Text c="dimmed">No places match your search.</Text>
            <Button
              onClick={() => {
                setQuery('')
                setCategory('All')
              }}
            >
              Clear filters
            </Button>
          </Stack>
        ) : (
          filtered.map((place) => (
            <Card
              key={place.id}
              component={Link}
              to={`/explore/${place.id}`}
              padding="sm"
              radius="md"
              withBorder
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Group wrap="nowrap" align="flex-start">
                <Image src={place.imageUrl} w={88} h={72} radius="md" alt={place.name} />
                <Stack gap={2} style={{ flex: 1 }}>
                  <Text fw={700}>{place.name}</Text>
                  <Text size="xs" c="dimmed">
                    {place.category}
                  </Text>
                  <Text size="sm" c="dimmed" lineClamp={2}>
                    {place.address}
                  </Text>
                </Stack>
              </Group>
            </Card>
          ))
        )}
      </Stack>
    </Stack>
  )
}

export function ExploreMapPage() {
  const [places, setPlaces] = useState<ExplorePlace[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    void dataClient.getExplore().then(setPlaces)
  }, [])

  return (
    <Stack gap={0}>
      <AppHeader title="Explore Map" showBack backTo="/explore" />
      <Stack p="md" pb={100}>
        <MapView
          pins={places.map((p) => ({ id: p.id, name: p.name, lat: p.lat, lng: p.lng }))}
          onSelect={(id) => navigate(`/explore/${id}`)}
          height={420}
        />
        <Button variant="light" onClick={() => navigate('/explore')}>
          View List
        </Button>
      </Stack>
    </Stack>
  )
}

export function PlaceDetailPage() {
  const { id } = useParams()
  const [place, setPlace] = useState<ExplorePlace | null>(null)
  const { favorites, toggleFav } = useAuth()

  useEffect(() => {
    void dataClient.getExplore().then((list) => setPlace(list.find((p) => p.id === id) ?? null))
  }, [id])

  if (!place) return <Text p="xl">Loading…</Text>
  const fav = favorites.places.includes(place.id)
  const mapsUrl = `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lng}#map=16/${place.lat}/${place.lng}`

  return (
    <Stack gap={0}>
      <AppHeader title={place.name} showBack backTo="/explore" />
      <Image src={place.imageUrl} h={210} fit="cover" alt={place.name} />
      <Stack gap="md" p="md" pb={100}>
        <Group gap="xs">
          {place.categories
            .filter((c) => c !== 'All')
            .map((c) => (
              <Badge key={c}>{c}</Badge>
            ))}
        </Group>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Favorite
          </Text>
          <ActionIcon variant="subtle" color="red" size="lg" onClick={() => toggleFav('places', place.id)}>
            <Text size="xl">{fav ? '♥' : '♡'}</Text>
          </ActionIcon>
        </Group>
        <Text style={{ lineHeight: 1.55 }}>{place.description}</Text>
        <div>
          <Text size="sm" c="dimmed">
            Address
          </Text>
          <Text fw={700}>{place.address}</Text>
        </div>
        <div>
          <Text size="sm" c="dimmed">
            Hours
          </Text>
          <Text fw={700}>{place.hours}</Text>
        </div>
        <Button component="a" href={mapsUrl} target="_blank" rel="noreferrer">
          Open in map
        </Button>
      </Stack>
    </Stack>
  )
}
