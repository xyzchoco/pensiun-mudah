import vertexShaderSource from './shaders/background.vert.glsl?raw';
import fragmentShaderSource from './shaders/background.frag.glsl?raw';

/**
 * WebGL Interactive Shader Background Engine
 * Converted 1-to-1 from AI Studio InteractiveBackground.tsx
 */
export function initializeBackground() {
    const canvas = document.getElementById('interactive-bg-canvas');
    if (!canvas) return;

    let animationFrameId = null;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    const syncSize = () => {
        if (!canvas) return;
        const w = canvas.clientWidth || window.innerWidth;
        const h = canvas.clientHeight || window.innerHeight;
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
        }
    };

    syncSize();
    window.addEventListener('resize', syncSize);

    // WebGL Fallback if hardware WebGL is unavailable
    if (!gl) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            let t = 0;
            const render2D = () => {
                syncSize();
                t += 0.01;
                ctx.fillStyle = '#0B0B0D';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw grid fallback
                ctx.strokeStyle = 'rgba(20, 184, 166, 0.05)';
                ctx.lineWidth = 1;
                const gridSize = 40;
                for (let x = 0; x < canvas.width; x += gridSize) {
                    ctx.beginPath();
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvas.height);
                    ctx.stroke();
                }
                for (let y = 0; y < canvas.height; y += gridSize) {
                    ctx.beginPath();
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvas.width, y);
                    ctx.stroke();
                }

                animationFrameId = requestAnimationFrame(render2D);
            };
            render2D();
        }
        return;
    }

    function createShader(type, src) {
        if (!gl) return null;
        const s = gl.createShader(type);
        if (!s) return null;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(s));
            gl.deleteShader(s);
            return null;
        }
        return s;
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const prog = gl.createProgram();
    if (!prog) return;

    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (e) => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        if (rect.width && rect.height) {
            const nx = (e.clientX - rect.left) / rect.width;
            const ny = 1.0 - (e.clientY - rect.top) / rect.height;
            mouse.x = nx * canvas.width;
            mouse.y = ny * canvas.height;
        }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = (t) => {
        if (!canvas || !gl) return;
        syncSize();
        gl.viewport(0, 0, canvas.width, canvas.height);
        if (uTime) gl.uniform1f(uTime, t * 0.001);
        if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
        if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        animationFrameId = requestAnimationFrame(render);
    };

    render(0);
}
