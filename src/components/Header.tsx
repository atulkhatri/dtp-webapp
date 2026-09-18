import { ActionIcon, Group, Text, UnstyledButton } from '@mantine/core'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconArrowLeft, IconMenu2, IconPencil } from './icons'

interface HeaderProps {
  title: string
  showMenu?: boolean
  showBack?: boolean
  backTo?: string
  onBack?: () => void
  onMenu?: () => void
  onEdit?: () => void
  right?: ReactNode
}

export function AppHeader({ title, showMenu, showBack, backTo, onBack, onMenu, onEdit, right }: HeaderProps) {
  const navigate = useNavigate()

  function handleBack() {
    if (onBack) onBack()
    else if (backTo) navigate(backTo)
    else navigate(-1)
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        height: 56,
        padding: '0 12px',
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        borderBottom: '1px solid var(--mantine-color-gray-2)',
      }}
    >
      <Group h="100%" justify="space-between" wrap="nowrap" w="100%">
        <Group w={64} justify="flex-start">
          {showBack ? (
            <UnstyledButton
              type="button"
              onClick={handleBack}
              c="dtp"
              fw={700}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <IconArrowLeft /> Back
            </UnstyledButton>
          ) : showMenu ? (
            <ActionIcon variant="subtle" color="dtp" size="lg" onClick={onMenu} aria-label="Open menu">
              <IconMenu2 />
            </ActionIcon>
          ) : null}
        </Group>
        <Text fw={700} size="lg" ta="center" style={{ flex: 1 }}>
          {title}
        </Text>
        <Group w={64} justify="flex-end">
          {onEdit ? (
            <ActionIcon variant="subtle" color="dtp" size="lg" onClick={onEdit} aria-label="Edit">
              <IconPencil />
            </ActionIcon>
          ) : (
            right
          )}
        </Group>
      </Group>
    </header>
  )
}

/** @deprecated prefer AppHeader */
export const Header = AppHeader

export function BrandMark({ large = false }: { large?: boolean }) {
  const base = import.meta.env.BASE_URL
  return (
    <Group justify="center" gap="sm" my={large ? 'xl' : 'md'}>
      <img
        src={`${base}brand/dtp-v1_logo_square.png`}
        alt="DTP logo"
        width={large ? 64 : 40}
        height={large ? 64 : 40}
        style={{ borderRadius: 12 }}
      />
      <Text
        c="dtp"
        fw={800}
        style={{ fontSize: large ? '2.4rem' : '1.5rem', letterSpacing: '-0.03em', lineHeight: 1 }}
      >
        dtp
      </Text>
    </Group>
  )
}

export function Copyright() {
  return (
    <Text size="xs" c="dimmed" ta="center" mt="lg">
      © 2026 DTP Support Services Corp.
    </Text>
  )
}
