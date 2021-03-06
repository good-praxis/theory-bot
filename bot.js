import dotenv from 'dotenv'
dotenv.config()

import R from 'ramda'
import cron from 'node-cron'
import Telegraf from 'telegraf'
import Telegram from 'telegraf/telegram.js'
import { performCheck } from './dailycheck.js'
import { getSubscribers, updateSubscribers } from './jsonHandler.js'
import { onWhitelist } from './whitelist.js'

export const bot = new Telegraf(process.env.BOT_TOKEN)
export const telegram = new Telegram(process.env.BOT_TOKEN)

bot.use(async (ctx, next) => {
  if (onWhitelist(ctx.chat.id)) {
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
  if (!isVerbose(getMessageText(ctx))) return await next()
  ctx.state.verbose = true
  await next()
  ctx.state.verbose = false
})
bot.command('check', async (ctx) => {
  await performCheck(ctx.chat.id, telegram, ctx.state.verbose)
})
bot.command('subscribe', (ctx) => {
  if (isSubscribed(ctx.chat.id)) return ctx.reply('Already subscribed')

  if (ctx.state.verbose) ctx.reply("Can't subscribe verbosely")

  cron.schedule('0 10 * * *', async () => {
    await performCheck(ctx.chat.id, telegram)
    telegram.sendMessage(ctx.chat.id, 'performed daily cron')
  })
  updateSubscribers(ctx.chat.id)
  ctx.reply('You have been subscribed to the daily check')
})
bot.hears(/^ID/gim, (ctx) => ctx.reply(`${ctx.chat.id}`))

function getMessageText(ctx) {
  return ctx.message?.text ? ctx.message.text : ''
}

const isTimed = R.curryN(2, R.includes)('-t')
const isVerbose = R.curryN(2, R.includes)('-v')
function isSubscribed(id) {
  return R.includes(id, getSubscribers())
}
