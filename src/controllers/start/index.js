import { Scenes } from 'telegraf';
import User from "../../models/User.js";
import { getChangeNameKeyboard } from './helpers.js';
import { saveToSession } from '../../utils/session.js';
import errorHandle from '../../utils/errorHandle.js';
import { changeNameHandler } from './actions.js';
import UserService from '../../utils/userService.js';
import leaveFromScene from '../../utils/leaveFromScene.js';


const start = new Scenes.BaseScene('start')

start.enter(async (ctx) => {
    try {
        let user = await User.findOne({ chatId: ctx.from.id })

        if (!user) {
            const changeNameKeys = getChangeNameKeyboard()
            saveToSession(ctx, 'changeName', false)

            user = new User({
                chatId: ctx.from.id,
                link: `https://t.me/${ctx.from.username}`,
                name: ctx.from.first_name,
                username: ctx.from.username,
                stat: {
                    w: 0,
                    l: 0,
                    d: 0,
                    scores: 0
                }
            })

            await user.save()

            await ctx.replyWithHTML(`Привет <b>${ctx.from.first_name}</b>\n\n<b>Я бот помошник.</b>  Я помогу тебе \n<u>записаться на игру</u> / <u>собрать состав</u> / <u>вести статистику игр</u> \nи многое другое.`)
            return await ctx.reply(`Для начала не хочешь ли изменить свое имя?`, changeNameKeys)
        }
        saveToSession(ctx, 'user', new UserService(user))
        await ctx.scene.leave()
    } catch (e) {
        errorHandle(ctx, e)
    }
})

start.leave(leaveFromScene)

start.on('text', changeNameHandler)
start.action('no', (ctx) => ctx.scene.leave())
start.action(
    'yes',
    (ctx, next) => {
        ctx.bye = true
        next()
    },
    (ctx) => ctx.scene.enter('changeName')
)

export default start