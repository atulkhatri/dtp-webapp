import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { useToast } from '../app/ToastContext'
import { BrandMark, Copyright, Header } from '../components/Header'
import type { SessionRole } from '../data/session'

export function SignUpPage() {
  const { signup } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<SessionRole>('tourist')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = await signup(name, email, password, role)
    if (!result.ok) {
      setError(result.error ?? 'Sign up failed')
      return
    }
    toast('Account created')
    if (role === 'business') navigate('/business-coming-soon')
    else navigate('/questionnaire')
  }

  return (
    <div className="page">
      <Header title="Sign Up" showBack backTo="/login" />
      <BrandMark />
      <form className="stack" onSubmit={onSubmit}>
        <div>
          <label className="label" htmlFor="name">
            Name
          </label>
          <input id="name" className="field" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input id="email" className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="row" style={{ gap: 24 }}>
          <label className="checkbox">
            <input type="checkbox" checked={role === 'tourist'} onChange={() => setRole('tourist')} />
            Tourist
          </label>
          <label className="checkbox">
            <input type="checkbox" checked={role === 'business'} onChange={() => setRole('business')} />
            Business
          </label>
        </div>
        {error ? <p style={{ color: 'var(--color-danger)', margin: 0 }}>{error}</p> : null}
        <button type="submit" className="btn btn-primary btn-block">
          Create account
        </button>
        <p className="muted" style={{ textAlign: 'center' }}>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
      <Copyright />
    </div>
  )
}
