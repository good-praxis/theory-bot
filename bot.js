import dotenv from 'dotenv'
dotenv.config()

import Telegraf from 'telegraf'

import { performCheck } from './dailycheck.js'

export const bot = new Telegraf(process.env.BOT_TOKEN)

let timed = false

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
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
