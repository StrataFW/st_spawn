---@class st_spawn.Camera
Camera = {}

local OVERVIEW <const> = {
    x = 100.0, y = -1000.0, z = 1500.0,
    pitch = -75.0, yaw = 0.0, fov = 50.0,
}

local PREWARM_STRIDE_MS <const> = 600
local STOP_FADE_MS      <const> = 1000

local cam
local mode = 'overview'
local prewarmToken = nil

local function destroy()
    if cam then DestroyCam(cam, false); cam = nil end
end

---@param cx number
---@param cy number
---@param tx number
---@param ty number
---@return number degrees
local function yawTo(cx, cy, tx, ty)
    return math.deg(math.atan(-(tx - cx), ty - cy)) % 360.0
end

---@param newCam integer
---@param durationMs integer
local function swapCam(newCam, durationMs)
    SetCamActiveWithInterp(newCam, true, durationMs, true, true)
    local oldCam = cam
    cam = newCam
    SetTimeout(durationMs + 100, function()
        if oldCam and oldCam ~= cam then DestroyCam(oldCam, false) end
    end)
end

function Camera.start()
    destroy()
    cam = CreateCamWithParams(
        'DEFAULT_SCRIPTED_CAMERA',
        OVERVIEW.x, OVERVIEW.y, OVERVIEW.z,
        OVERVIEW.pitch, 0.0, OVERVIEW.yaw,
        OVERVIEW.fov, false, 0
    )
    SetCamActiveWithInterp(cam, true, 600, true, true)
    RenderScriptCams(true, false, 600, true, true)
    DisplayRadar(false)
    mode = 'overview'

    Camera.prewarm()
end

function Camera.prewarm()
    if not Config or not Config.Spawns then return end

    local token = {}
    prewarmToken = token

    CreateThread(function()
        for i = 1, #Config.Spawns do
            if prewarmToken ~= token then return end
            local c = Config.Spawns[i].coords
            SetFocusPosAndVel(c.x, c.y, c.z, 0.0, 0.0, 0.0)
            RequestCollisionAtCoord(c.x, c.y, c.z)
            Wait(PREWARM_STRIDE_MS)
        end
        if prewarmToken == token then
            ClearFocus()
            prewarmToken = nil
        end
    end)
end

---@param coords vector4
function Camera.focus(coords)
    if not cam then return end

    prewarmToken = nil
    SetFocusPosAndVel(coords.x, coords.y, coords.z, 0.0, 0.0, 0.0)
    RequestCollisionAtCoord(coords.x, coords.y, coords.z)

    local hRad = math.rad(coords.w or 0)
    local cx = coords.x + math.sin(hRad) * 80.0
    local cy = coords.y - math.cos(hRad) * 80.0
    local cz = coords.z + 60.0

    local newCam = CreateCamWithParams(
        'DEFAULT_SCRIPTED_CAMERA',
        cx, cy, cz,
        -35.0, 0.0, yawTo(cx, cy, coords.x, coords.y),
        45.0, false, 0
    )
    swapCam(newCam, 1200)
    mode = 'focus'
end

function Camera.overview()
    if mode == 'overview' or not cam then return end

    local newCam = CreateCamWithParams(
        'DEFAULT_SCRIPTED_CAMERA',
        OVERVIEW.x, OVERVIEW.y, OVERVIEW.z,
        OVERVIEW.pitch, 0.0, OVERVIEW.yaw,
        OVERVIEW.fov, false, 0
    )
    swapCam(newCam, 1500)
    mode = 'overview'
end

---@param coords vector4
---@param durationMs integer?
function Camera.dive(coords, durationMs)
    durationMs = durationMs or 1500
    if not cam then return end

    local hRad = math.rad(coords.w or 0)
    local cx = coords.x + math.sin(hRad) * 6.0
    local cy = coords.y - math.cos(hRad) * 6.0
    local cz = coords.z + 3.0

    local newCam = CreateCamWithParams(
        'DEFAULT_SCRIPTED_CAMERA',
        cx, cy, cz,
        -10.0, 0.0, yawTo(cx, cy, coords.x, coords.y),
        50.0, false, 0
    )
    swapCam(newCam, durationMs)
    mode = 'dive'
end

function Camera.stop()
    destroy()
    RenderScriptCams(false, true, STOP_FADE_MS, true, true)
    DisplayRadar(true)
    prewarmToken = nil
    ClearFocus()
end

---@param duration integer?
function Camera.fadeOut(duration)
    duration = duration or 500
    DoScreenFadeOut(duration)
    lib.waitFor(function() return IsScreenFadedOut() or nil end, nil, duration + 1500)
end

---@param duration integer?
function Camera.fadeIn(duration)
    duration = duration or 500
    DoScreenFadeIn(duration)
    lib.waitFor(function() return IsScreenFadedIn() or nil end, nil, duration + 1500)
end
