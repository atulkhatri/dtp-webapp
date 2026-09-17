import { Button, Divider, Drawer, Stack, Text } from '@mantine/core'
import { Link } from 'react-router-dom'
import { useAuth } from '../app/AuthContext'

const items = [
  { to: '/my-places', label: 'My Places' },
  { to: '/my-reviews', label: 'My Reviews' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/work-with-us', label: 'Work with Us' },
  { to: '/settings', label: 'Settings' },
  { to: '/about', label: 'About' },
]

interface MenuDrawerProps {
  open: boolean
  onClose: () => void
}

export function MenuDrawer({ open, onClose }: MenuDrawerProps) {
  const { user, logout } = useAuth()

  return (
    <Drawer
      opened={open}
      onClose={onClose}
      title={
        <Stack gap={2}>
          <Text fw={800} size="lg">
            {user?.name ?? 'Traveller'}
          </Text>
          <Text size="sm" c="dimmed">
            {user?.email}
          </Text>
        </Stack>
      }
      position="left"
      size="85%"
      overlayProps={{ backgroundOpacity: 0.35, blur: 2 }}
      styles={{
        content: { maxWidth: 360 },
      }}
    >
      <Stack gap="xs" mt="md">
        {items.map((item) => (
          <Button
            key={item.to}
            component={Link}
            to={item.to}
            variant="subtle"
            color="gray"
            justify="flex-start"
            onClick={onClose}
            styles={{ root: { fontWeight: 700 } }}
          >
            {item.label}
          </Button>
        ))}
        <Divider my="sm" />
        <Button
          variant="light"
          color="dtp"
          onClick={() => {
            onClose()
            logout()
          }}
        >
          Sign Out
        </Button>
      </Stack>
    </Drawer>
  )
}
