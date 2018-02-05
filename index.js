#!/usr/bin/env node
console.log('Running Bomstatic 🏄')

const cwd = process.cwd()
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const glob = require('glob')
const sass = require('node-sass')
const markdown = require('jekyll-markdown-parser')
const pug = require('pug')
const contentPath = path.resolve(cwd, 'content')
const templatePath = path.resolve(cwd, 'template')
const buildPath = path.resolve(cwd, 'build')
const content = glob.sync('**/[^_]*', { cwd: contentPath, nodir: true })
const template = glob.sync('**/[^_]*', { cwd: templatePath, nodir: true })

let templates = {}
let _static = { styles: [] }

template.forEach(file => {
  const ext = path.extname(file)
  mkdirp.sync(path.dirname(path.resolve(buildPath, file)))

  switch (ext) {
    case '.scss':
    case '.sass': {
      const url = `${file.substr(0, file.length - ext.length)}.css`
      const out = path.resolve(buildPath, url)
      const result = sass.renderSync({
        file: path.resolve(templatePath, file),
        outFile: out,
        outputStyle: 'compressed'
      })
      fs.writeFileSync(out, result.css)
      _static.styles.push({ url: `/${url}`, file: out, content: result.css })
      break
    }
    case '.pug': {
      const name = path.basename(file, ext)
      templates[name] = {
        render: (data) => pug.renderFile(path.resolve(templatePath, file), data)
      }
      break
    }
  }
})

content.forEach(file => {
  const ext = path.extname(file)
  mkdirp.sync(path.dirname(path.resolve(buildPath, file)))

  switch (ext) {
    case '.md': {
      const out = path.resolve(buildPath, `${file.substr(0, file.length - ext.length)}.html`)
      const data = fs.readFileSync(path.resolve(contentPath, file), 'utf-8')
      const { html, parsedYaml } = markdown.parse(data)
      const template = templates[parsedYaml.layout || 'index']
      const rendered = template ? template.render({ content: html, ...parsedYaml, static: _static }) : html
      fs.writeFileSync(out, rendered)
      break
    }
    default: {
      fs.copyFileSync(path.resolve(contentPath, file), path.resolve(buildPath, file))
    }
  }
})

console.log('Done!')
