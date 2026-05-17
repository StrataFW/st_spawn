---@class st_spawn.DB
DB = {}

---@param charId integer
---@return { firstName: string, lastName: string, stateId: string }?
function DB.identityFor(charId)
    return MySQL.single.await(
        'SELECT firstName, lastName, stateId FROM characters WHERE charId = ?',
        { charId }
    )
end
