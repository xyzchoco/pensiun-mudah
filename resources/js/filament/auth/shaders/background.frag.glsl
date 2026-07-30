precision highp float;
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
