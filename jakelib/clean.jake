/* global desc, task, fail, complete */

const rimraf = require('rimraf')

desc('Cleanup generated files')
task('clean', { async: true }, () => {
  rimraf('./htdocs/**/*', (error) => {
    error ? fail(error) : complete()
  })
})
