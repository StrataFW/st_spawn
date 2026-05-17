---@class st_spawn.Identity
Identity = {}

---@param source integer
---@return st_spawn.IdentityContext|nil
function Identity.contextFor(source)
    local player = Ox.GetPlayer(source)
    if not player or not player.charId then return nil end

    local row = DB.identityFor(player.charId)
    if not row then return { stateId = player.stateId } end

    return {
        firstName = row.firstName,
        lastName  = row.lastName,
        stateId   = row.stateId or player.stateId,
    }
end
