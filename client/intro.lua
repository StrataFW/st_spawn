---@class st_spawn.Intro
Intro = {}

local INTRO_DURATION_MS <const> = 13000
local FADE_IN_MS        <const> = 2000
local HUD_RESTORE_LEAD  <const> = 2000

---@param target vector4
function Intro.play(target)
    local ped  = cache.ped
    local dict = IsPedMale(ped)
        and 'anim@scripted@heist@ig25_beach@male@'
        or  'anim@scripted@heist@ig25_beach@heeled@'

    local x, y, z, h = target.x, target.y, target.z - 1.0, target.w

    DoScreenFadeOut(0)
    SetEntityCoordsNoOffset(ped, x, y, z, false, false, false)
    SetEntityHeading(ped, h)
    FreezeEntityPosition(ped, true)

    lib.requestAnimDict(dict, 10000)

    local scene = NetworkCreateSynchronisedScene(
        x, y, z, 0.0, 0.0, h, 2, false, false, 1.0, 0.0, 1.0
    )
    NetworkAddPedToSynchronisedScene(
        ped, scene, dict, 'action', 8.0, -8.0, 0, 0, 1000.0, 0
    )
    NetworkStartSynchronisedScene(scene)
    SetFacialIdleAnimOverride(ped, 'HS4F_IG25_BEACH', 0)

    local introCam = CreateCam('DEFAULT_ANIMATED_CAMERA', true)
    PlayCamAnim(introCam, 'action_camera', dict, x, y, z, 0.0, 0.0, h, false, 2)
    RenderScriptCams(true, false, 1000, true, false)

    pcall(function() exports.st_ui:toggleHud(false) end)

    local hideToken = true
    CreateThread(function()
        while hideToken do
            HideHudAndRadarThisFrame()
            Wait(0)
        end
    end)

    DoScreenFadeIn(FADE_IN_MS)

    SetTimeout(INTRO_DURATION_MS - HUD_RESTORE_LEAD, function()
        pcall(function() exports.st_ui:toggleHud(true) end)
    end)

    Wait(INTRO_DURATION_MS)

    NetworkStopSynchronisedScene(scene)
    RenderScriptCams(false, true, 1000, true, false)
    DestroyCam(introCam, false)
    ClearFacialIdleAnimOverride(ped)
    FreezeEntityPosition(ped, false)
    RemoveAnimDict(dict)

    hideToken = false
    pcall(function() exports.st_ui:toggleHud(true) end)
end
