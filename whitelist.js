import { getWhitelist } from './jsonHandler.js'
import R from 'ramda'

export function onWhitelist(id) {
  return R.includes(id, getWhitelist())
}
