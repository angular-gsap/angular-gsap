import { Component, ElementRef, viewChild } from '@angular/core';
import { injectGsap, target } from '@angular-gsap/core';
import { CodeSnippet } from '../code-snippet';
import { injectLocale } from '../i18n';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'WebGL · angular-gsap',
};

const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_warp;
uniform float u_hue;
uniform float u_zoom;
uniform vec2 u_mouse;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
  uv = uv * u_zoom - u_mouse;
  float d = length(uv);
  float a = atan(uv.y, uv.x);
  float wave = sin(12.0 * d - u_time * 2.0 + u_warp * 5.0 * sin(3.0 * a + u_time * 0.7));
  float band = smoothstep(-0.12, 0.12, wave);
  float pick = step(0.0, sin(5.0 * d - u_time * 0.6));
  vec3 c1 = hsv2rgb(vec3(fract(u_hue), 0.85, 0.96));
  vec3 c2 = hsv2rgb(vec3(fract(u_hue + 0.42), 0.85, 0.96));
  vec3 bright = mix(c1, c2, pick);
  vec3 dark = vec3(0.075, 0.075, 0.086);
  gl_FragColor = vec4(mix(dark, bright, band), 1.0);
}`;

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const COPY = {
  en: {
    eyebrow: 'Example · WebGL',
    title: 'WebGL uniforms',
    intro:
      "GSAP tweens plain object properties, so shader uniforms are fair game. The render loop runs on <code>gsap.ticker</code>, the ambient drift is a yoyo tween on <code>u_warp</code>, the pattern's center chases the pointer through two <code>quickTo</code> setters, and Pulse tweens zoom and hue. The returned cleanup removes the ticker callback on destroy.",
    pulse: 'Pulse',
    how: 'How this works',
    explain: [
      'The uniforms live in a plain object. <code>gsap.to(u, { warp: 0.9 })</code> works exactly like tweening an element, because to GSAP everything is just properties over time.',
      'The draw call is a <code>gsap.ticker</code> callback: one shared requestAnimationFrame, in sync with every other tween, outside change detection.',
      "The callback returns a cleanup function, and the context runs it on destroy, exactly like <code>gsap.context()</code>. The GL loop can't outlive the component.",
    ],
  },
  es: {
    eyebrow: 'Ejemplo · WebGL',
    title: 'Uniforms de WebGL',
    intro:
      'GSAP anima propiedades de objetos planos, así que los uniforms de un shader también cuentan. El loop de render corre en <code>gsap.ticker</code>, la deriva ambiental es un tween yoyo sobre <code>u_warp</code>, y el centro del patrón persigue al puntero con dos setters <code>quickTo</code>, y Pulso anima zoom y tono. La limpieza devuelta quita el callback del ticker al destruir.',
    pulse: 'Pulso',
    how: 'Cómo funciona',
    explain: [
      'Los uniforms viven en un objeto plano. <code>gsap.to(u, { warp: 0.9 })</code> funciona exactamente igual que animar un elemento, porque para GSAP todo son propiedades en el tiempo.',
      'El draw call es un callback de <code>gsap.ticker</code>: un solo requestAnimationFrame compartido, en sincronía con el resto de los tweens, fuera de change detection.',
      'El callback devuelve una función de limpieza y el contexto la ejecuta al destruir, igual que <code>gsap.context()</code>. El loop de GL no puede sobrevivir al componente.',
    ],
  },
} as const;

@Component({
  selector: 'app-webgl',
  imports: [CodeSnippet],
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">{{ c.eyebrow }}</p>
        <h1>{{ c.title }}</h1>
        <p [innerHTML]="c.intro"></p>
        <div class="api-chips">
          <span>gsap.ticker</span><span>uniforms</span
          ><span>cleanup functions</span>
        </div>
      </header>

      <div class="example">
        <div>
          <div
            class="stage gl-stage"
            (pointermove)="onMove($event)"
            (pointerleave)="onLeave()"
          >
            <canvas #cnv></canvas>
          </div>
          <div class="stage-controls">
            <button class="btn" (click)="pulse()">{{ c.pulse }}</button>
          </div>
        </div>
        <div class="panels">
          <app-code [code]="snippet" label="shader.ts" />
        </div>
      </div>

      <section class="explain">
        <h2>{{ c.how }}</h2>
        <ul>
          @for (item of c.explain; track $index) {
            <li [innerHTML]="item"></li>
          }
        </ul>
      </section>
    </div>
  `,
  styles: `
    .gl-stage {
      background-image: none;
      padding: 0;
      display: grid;

      canvas {
        width: 100%;
        height: 100%;
        min-height: 22rem;
        display: block;
      }
    }
  `,
})
export default class WebglPage {
  protected readonly c = COPY[injectLocale()];

  private readonly canvas =
    viewChild.required<ElementRef<HTMLCanvasElement>>('cnv');

  private readonly u = { warp: 0.25, hue: 0.36, zoom: 1, mx: 0, my: 0 };
  private moveX?: (v: number) => unknown;
  private moveY?: (v: number) => unknown;

  protected readonly ref = injectGsap(({ gsap }) => {
    const canvas = target(this.canvas);
    const gl = canvas?.getContext('webgl');
    if (!canvas || !gl) {
      return;
    }

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram();
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!program || !vs || !fs) {
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uni = (name: string) => gl.getUniformLocation(program, name);
    const uRes = uni('u_res');
    const uTime = uni('u_time');
    const uWarp = uni('u_warp');
    const uHue = uni('u_hue');
    const uZoom = uni('u_zoom');
    const uMouse = uni('u_mouse');

    const render = (time: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uWarp, this.u.warp);
      gl.uniform1f(uHue, this.u.hue);
      gl.uniform1f(uZoom, this.u.zoom);
      gl.uniform2f(uMouse, this.u.mx, this.u.my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    gsap.ticker.add(render);

    // one reusable tween per pointer axis, quickTo style
    this.moveX = gsap.quickTo(this.u, 'mx', { duration: 0.6, ease: 'power3' });
    this.moveY = gsap.quickTo(this.u, 'my', { duration: 0.6, ease: 'power3' });

    // ambient drift: a tween on a plain object
    gsap.to(this.u, {
      warp: 0.9,
      duration: 6,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    return () => gsap.ticker.remove(render);
  });

  protected onMove = this.ref.contextSafe((event: PointerEvent) => {
    const canvas = target(this.canvas);
    if (!canvas) {
      return;
    }
    const r = canvas.getBoundingClientRect();
    const m = Math.min(r.width, r.height);
    this.moveX?.((event.clientX - r.left - r.width / 2) / m);
    this.moveY?.(-(event.clientY - r.top - r.height / 2) / m);
  });

  protected onLeave = this.ref.contextSafe(() => {
    this.moveX?.(0);
    this.moveY?.(0);
  });

  protected pulse = this.ref.contextSafe(() => {
    this.ref.gsap.fromTo(
      this.u,
      { zoom: 1.7 },
      { zoom: 1, duration: 1.1, ease: 'expo.out' }
    );
    this.ref.gsap.to(this.u, {
      hue: this.u.hue + 0.23,
      duration: 1.1,
      ease: 'power2.out',
    });
  });

  protected readonly snippet = [
    `u = { warp: 0.25, hue: 0.36, zoom: 1, mx: 0, my: 0 };`,
    ``,
    `ref = injectGsap(({ gsap }) => {`,
    `  // …compile shader, look up uniforms…`,
    `  const render = () => {`,
    `    gl.uniform2f(uMouse, this.u.mx, this.u.my);`,
    `    gl.drawArrays(gl.TRIANGLES, 0, 3);`,
    `  };`,
    `  gsap.ticker.add(render);`,
    ``,
    `  // uniforms are just object properties`,
    `  this.moveX = gsap.quickTo(this.u, 'mx',`,
    `    { duration: 0.6, ease: 'power3' });`,
    `  gsap.to(this.u, { warp: 0.9, yoyo: true, repeat: -1 });`,
    ``,
    `  // runs on revert/destroy, like gsap.context()`,
    `  return () => gsap.ticker.remove(render);`,
    `});`,
    ``,
    `onMove = this.ref.contextSafe((e: PointerEvent) =>`,
    `  this.moveX?.(toUv(e).x)`,
    `);`,
  ].join('\n');
}
