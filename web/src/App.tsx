import { Box, createStyles } from '@mantine/core'
import { useCallback, useEffect, useState } from 'react'
import { Background } from './components/Background'
import { Header } from './components/Header'
import { Map } from './components/Map'
import type { ShowPayload } from './types'
import { nui } from './nui-kit/nui'

const useStyles = createStyles(() => ({
  root: {
    position: 'relative',
    height: '100dvh',
    minHeight: '100vh',
    width: '100vw',
    overflow: 'hidden',
    animation: 'fade-in 0.32s ease-out both',
  },
}))

const MOCK: ShowPayload = {
  brand: { title: 'STRATA', subtitle: 'CHOOSE YOUR ARRIVAL', accent: '#228BE6', version: 'v1.0.0' },
  mapImage: './assets/map.jpg',
  mapAspectRatio: 1.494,
  cinematicCamera: true,
  character: { firstName: 'Carl', lastName: 'Vance', stateId: 'AB1234' },
  spawns: [
    { id: 'paleto',      name: 'Paleto Bay',               district: 'Blaine County',         description: 'A coastal town in the far north.',                       image: './assets/spawn-paleto.jpg',      map: { x: 0.179, y: 0.541 } },
    { id: 'sandy',       name: 'Sandy Shores',             district: 'Blaine County',         description: 'Desert flats, trailer parks, and a long horizon.',       image: './assets/spawn-sandy.png',       map: { x: 0.363, y: 0.333 } },
    { id: 'vinewood',    name: 'Vinewood Hills',           district: 'Los Santos',            description: 'Hilltop neighborhood with sweeping views of the city.',  image: './assets/spawn-vinewood.jpg',    map: { x: 0.606, y: 0.583 } },
    { id: 'mission_row', name: 'Mission Row',              district: 'Los Santos · Downtown', description: 'The Mission Row precinct. Central, walkable.',           image: './assets/spawn-mission-row.jpeg', map: { x: 0.691, y: 0.481 } },
    { id: 'grove',       name: 'Grove Street',             district: 'Los Santos · Davis',    description: 'South-central. Real, lived-in.',                          image: './assets/spawn-grove.jpeg',      map: { x: 0.751, y: 0.524 } },
    { id: 'lsia',        name: 'Los Santos International', district: 'Los Santos · LSIA',     description: 'The international terminal.',                             image: './assets/spawn-lsia.jpeg',       map: { x: 0.822, y: 0.665 } },
  ],
}

export default function App() {
  const { classes } = useStyles()
  const [visible, setVisible] = useState(false)
  const [data, setData] = useState<ShowPayload>(MOCK)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const inGame = typeof (window as unknown as { invokeNative?: unknown }).invokeNative !== 'undefined'
    if (!inGame) setVisible(true)
  }, [])

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const msg = e?.data
      if (!msg || typeof msg !== 'object') return
      if (msg.type === 'show') {
        setData(msg.payload as ShowPayload)
        setActiveId(null)
        setBusy(false)
        setVisible(true)
      } else if (msg.type === 'hide') {
        setVisible(false)
        setBusy(false)
      }
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [])

  useEffect(() => {
    const sources: string[] = []
    if (data.mapImage) sources.push(data.mapImage)
    for (const s of data.spawns) if (s.image) sources.push(s.image)

    const links: HTMLLinkElement[] = []
    for (const src of sources) {
      const link = document.createElement('link')
      link.rel  = 'preload'
      link.as   = 'image'
      link.href = src
      document.head.appendChild(link)
      links.push(link)

      const img = new Image()
      img.src   = src
      ;(img as HTMLImageElement & { decoding?: string }).decoding = 'async'
      if (typeof img.decode === 'function') img.decode().catch(() => {})
    }

    return () => {
      for (const link of links) {
        if (link.parentNode) link.parentNode.removeChild(link)
      }
    }
  }, [data.mapImage, data.spawns])

  const handleSelect = useCallback((id: string) => {
    if (id === activeId) return
    setActiveId(id)
    nui('focus', { id })
  }, [activeId])

  const handleConfirm = useCallback(async (idOverride?: string) => {
    const id = idOverride ?? activeId
    if (!id || busy) return
    if (id !== activeId) setActiveId(id)
    setBusy(true)
    const res = await nui<{ ok: boolean }>('confirm', { id })
    if (!res.ok) setBusy(false)
  }, [activeId, busy])

  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return

      if (e.key === 'Enter' && activeId && !busy) {
        e.preventDefault()
        handleConfirm()
        return
      }

      const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1
                : e.key === 'ArrowLeft'  || e.key === 'ArrowUp'   ? -1
                : 0
      if (dir === 0) return
      e.preventDefault()
      const idx = data.spawns.findIndex((s) => s.id === activeId)
      const next = idx === -1 ? 0 : (idx + dir + data.spawns.length) % data.spawns.length
      handleSelect(data.spawns[next].id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [visible, activeId, busy, data.spawns, handleConfirm, handleSelect])

  if (!visible) return null

  return (
    <Box key={String(visible)} className={classes.root}>
      <Background />
      <Header brand={data.brand} />

      <Map
        imageUrl={data.mapImage}
        aspectRatio={data.mapAspectRatio}
        spawns={data.spawns}
        activeId={activeId}
        busy={busy}
        onSelect={handleSelect}
        onConfirm={(id) => handleConfirm(id)}
      />
    </Box>
  )
}
