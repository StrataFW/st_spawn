export type Spawn = {
  id: string
  name: string
  district: string
  description: string
  image?: string
  map: { x: number; y: number }
}

export type Brand = {
  title: string
  subtitle: string
  accent: string
  version?: string
}

export type Character = {
  firstName?: string
  lastName?: string
  stateId?: string
}

export type ShowPayload = {
  brand: Brand
  mapImage: string
  mapAspectRatio: number
  cinematicCamera: boolean
  spawns: Spawn[]
  character?: Character | null
}
