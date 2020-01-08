# s h a d e r i n o

A little glsl fragment shader viewer with no dependencies.

## Usage

See `examples/index.html` for a working shader.

Just import minishader in your page, and use it like this:

    let fsEl = document.getElementById('fs')
    let ms = minishader(document.getElementById('canvas'), fsEl.value)
    ms.draw()

Then minishader will automatically update in a loop.

## TODO

- React Component
- WebComponents version
- NPM package