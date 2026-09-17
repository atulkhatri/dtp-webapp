import { createTheme } from '@mantine/core'

export const dtpTheme = createTheme({
  primaryColor: 'dtp',
  fontFamily: '"Nunito Sans", "Segoe UI", sans-serif',
  headings: {
    fontFamily: '"Nunito Sans", "Segoe UI", sans-serif',
    fontWeight: '750',
  },
  defaultRadius: 'md',
  colors: {
    dtp: [
      '#f0f0ff',
      '#dde0ff',
      '#b8bbff',
      '#9294ff',
      '#7879ff',
      '#5f60e6',
      '#4a4bc4',
      '#3a3ba0',
      '#2e2f7d',
      '#22235c',
    ],
  },
  primaryShade: 4,
  components: {
    Button: {
      defaultProps: { radius: 'md' },
    },
    TextInput: {
      defaultProps: { radius: 'md', size: 'md' },
    },
    Paper: {
      defaultProps: { radius: 'md' },
    },
  },
})
