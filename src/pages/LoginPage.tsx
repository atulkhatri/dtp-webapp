import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { useToast } from '../app/ToastContext'
import { BrandMark, Copyright, Header } from '../components/Header'
import type { SessionRole } from '../data/session'

export function LoginPage() {
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<SessionRole>('tourist')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const result = await login(email, password, role)
    if (!result.ok) {
      setError(result.error ?? 'Login failed')
      return
    }
    if (role === 'business') navigate('/business-coming-soon')
    else navigate('/questionnaire')
  }

  return (
    <div className="page">
      <Header title="Log In" />
      <BrandMark large />
      <form className="stack" onSubmit={onSubmit}>
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="field"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="field"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        {error ? <p style={{ color: 'var(--color-danger)', margin: 0 }}>{error}</p> : null}
        <div className="btn-row">
          <Link to="/signup" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Sign Up
          </Link>
          <button type="submit" className="btn btn-primary">
            Log In
          </button>
        </div>
        <div className="row" style={{ gap: 24, marginTop: 4 }}>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={role === 'tourist'}
              onChange={() => setRole('tourist')}
            />
            Tourist
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={role === 'business'}
              onChange={() => setRole('business')}
            />
            Business
          </label>
        </div>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ justifyContent: 'flex-start', paddingLeft: 0 }}
          onClick={() => toast('Contact support at hello@dtpsupport.com')}
        >
          Forgot password?
        </button>
        <div className="stack" style={{ marginTop: 8 }}>
          <div className="btn-row">
            <button type="button" className="btn btn-secondary" onClick={() => toast('Coming soon')}>
              Continue with Facebook
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => toast('Coming soon')}>
              Continue with Google
            </button>
          </div>
          <button type="button" className="btn btn-secondary btn-block" onClick={() => toast('Coming soon')}>
            Sign In with Apple
          </button>
        </div>
      </form>
      <p className="tiny" style={{ marginTop: 20, textAlign: 'center' }}>
        Demo: maya.chen@example.com / travel2026
      </p>
      <Copyright />
    </div>
  )
}
