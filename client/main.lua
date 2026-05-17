local SELF <const> = GetCurrentResourceName()
local STASIS <const> = vec3(7000.0, 7000.0, 800.0)

local active = false
local newCharFlag = false

-- ─── nui ─────────────────────────────────────────────────────────────────

---@param payload st_spawn.OpenPayload
local function showNui(payload)
    SetNuiFocus(true, true)
    SendNUIMessage({ type = 'show', payload = payload })
end

local function hideNui()
    SetNuiFocus(false, false)
    SendNUIMessage({ type = 'hide' })
end

-- ─── stasis (parked off-map while the selector is open) ──────────────────

local function enterStasis()
    local ped = cache.ped
    NetworkResurrectLocalPlayer(STASIS.x, STASIS.y, STASIS.z, 0.0, true, false)
    SetEntityHealth(ped, GetEntityMaxHealth(ped))
    ClearPedBloodDamage(ped)
    ClearPedTasksImmediately(ped)
    LocalPlayer.state:set('isDead', false, true)
    SetEntityCoordsNoOffset(ped, STASIS.x, STASIS.y, STASIS.z, false, false, false)
    FreezeEntityPosition(ped, true)
    SetEntityVisible(ped, false, false)
    SetPlayerInvincible(cache.playerId, true)
    DisableIdleCamera(true)
end

local function exitStasis()
    local ped = cache.ped
    FreezeEntityPosition(ped, false)
    SetEntityVisible(ped, true, false)
    SetPlayerInvincible(cache.playerId, false)
    DisableIdleCamera(false)
end

-- ─── spawn flow ──────────────────────────────────────────────────────────

---@param id string
---@return st_spawn.Spawn|nil
local function spawnById(id)
    for i = 1, #Config.Spawns do
        if Config.Spawns[i].id == id then return Config.Spawns[i] end
    end
end

---@param coords st_spawn.PickResult
local function spawnAt(coords)
    local target = vec4(coords.x, coords.y, coords.z, coords.h or 0)
    local skipCinematic = coords.skipCinematic == true

    Camera.fadeOut(500)
    hideNui()
    active = false
    Camera.stop()

    RequestCollisionAtCoord(target.x, target.y, target.z)
    NewLoadSceneStart(target.x, target.y, target.z, 0.0, 0.0, 0.0, 50.0, 0)
    lib.waitFor(function()
        return (not IsNewLoadSceneActive() or IsNewLoadSceneLoaded()) and true or nil
    end, nil, 3000)
    NewLoadSceneStop()

    local ped = cache.ped
    NetworkResurrectLocalPlayer(target.x, target.y, target.z, target.w, true, false)
    SetEntityHealth(ped, GetEntityMaxHealth(ped))
    ClearPedBloodDamage(ped)
    ClearPedTasksImmediately(ped)
    SetEntityCoordsNoOffset(ped, target.x, target.y, target.z, false, false, false)
    SetEntityHeading(ped, target.w)
    LocalPlayer.state:set('isDead', false, true)
    TriggerEvent('ox:playerRevived')
    exitStasis()

    lib.waitFor(function() return HasCollisionLoadedAroundEntity(ped) or nil end, nil, 1500)

    if not skipCinematic and not newCharFlag then
        Intro.play(target)
    else
        DoScreenFadeIn(Config.FadeInMs)
    end

    if newCharFlag then
        newCharFlag = false
        SetTimeout(Config.FadeInMs + 500, function()
            pcall(function() exports.st_appearance:open({ pedMenu = true }) end)
        end)
    end
end

-- ─── events ──────────────────────────────────────────────────────────────

RegisterNetEvent('st_spawn:open', function(payload)
    if active then return end
    active = true
    newCharFlag = payload and payload.isNew == true

    DoScreenFadeOut(0)
    enterStasis()
    if Config.CinematicCamera then Camera.start() end
    showNui(payload)

    SetTimeout(80, function() DoScreenFadeIn(450) end)
end)

-- ─── nui callbacks ───────────────────────────────────────────────────────

RegisterNUICallback('focus', function(data, cb)
    if data and data.id and Config.CinematicCamera then
        local s = spawnById(data.id)
        if s then Camera.focus(s.coords) end
    end
    cb({ ok = true })
end)

RegisterNUICallback('overview', function(_, cb)
    if Config.CinematicCamera then Camera.overview() end
    cb({ ok = true })
end)

RegisterNUICallback('confirm', function(data, cb)
    if not data or not data.id then return cb({ ok = false }) end

    local coords = lib.callback.await('st_spawn:pick', false, data.id)
    if not coords then return cb({ ok = false, error = 'invalid pick' }) end

    cb({ ok = true })
    CreateThread(function() spawnAt(coords) end)
end)

RegisterNUICallback('exit', function(_, cb) cb({ ok = true }) end)

-- ─── teardown ────────────────────────────────────────────────────────────

AddEventHandler('onResourceStop', function(name)
    if name ~= SELF or not active then return end
    SetNuiFocus(false, false)
    Camera.stop()
    exitStasis()
    DoScreenFadeIn(0)
end)

-- ─── exports ─────────────────────────────────────────────────────────────

---@param character st_spawn.Character?
---@return boolean
exports('willHandleSpawn', function(character)
    if not character then return false end
    if Config.ShowMode == 'always'  then return true end
    if Config.ShowMode == 'manual'  then return false end
    if Config.ShowMode == 'newOnly' then
        return character.isNew == true or character.x == nil
    end
    return false
end)
