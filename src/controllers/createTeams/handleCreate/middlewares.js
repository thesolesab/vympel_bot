export const exposeTeam = (ctx, next) => {
    const action = JSON.parse(ctx.callbackQuery.data)
    const { game } = ctx.session

    ctx.session.team = game.getTeams(action.id)
    next()
}

export const exposePlayer = async (ctx, next) => {
    const action = JSON.parse(ctx.callbackQuery.data)
    const { game } = ctx.session

    if (ctx.session.oldPlayer) {
        ctx.session.newPlayer = await game.returnPlayer(action.p)
    } else {
        ctx.session.oldPlayer = await game.returnPlayer(action.p)
    }
    return next()
}