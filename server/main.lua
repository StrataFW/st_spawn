---@type table<integer, true>
local recentlyCreated = {}

local RECENT_TTL_MS <const> = 60000

---@param source integer
---@param player table
---@param coords vector4|st_spawn.PickResult
local function persistLastKnown(player, coords)
    if not player then return end
    player.set('x',       coords.x, true)
    player.set('y',       coords.y, true)
    player.set('z',       coords.z, true)
    player.set('heading', coords.w or coords.h, true)
end

-- ─── exports ─────────────────────────────────────────────────────────────

exports('requestRespawn', function(source)
    Log.info('st_spawn', 'respawn requested', { src = source })
    Selector.open(source, { isNew = false, respawn = true })
end)

exports('willHandleSpawn', function(character)
    return Selector.shouldShowFor(character or {})
end)

-- ─── ox lifecycle ────────────────────────────────────────────────────────

AddEventHandler('ox:createdCharacter', function(_, _, charId)
    recentlyCreated[charId] = true
    SetTimeout(RECENT_TTL_MS, function() recentlyCreated[charId] = nil end)
end)

AddEventHandler('ox:playerLoaded', function(playerId)
    local player = Ox.GetPlayer(playerId)
    if not player then return end

    if recentlyCreated[player.charId] then
        recentlyCreated[player.charId] = nil
        return
    end

    local character = {
        isNew = false,
        x     = player.get('x'),
        y     = player.get('y'),
        z     = player.get('z'),
    }

    if Selector.shouldShowFor(character) then
        Selector.open(playerId, { isNew = false })
    end
end)

-- ─── callbacks ───────────────────────────────────────────────────────────

lib.callback.register('st_spawn:pick', function(source, spawnId)
    local aptIdStr = type(spawnId) == 'string' and spawnId:match('^apartment:(%d+)$') or nil
    if aptIdStr then
        local aptId = tonumber(aptIdStr)
        if GetResourceState('st_apartments') ~= 'started' then return false end

        local coords = exports.st_apartments:enterFromSpawn(source, aptId)
        if not coords then
            Log.warn('st_spawn', 'apartment spawn rejected', { src = source, aptId = aptId })
            return false
        end

        Log.info('st_spawn', 'spawned at apartment', { src = source, apt = aptId })
        persistLastKnown(Ox.GetPlayer(source), coords)

        return {
            x = coords.x, y = coords.y, z = coords.z, h = coords.h,
            skipCinematic = true,
        }
    end

    local spawn = Selector.spawnById(spawnId)
    if not spawn then
        Log.warn('st_spawn', 'invalid spawn pick', { src = source, requested = spawnId })
        return false
    end

    if spawn.requires and not IsPlayerAceAllowed(source, spawn.requires) then
        Log.warn('st_spawn', 'permission denied', { src = source, spawnId = spawnId, ace = spawn.requires })
        return false
    end

    Log.info('st_spawn', 'spawned', { src = source, at = spawnId })
    persistLastKnown(Ox.GetPlayer(source), spawn.coords)

    return {
        id = spawnId,
        x  = spawn.coords.x,
        y  = spawn.coords.y,
        z  = spawn.coords.z,
        h  = spawn.coords.w,
    }
end)

-- ─── commands ────────────────────────────────────────────────────────────

lib.addCommand('spawnmenu', {
    help       = 'Re-open the spawn selector.',
    restricted = 'group.admin',
}, function(source)
    Selector.open(source)
end)
