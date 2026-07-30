var e=`attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`,t=`precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

varying vec2 v_texCoord;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= u_resolution.x / u_resolution.y;
    
    vec2 mouse = (u_mouse / u_resolution) * 2.0 - 1.0;
    mouse.x *= u_resolution.x / u_resolution.y;

    // Layer 1: Deep Background & Subtle Noise
    vec3 color = vec3(0.043, 0.043, 0.051); // #0B0B0D
    float n = noise(uv * 200.0 + u_time * 0.05);
    color += n * 0.012;

    // Layer 2: Interactive Grid with Mouse Parallax
    vec2 grid_uv = uv + mouse * 0.01;
    vec2 grid = fract(grid_uv * vec2(30.0, 30.0 * (u_resolution.y / u_resolution.x)));
    float line = smoothstep(0.015, 0.0, grid.x) + smoothstep(0.985, 1.0, grid.x) +
                 smoothstep(0.015, 0.0, grid.y) + smoothstep(0.985, 1.0, grid.y);
    color += vec3(0.078, 0.721, 0.651) * line * 0.035;

    // Layer 3: Mouse-following Glow
    float distToMouse = distance(p, mouse);
    float mouseGlow = smoothstep(0.8, 0.0, distToMouse);
    color += vec3(0.078, 0.721, 0.651) * mouseGlow * 0.08;

    // Layer 4: Floating Particles
    for(float i = 0.0; i < 20.0; i++) {
        float t = u_time * (0.05 + hash(vec2(i)) * 0.1);
        vec2 pos = vec2(
            sin(t + i * 2.5) * 1.2,
            cos(t * 0.8 + i * 3.1) * 0.8
        );
        pos += mouse * (0.02 + hash(vec2(i, 5.0)) * 0.02);
        
        float dist = distance(p, pos);
        float brightness = 0.0006 / dist;
        color += vec3(0.078, 0.721, 0.651) * brightness * (0.2 + hash(vec2(i, 4.0)) * 0.4);
    }

    // Layer 5: Large Blurred Ambient Lights
    vec2 glow1_pos = vec2(-0.7 + sin(u_time * 0.2) * 0.3, 0.4 + cos(u_time * 0.3) * 0.2);
    vec2 glow2_pos = vec2(0.8 + cos(u_time * 0.25) * 0.4, -0.5 + sin(u_time * 0.4) * 0.3);
    
    float glow1 = smoothstep(1.2, 0.0, distance(p, glow1_pos));
    float glow2 = smoothstep(1.0, 0.0, distance(p, glow2_pos));
    
    color += vec3(0.078, 0.721, 0.651) * glow1 * 0.1;
    color += vec3(0.078, 0.721, 0.651) * glow2 * 0.07;

    // Layer 6: Subtle Light Beams
    float beam = smoothstep(0.0, 0.02, abs(p.x - p.y + sin(u_time * 0.5) * 0.5)) * 
                 smoothstep(0.02, 0.0, abs(p.x - p.y + sin(u_time * 0.5) * 0.5));
    color += vec3(0.078, 0.721, 0.651) * beam * 0.02 * (0.5 + 0.5 * sin(u_time));

    gl_FragColor = vec4(color, 1.0);
}
`;function n(){let n=document.getElementById(`interactive-bg-canvas`);if(!n)return;let r=n.getContext(`webgl`)||n.getContext(`experimental-webgl`),i=()=>{if(!n)return;let e=n.clientWidth||window.innerWidth,t=n.clientHeight||window.innerHeight;(n.width!==e||n.height!==t)&&(n.width=e,n.height=t)};if(i(),window.addEventListener(`resize`,i),!r){let e=n.getContext(`2d`);if(e){let t=0,r=()=>{i(),t+=.01,e.fillStyle=`#0B0B0D`,e.fillRect(0,0,n.width,n.height),e.strokeStyle=`rgba(20, 184, 166, 0.05)`,e.lineWidth=1;for(let t=0;t<n.width;t+=40)e.beginPath(),e.moveTo(t,0),e.lineTo(t,n.height),e.stroke();for(let t=0;t<n.height;t+=40)e.beginPath(),e.moveTo(0,t),e.lineTo(n.width,t),e.stroke();requestAnimationFrame(r)};r()}return}function a(e,t){if(!r)return null;let n=r.createShader(e);return n?(r.shaderSource(n,t),r.compileShader(n),r.getShaderParameter(n,r.COMPILE_STATUS)?n:(console.error(`Shader compile error:`,r.getShaderInfoLog(n)),r.deleteShader(n),null)):null}let o=a(r.VERTEX_SHADER,e),s=a(r.FRAGMENT_SHADER,t);if(!o||!s)return;let c=r.createProgram();if(!c)return;r.attachShader(c,o),r.attachShader(c,s),r.linkProgram(c),r.useProgram(c);let l=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,l),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),r.STATIC_DRAW);let u=r.getAttribLocation(c,`a_position`);r.enableVertexAttribArray(u),r.vertexAttribPointer(u,2,r.FLOAT,!1,0,0);let d=r.getUniformLocation(c,`u_time`),f=r.getUniformLocation(c,`u_resolution`),p=r.getUniformLocation(c,`u_mouse`),m={x:n.width/2,y:n.height/2};window.addEventListener(`mousemove`,e=>{if(!n)return;let t=n.getBoundingClientRect();if(t.width&&t.height){let r=(e.clientX-t.left)/t.width,i=1-(e.clientY-t.top)/t.height;m.x=r*n.width,m.y=i*n.height}});let h=e=>{!n||!r||(i(),r.viewport(0,0,n.width,n.height),d&&r.uniform1f(d,e*.001),f&&r.uniform2f(f,n.width,n.height),p&&r.uniform2f(p,m.x,m.y),r.drawArrays(r.TRIANGLE_STRIP,0,4),requestAnimationFrame(h))};h(0)}function r(){let e=document.getElementById(`login-card`);if(!e)return;let t=0,n=0,r=0,i=0,a=null,o=()=>{window.__isAuthenticating||(r+=(t-r)*.1,i+=(n-i)*.1,e.style.transform=`perspective(1000px) rotateY(${r.toFixed(2)}deg) rotateX(${i.toFixed(2)}deg)`,a=Math.abs(t-r)>.01||Math.abs(n-i)>.01?requestAnimationFrame(o):null)};window.addEventListener(`mousemove`,e=>{window.innerWidth>768&&(t=(window.innerWidth/2-e.pageX)/90,n=(window.innerHeight/2-e.pageY)/90,a||=requestAnimationFrame(o))}),document.addEventListener(`mouseleave`,()=>{t=0,n=0,a||=requestAnimationFrame(o)})}function i(){console.log(`[FilamentAuth] Initializing particle module...`)}document.addEventListener(`DOMContentLoaded`,()=>{window.matchMedia(`(prefers-reduced-motion: reduce)`).matches?console.log(`[FilamentAuth] Reduced motion preferred. Skipping canvas animations.`):(n(),r(),i());let e=document.getElementById(`login-card`),t=document.getElementById(`auth-background-layer`),a=document.querySelector(`.auth-glass-card form`);a&&a.addEventListener(`submit`,()=>{e?.classList.add(`is-authenticating`),t?.classList.add(`is-authenticating`),window.__isAuthenticating=!0});let o=()=>{setTimeout(()=>{e?.classList.remove(`is-authenticating`),t?.classList.remove(`is-authenticating`),window.__isAuthenticating=!1},200)},s=()=>{!window.Livewire||window.__filamentAuthHooksRegistered||(window.__filamentAuthHooksRegistered=!0,Livewire.hook(`commit`,({component:t,respond:n,fail:r})=>{n(()=>{o(),setTimeout(()=>{if(document.querySelectorAll(`.fi-fo-field-wrp-error-message, .fi-no-notification-danger`).length>0){e?.classList.remove(`auth-card-success`),e?.classList.add(`auth-card-shake`,`auth-card-error`),document.querySelectorAll(`.fi-fo-field, .fi-fo-field-wrp`).forEach(e=>{e.querySelector(`.fi-fo-field-wrp-error-message`)?e.classList.add(`auth-invalid`):e.classList.remove(`auth-invalid`)});let t=a?.querySelector(`input[type="password"]`);t&&t.focus(),setTimeout(()=>{e?.classList.remove(`auth-card-shake`)},450)}else e?.classList.remove(`auth-card-error`),e?.classList.add(`auth-card-success`)},60)}),r(()=>{o(),e?.classList.add(`auth-card-shake`,`auth-card-error`),setTimeout(()=>e?.classList.remove(`auth-card-shake`),450)})}))};window.Livewire?s():document.addEventListener(`livewire:initialized`,s)});