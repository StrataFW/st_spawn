import { Box, Button, Text, createStyles } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'
import type { Spawn } from '../types'

const NOISE_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>" +
  "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/></filter>" +
  "<rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")"

const useStyles = createStyles((theme) => ({
  pin: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    cursor: 'pointer',
    animation: 'fade-up 0.5s ease-out both',
  },
  pinInner: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dot: {
    position: 'relative',
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: theme.colors[theme.primaryColor][6],
    boxShadow: `0 0 0 3px rgba(0,0,0,0.65), 0 0 16px 4px ${theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.55)}`,
    transition: 'transform 200ms ease, box-shadow 200ms ease',
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: -22,
      borderRadius: '50%',
    },
  },
  dotActive: {
    transform: 'scale(1.3)',
    boxShadow: `0 0 0 4px rgba(0,0,0,0.8), 0 0 28px 10px ${theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.6)}`,
  },
  ring: {
    position: 'absolute',
    inset: -10,
    borderRadius: '50%',
    border: `1px solid ${theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.4)}`,
    transition: 'opacity 200ms ease',
    pointerEvents: 'none',
  },
  ringActive: {
    inset: -18,
    borderWidth: 2,
    borderColor: theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.85),
    animation: 'ringPulse 2s ease-in-out infinite',
  },
  ringOuter: {
    inset: -28,
    opacity: 0,
    animation: 'ringExpand 2.4s ease-out infinite',
  },

  card: {
    position: 'absolute',
    zIndex: 30,
    width: 'min(300px, 70vw)',
    overflow: 'hidden',
    borderRadius: theme.radius.md,
    background: theme.colors.dark[8],
    border: `1px solid ${theme.colors.dark[5]}`,
    boxShadow: '0 18px 45px rgba(0, 0, 0, 0.5)',
    opacity: 0,
    pointerEvents: 'none',
    willChange: 'opacity, transform',
    transition: 'opacity 280ms ease-out, transform 280ms ease-out',
  },
  cardOpen: {
    opacity: 1,
    pointerEvents: 'auto',
  },
  cardSide: { transform: 'translateY(calc(-50% + 8px))' },
  cardSideOpen: { transform: 'translateY(-50%)' },
  cardAbove: { transform: 'translateY(8px)' },
  cardAboveOpen: { transform: 'translateY(0)' },

  cardAccentRule: {
    position: 'absolute',
    left: 0, right: 0, top: 0,
    zIndex: 10,
    height: 1,
    background: `linear-gradient(90deg, transparent, ${theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.85)}, transparent)`,
  },
  hero: {
    position: 'relative',
    height: 140,
    width: '100%',
    overflow: 'hidden',
  },
  heroFallback: {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(135deg, ${theme.colors.dark[7]}, ${theme.colors.dark[8]} 60%, ${theme.colors.dark[9]})`,
  },
  heroNoise: {
    position: 'absolute',
    inset: 0,
    opacity: 0.08,
    mixBlendMode: 'overlay',
    backgroundImage: NOISE_SVG,
  },
  heroFade: {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(180deg, ${theme.fn.rgba(theme.colors.dark[9], 0.85)} 0%, ${theme.fn.rgba(theme.colors.dark[9], 0.30)} 30%, transparent 55%, ${theme.colors.dark[8]} 100%)`,
  },
  heroImg: {
    position: 'absolute',
    inset: 0,
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    animation: 'fade-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) both',
  },

  heroMeta: {
    position: 'absolute',
    left: 14, right: 14, top: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 700,
    fontSize: 'clamp(9px, 0.5vw, 11px)',
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: theme.white,
    textShadow: '0 1px 4px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.85), 0 0 1px rgba(0,0,0,0.9)',
    opacity: 0,
    transform: 'translateY(-4px)',
    transition: 'opacity 300ms ease-out 0ms, transform 300ms ease-out 0ms',
  },
  heroMetaOpen: {
    opacity: 1,
    transform: 'translateY(0)',
    transitionDelay: '120ms',
  },
  heroTitle: {
    position: 'absolute',
    left: 14, right: 14, bottom: 10,
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 800,
    fontSize: 'clamp(15px, 1vw, 18px)',
    lineHeight: 1.05,
    letterSpacing: '0.10em',
    textTransform: 'uppercase' as const,
    color: theme.white,
    textShadow: '0 2px 6px rgba(0,0,0,0.95), 0 0 18px rgba(0,0,0,0.85), 0 0 1px rgba(0,0,0,0.95)',
    opacity: 0,
    transform: 'translateY(6px)',
    transition: 'opacity 320ms ease-out 0ms, transform 320ms ease-out 0ms',
  },
  heroTitleOpen: {
    opacity: 1,
    transform: 'translateY(0)',
    transitionDelay: '180ms',
  },
  body: {
    padding: '14px 16px 16px',
  },
  description: {
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 'clamp(11px, 0.72vw, 13px)',
    lineHeight: 1.55,
    color: theme.colors.dark[1],
    opacity: 0,
    transform: 'translateY(4px)',
    transition: 'opacity 300ms ease-out 0ms, transform 300ms ease-out 0ms',
  },
  descriptionOpen: {
    opacity: 1,
    transform: 'translateY(0)',
    transitionDelay: '220ms',
  },
  divider: {
    marginTop: 14,
    height: 1,
    background: `linear-gradient(90deg, transparent, ${theme.colors.dark[5]}, transparent)`,
    opacity: 0,
    transition: 'opacity 500ms ease-out 0ms',
  },
  dividerOpen: {
    opacity: 1,
    transitionDelay: '340ms',
  },
  goBtnWrapper: {
    position: 'relative',
    marginTop: 14,
    opacity: 0,
    transform: 'translateY(4px)',
    transition: 'opacity 300ms ease-out 0ms, transform 300ms ease-out 0ms',
  },
  goBtnWrapperOpen: {
    opacity: 1,
    transform: 'translateY(0)',
    transitionDelay: '380ms',
  },
  goProgress: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 0,
    background: theme.colors[theme.primaryColor][6],
    animation: 'progress-fill 2000ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
    pointerEvents: 'none',
    borderRadius: theme.radius.sm,
  },
  goButton: {
    position: 'relative',
    zIndex: 1,
    letterSpacing: '0.22em',
  },
}))

type Props = {
  spawn: Spawn
  active: boolean
  busy?: boolean
  index: number
  total: number
  onSelect: () => void
  onConfirm: () => void
}

export function MarkerPin({ spawn, active, busy, index, total, onSelect, onConfirm }: Props) {
  const { classes, cx } = useStyles()

  const flipH = spawn.map.x > 0.55
  const flipV = spawn.map.y > 0.65

  const [hovered, setHovered] = useState(false)
  const hideTimer = useRef<number | null>(null)

  const open = () => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current)
      hideTimer.current = null
    }
    if (!hovered) setHovered(true)
  }

  const scheduleClose = () => {
    if (busy) return
    if (hideTimer.current) window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => setHovered(false), 80)
  }

  useEffect(() => {
    if (busy) {
      if (hideTimer.current) {
        window.clearTimeout(hideTimer.current)
        hideTimer.current = null
      }
      setHovered(true)
    }
  }, [busy])

  const idxLabel = String(index + 1).padStart(2, '0')
  const totalLabel = String(total).padStart(2, '0')

  return (
    <Box
      onClick={onSelect}
      onDoubleClick={onConfirm}
      onMouseEnter={() => { open(); onSelect() }}
      onMouseLeave={scheduleClose}
      role="button"
      tabIndex={-1}
      className={classes.pin}
      sx={{
        left:  `${spawn.map.x * 100}%`,
        top:   `${spawn.map.y * 100}%`,
        animationDelay: `${index * 60}ms`,
      }}
    >
      <Box className={classes.pinInner}>
        <Box className={cx(classes.dot, active && classes.dotActive)} />
        <Box className={classes.ring} />
        {active && (
          <>
            <Box className={cx(classes.ring, classes.ringActive)} />
            <Box className={cx(classes.ring, classes.ringOuter)} />
          </>
        )}

        <Box
          onMouseEnter={open}
          onMouseLeave={scheduleClose}
          className={cx(
            classes.card,
            hovered && classes.cardOpen,
            flipV ? classes.cardAbove : classes.cardSide,
            hovered && (flipV ? classes.cardAboveOpen : classes.cardSideOpen),
          )}
          sx={{
            left:  flipH ? 'auto' : 'calc(100% + 22px)',
            right: flipH ? 'calc(100% + 22px)' : 'auto',
            top:    flipV ? 'auto' : '50%',
            bottom: flipV ? '50%'  : 'auto',
          }}
        >
          <Box aria-hidden className={classes.cardAccentRule} />

          <Box className={classes.hero}>
            <Box className={classes.heroFallback} />

            {spawn.image && (
              <Box
                component="img"
                src={spawn.image}
                alt=""
                loading="eager"
                decoding="async"
                className={classes.heroImg}
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                }}
              />
            )}

            <Box aria-hidden className={classes.heroNoise} />
            <Box className={classes.heroFade} />

            <Box className={cx(classes.heroMeta, hovered && classes.heroMetaOpen)}>
              <Text component="span" sx={{ fontSize: 'inherit', letterSpacing: 'inherit' }}>
                {spawn.district}
              </Text>
              <Text component="span" sx={{ color: '#C1C2C5', fontSize: 'inherit' }}>
                {idxLabel}
                <Text component="span" sx={{ opacity: 0.6 }}> / {totalLabel}</Text>
              </Text>
            </Box>

            <Box className={cx(classes.heroTitle, hovered && classes.heroTitleOpen)}>
              {spawn.name}
            </Box>
          </Box>

          <Box className={classes.body}>
            <Text className={cx(classes.description, hovered && classes.descriptionOpen)}>
              {spawn.description}
            </Text>

            <Box className={cx(classes.divider, hovered && classes.dividerOpen)} />

            <Box className={cx(classes.goBtnWrapper, hovered && classes.goBtnWrapperOpen)}>
              {busy && <Box aria-hidden className={classes.goProgress} />}
              <Button
                onClick={(e) => { e.stopPropagation(); onConfirm() }}
                disabled={busy}
                fullWidth
                variant={busy ? 'subtle' : 'light'}
                color="blue"
                radius="sm"
                size="md"
                rightIcon={!busy && <Text sx={{ fontWeight: 700 }}>→</Text>}
                className={classes.goButton}
              >
                {busy ? 'Loading' : 'Go'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
