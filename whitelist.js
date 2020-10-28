import { getData } from './jsonHandler.js'

const data = getData()

export function isUserOnWhitelist(ctx) {
  const { whitelist } = data
  return whitelist.includes(ctx.chat.id)
}
