# turndown-plugin-gfm

A [Turndown](https://github.com/domchristie/turndown) plugin which captures alignment attributes from the style attribute of an img tag and appends a querystring to the image url.  The purpose is to allow alignment while still enforcing the guard rails of converting to markdown.

## Installation

npm:

```
npm install turndown-plugin-image-with-style
```

Browser:

```html
<script src="https://unpkg.com/turndown/dist/turndown.js"></script>
<script src="https://unpkg.com/turndown-plugin-image-with-style/dist/turndown-plugin-image-with-style.js"></script>
```

## Usage

```js
// For Node.js
var TurndownService = require('turndown')
var TurndownPluginImageWithStyle = require('turndown-plugin-image-with-style')

var turndownService = new TurndownService()
turndownService.use(TurndownPluginImageWithStyle)
var markdown = turndownService.turndown('<strike>Hello world!</strike>')
```

`turndown-plugin-image-with-style` looks for the style declarations applied for image alignment and size.  
Specifically, using [Quill Image Resize Module](https://github.com/kensnyder/quill-image-resize-module) with [Quill Editor](https://quilljs.com), the editor consistently inserts specific style attributes that can be matched and handled.  

`turndown-plugin-image-with-style` will convert these to:
- align=[left|center|right]
- width=[value]

It's then up to you to process these qs variables from the querystring when converting back to html.  If I find a solution as awesome as downturn for the other direction, I'll open source that and link it as well.
So for example, if you only wish to convert tables:

```js
var imageWithStyle = require('turndown-plugin-image-with-style')
var turndownService = new TurndownService()
turndownService.use(imageWithStyle)
```

## License

turndown-plugin-image-with-style is released under the MIT license.  All original [Turndown](https://github.com/domchristie/turndown) copyright belongs to Dom Christie, also released under the MIT license.
