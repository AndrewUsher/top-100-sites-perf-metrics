const puppeteer = require('puppeteer')
const { writeFile } = require('fs')
const { promisify } = require('util')
const write = promisify(writeFile)

;(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false
    })

    const page = await browser.newPage()
    await page.goto('https://moz.com/top500')
    const sites = await page.evaluate(() => {
      return [...document.querySelectorAll('td.url')].map(url =>
        url.innerText.trim()
      )
    })
    await write(
      'sites.js',
      `
    module.exports = ${JSON.stringify(sites)}
    `
    )
    process.exit()
  } catch (err) {
    console.error(err)
    process.exit()
  }
})()
