import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { useToast } from '../app/ToastContext'
import { dataClient } from '../data/client'
import type { Stay, StaySearchDefaults } from '../data/types'
import { Header } from '../components/Header'
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

  if (!defaults) return <div className="loading">Loading…</div>

  return (
    <div className="page with-tabs with-header">
      <Header title="Stays" showMenu onMenu={onMenu} />
      <h1 className="h1">{defaults.heading}</h1>
      <div className="stack">
        <div>
          <label className="label">Location</label>
          <input className="field soft" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div className="btn-row">
          <div>
            <label className="label">Check-in</label>
            <input className="field soft" value={checkInLabel} onChange={(e) => setCheckInLabel(e.target.value)} />
          </div>
          <div>
            <label className="label">Check-out</label>
            <input className="field soft" value={checkOutLabel} onChange={(e) => setCheckOutLabel(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Rooms & guests</label>
          <button
            type="button"
            className="field soft"
            style={{ textAlign: 'left' }}
            onClick={() => {
              setRooms((r) => (r >= 2 ? 1 : r + 1))
              setGuests((g) => (g >= 4 ? 2 : g + 1))
            }}
          >
            {rooms} room, {guests} guests
          </button>
        </div>
        <label className="checkbox">
          <input type="checkbox" checked={petFriendly} onChange={(e) => setPetFriendly(e.target.checked)} />
          Pet-friendly
        </label>
        <button className="btn btn-primary btn-block" onClick={() => setSearched(true)}>
          Find
        </button>
        <div className="row between">
          <button className="btn btn-secondary" onClick={() => setShowFilters(true)}>
            Filters
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/stays/map', { state: { ids: results.map((r) => r.id) } })}>
            View Map
          </button>
        </div>
      </div>

      <h2 className="h2" style={{ marginTop: 20 }}>
        Suggested stays
      </h2>
      {results.length === 0 ? (
        <div className="empty">
          <p>No stays match your filters.</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setSelectedAmenities([])
              setMaxPrice(400)
              setPetFriendly(false)
              setSearched(true)
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {results.map((stay) => (
            <Link key={stay.id} to={`/stays/${stay.id}`} className="stay-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card-media">
                <img src={stay.imageUrl} alt={stay.name} />
              </div>
              <div className="name">{stay.name}</div>
              <div className="tiny">{stay.neighborhood}</div>
              <div className="muted">from ${stay.priceFrom}</div>
            </Link>
          ))}
        </div>
      )}

      {showFilters ? (
        <div className="sheet-backdrop" onClick={() => setShowFilters(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <h2 className="h2">Filters</h2>
            <label className="label">Max price per night: ${maxPrice}</label>
            <input
              type="range"
              min={100}
              max={400}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%' }}
            />
            <div className="stack" style={{ marginTop: 12 }}>
              {amenityOptions.map((a) => (
                <label key={a} className="checkbox">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(a)}
                    onChange={(e) => {
                      setSelectedAmenities((prev) =>
                        e.target.checked ? [...prev, a] : prev.filter((x) => x !== a),
                      )
                    }}
                  />
                  {a}
                </label>
              ))}
            </div>
            <div className="btn-row" style={{ marginTop: 16 }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedAmenities([])
                  setMaxPrice(400)
                }}
              >
                Clear
              </button>
              <button className="btn btn-primary" onClick={() => setShowFilters(false)}>
                Apply
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function StaysMapPage() {
  const [stays, setStays] = useState<Stay[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    void dataClient.getStays().then(setStays)
  }, [])

  return (
    <div className="page with-tabs with-header">
      <Header title="Stays Map" showBack backTo="/stays" />
      <div style={{ height: 420, marginBottom: 12 }}>
        <MapView
          pins={stays.map((s) => ({ id: s.id, name: s.name, lat: s.lat, lng: s.lng }))}
          onSelect={(id) => navigate(`/stays/${id}`)}
          height={420}
        />
      </div>
      <div className="fab-row">
        <button className="fab" aria-label="Back to list" onClick={() => navigate('/stays')}>
          ☰
        </button>
      </div>
    </div>
  )
}

export function StayDetailPage() {
  const { id } = useParams()
  const [stay, setStay] = useState<Stay | null>(null)
  const { favorites, toggleFav } = useAuth()
  const { toast } = useToast()
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    void dataClient.getStays().then((list) => setStay(list.find((s) => s.id === id) ?? null))
  }, [id])

  if (!stay) return <div className="loading">Loading…</div>
  const fav = favorites.stays.includes(stay.id)

  return (
    <div className="page with-tabs with-header">
      <Header title={stay.name} showBack backTo="/stays" />
      <div className="detail-hero">
        <img src={stay.imageUrl} alt={stay.name} />
        <div className="caption">
          <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{stay.name}</div>
          <div>{stay.neighborhood}</div>
        </div>
      </div>
      <div className="profile-row row between">
        <span className="label" style={{ margin: 0 }}>
          Favorite
        </span>
        <button className="heart-outline" onClick={() => toggleFav('stays', stay.id)} aria-label="Favorite">
          {fav ? '♥' : '♡'}
        </button>
      </div>
      <div className="profile-row">
        <div className="label">Rating</div>
        <div>
          {stay.rating} / 5 <span className="hearts">{'♥'.repeat(stay.rating)}</span>
        </div>
      </div>
      <div className="profile-row">
        <div className="label">Address</div>
        <div>{stay.address}</div>
      </div>
      <div className="profile-row">
        <div className="label">Price per night</div>
        <div>from ${stay.priceFrom}</div>
      </div>
      <div className="profile-row">
        <div className="label">Website</div>
        <a href={stay.website} target="_blank" rel="noreferrer">
          {stay.website}
        </a>
      </div>
      <div className="profile-row row between">
        <div>
          <div className="label">Phone</div>
          <div>{stay.phone}</div>
        </div>
        <div className="row">
          <button className="fab" style={{ position: 'static' }} onClick={() => setChatOpen(true)} aria-label="Chat">
            💬
          </button>
          <a className="fab" style={{ position: 'static' }} href={`tel:${stay.phone.replace(/\s/g, '')}`} aria-label="Call">
            📞
          </a>
        </div>
      </div>
      <p className="muted">{stay.description}</p>

      {chatOpen ? (
        <div className="sheet-backdrop" onClick={() => setChatOpen(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <h2 className="h2">Concierge chat</h2>
            <p className="muted">Concierge will reply soon. This is a demo conversation.</p>
            <input className="field" placeholder="Type a message…" onKeyDown={(e) => {
              if (e.key === 'Enter') toast('Message sent (demo)')
            }} />
            <button className="btn btn-primary btn-block" style={{ marginTop: 12 }} onClick={() => { toast('Message sent (demo)'); setChatOpen(false) }}>
              Send
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
