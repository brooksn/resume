const replacements = require('./replacements.js')

module.exports = function markdownReplacer(files, metalsmith, done) {
  let text = files['resume.md'].contents.toString()
  let gisText = files['gis.md'].contents.toString()
  let replacementTexts = [{filename: 'resume.md'}, {filename: 'gis.md'}]
  for(r in replacements) {
    replacementTexts.forEach(file => {
      file.text = files[file.filename].contents.toString()
      file.text = file.text.replace('${'+ r +'}', replacements[r].replace(/['"]+/g, ''))
    })
  }
  replacementTexts.forEach(file => {
    file.text = file.text.replace(/\+\s(.+)/g, '+ <div class="chip-sm"><span class="chip-name">$1</span></div>')//replace skills list with chips
    file.text = file.text.replace(/(\w{1,12}@\w{4,12}\.\w{2,4})(\s)/ig, '<a href="mailto:Brooks%20Newberry%3c$1%3e">$1</a>$2')//mailto links
    file.text = file.text.replace(/(\d{3})\.(\d{3})\.(\d{4})(\s)/ig, '<a href="tel:+01-$1-$2-$3">$1.$2.$3</a>$4')//tel links
    files[file.filename].contents = new Buffer(file.text)
  })

  //files['resume.md'].contents = new Buffer(text)
  files['index.md'] = {contents: new Buffer(replacementTexts[0].text)}
  files['index.md'].webDest = true
  //files['gis.md'].webDest = true
  done()
}
