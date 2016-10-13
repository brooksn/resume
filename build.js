require('dotenv-safe').config({silent: true})
const fs = require('fs')
const Metalsmith = require('metalsmith')
const myth = require('metalsmith-myth')
const markdown = require('metalsmith-markdown')
const marked = require('marked')
const layouts = require('metalsmith-layouts')
const pdf = require('metalsmith-pdf')
const fingerprint = require('metalsmith-fingerprint')
const ignore = require('metalsmith-ignore')

const replacements = {
  phone: process.env.PHONE || '',
  email: process.env.EMAIL || '',
  summary: process.env.SUMMARY || '',
  linkedin: process.env.LINKEDIN || '',
  aa_institution: process.env.AA_INSTITUTION || '',
  bs_institution: process.env.BS_INSTITUTION || ''
}

const markdownRenderer = new marked.Renderer()
markdownRenderer.heading = (text, level) => {
  const {phone, email, linkedin} = replacements
  var esc = text.toLowerCase().replace(/[^\w]+/g, '-')
  const contact = `    
    <div class="right-sidebar" id="contact-header-container">
      <h${level} id="contact-header">Contact</h${level}>
      ${level === 1 ? '<hr class="h1hr" id="' + esc + '-hr"></hr>' : ''}
    </div>
    <div class="right-sidebar" id="contact-list-container">
      <ul>
        <li><a href="tel:+01-${phone.replace(/(\d{3})\.(\d{3})\.(\d{4})/g, '$1-$2-$3')}">${phone}</a></li>
        <li><a href="mailto:Brooks%20Newberry%3c${email}%3e">${email}</a></li>
        <li><a href="https://brooks.is">https://brooks.is</a></li>
        <li><a href="https://github.com/brooksn">https://github.com/brooksn</a></li>
        <li><a href="${linkedin}">${linkedin}</a></li>
      </ul>
    </div>`
  if (esc === 'summary' || esc === 'skills') {
    return `
    ${esc === 'summary' ? contact : ''}
    <div class="right-sidebar" id="${esc}-header-container">
      <h${level} id="${esc}-header">
        <a name="${esc}" class="anchor" href="#${esc}">
          <span class="header-link">
          </span>
        </a>
        ${text}
      </h${level}>
      ${level === 1 ? '<hr class="h1hr" id="' + esc + '-hr"></hr>' : ''}
    </div>`
  } else return `
  <h${level} id="${esc}-header"><a name="${esc}" class="anchor" href="#${esc}"><span class="header-link"></span></a>${text}</h${level}>
  ${level === 1 ? '<hr class="h1hr" id="' + esc + '-hr"></hr>' : ''}
  `
}
markdownRenderer.list = (text, ordered) => {
  if (text.indexOf('chip-name') >= 0) {
    return `<div class="skill-chips right-sidebar">${text}</div>`
  } else return `<${ordered ? 'o' : 'u'}l>${text}</${ordered ? 'o' : 'u'}l>`
  
}
markdownRenderer.listitem = text => {
  if (text.indexOf('chip-name') >= 0) {
    return text
  } else return `<li>${text}</li>`
}
const build = () => {
  Metalsmith(__dirname)
  .use((files, metalsmith, done) => {
    let text = files['resume.md'].contents.toString()
    for(r in replacements) {
      text = text.replace('${'+ r +'}', replacements[r].replace(/['"]+/g, ''))
    }
    text = text.replace(/\+\s(.+)/g, '+ <div class="chip-sm"><span class="chip-name">$1</span></div>')//replace skills list with chips
    text = text.replace(/(\w{1,12}@\w{4,12}\.\w{2,4})(\s)/ig, '<a href="mailto:Brooks%20Newberry%3c$1%3e">$1</a>$2')//mailto links
    text = text.replace(/(\d{3})\.(\d{3})\.(\d{4})(\s)/ig, '<a href="tel:+01-$1-$2-$3">$1.$2.$3</a>$4')//tel links

    files['resume.md'].contents = new Buffer(text)
    files['index.md'] = {contents: new Buffer(text)}
    files['index.md'].webDest = true
    done()
  })
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
    pattern: 'resume.html',
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
