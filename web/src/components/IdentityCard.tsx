import { Box, Group, Stack, Text, createStyles } from '@mantine/core'
import type { Character } from '../types'

const useStyles = createStyles((theme) => ({
  card: {
    position: 'absolute',
    left: 'clamp(28px, 3vw, 48px)',
    bottom: 'clamp(28px, 3vw, 48px)',
    zIndex: 20,
    width: 'min(360px, 32vw)',
    padding: 'clamp(14px, 1.2vw, 18px) clamp(16px, 1.4vw, 20px)',
    borderRadius: theme.radius.sm,
    background: theme.colors.dark[7],
    border: `1px solid ${theme.colors.dark[5]}`,
    animation: 'fade-up 0.5s ease-out both',
  },
  caps: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 600,
    fontSize: 'clamp(10px, 0.55vw, 12px)',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
  },
  hero: {
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 800,
    fontSize: 'clamp(1.6rem, 2.6vw, 2.5rem)',
    lineHeight: 0.95,
    letterSpacing: '0.04em',
    textTransform: 'uppercase' as const,
    color: theme.white,
    textShadow: '0 2px 12px rgba(0, 0, 0, 0.85)',
  },
  accentDot: {
    width: 6, height: 6,
    borderRadius: '50%',
    background: theme.colors[theme.primaryColor][6],
  },
  accentRule: {
    flex: 1,
    height: 1,
    background: `linear-gradient(90deg, ${theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.7)}, transparent)`,
  },
}))

type Props = {
  character?: Character | null
}

export function IdentityCard({ character }: Props) {
  const { classes } = useStyles()
  const first = (character?.firstName || 'NEW').toUpperCase()
  const last  = (character?.lastName  || 'ARRIVAL').toUpperCase()
  const stateId = character?.stateId ?? '—'

  return (
    <Box className={classes.card}>
      <Group spacing={10} align="center" noWrap>
        <Group spacing={8} align="center" noWrap>
          <Box className={classes.accentDot} />
          <Text className={classes.caps} color="blue.4">Arriving as</Text>
        </Group>
        <Box className={classes.accentRule} />
        <Text className={classes.caps} color="dark.2">{stateId}</Text>
      </Group>

      <Stack spacing={2} mt={12}>
        <Text className={classes.hero}>{first}</Text>
        <Text className={classes.hero}>{last}</Text>
      </Stack>
    </Box>
  )
}
