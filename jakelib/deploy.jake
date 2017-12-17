/* global desc, task, complete, fail */

const ghpages = require('gh-pages')

desc('Deploy website to GitHub Pages')
task('deploy', ['build'], { async: true }, () => {
  ghpages.publish('htdocs', {
    branch: 'master',
    repo: 'git@github.com:oy-brigade/oy-brigade.github.io',
    clone: 'tmp/repo'
  }, (error) => {
    error ? fail(error) : complete()
  })
})
