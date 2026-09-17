import {
  Button,
  Card,
  Drawer,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { dataClient } from '../data/client'
import type { TripData } from '../data/types'
import { AppHeader } from '../components/Header'

interface OnTheWayPageProps {
  onMenu: () => void
}

export function OnTheWayPage({ onMenu }: OnTheWayPageProps) {
  return (
    <Stack gap={0}>
      <AppHeader title="On the Way" showMenu onMenu={onMenu} />
      <Stack gap="md" p="md" pb={100}>
        <Title order={3}>Your journey toolkit</Title>
        <SimpleGrid cols={2} spacing="sm">
          <HubTile to="/on-the-way/booking" icon="🧾" label="Booking Information" />
          <HubTile to="/on-the-way/flight" icon="✈️" label="Flight Information" />
          <HubTile to="/on-the-way/airport" icon="🛫" label="Airport Information" />
          <HubTile to="/on-the-way/transport" icon="🚌" label="Transportation" />
        </SimpleGrid>
      </Stack>
    </Stack>
  )
}

function HubTile({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <Card
      component={Link}
      to={to}
      padding="lg"
      radius="md"
      bg="dtp.0"
      style={{ textDecoration: 'none', color: 'inherit', minHeight: 110 }}
    >
      <Text size="xl" mb={8}>
        {icon}
      </Text>
      <Text fw={700} c="dtp.6">
        {label}
      </Text>
    </Card>
  )
}

export function FlightPage() {
  const [trip, setTrip] = useState<TripData | null>(null)
  const [boardingOpen, setBoardingOpen] = useState(false)

  useEffect(() => {
    void dataClient.getTrip().then(setTrip)
  }, [])

  if (!trip) return <Text p="xl">Loading…</Text>
  const f = trip.flight

  return (
    <Stack gap={0}>
      <AppHeader title="Flight Information" showBack backTo="/on-the-way" />
      <Stack gap="sm" p="md" pb={100}>
        <Card padding="lg" radius="md" style={{ background: 'linear-gradient(135deg, #7879ff, #78b1c2)', color: '#fff' }}>
          <Text fw={800} size="xl">
            {f.airline}
          </Text>
          <Text>
            {f.flightNumber} · {f.status}
          </Text>
        </Card>
        <Info label="From" value={f.from} />
        <Info label="To" value={f.to} />
        <Info label="Departure" value={f.departureLabel} />
        <Info label="Check-in before" value={f.checkInBefore} />
        <Info label="Boarding" value={f.boarding} />
        <Info label="Gate" value={f.gate} />
        <Info label="Class" value={f.class} />
        <Info label="Seat" value={f.seat} />
        <Info label="Terminal" value={f.terminal} />
        <Info label="Confirmation" value={f.confirmationCode} />
        <Button mt="md" onClick={() => setBoardingOpen(true)}>
          Boarding Pass
        </Button>
      </Stack>

      <Drawer opened={boardingOpen} onClose={() => setBoardingOpen(false)} position="bottom" title="Boarding Pass" size="auto">
        <div className="boarding-pass">
          <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{f.airline}</div>
          <div>{f.flightNumber}</div>
          <div className="code" aria-hidden>
            QR
          </div>
          <div style={{ fontWeight: 700 }}>{f.passengerName}</div>
          <div style={{ marginTop: 8 }}>
            Gate {f.gate} · Seat {f.seat}
          </div>
          <div style={{ opacity: 0.9, marginTop: 4 }}>{f.departureLabel}</div>
        </div>
        <Button variant="light" fullWidth mt="md" onClick={() => setBoardingOpen(false)}>
          Close
        </Button>
      </Drawer>
    </Stack>
  )
}

export function AirportHubPage() {
  const [trip, setTrip] = useState<TripData | null>(null)

  useEffect(() => {
    void dataClient.getTrip().then(setTrip)
  }, [])

  if (!trip) return <Text p="xl">Loading…</Text>

  return (
    <Stack gap={0}>
      <AppHeader title="Airport Information" showBack backTo="/on-the-way" />
      <Stack gap="md" p="md" pb={100}>
        <Title order={3}>{trip.airport.name}</Title>
        <Text c="dimmed">{trip.airport.code}</Text>
        {trip.airport.categories.map((cat) => (
          <Card
            key={cat.id}
            component={Link}
            to={`/on-the-way/airport/${cat.id}`}
            padding="md"
            radius="md"
            bg="dtp.0"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Text fw={800}>{cat.title}</Text>
            <Text size="sm" c="dimmed">
              {cat.summary}
            </Text>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}

export function AirportCategoryPage() {
  const { categoryId } = useParams()
  const [trip, setTrip] = useState<TripData | null>(null)

  useEffect(() => {
    void dataClient.getTrip().then(setTrip)
  }, [])

  const cat = trip?.airport.categories.find((c) => c.id === categoryId)
  if (!trip || !cat) return <Text p="xl">Loading…</Text>

  return (
    <Stack gap={0}>
      <AppHeader title={cat.title} showBack backTo="/on-the-way/airport" />
      <Stack gap="md" p="md" pb={100}>
        <Image src={cat.imageUrl} h={160} radius="md" alt={cat.title} />
        <Text c="dimmed">{cat.summary}</Text>
        <Stack gap="xs" component="ul" style={{ paddingLeft: 20, margin: 0 }}>
          {cat.tips.map((tip) => (
            <Text key={tip} component="li">
              {tip}
            </Text>
          ))}
        </Stack>
      </Stack>
    </Stack>
  )
}

export function BookingPage() {
  const [trip, setTrip] = useState<TripData | null>(null)

  useEffect(() => {
    void dataClient.getTrip().then(setTrip)
  }, [])

  if (!trip) return <Text p="xl">Loading…</Text>
  const b = trip.booking

  return (
    <Stack gap={0}>
      <AppHeader title="Booking Information" showBack backTo="/on-the-way" />
      <Stack gap="sm" p="md" pb={100}>
        <Title order={3}>Your itinerary</Title>
        <Info label="Hotel" value={b.hotelName} />
        <Info label="Confirmation" value={b.hotelConfirmation} />
        <Info label="Stay" value={`${b.checkIn} → ${b.checkOut}`} />
        <Info label="Rooms / guests" value={`${b.rooms} room · ${b.guests} guests`} />
        <Info label="Flight" value={b.flightSummary} />
        <Text c="dimmed" mt="sm">
          {b.notes}
        </Text>
      </Stack>
    </Stack>
  )
}

export function TransportPage() {
  const [trip, setTrip] = useState<TripData | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    void dataClient.getTrip().then(setTrip)
  }, [])

  if (!trip) return <Text p="xl">Loading…</Text>
  const selected = trip.transportation.find((t) => t.id === openId)

  return (
    <Stack gap={0}>
      <AppHeader title="Transportation" showBack backTo="/on-the-way" />
      <Stack gap="sm" p="md" pb={100}>
        {trip.transportation.map((item) => (
          <Card key={item.id} padding="md" radius="md" bg="dtp.0" onClick={() => setOpenId(item.id)} style={{ cursor: 'pointer' }}>
            <Text fw={800}>{item.name}</Text>
            <Text size="sm" c="dimmed">
              {item.detail}
            </Text>
          </Card>
        ))}
      </Stack>
      <Drawer opened={!!selected} onClose={() => setOpenId(null)} position="bottom" title={selected?.name}>
        {selected ? (
          <Stack>
            <Text>{selected.detail}</Text>
            <Text c="dimmed">{selected.tips}</Text>
            <Button onClick={() => setOpenId(null)}>Done</Button>
            <Button variant="subtle" onClick={() => navigate('/on-the-way')}>
              Back to On the Way
            </Button>
          </Stack>
        ) : null}
      </Drawer>
    </Stack>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <Text fw={700}>{value}</Text>
    </div>
  )
}
