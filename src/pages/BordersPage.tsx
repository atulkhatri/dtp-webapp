import { Image, Loader, Stack, Text, UnstyledButton } from '@mantine/core'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dataClient } from '../data/client'
import type { BordersData } from '../data/types'
import { AppHeader } from '../components/Header'

interface BordersPageProps {
  onMenu: () => void
}

export function BordersPage({ onMenu }: BordersPageProps) {
  const [data, setData] = useState<BordersData | null>(null)

  useEffect(() => {
    void dataClient.getBorders().then(setData)
  }, [])

  if (!data) {
    return (
      <Stack align="center" py="xl">
        <Loader color="dtp" />
      </Stack>
    )
  }

  return (
    <Stack gap={0}>
      <AppHeader title="Borders" showMenu onMenu={onMenu} />
      <Stack gap="lg" px="md" pt="sm" pb={88}>
        {data.items.map((item) => (
          <UnstyledButton
            key={item.id}
            component={Link}
            to={`/borders/${item.id}`}
            style={{ display: 'block', width: '100%' }}
          >
            <Stack gap="xs">
              <Image
                src={item.imageUrl}
                alt={item.title}
                radius="md"
                h={168}
                fit="cover"
                fallbackSrc="https://placehold.co/800x400/ebebfd/7879ff?text=DTP"
              />
              <Text fw={700} size="lg">
                {item.title}
              </Text>
            </Stack>
          </UnstyledButton>
        ))}
      </Stack>
    </Stack>
  )
}

export function BorderArticlePage() {
  const { articleId } = useParams()
  const [item, setItem] = useState<BordersData['items'][number] | null>(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    void dataClient.getBorders().then((data) => {
      const found = data.items.find((i) => i.id === articleId) ?? null
      setItem(found)
      setMissing(!found)
    })
  }, [articleId])

  if (!item && !missing) {
    return (
      <Stack align="center" py="xl">
        <Loader color="dtp" />
      </Stack>
    )
  }

  return (
    <Stack gap={0}>
      <AppHeader title="Borders" showBack backTo="/borders" />
      <Stack gap="md" px="md" pt="sm" pb={88}>
        {item ? (
          <>
            <Image src={item.imageUrl} alt={item.title} radius="md" h={200} fit="cover" />
            <Text fw={800} size="xl">
              {item.title}
            </Text>
            <Text c="dimmed">{item.summary}</Text>
            <Text style={{ lineHeight: 1.6 }}>{item.body}</Text>
          </>
        ) : (
          <Text>Content not found.</Text>
        )}
      </Stack>
    </Stack>
  )
}
