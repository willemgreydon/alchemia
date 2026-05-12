// ALCHEMIA — ambient WebGL background + 2D canvas particle engine
(function () {
  'use strict';

  // ============ WebGL ambient background ============
  // Slow flowing organic noise on cream tone — paper / parchment feel.
  function initAmbient(canvas) {
    const gl = canvas.getContext('webgl', { antialias: true, premultipliedAlpha: false });
    if (!gl) return null;

    const vsrc = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;

    const fsrc = `
      precision highp float;
      uniform vec2 u_res;
      uniform float u_time;
      uniform float u_intensity;

      // simplex noise (Ashima)
      vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
      vec2 mod289(vec2 x){return x - floor(x*(1.0/289.0))*289.0;}
      vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187,0.366025403784439,
                            -0.577350269189626,0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1; i1 = (x0.x>x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
        vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0,i1.y,1.0)) + i.x + vec3(0.0,i1.x,1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res.xy;
        vec2 p = (gl_FragCoord.xy - 0.5*u_res) / min(u_res.x, u_res.y);
        float t = u_time * 0.04;

        // layered noise → soft cloud field
        float n = 0.0;
        n += 0.55 * snoise(p*1.2 + vec2(t, t*0.6));
        n += 0.30 * snoise(p*2.8 + vec2(-t*0.8, t*0.4));
        n += 0.15 * snoise(p*5.5 + vec2(t*1.3, -t*0.9));

        // distance vignette
        float r = length(p);
        float vignette = smoothstep(1.2, 0.2, r);

        // base cream
        vec3 cream = vec3(0.949, 0.929, 0.882);
        vec3 warm  = vec3(0.965, 0.918, 0.835);
        vec3 cool  = vec3(0.890, 0.898, 0.890);

        vec3 col = mix(cream, mix(warm, cool, 0.5 + 0.5*n), 0.10 + 0.10*u_intensity);

        // subtle grain on top
        float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233))) * 43758.5453);
        col -= 0.012 * (grain - 0.5);

        col *= 0.94 + 0.06*vignette;
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type, src) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    }
    const vs = compile(gl.VERTEX_SHADER, vsrc);
    const fs = compile(gl.FRAGMENT_SHADER, fsrc);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1,  1,-1,  -1,1,
      -1, 1,  1,-1,   1,1
    ]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uInt = gl.getUniformLocation(prog, 'u_intensity');

    let intensity = 0;
    let targetIntensity = 0;
    let start = performance.now();

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    function frame() {
      intensity += (targetIntensity - intensity) * 0.04;
      targetIntensity *= 0.985;
      const t = (performance.now() - start) / 1000;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uInt, intensity);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(frame);
    }
    frame();

    return {
      pulse: (amount = 1) => { targetIntensity = Math.min(2, targetIntensity + amount); }
    };
  }

  // ============ 2D canvas particle layer ============
  function initParticles(canvas) {
    const ctx = canvas.getContext('2d');
    const particles = [];
    const rings = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function burst(x, y, color, opts = {}) {
      const count = opts.count || 40;
      const speed = opts.speed || 6;
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = speed * (0.3 + Math.random() * 0.8);
        particles.push({
          x, y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: 1,
          decay: 0.012 + Math.random() * 0.02,
          size: 2 + Math.random() * 5,
          color,
          shape: Math.random() < 0.25 ? 'square' : 'circle',
          rot: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.2
        });
      }
      // expanding ring
      rings.push({ x, y, r: 4, maxR: 110, life: 1, color, width: 3 });
      rings.push({ x, y, r: 2, maxR: 70, life: 1, color: '#FFFFFF', width: 6 });
    }

    function emit(x, y, color, opts = {}) {
      // gentle continuous trail emission
      const count = opts.count || 1;
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 0.5 + Math.random() * 1.5;
        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(a) * s * 0.3,
          vy: Math.sin(a) * s * 0.3 - 0.4,
          life: 1,
          decay: 0.04 + Math.random() * 0.03,
          size: 1.5 + Math.random() * 2.5,
          color,
          shape: 'circle',
          rot: 0, spin: 0
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      // rings
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.r += (r.maxR - r.r) * 0.12;
        r.life -= 0.035;
        if (r.life <= 0) { rings.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = Math.max(0, r.life);
        ctx.strokeStyle = r.color;
        ctx.lineWidth = r.width * r.life;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy = p.vy * 0.96 + 0.08; // gravity
        p.rot += p.spin;
        p.life -= p.decay;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        if (p.shape === 'square') {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          const s = p.size * p.life;
          ctx.fillRect(-s/2, -s/2, s, s);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * Math.max(0.2, p.life), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      requestAnimationFrame(frame);
    }
    frame();

    return { burst, emit };
  }

  window.ALCHEMIA_FX = { initAmbient, initParticles };
})();
