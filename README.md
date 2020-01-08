# s h a d e r i n o

A little Webgl/glsl fragment shader viewer with no dependencies.

## Usage

See `examples/index.html` for a running example or head to http://shaderino.netlify.com.

Just import shaderino in your page, and use it like this:

    let fs = `your fragment shader goes here`
    let sh = shaderino(document.getElementById('canvas'), fs)
    sh.draw()

Then shaderino will automatically update in a loop.

## Available uniforms

By now shaderino provides you two uniforms:

    vec2 u_resolution;        // Canvas size in pixel
    float u_time;             // Elapsed time

## TODO

- WebVR
- React Component
- WebComponents version
- NPM package
- Automatic builds
- Handle user uniforms