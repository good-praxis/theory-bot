import axios from 'axios'
import data from './data.js'

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

        return response.data.search(this.target) == -1
      })
      .catch(true) // Preventing exception, acting like target was found
  },
}

const websites = data.dailyChecks.map((website) => {
  return Object.create(Website).init(website)
})

export async function performCheck(bot) {
  for (let website of websites) {
    if (await !website.urlIncludesTarget())
      bot.reply(website.targetNotFoundMessage)
  }
}
