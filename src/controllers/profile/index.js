import { Scenes } from "telegraf"
import UserService from "../../utils/userService.js"
import User from "../../models/User.js"
import { getMessageStat } from "./helpers.js"
import { getBackKeyboard } from "../../utils/keyboards.js"
import { changeScoreEnter, renameUser } from "./actions.js"
import { saveToSession } from "../../utils/session.js"
import leaveFromScene from "../../utils/leaveFromScene.js"

const profileMain = new Scenes.BaseScene('profileMain')
const { backKeyboardText } = getBackKeyboard();

profileMain.enter(
    async (ctx) => {
        const { backKeyboard } = getBackKeyboard()
        const user = new UserService(await User.findOne({ chatId: ctx.from.id }))
        saveToSession(ctx, `user`, user)

        await ctx.replyWithHTML(
            `Привет, ${user.name}!`,
            backKeyboard
        )
        await getMessageStat(ctx)
    }
)

profileMain.leave(leaveFromScene)


profileMain.action(
    'changeName',
    (ctx, next) => {
        ctx.bye = true
        next()
    },
    renameUser
)
profileMain.action('changeScores', changeScoreEnter)
profileMain.hears(backKeyboardText, (ctx) => ctx.scene.leave())
profileMain.action('exit', (ctx) => ctx.scene.leave())



export default profileMain