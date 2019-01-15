module.exports = {
  extends: 'lighthouse:default',
  settings: {
    quiet: true,
    output: 'json',
    onlyAudits: [
      'first-contentful-paint',
      'first-cpu-idle',
      'first-meaningful-paint',
      'interactive'
    ]
  }
}
