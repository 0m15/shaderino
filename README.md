# s h a d e r i n o

A little Webgl/glsl fragment shader viewer with no dependencies.

## Usage

See `examples/index.html` for a running example or head to http://shaderino.netlify.com.

Just import shaderino in your page, and use it like this:

```javascript
let fs = `your fragment shader goes here`
let sh = shaderino(document.getElementById('canvas'), fs)
sh.draw()
```

Then shaderino will automatically update in a loop.

## Available uniforms

Shaderino provides you two uniforms:

```glsl
vec2 u_resolution;        // Canvas size in pixel
float u_time;             // Elapsed time
```

## Custom uniforms

You can define and pass custom uniforms like this:

```javascript
let uniformsDef = [
    {
        type: 'vec2',
        name: 'u_mouse',
        value: [0, 0],
        update: () => return [mouse.x, mouse.y]
    }
]

shaderino(canvas, fs, uniformsDef)
```
Then `update` function will be called at each frame.
Note: You'll have to declare the uniform in the fragment shader in order to use it.

### Uniform types
Right now, only these types are supported:

- `float`
- `vec2`
- `vec3`
- `vec4`


## TODO

- WebVR
- React Component
- Custom Element (WebComponents)
- NPM package
- Automatic builds
- ~~Handle user uniforms~~ Allow more user uniforms