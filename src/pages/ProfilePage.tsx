import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { dataClient } from '../data/client'
import type { Review } from '../data/types'
import { Header } from '../components/Header'

interface ProfilePageProps {
  onMenu: () => void
}

export function ProfilePage({ onMenu }: ProfilePageProps) {
  const { user, updateUser } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    void dataClient.getReviews().then(setReviews)
  }, [])

  if (!user) return <div className="loading">Loading…</div>

  return (
    <div className="page with-tabs with-header">
      <Header
        title="Profile"
        showMenu
        onMenu={onMenu}
        right={
          <Link to="/profile/edit" className="btn btn-ghost" style={{ minHeight: 40, fontSize: '1.1rem' }} aria-label="Edit">
            ✎
          </Link>
        }
      />
      <div className="profile-row">
        <div className="label">Name</div>
        <div className="value">{user.name}</div>
      </div>
      <div className="profile-row row between">
        <div className="label" style={{ margin: 0 }}>
          Travel Document
        </div>
        <Link to="/profile/travel-document" className="link-pill" aria-label="Travel document">
          ↗
        </Link>
      </div>
      <div className="profile-row row between">
        <div className="label" style={{ margin: 0 }}>
          Vaccination Card
        </div>
        <Link to="/profile/vaccination" className="link-pill" aria-label="Vaccination">
          ↗
        </Link>
      </div>
      <div className="profile-row">
        <div className="label">Country of Residence</div>
        <div className="value">{user.countryOfResidence}</div>
      </div>
      <div className="divider" />
      <div className="profile-row">
        <div className="label">Destination</div>
        <div className="value">{user.destination}</div>
      </div>
      <div className="profile-row">
        <div className="label">Preferred Travel Type</div>
        <div className="value">{user.preferredTravelType}</div>
      </div>
      <div className="divider" />
      <div className="profile-row row between">
        <span>Location Sharing</span>
        <button
          className={`toggle ${user.locationSharing ? 'on' : ''}`}
          aria-pressed={user.locationSharing}
          onClick={() => updateUser({ locationSharing: !user.locationSharing })}
        />
      </div>
      <div className="profile-row row between">
        <span>Notifications</span>
        <button
          className={`toggle ${user.notifications ? 'on' : ''}`}
          aria-pressed={user.notifications}
          onClick={() => updateUser({ notifications: !user.notifications })}
        />
      </div>
      <div className="divider" />
      <h2 className="h2">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="muted">No reviews yet.</p>
      ) : (
        reviews.slice(0, 2).map((r) => (
          <div key={r.id} style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700 }}>{r.placeName}</div>
            <div className="hearts">{'♥'.repeat(r.rating)}</div>
            <p className="muted" style={{ margin: '4px 0 0' }}>
              {r.text}
            </p>
          </div>
        ))
      )}
      <Link to="/my-reviews" className="btn btn-secondary btn-block" style={{ textDecoration: 'none', marginTop: 8 }}>
        See all reviews
      </Link>
    </div>
  )
}

export function ProfileEditPage() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [occupation, setOccupation] = useState(user?.occupation ?? '')

  if (!user) return <div className="loading">Loading…</div>

  return (
    <div className="page with-tabs with-header">
      <Header title="Edit Profile" showBack backTo="/profile" />
      <div className="stack">
        <div>
          <label className="label">Name</label>
          <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="label">Occupation</label>
          <input className="field" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
        </div>
        <button
          className="btn btn-primary btn-block"
          onClick={() => updateUser({ name, occupation })}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export function TravelDocumentPage() {
  const [fileName, setFileName] = useState<string | null>(null)
  return (
    <div className="page with-tabs with-header">
      <Header title="Travel Document" showBack backTo="/profile" />
      <p className="muted">Passport status for this demo: Verified (mock).</p>
      <div className="banner" style={{ fontSize: '1.1rem' }}>
        Passport · Singapore · Valid
      </div>
      <label className="btn btn-secondary btn-block" style={{ cursor: 'pointer' }}>
        Upload
        <input
          type="file"
          hidden
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </label>
      {fileName ? <p className="tiny">Selected: {fileName} (stored locally only)</p> : null}
    </div>
  )
}

export function VaccinationPage() {
  const { user } = useAuth()
  const [fileName, setFileName] = useState<string | null>(null)
  return (
    <div className="page with-tabs with-header">
      <Header title="Vaccination Card" showBack backTo="/profile" />
      <p className="muted">Status: {user?.vaccinationStatus ?? 'Unknown'}</p>
      <div className="banner" style={{ fontSize: '1.1rem', background: 'var(--color-success)' }}>
        {user?.vaccinationStatus ?? 'Not set'}
      </div>
      <label className="btn btn-secondary btn-block" style={{ cursor: 'pointer' }}>
        Upload
        <input type="file" hidden onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
      </label>
      {fileName ? <p className="tiny">Selected: {fileName} (stored locally only)</p> : null}
    </div>
  )
}
