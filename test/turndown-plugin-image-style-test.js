var Attendant = require('turndown-attendant')
var TurndownService = require('turndown')
var ImageWithStylePlugin = require('../lib/turndown-plugin-image-with-style.cjs')

var attendant = new Attendant({
  file: __dirname + '/index.html',
  TurndownService: TurndownService,
  beforeEach: function (turndownService) {
    turndownService.use(ImageWithStylePlugin)
  }
})

attendant.run()
