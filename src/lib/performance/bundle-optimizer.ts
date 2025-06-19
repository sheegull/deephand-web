/**
 * Bundle Size Optimizer
 * Phase 4: Targets the 882kB DitherBackground issue specifically
 */

// Lightweight fallback components for better initial load
export const createLightweightFallback = () => {
  const FallbackBackground = ({ className = '' }: { className?: string }) => (
    <div 
      className={`${className}`}
      style={{
        background: `
          linear-gradient(135deg, 
            #1e1e1e 0%, 
            #2a2a2a 25%, 
            #1e1e1e 50%, 
            #2a2a2a 75%, 
            #1e1e1e 100%
          ),
          radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.05) 0%, transparent 40%),
          radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.05) 0%, transparent 40%)
        `,
        backgroundSize: '400% 400%, 100% 100%, 100% 100%',
        animation: 'gradientShift 8s ease infinite'
      }}
    >
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
  
  return FallbackBackground;
};

// Tree shaking utilities for Three.js
export const getOptimizedThreeImports = () => {
  // Instead of importing entire Three.js, import only what's needed
  return {
    // Core
    Scene: () => import('three/src/scenes/Scene'),
    WebGLRenderer: () => import('three/src/renderers/WebGLRenderer'),
    PerspectiveCamera: () => import('three/src/cameras/PerspectiveCamera'),
    
    // Geometry (only if needed)
    PlaneGeometry: () => import('three/src/geometries/PlaneGeometry'),
    
    // Materials (only if needed)
    ShaderMaterial: () => import('three/src/materials/ShaderMaterial'),
    
    // Math (commonly used)
    Vector2: () => import('three/src/math/Vector2'),
    Vector3: () => import('three/src/math/Vector3'),
  };
};

// Conditional loading based on device capabilities
export const shouldLoadHeavyComponents = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check device capabilities
  const hasWebGL = (() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  })();
  
  const hasGoodPerformance = (() => {
    const cores = navigator.hardwareConcurrency || 2;
    const memory = (navigator as any).deviceMemory;
    const connection = (navigator as any).connection;
    
    // Conservative checks
    const hasSufficientCores = cores >= 4;
    const hasSufficientMemory = !memory || memory >= 4;
    const hasGoodConnection = !connection || 
      (connection.effectiveType !== 'slow-2g' && connection.effectiveType !== '2g');
    
    return hasSufficientCores && hasSufficientMemory && hasGoodConnection;
  })();
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return hasWebGL && hasGoodPerformance && !prefersReducedMotion;
};

// Memory management for large components
export class ComponentMemoryManager {
  private loadedComponents = new Set<string>();
  private componentRefs = new Map<string, any>();
  
  register(componentName: string, componentRef: any) {
    this.loadedComponents.add(componentName);
    this.componentRefs.set(componentName, componentRef);
  }
  
  unregister(componentName: string) {
    this.loadedComponents.delete(componentName);
    const ref = this.componentRefs.get(componentName);
    
    // Cleanup WebGL contexts if present
    if (ref && ref.dispose) {
      ref.dispose();
    }
    
    this.componentRefs.delete(componentName);
  }
  
  getMemoryUsage() {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      return (performance as any).memory;
    }
    return null;
  }
  
  forceGarbageCollection() {
    // Request garbage collection if available (Chrome DevTools)
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as any).gc();
    }
  }
  
  getLoadedComponents() {
    return Array.from(this.loadedComponents);
  }
}

export const memoryManager = new ComponentMemoryManager();

// Optimize imports by removing unused dependencies
export const optimizeImports = {
  // Replace heavy framer-motion with lighter alternatives where possible
  lightMotion: {
    MotionDiv: 'div', // Fallback to regular div for non-critical animations
    useInView: () => true, // Simplified always-visible hook
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useTransform: () => '0%',
  },
  
  // Optimize Three.js imports
  lightThree: {
    Canvas: () => null, // Return null component for SSR
    useFrame: () => {},
    useThree: () => ({}),
  }
};

// Bundle analysis helpers
export const getBundleInfo = () => {
  if (typeof window !== 'undefined') {
    const scripts = Array.from(document.scripts);
    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    return {
      scriptCount: scripts.length,
      stylesheetCount: stylesheets.length,
      scripts: scripts.map(s => ({ src: s.src, async: s.async, defer: s.defer })),
      stylesheets: stylesheets.map(s => ({ href: (s as HTMLLinkElement).href }))
    };
  }
  return null;
};

// Critical CSS extraction helper
export const extractCriticalCSS = (componentName: string) => {
  // This would be used in build process to extract critical CSS
  const criticalClasses = {
    hero: ['font-alliance', 'bg-\\[#1e1e1e\\]', 'text-white'],
    navigation: ['fixed', 'top-0', 'z-\\[100\\]'],
    forms: ['rounded-\\w+', 'border', 'bg-\\[#.*\\]'],
  };
  
  return criticalClasses[componentName as keyof typeof criticalClasses] || [];
};