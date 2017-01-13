const marked = require('marked')
const markdownRenderer = new marked.Renderer()
const replacements = require('./replacements.js')
const summary = 'career-objective'
const skills = 'technical-skills'



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
  if (esc === summary || esc === skills || esc === 'education' || esc === 'certifications') {
    return `
    ${esc === summary ? contact : ''}
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

module.exports = markdownRenderer
