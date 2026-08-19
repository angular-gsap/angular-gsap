import { Component, ElementRef, viewChild } from '@angular/core';
import { injectGsap, target } from '@angular-gsap/core';
import { CodeSnippet } from '../code-snippet';
import { injectLocale } from '../i18n';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'WebGL · angular-gsap',
};

const COPY = {
  en: {
    eyebrow: 'Example · WebGL',
    title: 'A cube driven by tweens',
    intro:
      "The cube's rotation, tilt, and scale live in a plain object; GSAP tweens it like anything else. An infinite linear tween spins it, two <code>quickTo</code> setters tilt it toward the pointer, Pulse punches the scale, and the render loop is a <code>gsap.ticker</code> callback removed by the returned cleanup.",
    hint: 'move the pointer to tilt the cube',
    pulse: 'Pulse',
    how: 'How this works',
    explain: [
      'There is no 3D library here, just a plain object <code>{ spin, tiltX, tiltY, scale }</code> and a hand-rolled matrix. GSAP does not care: to it, rotation angles are properties over time like any CSS pixel.',
      "The infinite spin is <code>gsap.to(rot, { spin: '+=6.28', repeat: -1, ease: 'none' })</code>; the pointer tilt is two <code>quickTo</code> setters, so hundreds of pointer events per second reuse one tween per axis.",
      "Drawing happens in a <code>gsap.ticker</code> callback, one shared frame loop with every other tween, outside change detection. The callback returns a cleanup and the context runs it on destroy, so the GL loop can't outlive the component.",
    ],
  },
  es: {
    eyebrow: 'Ejemplo · WebGL',
    title: 'Un cubo movido por tweens',
    intro:
      'La rotación, inclinación y escala del cubo viven en un objeto plano; GSAP lo anima como cualquier otra cosa. Un tween lineal infinito lo gira, dos setters <code>quickTo</code> lo inclinan hacia el puntero, el botón Pulso le da un empujón a la escala, y el loop de render es un callback de <code>gsap.ticker</code> que se quita con la limpieza devuelta.',
    hint: 'mueve el puntero para inclinar el cubo',
    pulse: 'Pulso',
    how: 'Cómo funciona',
    explain: [
      'Aquí no hay librería 3D: solo un objeto plano <code>{ spin, tiltX, tiltY, scale }</code> y una matriz hecha a mano. A GSAP no le importa: para él, los ángulos de rotación son propiedades en el tiempo, igual que un pixel de CSS.',
      "El giro infinito es <code>gsap.to(rot, { spin: '+=6.28', repeat: -1, ease: 'none' })</code>; la inclinación del puntero son dos setters <code>quickTo</code>, así que cientos de eventos por segundo reutilizan un tween por eje.",
      'El dibujado ocurre en un callback de <code>gsap.ticker</code>, un solo loop de frames compartido con el resto de los tweens, fuera de change detection. El callback devuelve una limpieza y el contexto la ejecuta al destruir: el loop de GL no puede sobrevivir al componente.',
    ],
  },
} as const;

const VERT = `
attribute vec3 pos;
attribute vec3 col;
uniform mat4 mvp;
varying vec3 vColor;
void main() {
  vColor = col;
  gl_Position = mvp * vec4(pos, 1.0);
}`;

const FRAG = `
precision mediump float;
varying vec3 vColor;
uniform float u_edge;
void main() {
  gl_FragColor = vec4(mix(vColor, vec3(0.075, 0.075, 0.086), u_edge), 1.0);
}`;

// neo-brutal palette, one flat color per face
const FACE_COLORS: [number, number, number][] = [
  [0.886, 0.231, 0.502], // pulse pink
  [0.039, 0.894, 0.282], // kinetic green
  [0.357, 0.294, 0.91], // arc violet
  [1.0, 0.714, 0.153], // ember amber
  [0.949, 0.937, 0.902], // paper
  [0.29, 0.29, 0.33], // graphite
];

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
          <span>gsap.ticker</span><span>quickTo</span
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
            <p class="hint">{{ c.hint }}</p>
          </div>
          <div class="stage-controls">
            <button class="btn" (click)="pulse()">{{ c.pulse }}</button>
          </div>
        </div>
        <div class="panels">
          <app-code [code]="snippet" label="cube.ts" />
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
      display: grid;

      canvas {
        width: 100%;
        height: 100%;
        min-height: 24rem;
        display: block;
        touch-action: none;
      }
    }

    .hint {
      position: absolute;
      bottom: 0.9rem;
      left: 0;
      right: 0;
      text-align: center;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--ink-soft);
      pointer-events: none;
      margin: 0;
    }
  `,
})
export default class WebglPage {
  protected readonly c = COPY[injectLocale()];

  private readonly canvas =
    viewChild.required<ElementRef<HTMLCanvasElement>>('cnv');

  private readonly rot = { spin: 0.6, tiltX: 0, tiltY: -0.35, scale: 1 };
  private tiltToX?: (v: number) => unknown;
  private tiltToY?: (v: number) => unknown;

  protected readonly ref = injectGsap(({ gsap }) => {
    const canvas = target(this.canvas);
    const gl = canvas?.getContext('webgl', { alpha: true });
    if (!canvas || !gl) {
      return;
    }

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
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
    gl.enable(gl.DEPTH_TEST);

    // cube: 8 corners, 6 faces x 2 triangles, one flat color per face
    const P = [
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
      [-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1],
    ];
    const faces = [
      [0, 1, 2, 3], [7, 4, 5, 6], [3, 2, 6, 5], [4, 7, 1, 0], [1, 7, 6, 2], [4, 0, 3, 5],
    ];
    const verts: number[] = [];
    faces.forEach((f, i) => {
      const color = FACE_COLORS[i];
      for (const idx of [0, 1, 2, 0, 2, 3]) {
        verts.push(...P[f[idx]], ...color);
      }
    });
    const edgeVerts: number[] = [];
    const edgePairs = [
      [0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 7], [2, 6], [3, 5],
    ];
    for (const [a, b] of edgePairs) {
      edgeVerts.push(...P[a], 0, 0, 0, ...P[b], 0, 0, 0);
    }

    const mkBuf = (data: number[]) => {
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
      return b;
    };
    const faceBuf = mkBuf(verts);
    const edgeBuf = mkBuf(edgeVerts);
    const aPos = gl.getAttribLocation(program, 'pos');
    const aCol = gl.getAttribLocation(program, 'col');
    const uMvp = gl.getUniformLocation(program, 'mvp');
    const uEdge = gl.getUniformLocation(program, 'u_edge');

    const bind = (buf: WebGLBuffer | null) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 24, 0);
      gl.enableVertexAttribArray(aCol);
      gl.vertexAttribPointer(aCol, 3, gl.FLOAT, false, 24, 12);
    };

    // perspective * translate(z) * rotX * rotY * uniform scale, column-major
    const mvp = (aspect: number) => {
      const rx = this.rot.tiltY;
      const ry = this.rot.spin + this.rot.tiltX;
      const s = this.rot.scale;
      const cx = Math.cos(rx), sx = Math.sin(rx);
      const cy = Math.cos(ry), sy = Math.sin(ry);
      const m = [
        s * cy, s * sx * sy, s * -cx * sy,
        0, s * cx, s * sx,
        s * sy, s * -sx * cy, s * cx * cy,
      ];
      const f = 2.2, near = 0.1, far = 20, z = -6;
      const px = f / aspect;
      const pz = (far + near) / (near - far);
      const pw = (2 * far * near) / (near - far);
      return new Float32Array([
        px * m[0], f * m[1], pz * m[2], -m[2],
        px * m[3], f * m[4], pz * m[5], -m[5],
        px * m[6], f * m[7], pz * m[8], -m[8],
        0, 0, pz * z + pw, -z,
      ]);
    };

    const render = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniformMatrix4fv(uMvp, false, mvp(w / h));
      gl.uniform1f(uEdge, 0);
      bind(faceBuf);
      gl.drawArrays(gl.TRIANGLES, 0, 36);
      gl.uniform1f(uEdge, 1);
      bind(edgeBuf);
      gl.lineWidth(2);
      gl.drawArrays(gl.LINES, 0, 24);
    };
    gsap.ticker.add(render);

    // ambient spin: one endless linear tween on a plain object
    gsap.to(this.rot, {
      spin: '+=6.28318',
      duration: 10,
      repeat: -1,
      ease: 'none',
    });

    // pointer tilt: one reusable tween per axis
    this.tiltToX = gsap.quickTo(this.rot, 'tiltX', {
      duration: 0.6,
      ease: 'power3',
    });
    this.tiltToY = gsap.quickTo(this.rot, 'tiltY', {
      duration: 0.6,
      ease: 'power3',
    });

    return () => gsap.ticker.remove(render);
  });

  protected onMove = this.ref.contextSafe((event: PointerEvent) => {
    const canvas = target(this.canvas);
    if (!canvas) {
      return;
    }
    const r = canvas.getBoundingClientRect();
    this.tiltToX?.(((event.clientX - r.left) / r.width - 0.5) * 1.6);
    this.tiltToY?.(((event.clientY - r.top) / r.height - 0.5) * 1.4 - 0.35);
  });

  protected onLeave = this.ref.contextSafe(() => {
    this.tiltToX?.(0);
    this.tiltToY?.(-0.35);
  });

  protected pulse = this.ref.contextSafe(() => {
    this.ref.gsap.fromTo(
      this.rot,
      { scale: 1.45 },
      { scale: 1, duration: 1.1, ease: 'elastic.out(1, 0.45)' }
    );
    this.ref.gsap.to(this.rot, {
      spin: '+=1.5708',
      duration: 0.9,
      ease: 'back.inOut(1.4)',
    });
  });

  protected readonly snippet = [
    `rot = { spin: 0.6, tiltX: 0, tiltY: -0.35, scale: 1 };`,
    ``,
    `ref = injectGsap(({ gsap }) => {`,
    `  // …compile shaders, upload the cube…`,
    `  const render = () => {`,
    `    gl.uniformMatrix4fv(uMvp, false, mvp(this.rot));`,
    `    gl.drawArrays(gl.TRIANGLES, 0, 36);`,
    `  };`,
    `  gsap.ticker.add(render);`,
    ``,
    `  // endless spin on a plain object`,
    `  gsap.to(this.rot, {`,
    `    spin: '+=6.28', duration: 10,`,
    `    repeat: -1, ease: 'none',`,
    `  });`,
    ``,
    `  // one reusable tween per tilt axis`,
    `  this.tiltToX = gsap.quickTo(this.rot, 'tiltX',`,
    `    { duration: 0.6, ease: 'power3' });`,
    ``,
    `  return () => gsap.ticker.remove(render);`,
    `});`,
    ``,
    `pulse = this.ref.contextSafe(() =>`,
    `  this.ref.gsap.fromTo(this.rot,`,
    `    { scale: 1.45 },`,
    `    { scale: 1, ease: 'elastic.out(1, 0.45)' })`,
    `);`,
  ].join('\n');
}
