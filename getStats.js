const { spawnSync } = require('child_process')
const { readdir, readFile, writeFile } = require('fs')
const { promisify } = require('util')
const readdirAsync = promisify(readdir)
const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)
const path = require('path')
let sites = require('./sites')

const stats = []
;(async () => {
  const writeStatsToFile = async stats => {
    await writeFileAsync('stats.js', `export default ${JSON.stringify(stats)}`)
  }
  const parseSites = async () => {
    const pathToReports = path.resolve(process.cwd(), 'report/lighthouse')
    const files = await readdirAsync(pathToReports)
    const lines = await Promise.all(
      files.map(async (file, index) => {
        if (index === 2) {
          return []
        }
        const data = await readFileAsync(path.resolve(pathToReports, file))
        const lighthouseJSON = JSON.parse(data.toString())
        const { audits } = lighthouseJSON
        // console.log(audits)

        const {
          interactive: { displayValue: TTI },
          'first-cpu-idle': { displayValue: FCI },
          'first-meaningful-paint': { displayValue: FMP },
          'first-contentful-paint': { displayValue: FCP }
        } = audits
        if (FCP && FMP && FCI && TTI) {
          const line = [
            {
              x: 'First Contentful Paint',
              y: Number(Number(FCP.slice(0, FCP.length - 2)).toFixed(2))
            },
            {
              x: 'First Meaningful Paint',
              y: Number(Number(FMP.slice(0, FMP.length - 2)).toFixed(2))
            },
            {
              x: 'First CPU Idle',
              y: Number(Number(FCI.slice(0, FCI.length - 2)).toFixed(2))
            },
            {
              x: 'Time To Interactive',
              y: Number(Number(TTI.slice(0, TTI.length - 2)).toFixed(2))
            }
          ]
          return line
        } else {
          return []
        }
      })
    )
    await writeStatsToFile(lines)
  }
  // const cmd = spawnSync('node', ['batcher.js', '-s', sites.join(','), '-p', '-config-path=lighthouse.config.js'])
  // cmd.stdout.on('data', d => console.log(d))
  await parseSites()
})()
