import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { dataClient } from '../data/client'
import type { TripData } from '../data/types'
import { Header } from '../components/Header'

interface OnTheWayPageProps {
  onMenu: () => void
}

export function OnTheWayPage({ onMenu }: OnTheWayPageProps) {
  return (
    <div className="page with-tabs with-header">
      <Header title="On the Way" showMenu onMenu={onMenu} />
      <h1 className="h1">Your journey toolkit</h1>
      <div className="grid-2" style={{ marginTop: 8 }}>
        <Link to="/on-the-way/booking" className="tile" style={{ textDecoration: 'none' }}>
          <span className="icon">🧾</span>
          Booking Information
        </Link>
        <Link to="/on-the-way/flight" className="tile" style={{ textDecoration: 'none' }}>
          <span className="icon">✈️</span>
          Flight Information
        </Link>
        <Link to="/on-the-way/airport" className="tile" style={{ textDecoration: 'none' }}>
          <span className="icon">🛫</span>
          Airport Information
        </Link>
        <Link to="/on-the-way/transport" className="tile" style={{ textDecoration: 'none' }}>
          <span className="icon">🚌</span>
          Transportation
        </Link>
      </div>
    </div>
  )
}

export function FlightPage() {
  const [trip, setTrip] = useState<TripData | null>(null)
  const [boardingOpen, setBoardingOpen] = useState(false)

  useEffect(() => {
    void dataClient.getTrip().then(setTrip)
  }, [])

  if (!trip) return <div className="loading">Loading…</div>
  const f = trip.flight

  return (
    <div className="page with-tabs with-header">
      <Header title="Flight Information" showBack backTo="/on-the-way" />
      <div className="banner" style={{ background: 'linear-gradient(135deg, #7879ff, #78b1c2)' }}>
        {f.airline}
        <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: 6 }}>
          {f.flightNumber} · {f.status}
        </div>
      </div>
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
      <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={() => setBoardingOpen(true)}>
        Boarding Pass
      </button>

      {boardingOpen ? (
        <div className="sheet-backdrop" onClick={() => setBoardingOpen(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
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
            <button className="btn btn-secondary btn-block" style={{ marginTop: 12 }} onClick={() => setBoardingOpen(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function AirportHubPage() {
  const [trip, setTrip] = useState<TripData | null>(null)

  useEffect(() => {
    void dataClient.getTrip().then(setTrip)
  }, [])

  if (!trip) return <div className="loading">Loading…</div>

  return (
    <div className="page with-tabs with-header">
      <Header title="Airport Information" showBack backTo="/on-the-way" />
      <h1 className="h1">{trip.airport.name}</h1>
      <p className="muted">{trip.airport.code}</p>
      <div className="stack" style={{ marginTop: 12 }}>
        {trip.airport.categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/on-the-way/airport/${cat.id}`}
            className="tile"
            style={{ textDecoration: 'none', minHeight: 72 }}
          >
            <span style={{ fontWeight: 800 }}>{cat.title}</span>
            <span className="muted" style={{ fontWeight: 500 }}>
              {cat.summary}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function AirportCategoryPage() {
  const { categoryId } = useParams()
  const [trip, setTrip] = useState<TripData | null>(null)

  useEffect(() => {
    void dataClient.getTrip().then(setTrip)
  }, [])

  const cat = trip?.airport.categories.find((c) => c.id === categoryId)
  if (!trip || !cat) return <div className="loading">Loading…</div>

  return (
    <div className="page with-tabs with-header">
      <Header title={cat.title} showBack backTo="/on-the-way/airport" />
      <div className="card-media" style={{ height: 160, marginBottom: 12 }}>
        <img src={cat.imageUrl} alt={cat.title} />
      </div>
      <p className="muted">{cat.summary}</p>
      <ul>
        {cat.tips.map((tip) => (
          <li key={tip} style={{ marginBottom: 8 }}>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function BookingPage() {
  const [trip, setTrip] = useState<TripData | null>(null)

  useEffect(() => {
    void dataClient.getTrip().then(setTrip)
  }, [])

  if (!trip) return <div className="loading">Loading…</div>
  const b = trip.booking

  return (
    <div className="page with-tabs with-header">
      <Header title="Booking Information" showBack backTo="/on-the-way" />
      <h1 className="h1">Your itinerary</h1>
      <Info label="Hotel" value={b.hotelName} />
      <Info label="Confirmation" value={b.hotelConfirmation} />
      <Info label="Stay" value={`${b.checkIn} → ${b.checkOut}`} />
      <Info label="Rooms / guests" value={`${b.rooms} room · ${b.guests} guests`} />
      <Info label="Flight" value={b.flightSummary} />
      <p className="muted" style={{ marginTop: 12 }}>
        {b.notes}
      </p>
    </div>
  )
}

export function TransportPage() {
  const [trip, setTrip] = useState<TripData | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    void dataClient.getTrip().then(setTrip)
  }, [])

  if (!trip) return <div className="loading">Loading…</div>
  const selected = trip.transportation.find((t) => t.id === openId)

  return (
    <div className="page with-tabs with-header">
      <Header title="Transportation" showBack backTo="/on-the-way" />
      <div className="stack">
        {trip.transportation.map((item) => (
          <button key={item.id} className="tile" onClick={() => setOpenId(item.id)}>
            <span>{item.name}</span>
            <span className="muted" style={{ fontWeight: 500 }}>
              {item.detail}
            </span>
          </button>
        ))}
      </div>
      {selected ? (
        <div className="sheet-backdrop" onClick={() => setOpenId(null)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <h2 className="h2">{selected.name}</h2>
            <p>{selected.detail}</p>
            <p className="muted">{selected.tips}</p>
            <button className="btn btn-primary btn-block" onClick={() => setOpenId(null)}>
              Done
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => navigate('/on-the-way')}>
              Back to On the Way
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="profile-row">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  )
}
