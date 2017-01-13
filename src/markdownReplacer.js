const replacements = require('./replacements.js')

module.exports = function markdownReplacer(files, metalsmith, done) {
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
}
