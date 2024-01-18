import { Scenes } from 'telegraf';
import { getBackKeyboard, getButtonFrom, getInlineKeyboard } from '../../utils/keyboards.js';
import getNextDateGame from '../../utils/nextGame.js';
import { signCommands } from './helpers.js';
import { addLegionerAction, deletePlayersFromDb, signInAction, signOutAction } from './actions.js';
import User from '../../models/User.js';
import { saveToSession } from '../../utils/session.js';
import GameDayService from '../../utils/gameDayService.js';
import UserService from '../../utils/userService.js';
import errorHandle from '../../utils/errorHandle.js';
import { exposePlayer } from './middlewares.js';
import leaveFromScene from '../../utils/leaveFromScene.js';

const signIn = new Scenes.BaseScene('signIn')

const { backKeyboard, backKeyboardText } = getBackKeyboard();
const { deletePlayer, signin, signout } = getButtonFrom(signCommands)

signIn.enter(async (ctx) => {
    try {
        const gameDay = new GameDayService(getNextDateGame())
        await gameDay.init()
        const user = new UserService(await User.findOne({ chatId: ctx.from.id }))

        saveToSession(ctx, 'gameDay', gameDay)
        saveToSession(ctx, 'user', user)

        const { _game } = gameDay

        const allPlayers = gameDay.getAllPlayers()

        const isInGame = !!_game.players.find((player) => player.chatId === user._user.chatId)

        await ctx.replyWithHTML(`Запись на игру в <b>${gameDay.day}</b>\n\n${allPlayers.length} человек записан${allPlayers.length === 1 ? '' : 'о'}.`, backKeyboard)
        const ps = `\n\nP.S. По легионерам не ведется статистика кол-ва матчей/кол-ва побед/забитых мячей`
        if (allPlayers.length >= 15 && !isInGame) return ctx.replyWithHTML(`Упс, ты не успел. Может в другой раз?`)
        if (allPlayers.length >= 15 && isInGame) return ctx.replyWithHTML(`Ты записан, хочешь выписаться?`, getInlineKeyboard([signout, deletePlayer]))
        isInGame ?
            await ctx.replyWithHTML(`Похоже ты уже записан, хочешь добавить легионера?\nПросто напиши его имя${ps}`, getInlineKeyboard([signout, deletePlayer]))
            :
            await ctx.replyWithHTML(`Нажми на кнопку записаться или напиши имя легионера<i>${ps}</i>`, getInlineKeyboard([signin, deletePlayer]))
    } catch (e) {
        errorHandle(ctx, e)
    }
})

signIn.leave(leaveFromScene)

signIn.action('deletePlayer', deletePlayersFromDb)
signIn.action(/user/, exposePlayer, deletePlayersFromDb)

signIn.action('signin', signInAction)
signIn.action('signout', signOutAction)
signIn.action('back', async (ctx) => {
    await ctx.answerCbQuery()
    ctx.scene.leave()
})
signIn.hears(backKeyboardText, (ctx) => { ctx.scene.leave() })
signIn.on('text', addLegionerAction)


export default signIn