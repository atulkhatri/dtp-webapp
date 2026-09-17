import { Link } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'

const items = [
  { to: '/my-places', label: 'My Places' },
  { to: '/my-reviews', label: 'My Reviews' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/work-with-us', label: 'Work with Us' },
  { to: '/settings', label: 'Settings' },
  { to: '/about', label: 'About' },
]

interface MenuDrawerProps {
  open: boolean
  onClose: () => void
}

export function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  const { user, logout } = useAuth()
  if (!open) return null

  return (
    <div className="sheet-backdrop" onClick={onClose} role="presentation">
      <aside
        role="dialog"
        aria-label="Menu"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          left: 'max(0px, calc(50% - var(--shell-max) / 2))',
          top: 0,
          width: 'min(82vw, 340px)',
          height: '100%',
          background: '#fff',
          boxShadow: 'var(--shadow-soft)',
          padding: '28px 20px',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '0 16px 16px 0',
        }}
      >
        <button
          className="btn btn-ghost"
          style={{ alignSelf: 'flex-start', marginBottom: 12 }}
          onClick={onClose}
          aria-label="Close menu"
        >
          ✕
        </button>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>{user?.name ?? 'Traveller'}</div>
          <div className="muted">{user?.email}</div>
        </div>
        <nav className="stack" style={{ gap: 4, flex: 1 }}>
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
              style={{
                padding: '14px 4px',
                textDecoration: 'none',
                color: 'var(--color-text)',
                fontWeight: 700,
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          className="btn btn-secondary btn-block"
          style={{ marginTop: 16 }}
          onClick={() => {
            onClose()
            logout()
          }}
        >
          Sign Out
        </button>
      </aside>
    </div>
  )
}
