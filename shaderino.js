const VERTEX_SHADER = `
  attribute vec4 a_position;

  void main() { 
    gl_Position = a_position;
  }
`

function createShader(gl, type, source) {
    let shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

    if (success) {
        return shader
    }

    console.log(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
}

function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    let success = gl.getProgramParameter(program, gl.LINK_STATUS)

    if (success) {
        return program
    }

    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
}

function tex2D(gl, image, id = 0) {
    let texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

    return gl.texImage2D(gl.TEXTURE_2D, id, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
}

function setupProgram(gl, fs) {
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, `
        precision highp float;
        uniform vec2 u_resolution;
        uniform float u_time;

        ${fs}
    `)

    return createProgram(gl, vertexShader, fragmentShader)
}

function setupUniforms(gl, program, uniforms) {
    return uniforms.reduce((a, b) => {
        return {
            ...a,
            [b.name]: uniform(gl, program, b.type, b.name, b.update),
        }
    }, {})
}

function uniform(gl, program, type, name, updater) {
    let loc = gl.getUniformLocation(program, name)
    let __value
    return {
        update: updater,
        get() {
            return __value
        },
        set(value) {
            __value = value
            switch (type) {
                case "f":
                    return gl.uniform1f(loc, value)
                case "vec2":
                    return gl.uniform2f(loc, ...value)
                case "vec3":
                    return gl.uniform2f(loc, ...value)
                case "tex2D":
                    console.log("texture2d uniform type not supported yet!")
                    break
                    //return tex2D(gl, value, 0)
                default:
                    break
            }
        }
    }
}


function shaderino(canvasEl, fs, uniforms = []) {
    let gl = canvas.getContext("webgl")
    let time = 0
    let running = false
    let rafId

    if (!gl) {
        console.error("No webgl support")
        return
    }

    let program = setupProgram(gl, fs)
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position")
    let resolutionUniform = uniform(gl, program, "vec2", "u_resolution")
    let timeUniform = uniform(gl, program, "f", "u_time")
    let userUniforms = setupUniforms(gl, program, uniforms)

    let positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    // one big triangle
    let positions = [-2, 2, 3, 1, -1, -3]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    function draw() {
        // Set size
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program)
        gl.enableVertexAttribArray(positionAttributeLocation)

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

        // Set the resolution uniform
        resolutionUniform.set([gl.canvas.width, gl.canvas.height])
        
        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        gl.vertexAttribPointer(
            positionAttributeLocation, 2, gl.FLOAT, false, 0, 0)

        gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    function update() {
        if (!running) {
            return
        }

        // Set time uniform
        timeUniform.set(time)
        time += 0.01

        // Update user uniforms
        Object.keys(userUniforms).forEach(name => {
            userUniforms[name].set(userUniforms[name].update())
        })

        draw()

        rafId = requestAnimationFrame(() => update())
    }

    return {
        stop() {
            running = false
            cancelAnimationFrame(rafId)
        },
        start() {
            running = true
            draw()
            update()
        }
    }
}