const { exec } = require('child_process')
const { promisify } = require('util')
const execAsync = promisify(exec)
let sites = require('./sites')

sites = sites.slice(0, 30).map(site => `https://${site}`)
;(async () => {
  console.log(sites)
  console.log(sites.join(','))
  await execAsync(`lighthouse-batch -s ${sites.join(',')}`)
})()
