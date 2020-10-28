import { createRequire } from 'module'
const require = createRequire(import.meta.url)

export function getData() {
  const data = require('./data.json')
  return data
}
