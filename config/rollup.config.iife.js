import config from './rollup.config'

export default config({
  output: {
    format: 'iife',
    file: 'dist/turndown-plugin-image-with-style.js'
  }
})
