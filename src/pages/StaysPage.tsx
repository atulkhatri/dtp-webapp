import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Checkbox,
  Drawer,
  Group,
  Image,
  RangeSlider,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { dataClient } from '../data/client'
import type { Stay, StaySearchDefaults } from '../data/types'
import { AppHeader } from '../components/Header'
import { MapView } from '../components/MapView'

interface StaysPageProps {
  onMenu: () => void
}

export function StaysPage({ onMenu }: StaysPageProps) {
  const [defaults, setDefaults] = useState<StaySearchDefaults | null>(null)
  const [stays, setStays] = useState<Stay[]>([])
  const [location, setLocation] = useState('')
  const [checkInLabel, setCheckInLabel] = useState('')
  const [checkOutLabel, setCheckOutLabel] = useState('')
  const [rooms, setRooms] = useState(1)
  const [guests, setGuests] = useState(2)
  const [petFriendly, setPetFriendly] = useState(true)
  const [searched, setSearched] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [maxPrice, setMaxPrice] = useState(400)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    void Promise.all([dataClient.getStaySearchDefaults(), dataClient.getStays()]).then(([d, s]) => {
      setDefaults(d)
      setStays(s)
      setLocation(d.location)
      setCheckInLabel(d.checkInLabel)
      setCheckOutLabel(d.checkOutLabel)
      setRooms(d.rooms)
      setGuests(d.guests)
      setPetFriendly(d.petFriendly)
      setSearched(true)
    })
  }, [])

  const amenityOptions = useMemo(() => {
    const set = new Set<string>()
    stays.forEach((s) => s.amenities.forEach((a) => set.add(a)))
    return [...set]
  }, [stays])

  const results = useMemo(() => {
    if (!searched) return []
    return stays.filter((stay) => {
      const locOk =
        !location ||
        stay.address.toLowerCase().includes(location.toLowerCase().split(',')[0] ?? '') ||
        stay.neighborhood.toLowerCase().includes(location.toLowerCase()) ||
        location.toLowerCase().includes('vancouver')
      const petOk = !petFriendly || stay.petFriendly
      const priceOk = stay.priceFrom <= maxPrice
      const amenityOk =
        selectedAmenities.length === 0 || selectedAmenities.every((a) => stay.amenities.includes(a))
      return locOk && petOk && priceOk && amenityOk
    })
  }, [stays, searched, location, petFriendly, maxPrice, selectedAmenities])

  if (!defaults) return <Text p="xl">Loading…</Text>

  return (
    <Stack gap={0}>
      <AppHeader title="Stays" showMenu onMenu={onMenu} />
      <Stack gap="md" p="md" pb={100}>
        <Title order={3}>{defaults.heading}</Title>
        <TextInput label="Location" value={location} onChange={(e) => setLocation(e.currentTarget.value)} />
        <Group grow>
          <TextInput label="Check-in" value={checkInLabel} onChange={(e) => setCheckInLabel(e.currentTarget.value)} />
          <TextInput label="Check-out" value={checkOutLabel} onChange={(e) => setCheckOutLabel(e.currentTarget.value)} />
        </Group>
        <Button
          variant="default"
          justify="flex-start"
          onClick={() => {
            setRooms((r) => (r >= 2 ? 1 : r + 1))
            setGuests((g) => (g >= 4 ? 2 : g + 1))
          }}
        >
          {rooms} room, {guests} guests
        </Button>
        <Checkbox
          label="Pet-friendly"
          checked={petFriendly}
          onChange={(e) => setPetFriendly(e.currentTarget.checked)}
        />
        <Button fullWidth onClick={() => setSearched(true)}>
          Find
        </Button>
        <Group grow>
          <Button variant="light" onClick={() => setShowFilters(true)}>
            Filters
          </Button>
          <Button variant="light" onClick={() => navigate('/stays/map')}>
            View Map
          </Button>
        </Group>

        <Title order={4} mt="sm">
          Suggested stays
        </Title>
        {results.length === 0 ? (
          <Stack align="center" py="xl">
            <Text c="dimmed">No stays match your filters.</Text>
            <Button
              onClick={() => {
                setSelectedAmenities([])
                setMaxPrice(400)
                setPetFriendly(false)
                setSearched(true)
              }}
            >
              Clear filters
            </Button>
          </Stack>
        ) : (
          <SimpleGrid cols={2} spacing="sm">
            {results.map((stay) => (
              <Card key={stay.id} component={Link} to={`/stays/${stay.id}`} padding="xs" radius="md" withBorder style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card.Section>
                  <Image src={stay.imageUrl} h={110} alt={stay.name} />
                </Card.Section>
                <Text fw={700} size="sm" mt="xs" lineClamp={2}>
                  {stay.name}
                </Text>
                <Text size="xs" c="dimmed">
                  {stay.neighborhood}
                </Text>
                <Text size="sm" c="dtp" fw={600}>
                  from ${stay.priceFrom}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Stack>

      <Drawer opened={showFilters} onClose={() => setShowFilters(false)} position="bottom" title="Filters" size="auto">
        <Stack gap="md" pb="md">
          <Text size="sm" fw={600}>
            Max price per night: ${maxPrice}
          </Text>
          <RangeSlider
            min={100}
            max={400}
            step={10}
            value={[100, maxPrice]}
            onChange={(v) => setMaxPrice(v[1])}
            label={(v) => `$${v}`}
          />
          <Stack gap="xs">
            {amenityOptions.map((a) => (
              <Checkbox
                key={a}
                label={a}
                checked={selectedAmenities.includes(a)}
                onChange={(e) => {
                  setSelectedAmenities((prev) =>
                    e.currentTarget.checked ? [...prev, a] : prev.filter((x) => x !== a),
                  )
                }}
              />
            ))}
          </Stack>
          <Group grow>
            <Button
              variant="light"
              onClick={() => {
                setSelectedAmenities([])
                setMaxPrice(400)
              }}
            >
              Clear
            </Button>
            <Button onClick={() => setShowFilters(false)}>Apply</Button>
          </Group>
        </Stack>
      </Drawer>
    </Stack>
  )
}

export function StaysMapPage() {
  const [stays, setStays] = useState<Stay[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    void dataClient.getStays().then(setStays)
  }, [])

  return (
    <Stack gap={0}>
      <AppHeader title="Stays Map" showBack backTo="/stays" />
      <Stack p="md" pb={100}>
        <MapView
          pins={stays.map((s) => ({ id: s.id, name: s.name, lat: s.lat, lng: s.lng }))}
          onSelect={(id) => navigate(`/stays/${id}`)}
          height={420}
        />
        <Button variant="light" onClick={() => navigate('/stays')}>
          View List
        </Button>
      </Stack>
    </Stack>
  )
}

export function StayDetailPage() {
  const { id } = useParams()
  const [stay, setStay] = useState<Stay | null>(null)
  const { favorites, toggleFav } = useAuth()
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    void dataClient.getStays().then((list) => setStay(list.find((s) => s.id === id) ?? null))
  }, [id])

  if (!stay) return <Text p="xl">Loading…</Text>
  const fav = favorites.stays.includes(stay.id)

  return (
    <Stack gap={0}>
      <AppHeader title={stay.name} showBack backTo="/stays" />
      <div style={{ position: 'relative' }}>
        <Image src={stay.imageUrl} h={210} fit="cover" alt={stay.name} />
        <Stack gap={0} style={{ position: 'absolute', left: 16, bottom: 14 }} c="white">
          <Text fw={800} size="lg" style={{ textShadow: '0 2px 8px rgba(0,0,0,.45)' }}>
            {stay.name}
          </Text>
          <Text size="sm" style={{ textShadow: '0 2px 8px rgba(0,0,0,.45)' }}>
            {stay.neighborhood}
          </Text>
        </Stack>
      </div>
      <Stack gap="sm" p="md" pb={100}>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Favorite
          </Text>
          <ActionIcon variant="subtle" color="red" size="lg" onClick={() => toggleFav('stays', stay.id)}>
            <Text size="xl">{fav ? '♥' : '♡'}</Text>
          </ActionIcon>
        </Group>
        <Detail label="Rating" value={`${stay.rating} / 5`} />
        <Detail label="Address" value={stay.address} />
        <Detail label="Price per night" value={`from $${stay.priceFrom}`} />
        <div>
          <Text size="sm" c="dimmed">
            Website
          </Text>
          <Text component="a" href={stay.website} target="_blank" rel="noreferrer" c="dtp" size="sm">
            {stay.website}
          </Text>
        </div>
        <Group justify="space-between" align="flex-end">
          <Detail label="Phone" value={stay.phone} />
          <Group>
            <ActionIcon variant="light" size="xl" radius="xl" onClick={() => setChatOpen(true)}>
              💬
            </ActionIcon>
            <ActionIcon
              component="a"
              href={`tel:${stay.phone.replace(/\s/g, '')}`}
              variant="light"
              size="xl"
              radius="xl"
            >
              📞
            </ActionIcon>
          </Group>
        </Group>
        <Text c="dimmed">{stay.description}</Text>
        <Group gap="xs">
          {stay.amenities.map((a) => (
            <Badge key={a} variant="light">
              {a}
            </Badge>
          ))}
        </Group>
      </Stack>

      <Drawer opened={chatOpen} onClose={() => setChatOpen(false)} position="bottom" title="Concierge chat">
        <Stack>
          <Text c="dimmed">Concierge will reply soon. This is a demo conversation.</Text>
          <TextInput
            placeholder="Type a message…"
            onKeyDown={(e) => {
              if (e.key === 'Enter') notifications.show({ message: 'Message sent (demo)' })
            }}
          />
          <Button
            onClick={() => {
              notifications.show({ message: 'Message sent (demo)' })
              setChatOpen(false)
            }}
          >
            Send
          </Button>
        </Stack>
      </Drawer>
    </Stack>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <Text fw={700}>{value}</Text>
    </div>
  )
}
