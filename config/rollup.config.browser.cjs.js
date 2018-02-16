import config from './rollup.config'

export default config({
  output: {
    format: 'cjs',
    file: 'lib/turndown-plugin-image-with-style.browser.cjs.js'
  }
})
