## Install
```yarn global add bomstatic```
or
```npm i -g bomstatic```

## Run
Run `bomstatic` to convert this directory structure:
```
.
├── content
|   ├── favicon.ico
|   └── index.pug
├── template
|   ├── index.pug
|   └── index.sass
```

Into this:
```
.
├── build
|   ├── favicon.ico
|   ├── index.html
|   └── index.css
├── content
|   ├── favicon.ico
|   └── index.pug
├── template
|   ├── index.pug
|   └── index.sass
```
