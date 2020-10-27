import data from './data.js'

export function isUserOnWhitelist(ctx) {
  const { whitelist } = data
  return whitelist.includes(ctx.chat.id)
}
