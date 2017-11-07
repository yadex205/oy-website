/* global jake, desc, task, namespace */

const browserSync = require('browser-sync')

desc('Run live preview environment')
task('live', { async: true }, () => {
  jake.Task['watch'].invoke()

  let server = browserSync.create()
  server.init({ server: { baseDir: './htdocs' },
                open: false })

  jake.Task['build:html'].addListener('complete', () => { server.reload() })
  jake.Task['build:css'].addListener('complete', () => { server.reload('./htdocs/css/**/*.css') })
  jake.Task['build:js'].addListener('complete', () => { server.reload() })
})
