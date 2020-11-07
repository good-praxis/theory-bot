import axios from 'axios'
import { getData } from './jsonHandler.js'

const dailyChecksData = getData().dailyChecks

const Website = {
  init: function ({ url, title, target, targetNotFoundMessage }) {
    this.url = url
    this.title = title
    this.target = target
    this.targetNotFoundMessage = targetNotFoundMessage
    return this
  },

  urlIncludesTarget: async function () {
    return await axios
      .get(this.url)
      .then((response) => {
        if (response.status != 200) return true // Preventing exception, acting like target was found

        return response.data.search(this.target) != -1
      })
      .catch(true) // Preventing exception, acting like target was found
  },
}

export async function performCheck(id, telegram, verbose) {
  if (!(id.toString() in dailyChecksData)) return // If no dailyChecks data exist, we are done

  const websites = dailyChecksData[id.toString()].map((website) => {
    return Object.create(Website).init(website)
  })
  for (let website of websites) {
    if (verbose) await telegram.sendMessage(id, `Checking ${website.title}...`)
    const foundTarget = await website.urlIncludesTarget()
    if (!foundTarget) {
      await telegram.sendMessage(id, `${website.targetNotFoundMessage}\n${website.url}`)
    }
  }
  if (verbose) await telegram.sendMessage(id, 'Ran all checks')
}
