const vs = `
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

function shaderino(canvasEl, fs) {
    let gl = canvas.getContext("webgl")

    if (!gl) {
        console.error("No webgl support")
        return
    }

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vs)
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, `
        precision highp float; 
        uniform vec2 u_resolution; 
        uniform float u_time;

        ${fs}
    `)

    let program = createProgram(gl, vertexShader, fragmentShader)

    let positionAttributeLocation = gl.getAttribLocation(program, "a_position")
    let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution")
    let timeUniformLocation = gl.getUniformLocation(program, "u_time")

    let positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    // one big triangle
    let positions = [
        -2, 2,
        3, 1,
        -1.0, -3,
    ]

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    function draw() {
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
        gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        let size = 2          // 2 components per iteration
        let type = gl.FLOAT   // the data is 32bit floats
        let normalize = false // don't normalize the data
        let stride = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0        // start at the beginning of the buffer

        gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset)

        let primitiveType = gl.TRIANGLES
        let count = 3
        offset = 0

        gl.drawArrays(primitiveType, offset, count)
    }

    let time = 0
    let rafId
    let looping = false

    function update() {
        if (!looping) {
            return
        }
        
        time += 0.01

        // Set time uniform
        gl.uniform1f(timeUniformLocation, time)
        draw()
        
        rafId = requestAnimationFrame(function () {
            update()
        })
    }
    return {
        stop() {
            looping = false
            cancelAnimationFrame(rafId)
        },
        draw() {
            looping = true
            draw()
            update()
        }
    }
}