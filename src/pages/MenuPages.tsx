import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { dataClient } from '../data/client'
import type { ContentData, ExplorePlace, Review, Stay } from '../data/types'
import { Header } from '../components/Header'

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
    <div className="page with-tabs with-header">
      <Header title="My Places" showBack backTo="/profile" />
      <h2 className="h2">Stays</h2>
      {favStays.length === 0 ? (
        <p className="muted">No favorited stays yet.</p>
      ) : (
        <div className="grid-2">
          {favStays.map((stay) => (
            <Link key={stay.id} to={`/stays/${stay.id}`} className="stay-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card-media">
                <img src={stay.imageUrl} alt={stay.name} />
              </div>
              <div className="name">{stay.name}</div>
            </Link>
          ))}
        </div>
      )}
      <h2 className="h2" style={{ marginTop: 20 }}>
        Explore
      </h2>
      {favPlaces.length === 0 ? (
        <p className="muted">No favorited places yet.</p>
      ) : (
        favPlaces.map((place) => (
          <Link key={place.id} to={`/explore/${place.id}`} className="explore-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card-media">
              <img src={place.imageUrl} alt={place.name} />
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{place.name}</div>
              <div className="muted">{place.address}</div>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}

export function MyReviewsPage() {
  const [reviews, setReviews] = useState<Review[] | null>(null)

  useEffect(() => {
    void dataClient.getReviews().then(setReviews)
  }, [])

  if (!reviews) return <div className="loading">Loading…</div>

  return (
    <div className="page with-tabs with-header">
      <Header title="My Reviews" showBack backTo="/profile" />
      {reviews.length === 0 ? (
        <div className="empty">No reviews yet.</div>
      ) : (
        reviews.map((r) => (
          <article key={r.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ fontWeight: 800 }}>{r.placeName}</div>
            <div className="tiny">{r.date}</div>
            <div className="hearts">{'♥'.repeat(r.rating)}</div>
            <p className="muted">{r.text}</p>
          </article>
        ))
      )}
    </div>
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
  if (!content) return <div className="loading">Loading…</div>
  return (
    <div className="page with-tabs with-header">
      <Header title={title} showBack backTo="/profile" />
      {children(content)}
    </div>
  )
}

export function ContactPage() {
  return (
    <ContentPage title="Contact Us">
      {(c) => (
        <>
          <h1 className="h1">{c.contact.title}</h1>
          <p className="muted">{c.contact.body}</p>
          <p>
            <a href={`mailto:${c.contact.email}`}>{c.contact.email}</a>
          </p>
          <p>
            <a href={c.contact.website} target="_blank" rel="noreferrer">
              {c.contact.website}
            </a>
          </p>
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
          <h1 className="h1">{c.workWithUs.title}</h1>
          <p className="muted" style={{ lineHeight: 1.55 }}>
            {c.workWithUs.body}
          </p>
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
          <h1 className="h1">{c.settings.title}</h1>
          {c.settings.items.map((item) => (
            <div key={item.id} className="profile-row row between">
              <span>{item.label}</span>
              <span className="muted">{item.value}</span>
            </div>
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
          <h1 className="h1">{c.about.title}</h1>
          <p className="muted" style={{ lineHeight: 1.55 }}>
            {c.about.body}
          </p>
          <p className="tiny">{c.copyright}</p>
        </>
      )}
    </ContentPage>
  )
}
