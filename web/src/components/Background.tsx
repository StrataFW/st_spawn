import { Box, createStyles } from '@mantine/core'
import { memo } from 'react'

const useStyles = createStyles((theme) => ({
  root: { position: 'absolute', inset: 0, zIndex: -10, pointerEvents: 'none' },
  wash: {
    position: 'absolute',
    inset: 0,
    background: `
      radial-gradient(70% 70% at 50% 50%, ${theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.10)}, transparent 70%),
      linear-gradient(180deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.78) 100%)
    `,
  },
  grid: {
    position: 'absolute',
    inset: 0,
    opacity: 0.05,
    backgroundImage:
      `linear-gradient(to right, ${theme.colors.dark[3]} 1px, transparent 1px),` +
      `linear-gradient(to bottom, ${theme.colors.dark[3]} 1px, transparent 1px)`,
    backgroundSize: '64px 64px',
    maskImage: 'radial-gradient(ellipse 55% 60% at 50% 50%, transparent 30%, black 90%)',
    WebkitMaskImage: 'radial-gradient(ellipse 55% 60% at 50% 50%, transparent 30%, black 90%)',
  },
  topFade: {
    position: 'absolute',
    top: 0, left: 0, right: 0, height: 48,
    background: 'linear-gradient(180deg, rgba(0,0,0,0.85), transparent)',
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0, height: 64,
    background: 'linear-gradient(0deg, rgba(0,0,0,0.85), transparent)',
  },
  vignette: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(120% 90% at 50% 50%, transparent 60%, rgba(0,0,0,0.55) 100%)',
  },
  scanlines: {
    position: 'absolute',
    inset: 0,
    opacity: 0.05,
    mixBlendMode: 'overlay',
    backgroundImage:
      'repeating-linear-gradient(0deg, rgba(255,255,255,0.7) 0px, rgba(255,255,255,0.7) 1px, transparent 1px, transparent 3px)',
  },
  drift: {
    position: 'absolute',
    top: '-25%',
    left: '50%',
    transform: 'translateX(-50%)',
    height: '120%',
    width: '60%',
    opacity: 0.5,
    mixBlendMode: 'screen',
    background: `radial-gradient(40% 30% at 50% 50%, ${theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.18)}, transparent 70%)`,
    animation: 'light-drift 22s ease-in-out infinite',
  },
}))

export const Background = memo(function Background() {
  const { classes } = useStyles()
  return (
    <Box className={classes.root} aria-hidden>
      <Box className={classes.wash} />
      <Box className={classes.grid} />
      <Box className={classes.topFade} />
      <Box className={classes.bottomFade} />
      <Box className={classes.vignette} />
      <Box className={classes.scanlines} />
      <Box className={classes.drift} />
    </Box>
  )
})
