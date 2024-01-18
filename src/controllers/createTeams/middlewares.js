export function exposeAction(ctx, next) {

    const action = ctx.callbackQuery.data
    ctx.session.currentAction = action

    return next();
}

export function exposePlayer(ctx, next) {
    const action = JSON.parse(ctx.callbackQuery.data)

    const store = ctx.session?.sortPlayers?.unsorted

    ctx.player = store.find((item) => JSON.parse(JSON.stringify(item._id)) === action.p);

    return next();
}