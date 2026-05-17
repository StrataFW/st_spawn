---@class st_spawn.Selector
Selector = {}

---@type table<string, st_spawn.Spawn>
local byId = {}
for i = 1, #Config.Spawns do
    byId[Config.Spawns[i].id] = Config.Spawns[i]
end

---@param spawn st_spawn.Spawn
---@return st_spawn.SpawnSummary
local function toSummary(spawn)
    return {
        id          = spawn.id,
        name        = spawn.name,
        district    = spawn.district,
        description = spawn.description,
        image       = spawn.image,
        map         = spawn.map,
    }
end

---@param id string
---@return st_spawn.Spawn|nil
function Selector.spawnById(id)
    return byId[id]
end

---@param source integer
---@return st_spawn.SpawnSummary[]
function Selector.allowedFor(source)
    local out = {}

    if GetResourceState('st_apartments') == 'started' then
        local ok, entry = pcall(function() return exports.st_apartments:getSpawnEntry(source) end)
        if ok and entry then
            out[#out + 1] = {
                id          = entry.id,
                name        = entry.name,
                district    = entry.district,
                description = entry.description,
                image       = entry.image,
                map         = entry.map,
            }
        end
    end

    for i = 1, #Config.Spawns do
        local s = Config.Spawns[i]
        if not s.requires or IsPlayerAceAllowed(source, s.requires) then
            out[#out + 1] = toSummary(s)
        end
    end

    return out
end

---@param character st_spawn.Character
---@return boolean
function Selector.shouldShowFor(character)
    if Config.ShowMode == 'always'  then return true end
    if Config.ShowMode == 'manual'  then return false end
    if Config.ShowMode == 'newOnly' then
        return character.isNew == true or character.x == nil
    end
    return false
end

---@param source integer
---@param opts? { isNew?: boolean, respawn?: boolean }
---@return st_spawn.OpenPayload
function Selector.buildPayload(source, opts)
    return {
        brand           = Config.Brand,
        mapImage        = Config.MapImage,
        mapAspectRatio  = Config.MapAspectRatio,
        cinematicCamera = Config.CinematicCamera,
        spawns          = Selector.allowedFor(source),
        isNew           = opts and opts.isNew or false,
        character       = Identity.contextFor(source),
    }
end

---@param source integer
---@param opts? { isNew?: boolean, respawn?: boolean }
function Selector.open(source, opts)
    TriggerClientEvent('st_spawn:open', source, Selector.buildPayload(source, opts))
end
