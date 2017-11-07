/* global jake, desc, task, namespace */

const chokidar = require('chokidar')

task('watch', ['build'], { async: true }, () => {
  jake.Task['watch:html'].invoke()
  jake.Task['watch:css'].invoke()
  jake.Task['watch:js'].invoke()
})

namespace('watch', () => {
  task('html', { async: true }, () => {
    chokidar.watch('./src/html/**/*.ejs').on('all', () => {
      jake.Task['build:html'].reenable()
      jake.Task['build:html'].invoke()
    })
  })

  task('css', { async: true }, () => {
    chokidar.watch('./src/css/**/*.{sass,scss}').on('all', () => {
      jake.Task['build:css'].reenable()
      jake.Task['build:css'].invoke()
    })
  })

  task('js', { async: true }, () => {
    chokidar.watch('./src/js/**/*.js').on('all', () => {
      jake.Task['build:js'].reenable()
      jake.Task['build:js'].invoke()
    })
  })
})
