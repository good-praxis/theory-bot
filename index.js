import { bot, telegram } from './bot.js'
import { initializeData } from './jsonHandler.js'

bot.launch()
initializeData(telegram)
