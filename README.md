# st_spawn

Cinematic spawn-location selector for ox_core. Opens after character
pick (or on every load, per config) to let the player choose where to
arrive in the world.

**What you get:**

- Full-screen NUI with a top-down map, marker pins, and per-spawn
  district / image / description cards
- Scripted camera state machine — high overview → focus dive into the
  picked location with smooth interp transitions, prewarm streaming
  while the player browses
- Identity card (firstName / lastName / stateId) pulled from ox_core
- First-party apartment integration — `st_apartments` slots its
  player-owned spawn at the top of the list automatically
- ACE-gated spawns (`requires = 'group.admin'` etc.)
- GTAO beach-heist wake-up scene as the default arrival intro (skipped
  for apartment spawns and respawns to keep them snappy)
- Auto-open `st_appearance` after a new-character spawn finishes
- `/spawnmenu` admin command + `exports.st_spawn:requestRespawn(src)`
  to reopen mid-session
- Three trigger modes: `always`, `newOnly`, `manual`

## Setup

1. Drop the resource into `resources/[strata]/st_spawn/`.
2. Build the UI (see below).
3. In `server.cfg`:
   ```
   ensure st_spawn
   ```
   Order it after `ox_core` and `st_apartments` (if you use it).

## Build the UI

```sh
cd web
bun install
bun run dev    # http://localhost:5503 — browser preview with mock data
bun run build  # → ./dist  (committed assets served by FiveM)
```

The browser preview uses `DEV_MOCK` data from `web/src/main.tsx` so you
can iterate on layout without launching the game.

## Configuration

All runtime config lives in `shared/config.lua`. Highlights:

| Field               | Purpose                                                                |
|---------------------|------------------------------------------------------------------------|
| `Brand`             | Title / subtitle / accent / version shown across the top of the UI.    |
| `MapImage`          | Path relative to `web/dist`, or a full `https://` URL.                 |
| `MapAspectRatio`    | Width / height of the map image (pins are placed by percent).          |
| `ShowMode`          | `always` / `newOnly` / `manual` — when the selector opens automatically.|
| `CinematicCamera`   | Scripted overview→focus camera. `false` disables in favour of a flat map.|
| `FadeInMs`          | Post-spawn fade-in duration when the cinematic intro is skipped.       |
| `Spawns[]`          | Each entry: `id`, `name`, `district`, `description`, `image`, `coords`, `map`, optional `requires` (ACE permission). |

## How it integrates with ox_core

- `ox:playerLoaded` → checks `Config.ShowMode` + saved coords; opens the
  selector if appropriate.
- `ox:createdCharacter` → short-circuits the next `playerLoaded` so new
  characters get the selector once instead of twice.
- `exports.st_spawn:requestRespawn(src)` → reopen mid-session.
- `exports.st_spawn:willHandleSpawn(character)` → `st_multichar` calls
  this during character pick to decide whether to hand off to st_spawn
  or use its own teleport.
- `st_apartments:getSpawnEntry(src)` + `:enterFromSpawn(src, aptId)`
  power the apartment row at the top of the list.

## Layout

```
st_spawn/
├── fxmanifest.lua
├── shared/
│   ├── types.lua          ---@meta type aliases (Spawn, Character, …)
│   └── config.lua         brand, map, spawn list, behaviour flags
├── client/
│   ├── camera.lua         Camera.* — overview / focus / dive / fade
│   ├── intro.lua          Intro.*  — GTAO beach-heist wake-up scene
│   └── main.lua           entry — NUI bindings, fade/stream pipeline, lifecycle
├── server/
│   ├── db.lua             DB.*       — character identity lookup
│   ├── identity.lua       Identity.* — "you are" context builder
│   ├── selector.lua       Selector.* — allowed list, payload, open
│   └── main.lua           entry — exports, callbacks, ox lifecycle, /spawnmenu
└── web/
    ├── src/               React + Mantine UI source
    ├── dist/              built bundle (Vite output)
    ├── package.json
    └── vite.config.ts
```

Uses ox_lib helpers throughout — `lib.requestAnimDict`, `lib.waitFor`,
`cache.ped`, `cache.playerId`.

## Dependencies

- `ox_core` — character system
- `ox_lib` — callbacks, commands, cache, request helpers
- `oxmysql` — direct DB read for the identity context card
- `st_log` — structured logging
- `st_apartments` *(optional)* — surfaces the player's apartment as the
  first row in the selector via its `getSpawnEntry` / `enterFromSpawn`
  exports
- `st_appearance` *(optional)* — auto-opened after a new-character spawn
- `st_ui` *(optional)* — `toggleHud(false/true)` during the intro scene
