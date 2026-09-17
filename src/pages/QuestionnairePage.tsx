import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { dataClient } from '../data/client'
import type { QuestionnaireOptions, UserProfile } from '../data/types'
import { Copyright, Header } from '../components/Header'

export function QuestionnairePage() {
  const { user, completeQuestionnaire, skipQuestionnaire } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<'intro' | 'form'>('intro')
  const [options, setOptions] = useState<QuestionnaireOptions | null>(null)
  const [form, setForm] = useState<UserProfile | null>(null)

  useEffect(() => {
    void Promise.all([dataClient.getQuestionnaireOptions(), dataClient.getUser()]).then(([opts, seed]) => {
      setOptions(opts)
      setForm(user ?? seed)
    })
  }, [user])

  if (!options || !form) return <div className="loading">Loading…</div>

  if (step === 'intro') {
    return (
      <div className="page">
        <Header title="Questionnaire" />
        <div className="hero-block">
          <img
            src="https://images.unsplash.com/photo-1488646953015-cd6cf9984c85?w=900&q=80"
            alt="Travel collage"
          />
          <div className="overlay">Your end-to-end journey starts here!</div>
        </div>
        <h2 className="h1">Let&apos;s create your digital profile to facilitate travelling experiences</h2>
        <div className="btn-row" style={{ marginTop: 16 }}>
          <button
            className="btn btn-secondary"
            onClick={async () => {
              await skipQuestionnaire()
              navigate('/borders')
            }}
          >
            Later
          </button>
          <button className="btn btn-primary" onClick={() => setStep('form')}>
            Start
          </button>
        </div>
        <Copyright />
      </div>
    )
  }

  function update<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  return (
    <div className="page">
      <Header title="Questionnaire" showBack />
      <form
        className="stack"
        onSubmit={(e) => {
          e.preventDefault()
          completeQuestionnaire(form)
          navigate('/borders')
        }}
      >
        <Field label="Full name">
          <input className="field" value={form.name} onChange={(e) => update('name', e.target.value)} required />
        </Field>
        <Field label="Email">
          <input className="field" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
        </Field>
        <Field label="Gender">
          <Select value={form.gender} options={options.genders} onChange={(v) => update('gender', v)} />
        </Field>
        <Field label="Occupation">
          <input className="field" value={form.occupation} onChange={(e) => update('occupation', e.target.value)} />
        </Field>
        <Field label="Country of residence">
          <Select value={form.countryOfResidence} options={options.countries} onChange={(v) => update('countryOfResidence', v)} />
        </Field>
        <Field label="Origin">
          <Select value={form.origin} options={options.countries} onChange={(v) => update('origin', v)} />
        </Field>
        <Field label="Destination">
          <Select value={form.destination} options={options.destinations} onChange={(v) => update('destination', v)} />
        </Field>
        <Field label="Travel companions">
          <Select value={form.companions} options={options.companions} onChange={(v) => update('companions', v)} />
        </Field>
        <Field label="Travel means">
          <Select value={form.travelMeans} options={options.travelMeans} onChange={(v) => update('travelMeans', v)} />
        </Field>
        <Field label="Preferred travel type">
          <Select value={form.preferredTravelType} options={options.travelTypes} onChange={(v) => update('preferredTravelType', v)} />
        </Field>
        <Field label="Vaccination status">
          <Select value={form.vaccinationStatus} options={options.vaccinationOptions} onChange={(v) => update('vaccinationStatus', v)} />
        </Field>
        <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 8 }}>
          Create Profile
        </button>
      </form>
      <Copyright />
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <select className="field select" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}
