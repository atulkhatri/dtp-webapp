import { useNavigate } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { Header } from '../components/Header'

export function BusinessComingSoonPage() {
  const { continueAsTourist } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="page">
      <Header title="Business" showBack backTo="/login" />
      <div className="stack" style={{ paddingTop: 40, textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem' }}>🏢</div>
        <h2 className="h1">Business tools coming soon</h2>
        <p className="muted">
          Hospitality analytics and partner dashboards are not part of this demo yet. Continue as a tourist to explore the
          traveller experience.
        </p>
        <button
          className="btn btn-primary btn-block"
          onClick={() => {
            continueAsTourist()
            navigate('/questionnaire')
          }}
        >
          Continue as Tourist
        </button>
      </div>
    </div>
  )
}
