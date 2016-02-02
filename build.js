try { require('dotenv').load(); }
catch(e) { console.log(e); }
var Metalsmith = require('metalsmith');
var myth = require('metalsmith-myth');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var pdf = require('metalsmith-pdf');
var fingerprint = require('metalsmith-fingerprint');
var ignore = require('metalsmith-ignore');

Metalsmith(__dirname)
  .use(function(files, metalsmith, done){
    var replacements = {
      phone: process.env.PHONE,
      email: process.env.EMAIL,
      summary: process.env.SUMMARY,
      linkedin: process.env.LINKEDIN,
      aa: process.env.AA,
      bs: process.env.BS
    };
    for(var file in files){
      if(file.substr(-3)==='.md') {
        var text = files[file].contents.toString();
        for(r in replacements) {
          text = text.replace('${'+ r +'}', replacements[r]);
        }
        files[file].contents = new Buffer(text);
      }
    };
    done();
  })
  .use(markdown())
  .use(myth({
    files: 'css/*.css'
  }))
  .use(fingerprint({
    pattern: ['css/*.css']
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: 'templates',
    default: 'default.hbs',
    pattern: '*.html'
  }))
  .use(pdf({
    pattern: '*.html',
    printMediaType: true,
    pageSize: 'letter'
  }))
  .use(ignore(['css/style.css']))
  .build(function(err){
    console.log('Building!');
    if(err) console.log(err);
  });
