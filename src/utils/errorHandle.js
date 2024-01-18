const errorHandle = async (ctx, error) => {
    console.log(error)
    await ctx.reply(`Похоже произошла какая то ошибка, попробуй позже...`)
}

export default errorHandle