import { Box, createStyles } from '@mantine/core'
import { useRef, useState } from 'react'
import type { Spawn } from '../types'
import { MarkerPin } from './MarkerPin'

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'absolute',
    top: 'clamp(48px, 3.5vw, 64px)',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vignette: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.92) 100%)',
  },
  stage: {
    position: 'relative',
    maxHeight: '100%',
    maxWidth: '100%',
    width: '100%',
  },
  mapImg: {
    position: 'absolute',
    inset: 0,
    height: '100%',
    width: '100%',
    pointerEvents: 'none',
  },
  cursorReadout: {
    position: 'absolute',
    zIndex: 30,
    pointerEvents: 'none',
    padding: '6px 12px',
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.dark[5]}`,
    background: theme.fn.rgba(theme.colors.dark[9], 0.85),
    color: theme.colors.dark[0],
    fontFamily: 'Montserrat, sans-serif',
    fontSize: 'clamp(10px, 0.55vw, 12px)',
    letterSpacing: '0.04em',
  },
}))

type Props = {
  imageUrl: string
  aspectRatio: number
  spawns: Spawn[]
  activeId: string | null
  busy: boolean
  onSelect: (id: string) => void
  onConfirm: (id: string) => void
}

const DEV_READOUT = import.meta.env.DEV

export function Map({ imageUrl, aspectRatio, spawns, activeId, busy, onSelect, onConfirm }: Props) {
  const { classes, theme } = useStyles()
  const stageRef = useRef<HTMLDivElement>(null)
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)

  const onMouseMove = DEV_READOUT
    ? (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = stageRef.current?.getBoundingClientRect()
        if (!rect) return
        setCursor({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        })
      }
    : undefined

  const onMouseLeave = DEV_READOUT ? () => setCursor(null) : undefined

  const onClick = DEV_READOUT
    ? (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = stageRef.current?.getBoundingClientRect()
        if (!rect) return
        const x = ((e.clientX - rect.left) / rect.width).toFixed(3)
        const y = ((e.clientY - rect.top) / rect.height).toFixed(3)
        const snippet = `map = { x = ${x}, y = ${y} },`
        navigator.clipboard?.writeText(snippet).catch(() => {})
        console.log('[map] copied:', snippet)
      }
    : undefined

  return (
    <Box className={classes.wrapper}>
      <Box aria-hidden className={classes.vignette} />

      <Box
        ref={stageRef}
        className={classes.stage}
        sx={{ aspectRatio: String(aspectRatio) }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      >
        <Box component="img" src={imageUrl} alt="" draggable={false} className={classes.mapImg} />

        {DEV_READOUT && cursor && (
          <Box
            className={classes.cursorReadout}
            sx={{
              left: `${cursor.x * 100}%`,
              top:  `${cursor.y * 100}%`,
              transform: 'translate(12px, 12px)',
            }}
          >
            <Box component="span" sx={{ color: theme.colors.blue[4] }}>x</Box> {cursor.x.toFixed(3)}
            {'  '}
            <Box component="span" sx={{ color: theme.colors.blue[4] }}>y</Box> {cursor.y.toFixed(3)}
            <Box component="span" ml={8} sx={{ opacity: 0.5 }}>click → copy</Box>
          </Box>
        )}

        {spawns.map((s, i) => (
          <MarkerPin
            key={s.id}
            spawn={s}
            index={i}
            total={spawns.length}
            active={s.id === activeId}
            busy={busy && s.id === activeId}
            onSelect={() => onSelect(s.id)}
            onConfirm={() => onConfirm(s.id)}
          />
        ))}
      </Box>
    </Box>
  )
}
