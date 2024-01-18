import { Scenes } from "telegraf";
import { changeNameHandler } from "./actions.js";
import { getBackKeyboard } from "../../utils/keyboards.js";
import leaveFromScene from "../../utils/leaveFromScene.js";

const changeName = new Scenes.BaseScene('changeName')
const { backKeyboard } = getBackKeyboard()

changeName.enter(async (ctx) => {
    await ctx.reply(`Напиши мне как тебя называть?`, backKeyboard)
})

changeName.leave(leaveFromScene)

changeName.on('text', changeNameHandler)

export default changeName
