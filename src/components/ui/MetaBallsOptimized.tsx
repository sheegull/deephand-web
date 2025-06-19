import React, { useEffect, useRef, useState } from "react";
import {
  Renderer,
  Program,
  Mesh,
  Triangle,
  Transform,
  Vec3,
  Camera,
} from "ogl";

// モバイル性能最適化されたMetaBalls
// TDD: パフォーマンステストで検証される最適化実装

type OptimizedMetaBallsProps = {
  color?: string;
  speed?: number;
  enableMouseInteraction?: boolean;
  hoverSmoothness?: number;
  animationSize?: number;
  ballCount?: number;
  clumpFactor?: number;
  cursorBallSize?: number;
  cursorBallColor?: string;
  enableTransparency?: boolean;
};

interface DeviceCapabilities {
  isLowEnd: boolean;
  isMobile: boolean;
  cpuCores: number;
  memoryGB?: number;
}

// シンプルなデバイス性能検出
const detectDeviceCapabilities = (): DeviceCapabilities => {
  if (typeof window === 'undefined') {
    return { isLowEnd: false, isMobile: false, cpuCores: 4 };
  }

  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as any).deviceMemory;
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  const isLowEnd = cores <= 2 || (memory && memory <= 4) || isMobile;

  return {
    isLowEnd,
    isMobile,
    cpuCores: cores,
    memoryGB: memory,
  };
};

function parseHexColor(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;
  return [r, g, b];
}

// 軽量ハッシュ関数（計算量削減）
function simpleHash(x: number): number {
  return ((x * 0.1031) % 1 + 1) % 1;
}

function simpleHash3(x: number): [number, number, number] {
  const h1 = simpleHash(x);
  const h2 = simpleHash(x + 1.7);
  const h3 = simpleHash(x + 3.3);
  return [h1, h2, h3];
}

// 最適化されたバーテックスシェーダー（変更なし）
const vertex = `#version 300 es
precision mediump float;
layout(location = 0) in vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

// 大幅に最適化されたフラグメントシェーダー
const optimizedFragment = `#version 300 es
precision mediump float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec3 iMouse;
uniform vec3 iColor;
uniform vec3 iCursorColor;
uniform float iAnimationSize;
uniform int iBallCount;
uniform float iCursorBallSize;
uniform vec3 iMetaBalls[20]; // 50→20に削減（60%削減）
uniform float iClumpFactor;
uniform bool enableTransparency;
uniform float iOptimizationLevel; // 最適化レベル
out vec4 outColor;

// 高速化されたメタボール計算
float fastMetaBallValue(vec2 c, float r, vec2 p) {
    vec2 d = p - c;
    float dist2 = dot(d, d) + 0.001; // 0除算防止
    return (r * r) / dist2;
}

// 最適化されたメイン関数
void main() {
    vec2 fc = gl_FragCoord.xy;
    float scale = iAnimationSize / iResolution.y;
    vec2 coord = (fc - iResolution.xy * 0.5) * scale;
    vec2 mouseW = (iMouse.xy - iResolution.xy * 0.5) * scale;
    
    float m1 = 0.0;
    int effectiveBallCount = min(iBallCount, 20); // 上限を20に固定
    
    // ループ最適化: 早期終了条件追加
    for (int i = 0; i < 20; i++) {
        if (i >= effectiveBallCount) break;
        
        // 距離チェック: 遠すぎる場合は計算スキップ
        vec2 ballPos = iMetaBalls[i].xy;
        float distanceToCenter = length(ballPos - coord);
        if (distanceToCenter > 15.0 * iOptimizationLevel) continue; // 最適化レベルに応じた距離閾値
        
        m1 += fastMetaBallValue(ballPos, iMetaBalls[i].z, coord);
    }
    
    // マウスボール計算（条件付き）
    float m2 = 0.0;
    float mouseDistance = length(mouseW - coord);
    if (mouseDistance < 10.0 * iOptimizationLevel) { // 近い場合のみ計算
        m2 = fastMetaBallValue(mouseW, iCursorBallSize, coord);
    }
    
    float total = m1 + m2;
    
    // 簡素化されたスムーズステップ
    float threshold = 1.3 * iOptimizationLevel; // 最適化レベルに応じた閾値
    float f = smoothstep(threshold - 0.5, threshold + 0.5, total);
    
    // 色計算の最適化
    vec3 cFinal = vec3(0.0);
    if (total > 0.1) { // 閾値で不要な計算を避ける
        float alpha1 = m1 / (total + 0.001);
        float alpha2 = m2 / (total + 0.001);
        cFinal = iColor * alpha1 + iCursorColor * alpha2;
    }
    
    // ファイナル出力
    outColor = vec4(cFinal * f, enableTransparency ? f : 1.0);
}
`;

type OptimizedBallParams = {
  x: number;
  y: number;
  radius: number;
  speed: number;
  angle: number;
  orbitRadius: number;
};

const OptimizedMetaBalls: React.FC<OptimizedMetaBallsProps> = ({
  color = "#ffffff",
  speed = 0.25, // 0.3→0.25 (17%削減)
  enableMouseInteraction = true,
  hoverSmoothness = 0.08, // 0.05→0.08 (レスポンス削減でCPU負荷軽減)
  animationSize = 25, // 30→25 (17%削減)
  ballCount = 8, // 15→8 (47%削減)
  clumpFactor = 0.8, // 1→0.8 (20%削減)
  cursorBallSize = 2.5, // 3→2.5 (17%削減)
  cursorBallColor = "#ffffff",
  enableTransparency = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities>({
    isLowEnd: false,
    isMobile: false,
    cpuCores: 4,
  });

  useEffect(() => {
    setDeviceCapabilities(detectDeviceCapabilities());
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // デバイスに応じた設定
    const getOptimizedSettings = () => {
      if (deviceCapabilities.isLowEnd) {
        return {
          ballCount: Math.min(ballCount, 5), // 最大5個
          targetFPS: 20,
          dpr: 1,
          optimizationLevel: 2.0, // 高い最適化
          updateInterval: 2, // フレームスキップ
        };
      } else if (deviceCapabilities.isMobile) {
        return {
          ballCount: Math.min(ballCount, 8), // 最大8個
          targetFPS: 30,
          dpr: 1,
          optimizationLevel: 1.5,
          updateInterval: 1,
        };
      } else {
        return {
          ballCount: Math.min(ballCount, 12), // 最大12個（元の15より削減）
          targetFPS: 60,
          dpr: 1, // DPRを1に固定してパフォーマンス向上
          optimizationLevel: 1.0,
          updateInterval: 1,
        };
      }
    };

    const settings = getOptimizedSettings();

    const renderer = new Renderer({
      dpr: settings.dpr,
      alpha: true,
      premultipliedAlpha: false,
      antialias: !deviceCapabilities.isLowEnd, // ローエンドではアンチエイリアス無効
      powerPreference: deviceCapabilities.isLowEnd ? "low-power" : "default",
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
    const [r2, g2, b2] = parseHexColor(cursorBallColor);

    // メタボール配列を20個に制限
    const metaBallsUniform: Vec3[] = [];
    for (let i = 0; i < 20; i++) {
      metaBallsUniform.push(new Vec3(0, 0, 0));
    }

    const program = new Program(gl, {
      vertex,
      fragment: optimizedFragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec3(0, 0, 0) },
        iMouse: { value: new Vec3(0, 0, 0) },
        iColor: { value: new Vec3(r1, g1, b1) },
        iCursorColor: { value: new Vec3(r2, g2, b2) },
        iAnimationSize: { value: animationSize },
        iBallCount: { value: settings.ballCount },
        iCursorBallSize: { value: cursorBallSize },
        iMetaBalls: { value: metaBallsUniform },
        iClumpFactor: { value: clumpFactor },
        enableTransparency: { value: enableTransparency },
        iOptimizationLevel: { value: settings.optimizationLevel },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    const scene = new Transform();
    mesh.setParent(scene);

    // 最適化されたボールパラメータ生成
    const ballParams: OptimizedBallParams[] = [];
    for (let i = 0; i < settings.ballCount; i++) {
      const [h1, h2, h3] = simpleHash3(i + 1);
      
      ballParams.push({
        x: 0,
        y: 0,
        radius: 0.4 + h3 * 1.2, // 0.5-2.0→0.4-1.6 (20%削減)
        speed: speed * (0.8 + h1 * 0.4), // 速度の個体差削減
        angle: h1 * Math.PI * 2,
        orbitRadius: 3 + h2 * 5, // 5-10→3-8 (軌道半径削減)
      });
    }

    const mouseBallPos = { x: 0, y: 0 };
    let pointerInside = false;
    let pointerX = 0;
    let pointerY = 0;
    let frameCounter = 0;

    function resize() {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width * settings.dpr, height * settings.dpr);
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

    // マウスイベント（間引き処理）
    let lastMouseUpdate = 0;
    function onPointerMove(e: PointerEvent) {
      if (!enableMouseInteraction || !container) return;
      
      const now = performance.now();
      if (now - lastMouseUpdate < 16) return; // 60FPS以下に制限
      lastMouseUpdate = now;
      
      const rect = container.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      pointerX = (px / rect.width) * gl.canvas.width;
      pointerY = (1 - py / rect.height) * gl.canvas.height;
    }
    
    function onPointerEnter() {
      if (!enableMouseInteraction || deviceCapabilities.isLowEnd) return; // ローエンドでは無効
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
      frameCounter++;
      
      // フレームスキップ実装
      if (frameCounter % settings.updateInterval !== 0) {
        return;
      }
      
      const elapsed = (t - startTime) * 0.001;
      program.uniforms.iTime.value = elapsed;

      // ボール位置の更新（簡素化された動き）
      for (let i = 0; i < settings.ballCount; i++) {
        const p = ballParams[i];
        const angle = p.angle + elapsed * p.speed;
        
        // シンプルな円運動（複雑な計算を避ける）
        const x = Math.cos(angle) * p.orbitRadius * clumpFactor;
        const y = Math.sin(angle) * p.orbitRadius * clumpFactor;
        
        metaBallsUniform[i].set(x, y, p.radius);
      }

      // マウス位置の更新（スムージング削減）
      let targetX: number, targetY: number;
      if (pointerInside && enableMouseInteraction && !deviceCapabilities.isLowEnd) {
        targetX = pointerX;
        targetY = pointerY;
      } else {
        // 簡素化されたデフォルト動作
        const cx = gl.canvas.width * 0.5;
        const cy = gl.canvas.height * 0.5;
        targetX = cx;
        targetY = cy;
      }
      
      // スムージング計算の最適化
      const smoothing = hoverSmoothness * settings.optimizationLevel;
      mouseBallPos.x += (targetX - mouseBallPos.x) * smoothing;
      mouseBallPos.y += (targetY - mouseBallPos.y) * smoothing;
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
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    color,
    cursorBallColor,
    speed,
    enableMouseInteraction,
    hoverSmoothness,
    animationSize,
    ballCount,
    clumpFactor,
    cursorBallSize,
    enableTransparency,
    deviceCapabilities,
  ]);

  return <div ref={containerRef} className="w-full h-full relative" />;
};

export default OptimizedMetaBalls;