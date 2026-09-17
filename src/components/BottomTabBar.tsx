import { Group, Stack, Text, UnstyledButton } from '@mantine/core'
import { NavLink } from 'react-router-dom'
import { IconBook, IconBorders, IconHome, IconLuggage, IconUser } from './icons'

const tabs = [
  { to: '/borders', label: 'Borders', Icon: IconBorders },
  { to: '/stays', label: 'Stays', Icon: IconHome },
  { to: '/on-the-way', label: 'On the Way', Icon: IconLuggage },
  { to: '/explore', label: 'Explore', Icon: IconBook },
  { to: '/profile', label: 'Profile', Icon: IconUser },
]

export function BottomTabBar() {
  return (
    <Group
      gap={0}
      grow
      px={4}
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: 0,
        width: '100%',
        maxWidth: 430,
        height: 64,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        background: '#fff',
        borderTop: '1px solid var(--mantine-color-gray-2)',
        zIndex: 30,
      }}
    >
      {tabs.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
          {({ isActive }) => (
            <UnstyledButton w="100%" py={6}>
              <Stack gap={2} align="center">
                <Text c={isActive ? 'dtp' : 'gray.5'} style={{ display: 'flex' }}>
                  <Icon active={isActive} />
                </Text>
                <Text size="10px" fw={700} c={isActive ? 'dtp' : 'gray.5'} ta="center" lh={1.1}>
                  {label}
                </Text>
              </Stack>
            </UnstyledButton>
          )}
        </NavLink>
      ))}
    </Group>
  )
}
