/* global desc, task, namespace, complete, fail */

const path       = require('path')
const async      = require('async')
const writeFile  = require('write')
const cpx        = require('cpx')
const replaceExt = require('replace-ext')
const glob       = require('glob')
const ejs        = require('ejs')
const sass       = require('node-sass')
const browserify = require('browserify')

desc('Build website')
task('build', ['clean', 'build:html', 'build:css', 'build:js', 'build:image', 'build:deploy'])

namespace('build', () => {
  task('html', { async: true }, () => {
    async.waterfall([
      (done) => { glob('./src/html/**/!(_)*.ejs', done) },
      (files, done) => {
        async.each(files, (file, ejs_done) => {
          let dest = path.join('./htdocs', path.relative('./src/html', replaceExt(file, '.html')))
          ejs.renderFile(file, {}, {}, (error, generated) => {
            error ? ejs_done(error) : writeFile(dest, generated, ejs_done)
          })
        }, done)
      }
    ], (error) => { error ? fail(error) : complete() })
  })

  task('css', { async: true }, () => {
    async.waterfall([
      (done) => { glob('./src/css/**/!(_)*.{sass,scss}', done) },
      (files, done) => {
        async.each(files, (file, sass_done) => {
          let dest = path.join('./htdocs/css', path.relative('./src/css', replaceExt(file, '.css')))
          sass.render({ file: file }, (error, generated) => {
            error ? sass_done(error) : writeFile(dest, generated.css, sass_done)
          })
        }, done)
      }
    ], (error) => { error ? fail(error) : complete() })
  })

  task('js', { async: true }, () => {
    let b = browserify({ entries: './src/js/main.js',
                         debug: process.env['NODE_ENV'] === 'production' })
    async.waterfall([
      (done) => { b.bundle(done) },
      (result, done) => { writeFile('./htdocs/js/main.js', result, done) }
    ], (error) => { error ? fail(error) : complete() })
  })

  task('image', { async: true }, () => {
    cpx.copy('./src/image/**/*.{jpg,png}', './htdocs/image', (error) => {
      error ? fail(error) : complete()
    })
  })

  task('deploy', ['deploy:cname', 'deploy:vendor'])

  namespace('deploy', () => {
    task('cname', { async: true }, () => {
      writeFile('./htdocs/CNAME', 'www.oy-brigade.work', (error) => {
        error ? fail(error) : complete()
      })
    })

    task('vendor', { async: true }, () => {
      let mappings = [
        ['./node_modules/font-awesome/{css,fonts}/**/*', './htdocs/vendor/font-awesome']
      ]

      async.each(mappings, (mapping, done) => {
        cpx.copy(mapping[0], mapping[1], done)
      }, (error) => {
        error ? fail(error) : complete()
      })
    })
  })
})
