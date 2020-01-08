# s h a d e r i n o

A little glsl fragment shader viewer with no dependencies.
http://shaderino.netlify.com

## Usage

See `examples/index.html` for a working shader.

Just import shaderino in your page, and use it like this:

    let fsEl = document.getElementById('fs')
    let ms = shaderino(document.getElementById('canvas'), fsEl.value)
    ms.draw()

Then shaderino will automatically update in a loop.

## TODO

- WebVR
- React Component
- WebComponents version
- NPM package
- Automatic builds