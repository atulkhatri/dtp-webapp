import { Button, Group, Image, Select, Stack, Text, TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'
import { assetUrl, dataClient } from '../data/client'
import type { QuestionnaireOptions, UserProfile } from '../data/types'
import { AppHeader, Copyright } from '../components/Header'

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

  if (!options || !form) return <Text p="xl">Loading…</Text>

  if (step === 'intro') {
    return (
      <Stack gap={0}>
        <AppHeader title="Questionnaire" />
        <div style={{ position: 'relative' }}>
          <Image
            src={assetUrl('images/questionnaire-hero.jpg')}
            alt="Travel"
            h={220}
            fit="cover"
          />
          <Text
            fw={800}
            size="lg"
            c="white"
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              bottom: 16,
              textShadow: '0 2px 10px rgba(0,0,0,.45)',
            }}
          >
            Your end-to-end journey starts here!
          </Text>
        </div>
        <Stack gap="md" p="md">
          <Text fw={800} size="lg">
            Let&apos;s create your digital profile to facilitate travelling experiences
          </Text>
          <Group grow>
            <Button
              variant="light"
              onClick={async () => {
                await skipQuestionnaire()
                navigate('/borders')
              }}
            >
              Later
            </Button>
            <Button onClick={() => setStep('form')}>Start</Button>
          </Group>
          <Copyright />
        </Stack>
      </Stack>
    )
  }

  function update<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  return (
    <Stack gap={0}>
      <AppHeader title="Questionnaire" showBack onBack={() => setStep('intro')} />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          completeQuestionnaire(form)
          navigate('/borders')
        }}
      >
        <Stack gap="sm" p="md" pb="xl">
          <TextInput label="Full name" value={form.name} onChange={(e) => update('name', e.currentTarget.value)} required />
          <TextInput
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.currentTarget.value)}
            required
          />
          <Select label="Gender" data={options.genders} value={form.gender} onChange={(v) => v && update('gender', v)} />
          <TextInput
            label="Occupation"
            value={form.occupation}
            onChange={(e) => update('occupation', e.currentTarget.value)}
          />
          <Select
            label="Country of residence"
            data={options.countries}
            value={form.countryOfResidence}
            onChange={(v) => v && update('countryOfResidence', v)}
          />
          <Select label="Origin" data={options.countries} value={form.origin} onChange={(v) => v && update('origin', v)} />
          <Select
            label="Destination"
            data={options.destinations}
            value={form.destination}
            onChange={(v) => v && update('destination', v)}
          />
          <Select
            label="Travel companions"
            data={options.companions}
            value={form.companions}
            onChange={(v) => v && update('companions', v)}
          />
          <Select
            label="Travel means"
            data={options.travelMeans}
            value={form.travelMeans}
            onChange={(v) => v && update('travelMeans', v)}
          />
          <Select
            label="Preferred travel type"
            data={options.travelTypes}
            value={form.preferredTravelType}
            onChange={(v) => v && update('preferredTravelType', v)}
          />
          <Select
            label="Vaccination status"
            data={options.vaccinationOptions}
            value={form.vaccinationStatus}
            onChange={(v) => v && update('vaccinationStatus', v)}
          />
          <Button type="submit" fullWidth mt="sm">
            Create Profile
          </Button>
          <Copyright />
        </Stack>
      </form>
    </Stack>
  )
}
