require('shelljs/global')
const fs = require('fs')
const path = require('path')

const OUT = './report/lighthouse'
const REPORT_SUMMARY = 'summary.json'
const JSON_EXT = '.report.json'
const HTML_EXT = '.report.html'

function execute(options) {
  const summaryPath = `${OUT}/${REPORT_SUMMARY}`

  log = log.bind(log, options.verbose || false)

  rm('-rf', OUT)
  mkdir('-p', OUT)

  const count = options.sites.length
  log(`Lighthouse batch run begin for ${count} site${count > 1 ? 's' : ''}`)

  const reports = sitesInfo(options).map((site, i) => {
    const prefix = `${i + 1}/${count}: `
    const htmlOut = options.html ? ' --output html' : ''
    const filePath = `${OUT}/${site.file}`
    // if gen'ing html+json reports, ext '.report.json' is added by lighthouse cli automatically,
    // so here we try and keep the file names consistent by stripping to avoid duplication
    const outputPath = options.html
      ? filePath.slice(0, -JSON_EXT.length)
      : filePath

    const cmd = `${
      site.url
    } --output json${htmlOut} --output-path ${outputPath} ${options.params}`

    log(`${prefix}Lighthouse analyzing '${site.url}'`)
    log(cmd)

    const outcome = exec(`lighthouse ${cmd}`)
    const summary = updateSummary(filePath, site, outcome, options)

    if (summary.error)
      console.warn(`${prefix}Lighthouse analysis FAILED for ${summary.url}`)
    else
      log(
        `${prefix}Lighthouse analysis of '${summary.url}' complete with score ${
          summary.score
        }`
      )

    return summary
  })

  log(`Lighthouse batch run end`)
  log(`Writing reports summary to ${summaryPath}`)
  fs.writeFileSync(summaryPath, JSON.stringify(reports), 'utf8')
}

function sitesInfo(options) {
  return options.sites.map(url => {
    url = url.trim()
    if (!url.match(/^https?:/)) {
      if (!url.startsWith('//')) url = `//${url}`
      url = `https:${url}`
    }
    const name = siteName(url)
    const info = {
      url,
      name,
      file: `${name}${JSON_EXT}`
    }
    if (options.html) info.html = `${name}${HTML_EXT}`
    return info
  })
}

function siteName(site) {
  return site.replace(/^https?:\/\//, '').replace(/[\/\?#:\*\$@\!\.]/g, '_')
}

function updateSummary(filePath, summary, outcome, options) {
  if (outcome.code !== 0) {
    summary.score = 0
    summary.error = outcome.stderr
    return summary
  }
  const report = JSON.parse(fs.readFileSync(filePath))
  summary.score = getAverageScore(report)
  return summary
}

function getAverageScore(report) {
  let categories = report.reportCategories // lighthouse v1,2
  if (report.categories) {
    // lighthouse v3
    categories = Object.values(report.categories)
  }
  const total = categories.reduce((sum, cat) => sum + cat.score, 0)
  return (total / categories.length).toFixed(2)
}

function log(v, msg) {
  if (v) console.log(msg)
}

const program = require('commander')

program
  .option(
    '-s, --sites <sites>',
    'a comma delimited list of site urls to analyze with Lighthouse',
    str => str.split(','),
    []
  )
  .option(
    '-p, --params <params>',
    'extra parameters to pass to lighthouse cli for each execution e.g. -p "--perf --quiet"',
    null,
    ''
  )
  .option('-h, --html', 'generate an html report alongside the json report')
  .option(
    '-g, --use-global',
    'use a global lighthouse install instead of the dependency version'
  )
  .option('-v, --verbose', 'enable verbose logging')
  .parse(process.argv)

execute(program)
