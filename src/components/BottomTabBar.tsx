import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/borders', label: 'Borders', icon: '🛂' },
  { to: '/stays', label: 'Stays', icon: '🏠' },
  { to: '/on-the-way', label: 'On the Way', icon: '🧳' },
  { to: '/explore', label: 'Explore', icon: '📖' },
  { to: '/profile', label: 'Profile', icon: '👤' },
]

export function BottomTabBar() {
  return (
    <nav
      aria-label="Main"
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: 0,
        width: '100%',
        maxWidth: 'var(--shell-max)',
        height: 'calc(var(--tab-h) + var(--safe-bottom))',
        paddingBottom: 'var(--safe-bottom)',
        background: '#fff',
        borderTop: '1px solid var(--color-border)',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        zIndex: 30,
      }}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            textDecoration: 'none',
            color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
            fontSize: '0.68rem',
            fontWeight: 700,
          })}
        >
          <span style={{ fontSize: '1.15rem', lineHeight: 1 }} aria-hidden>
            {tab.icon}
          </span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
