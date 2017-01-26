const fs = require('fs')
const markdown = require('metalsmith-markdown')
const markdownRenderer = require('./src/markdownRenderer.js')
const markdownReplacer = require('./src/markdownReplacer.js')
const Metalsmith = require('metalsmith')
const myth = require('metalsmith-myth')
const layouts = require('metalsmith-layouts')
const pdf = require('metalsmith-pdf')
const fingerprint = require('metalsmith-fingerprint')
const ignore = require('metalsmith-ignore')

const build = () => {
  Metalsmith(__dirname)
  .use(markdownReplacer)
  .use(markdown({
    renderer: markdownRenderer,
    smartypants: false
  }))
  .use(myth({
    files: 'css/*.css'
  }))
  .use(fingerprint({
    pattern: ['css/*.css']
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: './templates',
    default: 'default.hbs',
    pattern: '*.html'
  }))
  .use(pdf({
    pattern: '*.html',
    printMediaType: true,
    pageSize: 'letter'
  }))
  .use(ignore(['css/style.css', 'css/spectre.min.css', 'resume.html']))
  .build(function(err){
    console.log('Building!')
    if(err) console.log(err)
  })
}

const stream = fs.createReadStream('./README.md').pipe(fs.createWriteStream('./src/resume.md'))
stream.on('finish', build)
