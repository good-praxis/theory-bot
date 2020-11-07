import { createRequire } from 'module'
const require = createRequire(import.meta.url)
import fs from 'fs'

const schema = require('./schema.json')
let data = {}

export function getData() {
  if (Object.keys(data) == 0) {
    if (fs.existsSync('./data.json')) data = require('./data.json')
    else saveData(schema)
  }
  return data
}

function saveData(newData = null) {
  if (newData) data = newData
  fs.writeFile('./data.json', JSON.stringify(data), (err) => {
    if (err) {
      throw err
    }
    console.log('JSON updated')
  })
}

export function updateSubscribers(id) {
  data.subscribers.push(id)
  saveData()
}

export function getSubscribers() {
  return getData().subscribers
}
