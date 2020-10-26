import dotenv from 'dotenv'
dotenv.config()

import cron from 'node-cron'
import Telegraf from 'telegraf'
import { performCheck } from './dailycheck.js'

export const bot = new Telegraf(process.env.BOT_TOKEN)

let timed = false
const subscribers = []

bot.use(async (ctx, next) => {
  if (!timed) return await next()
  const start = new Date()
  await next()
  const ms = new Date() - start
  await ctx.reply(`Action took ${ms}ms`)
})
bot.command('timed', (ctx) => {
  timed = !timed
  ctx.reply(timed ? 'Activated timing' : 'Deactivated timing')
})
bot.command('check', async (ctx) => {
  await performCheck(ctx)
})
bot.command('subscribe', (ctx) => {
  if (subscribers.indexOf(ctx.chat.id) != -1)
    return ctx.reply('Already subscribed')

  cron.schedule('0 10 * * *', async () => {
    await performCheck(ctx)
    ctx.reply('performed daily cron')
  })
  subscribers.push(ctx.chat.id)
  ctx.reply('You have been subscribed to the daily check')
})
bot.hears('ID', (ctx) => ctx.reply(`${ctx.chat.id}`))
