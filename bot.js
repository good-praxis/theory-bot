import dotenv from 'dotenv'
dotenv.config()

import cron from 'node-cron'
import Telegraf from 'telegraf'
import Telegram from 'telegraf/telegram.js'
import { performCheck } from './dailycheck.js'
import { isUserOnWhitelist } from './whitelist.js'

export const bot = new Telegraf(process.env.BOT_TOKEN)
const telegram = new Telegram(process.env.BOT_TOKEN)

let verbose = false
const subscribers = []

bot.use(async (ctx, next) => {
  if (isUserOnWhitelist(ctx)) {
    await next()
  }
})
bot.use(async (ctx, next) => {
  if (!isTimed(getMessageText(ctx))) return await next()
  const start = new Date()
  await next()
  const ms = new Date() - start
  await ctx.reply(`Action took ${ms}ms`)
})
bot.use(async (ctx, next) => {
  if(!isVerbose(getMessageText(ctx))) return await next()
  verbose = true
  await next()
  verbose = false
})
bot.command('check', async (ctx) => {
  await performCheck(ctx.chat.id, telegram)
})
bot.command('subscribe', (ctx) => {
  if (subscribers.indexOf(ctx.chat.id) != -1)
    return ctx.reply('Already subscribed')

  cron.schedule('0 10 * * *', async () => {
    await performCheck(ctx.chat.id, telegram)
    telegram.sendMessage(ctx.chat.id, 'performed daily cron')
  })
  subscribers.push(ctx.chat.id)
  ctx.reply('You have been subscribed to the daily check')
})
bot.hears(/^ID/gmi, (ctx) => ctx.reply(`${ctx.chat.id}`))

function getMessageText(ctx) {
  return ctx.message?.text ? ctx.message.text : ''
}

const isTimed = contains('-t')
const isVerbose = contains('-v')

function contains(target) {
  return function containsTarget(message) {
    return message.indexOf(target) != -1
  }
}