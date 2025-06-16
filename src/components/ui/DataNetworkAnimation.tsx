import React, { useEffect, useRef } from "react";
import {
  Renderer,
  Program,
  Mesh,
  Triangle,
  Transform,
  Vec3,
  Camera,
} from "ogl";

type DataNetworkAnimationProps = {
  color?: string;
  speed?: number;
  enableMouseInteraction?: boolean;
  hoverSmoothness?: number;
  animationSize?: number;
  nodeCount?: number;
  clumpFactor?: number;
  cursorNodeSize?: number;
  cursorNodeColor?: string;
  enableTransparency?: boolean;
};

function parseHexColor(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  return [r, g, b];
}

function fract(x: number): number {
  return x - Math.floor(x);
}

function hash31(p: number): number[] {
  let r = [p * 0.1031, p * 0.103, p * 0.0973].map(fract);
  const r_yzx = [r[1], r[2], r[0]];
  const dotVal =
    r[0] * (r_yzx[0] + 33.33) +
    r[1] * (r_yzx[1] + 33.33) +
    r[2] * (r_yzx[2] + 33.33);
  for (let i = 0; i < 3; i++) {
    r[i] = fract(r[i] + dotVal);
  }
  return r;
}

function hash33(v: number[]): number[] {
  let p = [v[0] * 0.1031, v[1] * 0.103, v[2] * 0.0973].map(fract);
  const p_yxz = [p[1], p[0], p[2]];
  const dotVal =
    p[0] * (p_yxz[0] + 33.33) +
    p[1] * (p_yxz[1] + 33.33) +
    p[2] * (p_yxz[2] + 33.33);
  for (let i = 0; i < 3; i++) {
    p[i] = fract(p[i] + dotVal);
  }
  const p_xxy = [p[0], p[0], p[1]];
  const p_yxx = [p[1], p[0], p[0]];
  const p_zyx = [p[2], p[1], p[0]];
  const result: number[] = [];
  for (let i = 0; i < 3; i++) {
    result[i] = fract((p_xxy[i] + p_yxx[i]) * p_zyx[i]);
  }
  return result;
}

const vertex = `#version 300 es
precision highp float;
layout(location = 0) in vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec3 iMouse;
uniform vec3 iColor;
uniform vec3 iCursorColor;
uniform float iAnimationSize;
uniform int iNodeCount;
uniform float iCursorNodeSize;
uniform vec3 iDataNodes[50];
uniform float iClumpFactor;
uniform bool enableTransparency;
out vec4 outColor;
const float PI = 3.14159265359;

float getNodeValue(vec2 c, float r, vec2 p) {
    vec2 d = p - c;
    float dist2 = dot(d, d);
    return (r * r) / dist2;
}

// Neural network connection lines
float drawConnection(vec2 p, vec2 a, vec2 b, float thickness) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    float dist = length(pa - ba * h);
    return smoothstep(thickness, thickness * 0.5, dist);
}

// Data pulse effect along connections
float dataPulse(vec2 p, vec2 a, vec2 b, float time, float speed) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    float pulsePos = mod(time * speed, 1.0);
    float pulseDist = abs(h - pulsePos);
    return exp(-pulseDist * 20.0) * 0.3;
}

// Grid pattern for tech aesthetic
float techGrid(vec2 coord, float scale) {
    vec2 grid = abs(fract(coord * scale) - 0.5);
    return smoothstep(0.0, 0.1, min(grid.x, grid.y)) * 0.1;
}

void main() {
    vec2 fc = gl_FragCoord.xy;
    float scale = iAnimationSize / iResolution.y;
    vec2 coord = (fc - iResolution.xy * 0.5) * scale;
    vec2 mouseW = (iMouse.xy - iResolution.xy * 0.5) * scale;
    
    // Data nodes calculation
    float m1 = 0.0;
    for (int i = 0; i < 50; i++) {
        if (i >= iNodeCount) break;
        m1 += getNodeValue(iDataNodes[i].xy, iDataNodes[i].z, coord);
    }
    float m2 = getNodeValue(mouseW, iCursorNodeSize, coord);
    float total = m1 + m2;
    float f = smoothstep(-1.0, 1.0, (total - 1.3) / min(1.0, fwidth(total)));
    
    // Neural network connections
    float connections = 0.0;
    float dataFlow = 0.0;
    for (int i = 0; i < 50; i++) {
        if (i >= iNodeCount) break;
        for (int j = i + 1; j < 50; j++) {
            if (j >= iNodeCount) break;
            vec2 nodeA = iDataNodes[i].xy;
            vec2 nodeB = iDataNodes[j].xy;
            float dist = distance(nodeA, nodeB);
            
            // Only draw connections between nearby nodes
            if (dist < 8.0) {
                float strength = 1.0 - (dist / 8.0);
                connections += drawConnection(coord, nodeA, nodeB, 0.12) * strength * 0.3;
                dataFlow += dataPulse(coord, nodeA, nodeB, iTime, 1.5) * strength;
            }
        }
    }
    
    // Node glow effect (tech aesthetic)
    float nodeGlow = 0.0;
    for (int i = 0; i < 50; i++) {
        if (i >= iNodeCount) break;
        vec2 nodePos = iDataNodes[i].xy;
        float dist = distance(coord, nodePos);
        float radius = iDataNodes[i].z;
        
        // Sharp core with soft glow
        float core = exp(-dist / (radius * 0.5)) * 0.2;
        float glow = exp(-dist / (radius * 3.0)) * 0.08;
        nodeGlow += core + glow;
    }
    
    // Tech grid background
    float grid = techGrid(coord, 0.5);
    
    // Combine effects
    vec3 cFinal = vec3(0.0);
    if (total > 0.0) {
        float alpha1 = m1 / total;
        float alpha2 = m2 / total;
        cFinal = iColor * alpha1 + iCursorColor * alpha2;
    }
    
    // Add network effects
    float networkEffect = connections + dataFlow + nodeGlow + grid;
    cFinal += iColor * networkEffect;
    
    float finalAlpha = f + networkEffect * 0.7;
    outColor = vec4(cFinal * finalAlpha, enableTransparency ? finalAlpha : 1.0);
}
`;

type NodeParams = {
  st: number;
  dtFactor: number;
  baseScale: number;
  toggle: number;
  radius: number;
  orbitRadius: number;
  phase: number;
};

const DataNetworkAnimation: React.FC<DataNetworkAnimationProps> = ({
  color = "#ffffff",
  speed = 0.3,
  enableMouseInteraction = true,
  hoverSmoothness = 0.05,
  animationSize = 30,
  nodeCount = 15,
  clumpFactor = 1,
  cursorNodeSize = 3,
  cursorNodeColor = "#ffffff",
  enableTransparency = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const dpr = 1;
    const renderer = new Renderer({
      dpr,
      alpha: true,
      premultipliedAlpha: false,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, enableTransparency ? 0 : 1);
    container.appendChild(gl.canvas);

    const camera = new Camera(gl, {
      left: -1,
      right: 1,
      top: 1,
      bottom: -1,
      near: 0.1,
      far: 10,
    });
    camera.position.z = 1;

    const geometry = new Triangle(gl);
    const [r1, g1, b1] = parseHexColor(color);
    const [r2, g2, b2] = parseHexColor(cursorNodeColor);

    const dataNodesUniform: Vec3[] = [];
    for (let i = 0; i < 50; i++) {
      dataNodesUniform.push(new Vec3(0, 0, 0));
    }

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec3(0, 0, 0) },
        iMouse: { value: new Vec3(0, 0, 0) },
        iColor: { value: new Vec3(r1, g1, b1) },
        iCursorColor: { value: new Vec3(r2, g2, b2) },
        iAnimationSize: { value: animationSize },
        iNodeCount: { value: nodeCount },
        iCursorNodeSize: { value: cursorNodeSize },
        iDataNodes: { value: dataNodesUniform },
        iClumpFactor: { value: clumpFactor },
        enableTransparency: { value: enableTransparency },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    const scene = new Transform();
    mesh.setParent(scene);

    const maxNodes = 50;
    const effectiveNodeCount = Math.min(nodeCount, maxNodes);
    const nodeParams: NodeParams[] = [];
    
    // Create more structured, tech-like movement patterns
    for (let i = 0; i < effectiveNodeCount; i++) {
      const idx = i + 1;
      const h1 = hash31(idx);
      
      // More structured orbits for tech aesthetic
      const orbitRadius = 3.0 + (i % 3) * 2.0;
      const phase = (i / effectiveNodeCount) * 2 * Math.PI;
      const st = h1[0] * (2 * Math.PI);
      const dtFactor = 0.05 * Math.PI + h1[1] * (0.15 * Math.PI - 0.05 * Math.PI);
      const baseScale = orbitRadius;
      
      const h2 = hash33(h1);
      const toggle = Math.floor(h2[0] * 3.0); // More variation
      const radiusVal = 0.3 + h2[2] * (1.2 - 0.3);
      
      nodeParams.push({ 
        st, 
        dtFactor, 
        baseScale, 
        toggle, 
        radius: radiusVal,
        orbitRadius,
        phase
      });
    }

    const mouseBallPos = { x: 0, y: 0 };
    let pointerInside = false;
    let pointerX = 0;
    let pointerY = 0;

    function resize() {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width * dpr, height * dpr);
      gl.canvas.style.width = `${width}px`;
      gl.canvas.style.height = `${height}px`;
      program.uniforms.iResolution.value.set(
        gl.canvas.width,
        gl.canvas.height,
        0
      );
    }
    window.addEventListener("resize", resize);
    resize();

    function onPointerMove(e: PointerEvent) {
      if (!enableMouseInteraction || !container) return;
      const rect = container.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      pointerX = (px / rect.width) * gl.canvas.width;
      pointerY = (1 - py / rect.height) * gl.canvas.height;
    }
    function onPointerEnter() {
      if (!enableMouseInteraction) return;
      pointerInside = true;
    }
    function onPointerLeave() {
      if (!enableMouseInteraction) return;
      pointerInside = false;
    }
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerenter", onPointerEnter);
    container.addEventListener("pointerleave", onPointerLeave);

    const startTime = performance.now();
    let animationFrameId: number;
    function update(t: number) {
      animationFrameId = requestAnimationFrame(update);
      const elapsed = (t - startTime) * 0.001;
      program.uniforms.iTime.value = elapsed;

      for (let i = 0; i < effectiveNodeCount; i++) {
        const p = nodeParams[i];
        const dt = elapsed * speed * p.dtFactor;
        
        // More structured, orbital movements
        const mainOrbit = p.st + dt;
        const x = Math.cos(mainOrbit + p.phase) * p.orbitRadius * clumpFactor;
        const y = Math.sin(mainOrbit + p.phase) * p.orbitRadius * clumpFactor;
        
        // Add secondary motion for complexity
        const secondaryMotion = Math.sin(dt * p.toggle) * 0.5;
        
        dataNodesUniform[i].set(
          x + secondaryMotion, 
          y + secondaryMotion * 0.5, 
          p.radius
        );
      }

      let targetX: number, targetY: number;
      if (pointerInside) {
        targetX = pointerX;
        targetY = pointerY;
      } else {
        const cx = gl.canvas.width * 0.5;
        const cy = gl.canvas.height * 0.5;
        const rx = gl.canvas.width * 0.1;
        const ry = gl.canvas.height * 0.1;
        targetX = cx + Math.cos(elapsed * speed * 0.5) * rx;
        targetY = cy + Math.sin(elapsed * speed * 0.5) * ry;
      }
      mouseBallPos.x += (targetX - mouseBallPos.x) * hoverSmoothness;
      mouseBallPos.y += (targetY - mouseBallPos.y) * hoverSmoothness;
      program.uniforms.iMouse.value.set(mouseBallPos.x, mouseBallPos.y, 0);

      renderer.render({ scene, camera });
    }
    animationFrameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerenter", onPointerEnter);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    color,
    cursorNodeColor,
    speed,
    enableMouseInteraction,
    hoverSmoothness,
    animationSize,
    nodeCount,
    clumpFactor,
    cursorNodeSize,
    enableTransparency,
  ]);

  return <div ref={containerRef} className="w-full h-full relative" />;
};

export default DataNetworkAnimation;