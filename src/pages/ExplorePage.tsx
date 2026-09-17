import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { dataClient } from '../data/client'
import type { ExplorePlace } from '../data/types'
import { Header } from '../components/Header'
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
    <div className="page with-tabs with-header">
      <Header title="Explore" showMenu onMenu={onMenu} />
      <div className="hero-block" style={{ minHeight: 140 }}>
        <img
          src="https://images.unsplash.com/photo-1559511260-66a654ae982a?w=900&q=80"
          alt="Vancouver waterfront"
          style={{ height: 160 }}
        />
        <div className="overlay">Discover the best of Vancouver</div>
      </div>
      <input
        className="field soft"
        placeholder="Search nearby"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="row wrap" style={{ marginTop: 12, gap: 8 }}>
        {categories.map((c) => (
          <button key={c} className={`chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="row between" style={{ marginTop: 12 }}>
        <span className="muted">{filtered.length} places</span>
        <button className="btn btn-secondary" onClick={() => navigate('/explore/map')}>
          View Map
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <p>No places match your search.</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setQuery('')
              setCategory('All')
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div>
          {filtered.map((place) => (
            <Link key={place.id} to={`/explore/${place.id}`} className="explore-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card-media">
                <img src={place.imageUrl} alt={place.name} />
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{place.name}</div>
                <div className="tiny">{place.category}</div>
                <div className="muted" style={{ fontSize: '0.85rem' }}>
                  {place.address}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function ExploreMapPage() {
  const [places, setPlaces] = useState<ExplorePlace[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    void dataClient.getExplore().then(setPlaces)
  }, [])

  return (
    <div className="page with-tabs with-header">
      <Header title="Explore Map" showBack backTo="/explore" />
      <div style={{ height: 420 }}>
        <MapView
          pins={places.map((p) => ({ id: p.id, name: p.name, lat: p.lat, lng: p.lng }))}
          onSelect={(id) => navigate(`/explore/${id}`)}
          height={420}
        />
      </div>
      <div className="fab-row">
        <button className="fab" onClick={() => navigate('/explore')} aria-label="View list">
          ☰
        </button>
      </div>
    </div>
  )
}

export function PlaceDetailPage() {
  const { id } = useParams()
  const [place, setPlace] = useState<ExplorePlace | null>(null)
  const { favorites, toggleFav } = useAuth()

  useEffect(() => {
    void dataClient.getExplore().then((list) => setPlace(list.find((p) => p.id === id) ?? null))
  }, [id])

  if (!place) return <div className="loading">Loading…</div>
  const fav = favorites.places.includes(place.id)
  const mapsUrl = `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lng}#map=16/${place.lat}/${place.lng}`

  return (
    <div className="page with-tabs with-header">
      <Header title={place.name} showBack backTo="/explore" />
      <div className="detail-hero">
        <img src={place.imageUrl} alt={place.name} />
        <div className="caption">
          <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>{place.name}</div>
        </div>
      </div>
      <div className="row wrap" style={{ gap: 8, marginBottom: 8 }}>
        {place.categories
          .filter((c) => c !== 'All')
          .map((c) => (
            <span key={c} className="chip active">
              {c}
            </span>
          ))}
      </div>
      <div className="row between">
        <span className="label" style={{ margin: 0 }}>
          Favorite
        </span>
        <button className="heart-outline" onClick={() => toggleFav('places', place.id)}>
          {fav ? '♥' : '♡'}
        </button>
      </div>
      <p style={{ lineHeight: 1.5 }}>{place.description}</p>
      <div className="profile-row">
        <div className="label">Address</div>
        <div>{place.address}</div>
      </div>
      <div className="profile-row">
        <div className="label">Hours</div>
        <div>{place.hours}</div>
      </div>
      <a className="btn btn-primary btn-block" href={mapsUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', marginTop: 12 }}>
        Open in map
      </a>
    </div>
  )
}
