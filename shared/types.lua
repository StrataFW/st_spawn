---@meta

---@alias st_spawn.ShowMode 'always'|'manual'|'newOnly'

---@class st_spawn.MapPoint
---@field x number normalised 0..1
---@field y number normalised 0..1

---@class st_spawn.Spawn
---@field id          string
---@field name        string
---@field district?   string
---@field description? string
---@field image?      string
---@field coords      vector4
---@field map         st_spawn.MapPoint
---@field requires?   string

---@class st_spawn.SpawnSummary
---@field id          string
---@field name        string
---@field district?   string
---@field description? string
---@field image?      string
---@field map?        st_spawn.MapPoint

---@class st_spawn.Character
---@field isNew?  boolean
---@field x?      number
---@field y?      number
---@field z?      number
---@field heading? number

---@class st_spawn.IdentityContext
---@field firstName? string
---@field lastName?  string
---@field stateId?   string

---@class st_spawn.PickResult
---@field id?            string
---@field x              number
---@field y              number
---@field z              number
---@field h              number
---@field skipCinematic? boolean

---@class st_spawn.OpenPayload
---@field brand            table
---@field mapImage         string
---@field mapAspectRatio   number
---@field cinematicCamera  boolean
---@field spawns           st_spawn.SpawnSummary[]
---@field isNew            boolean
---@field character        st_spawn.IdentityContext?
