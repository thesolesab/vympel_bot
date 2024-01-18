import { autoCreateTeameAction } from "./autoCreate/actions.js"
import { handleCreateTeameAction } from "./handleCreate/actions.js"


export const createTeamAction = async (ctx) => {
    const { currentAction } = ctx.session

    switch (currentAction) {
        case `autoTeamCreate`:
            return autoCreateTeameAction(ctx)
        case `handleCraeteTeam`:
            return handleCreateTeameAction(ctx)
        default:
            return ctx.scene.leave()
    }
}