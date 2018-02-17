# turndown-plugin-gfm

A [Turndown](https://github.com/domchristie/turndown) plugin which captures alignment attributes from the style attribute and value from height and width attributes of an img tag adds controlled attributes using the `{attr1=val attr2=another}` pattern.  The purpose is to allow alignment while still enforcing the guard rails of converting to markdown.

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
var markdown = turndownService.turndown('<img width="400" style="float:left" src="https://http.cat/405" alt="so awesome"/>')
```

`turndown-plugin-image-with-style` looks for the size and alignment declarations applied for image alignment and size.  
Specifically, using [Quill Image Resize Module](https://github.com/kensnyder/quill-image-resize-module) with [Quill Editor](https://quilljs.com), the editor consistently inserts specific style, height and width attributes that can be matched and handled.  

`turndown-plugin-image-with-style` will convert these to:
- style="float:left; margin:0px 1em 1em 0px;" OR style="float:right; margin:0px 0px 1em 1em;" OR display:block; margin:auto;"
- width=[value]
- height=[value]

It's then up to you to process these attributes when converting back to html.  
A handy module is: [markdown-it-attrs](https://github.com/arve0/markdown-it-attrs)
with [markdown-it](https://github.com/markdown-it/markdown-it)

example:

```js
var imageWithStyle = require('turndown-plugin-image-with-style')
var turndownService = new TurndownService()
turndownService.use(imageWithStyle)
```

## License

turndown-plugin-image-with-style is released under the MIT license.  All original [Turndown](https://github.com/domchristie/turndown) copyright belongs to Dom Christie, also released under the MIT license.
