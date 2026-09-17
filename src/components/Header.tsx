import { Link, useNavigate } from 'react-router-dom'

interface HeaderProps {
  title: string
  showMenu?: boolean
  showBack?: boolean
  backTo?: string
  right?: React.ReactNode
  onMenu?: () => void
}

export function Header({ title, showMenu, showBack, backTo, right, onMenu }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header
      style={{
        height: 'var(--header-h)',
        display: 'grid',
        gridTemplateColumns: '48px 1fr 48px',
        alignItems: 'center',
        padding: '0 8px',
        position: 'sticky',
        top: 0,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(8px)',
        zIndex: 20,
      }}
    >
      <div>
        {showBack ? (
          <button
            className="btn btn-ghost"
            style={{ minHeight: 40, padding: '6px 8px' }}
            onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
            aria-label="Back"
          >
            ← Back
          </button>
        ) : showMenu ? (
          <button
            className="btn btn-ghost"
            style={{ minHeight: 40, fontSize: '1.35rem', padding: '6px 10px' }}
            onClick={onMenu}
            aria-label="Open menu"
          >
            ☰
          </button>
        ) : (
          <span />
        )}
      </div>
      <h1 style={{ margin: 0, textAlign: 'center', fontSize: '1.05rem', fontWeight: 700 }}>{title}</h1>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </header>
  )
}

export function BrandMark({ large = false }: { large?: boolean }) {
  const base = import.meta.env.BASE_URL
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        margin: large ? '24px 0 28px' : '8px 0',
      }}
    >
      <img
        src={`${base}brand/dtp-v1_logo_square.png`}
        alt="DTP logo"
        width={large ? 64 : 40}
        height={large ? 64 : 40}
        style={{ borderRadius: 12 }}
      />
      <span
        style={{
          fontSize: large ? '2.4rem' : '1.5rem',
          fontWeight: 800,
          color: 'var(--color-primary)',
          letterSpacing: '-0.03em',
        }}
      >
        dtp
      </span>
    </div>
  )
}

export function Copyright() {
  return <p className="tiny" style={{ textAlign: 'center', marginTop: 24 }}>© 2026 DTP Support Services Corp.</p>
}

export function LinkButton({ to, children, className = 'btn btn-primary' }: { to: string; children: React.ReactNode; className?: string }) {
  return (
    <Link to={to} className={className} style={{ textDecoration: 'none' }}>
      {children}
    </Link>
  )
}
