export const exposePlayer = (ctx, next) => {
    const action = JSON.parse(ctx.callbackQuery.data)

    const store = ctx.session.gameDay.getAllPlayers()

    ctx.player = store.find((item) => JSON.parse(JSON.stringify(item._id)) === action.p);

    return next()
}