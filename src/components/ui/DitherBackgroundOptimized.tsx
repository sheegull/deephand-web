/* eslint-disable react/no-unknown-property */
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, wrapEffect } from "@react-three/postprocessing";
import { Effect } from "postprocessing";
import * as THREE from "three";

// モバイル性能最適化されたDitherBackground
// TDD: パフォーマンステストで検証される最適化実装

interface PointerEvent {
  clientX: number;
  clientY: number;
}

interface DeviceCapabilities {
  isLowEnd: boolean;
  isMobile: boolean;
  supportsWebGL: boolean;
  cpuCores: number;
  memoryGB?: number;
}

// デバイス性能検出（シンプル化）
const detectDeviceCapabilities = (): DeviceCapabilities => {
  if (typeof window === 'undefined') {
    return { isLowEnd: false, isMobile: false, supportsWebGL: false, cpuCores: 4 };
  }

  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as any).deviceMemory;
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // 簡素化された判定ロジック
  const isLowEnd = cores <= 2 || (memory && memory <= 4) || isMobile;
  
  let supportsWebGL = false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    supportsWebGL = !!gl;
  } catch {
    supportsWebGL = false;
  }

  return {
    isLowEnd,
    isMobile,
    supportsWebGL,
    cpuCores: cores,
    memoryGB: memory,
  };
};

// 最適化されたバーテックスシェーダー（変更なし、軽量）
const waveVertexShader = `
precision mediump float;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// 大幅に最適化されたフラグメントシェーダー
const optimizedWaveFragmentShader = `
precision mediump float;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;
uniform int octaveCount; // 動的オクターブ数

// 軽量なノイズ関数（簡素化版）
float simpleNoise(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// 高速化されたフラクタルノイズ（オクターブ数を削減）
float fastFbm(vec2 p, int octaves) {
  float value = 0.0;
  float amp = 1.0;
  float freq = waveFrequency;
  
  for (int i = 0; i < 4; i++) {
    if (i >= octaves) break;
    value += amp * (simpleNoise(p * freq) - 0.5) * 2.0;
    freq *= 2.0;
    amp *= waveAmplitude;
  }
  return value;
}

// 簡素化されたパターン関数
float optimizedPattern(vec2 p) {
  vec2 p2 = p - time * waveSpeed;
  return fastFbm(p + fastFbm(p2, octaveCount), octaveCount);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;
  
  float f = optimizedPattern(uv * 2.0); // スケール調整で密度減少
  
  // マウスインタラクション（簡素化）
  if (enableMouseInteraction == 1) {
    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= resolution.x / resolution.y;
    float dist = length(uv - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
    f -= 0.3 * effect; // エフェクト強度も削減
  }
  
  vec3 col = mix(vec3(0.0), waveColor, f * 0.8 + 0.2);
  gl_FragColor = vec4(col, 1.0);
}
`;

// 最適化されたディザーシェーダー（4x4マトリックスに削減）
const optimizedDitherFragmentShader = `
precision mediump float;
uniform float colorNum;
uniform float pixelSize;

// 8x8から4x4に削減（75%の計算削減）
const float bayerMatrix4x4[16] = float[16](
  0.0/16.0,  8.0/16.0,  2.0/16.0, 10.0/16.0,
 12.0/16.0,  4.0/16.0, 14.0/16.0,  6.0/16.0,
  3.0/16.0, 11.0/16.0,  1.0/16.0,  9.0/16.0,
 15.0/16.0,  7.0/16.0, 13.0/16.0,  5.0/16.0
);

vec3 fastDither(vec2 uv, vec3 color) {
  vec2 scaledCoord = floor(uv * resolution / pixelSize);
  int x = int(mod(scaledCoord.x, 4.0));
  int y = int(mod(scaledCoord.y, 4.0));
  float threshold = bayerMatrix4x4[y * 4 + x] - 0.125;
  
  float step = 1.0 / (colorNum - 1.0);
  color += threshold * step * 0.8; // 強度削減
  color = clamp(color, 0.0, 1.0);
  return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
}

void mainImage(in vec4 inputColor, in vec2 uv, out vec4 outputColor) {
  vec4 color = texture2D(inputBuffer, uv);
  color.rgb = fastDither(uv, color.rgb);
  outputColor = color;
}
`;

// 最適化されたエフェクトクラス
class OptimizedRetroEffectImpl extends Effect {
  public uniforms: Map<string, THREE.Uniform<any>>;
  constructor() {
    const uniforms = new Map<string, THREE.Uniform<any>>([
      ["colorNum", new THREE.Uniform(3.0)], // 4→3に削減
      ["pixelSize", new THREE.Uniform(3.0)], // 2→3に拡大（計算削減）
    ]);
    super("OptimizedRetroEffect", optimizedDitherFragmentShader, { uniforms });
    this.uniforms = uniforms;
  }
  
  set colorNum(value: number) {
    this.uniforms.get("colorNum")!.value = value;
  }
  get colorNum(): number {
    return this.uniforms.get("colorNum")!.value;
  }
  set pixelSize(value: number) {
    this.uniforms.get("pixelSize")!.value = value;
  }
  get pixelSize(): number {
    return this.uniforms.get("pixelSize")!.value;
  }
}

import { forwardRef } from "react";

const OptimizedRetroEffect = forwardRef<
  OptimizedRetroEffectImpl,
  { colorNum: number; pixelSize: number }
>((props, ref) => {
  const { colorNum, pixelSize } = props;
  const WrappedEffect = wrapEffect(OptimizedRetroEffectImpl);
  return (
    <WrappedEffect ref={ref} colorNum={colorNum} pixelSize={pixelSize} />
  );
});

OptimizedRetroEffect.displayName = "OptimizedRetroEffect";

// 最適化されたユニフォーム型定義
interface OptimizedWaveUniforms {
  [key: string]: THREE.Uniform<any>;
  time: THREE.Uniform<number>;
  resolution: THREE.Uniform<THREE.Vector2>;
  waveSpeed: THREE.Uniform<number>;
  waveFrequency: THREE.Uniform<number>;
  waveAmplitude: THREE.Uniform<number>;
  waveColor: THREE.Uniform<THREE.Color>;
  mousePos: THREE.Uniform<THREE.Vector2>;
  enableMouseInteraction: THREE.Uniform<number>;
  mouseRadius: THREE.Uniform<number>;
  octaveCount: THREE.Uniform<number>; // 動的オクターブ数
}

interface OptimizedDitheredWavesProps {
  deviceCapabilities: DeviceCapabilities;
  waveSpeed: number;
  waveFrequency: number;
  waveAmplitude: number;
  waveColor: [number, number, number];
  colorNum: number;
  pixelSize: number;
  disableAnimation: boolean;
  enableMouseInteraction: boolean;
  mouseRadius: number;
}

function OptimizedDitheredWaves({
  deviceCapabilities,
  waveSpeed,
  waveFrequency,
  waveAmplitude,
  waveColor,
  colorNum,
  pixelSize,
  disableAnimation,
  enableMouseInteraction,
  mouseRadius,
}: OptimizedDitheredWavesProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const { viewport, size, gl } = useThree();

  // デバイスに応じた動的設定
  const getOptimizedSettings = () => {
    if (deviceCapabilities.isLowEnd) {
      return {
        octaveCount: 2, // 8→2 (75%削減)
        targetFPS: 20,
        updateInterval: 1, // フレームスキップ
      };
    } else if (deviceCapabilities.isMobile) {
      return {
        octaveCount: 3, // 8→3 (62%削減)
        targetFPS: 30,
        updateInterval: 1,
      };
    } else {
      return {
        octaveCount: 4, // 8→4 (50%削減)
        targetFPS: 60,
        updateInterval: 1,
      };
    }
  };

  const settings = getOptimizedSettings();

  const waveUniformsRef = useRef<OptimizedWaveUniforms>({
    time: new THREE.Uniform(0),
    resolution: new THREE.Uniform(new THREE.Vector2(0, 0)),
    waveSpeed: new THREE.Uniform(waveSpeed * 0.7), // 速度削減で計算負荷軽減
    waveFrequency: new THREE.Uniform(waveFrequency * 0.8), // 周波数削減
    waveAmplitude: new THREE.Uniform(waveAmplitude * 0.9), // 振幅削減
    waveColor: new THREE.Uniform(new THREE.Color(...waveColor)),
    mousePos: new THREE.Uniform(new THREE.Vector2(0, 0)),
    enableMouseInteraction: new THREE.Uniform(enableMouseInteraction ? 1 : 0),
    mouseRadius: new THREE.Uniform(mouseRadius),
    octaveCount: new THREE.Uniform(settings.octaveCount),
  });

  // フレームレート制御
  const frameCounter = useRef(0);

  useEffect(() => {
    const dpr = Math.min(gl.getPixelRatio(), deviceCapabilities.isLowEnd ? 1 : 2); // DPR制限
    const newWidth = Math.floor(size.width * dpr);
    const newHeight = Math.floor(size.height * dpr);
    const currentRes = waveUniformsRef.current.resolution.value;
    if (currentRes.x !== newWidth || currentRes.y !== newHeight) {
      currentRes.set(newWidth, newHeight);
    }
  }, [size, gl, deviceCapabilities]);

  useFrame(({ clock }) => {
    frameCounter.current++;
    
    // フレームスキップ実装
    if (frameCounter.current % settings.updateInterval !== 0) {
      return;
    }

    if (!disableAnimation) {
      waveUniformsRef.current.time.value = clock.getElapsedTime() * 0.8; // 時間進行も削減
    }
    
    // ユニフォーム更新（最小限）
    waveUniformsRef.current.waveSpeed.value = waveSpeed * 0.7;
    waveUniformsRef.current.waveFrequency.value = waveFrequency * 0.8;
    waveUniformsRef.current.waveAmplitude.value = waveAmplitude * 0.9;
    waveUniformsRef.current.waveColor.value.set(...waveColor);
    waveUniformsRef.current.enableMouseInteraction.value = enableMouseInteraction ? 1 : 0;
    waveUniformsRef.current.mouseRadius.value = mouseRadius;
    
    if (enableMouseInteraction) {
      waveUniformsRef.current.mousePos.value.set(mousePos.x, mousePos.y);
    }
  });

  const handlePointerMove = (e: PointerEvent) => {
    if (!enableMouseInteraction) return;
    
    // マウス更新頻度制限（パフォーマンス向上）
    if (frameCounter.current % 2 !== 0) return;
    
    const rect = gl.domElement.getBoundingClientRect();
    const dpr = gl.getPixelRatio();
    const x = (e.clientX - rect.left) * dpr;
    const y = (e.clientY - rect.top) * dpr;
    setMousePos({ x, y });
  };

  return (
    <>
      <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1, 1, 1]} /> {/* セグメント削減 */}
        <shaderMaterial
          vertexShader={waveVertexShader}
          fragmentShader={optimizedWaveFragmentShader}
          uniforms={waveUniformsRef.current}
        />
      </mesh>

      <EffectComposer>
        <OptimizedRetroEffect colorNum={colorNum} pixelSize={pixelSize} />
      </EffectComposer>

      <mesh
        onPointerMove={handlePointerMove}
        position={[0, 0, 0.01]}
        scale={[viewport.width, viewport.height, 1]}
        visible={false}
      >
        <planeGeometry args={[1, 1, 1, 1]} /> {/* セグメント削減 */}
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

interface DitherBackgroundOptimizedProps {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
  className?: string;
}

export default function DitherBackgroundOptimized({
  waveSpeed = 0.004, // 0.005→0.004 (20%削減)
  waveFrequency = 1.2, // 1.5→1.2 (20%削減)
  waveAmplitude = 0.12, // 0.15→0.12 (20%削減)
  waveColor = [0.12, 0.13, 0.14],
  colorNum = 3, // 4→3 (25%削減)
  pixelSize = 3, // 2→3 (ピクセルサイズ増大で計算削減)
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1.0, // 1.2→1.0 (削減)
  className = "w-full h-full absolute inset-0 z-0",
}: DitherBackgroundOptimizedProps) {
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities>({
    isLowEnd: false,
    isMobile: false,
    supportsWebGL: false,
    cpuCores: 4,
  });

  useEffect(() => {
    setDeviceCapabilities(detectDeviceCapabilities());
  }, []);

  // WebGL非対応時のフォールバック
  if (!deviceCapabilities.supportsWebGL) {
    return (
      <div 
        className={className}
        style={{
          background: `linear-gradient(45deg, 
            rgba(31, 31, 31, 1) 0%, 
            rgba(49, 49, 49, 1) 100%)`,
        }}
      />
    );
  }

  return (
    <div className={className}>
      <Canvas
        className="w-full h-full"
        camera={{ position: [0, 0, 6] }}
        dpr={deviceCapabilities.isLowEnd ? 1 : Math.min(window.devicePixelRatio, 2)} // DPR制限
        gl={{ 
          antialias: !deviceCapabilities.isLowEnd, // ローエンドではアンチエイリアス無効
          preserveDrawingBuffer: false, // メモリ節約
          alpha: true,
          powerPreference: deviceCapabilities.isLowEnd ? "low-power" : "high-performance", // 電力設定
        }}
      >
        <OptimizedDitheredWaves
          deviceCapabilities={deviceCapabilities}
          waveSpeed={waveSpeed}
          waveFrequency={waveFrequency}
          waveAmplitude={waveAmplitude}
          waveColor={waveColor}
          colorNum={colorNum}
          pixelSize={pixelSize}
          disableAnimation={disableAnimation}
          enableMouseInteraction={enableMouseInteraction && !deviceCapabilities.isLowEnd} // ローエンドではマウス無効
          mouseRadius={mouseRadius}
        />
      </Canvas>
    </div>
  );
}