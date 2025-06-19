/**
 * Memory Optimizer - Phase 4 Performance Optimization
 * 🎯 Purpose: Optimize memory usage and prevent memory leaks
 * 📊 Features: Memory monitoring, garbage collection, component cleanup
 */

// Global memory management
interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface ComponentMemoryTracker {
  componentName: string;
  mountTime: number;
  memoryAtMount: number;
  cleanupFunctions: Array<() => void>;
}

class MemoryManager {
  private trackedComponents = new Map<string, ComponentMemoryTracker>();
  private memoryWarningThreshold = 0.85; // 85% of heap limit
  private cleanupInterval: NodeJS.Timeout | null = null;
  private performanceObserver: PerformanceObserver | null = null;

  constructor() {
    this.startMonitoring();
    this.setupCleanupScheduler();
  }

  /**
   * コンポーネントのメモリ使用量を追跡開始
   */
  trackComponent(componentName: string, cleanupFunctions: Array<() => void> = []): string {
    const trackerId = `${componentName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    this.trackedComponents.set(trackerId, {
      componentName,
      mountTime: performance.now(),
      memoryAtMount: this.getCurrentMemoryUsage(),
      cleanupFunctions
    });

    console.debug(`[MemoryManager] Tracking component: ${componentName} (${trackerId})`);
    return trackerId;
  }

  /**
   * コンポーネントのメモリ追跡終了とクリーンアップ
   */
  untrackComponent(trackerId: string): void {
    const tracker = this.trackedComponents.get(trackerId);
    if (!tracker) return;

    // クリーンアップ関数を実行
    tracker.cleanupFunctions.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.warn(`[MemoryManager] Cleanup function failed for ${tracker.componentName}:`, error);
      }
    });

    const currentMemory = this.getCurrentMemoryUsage();
    const memoryDiff = currentMemory - tracker.memoryAtMount;
    const lifeTime = performance.now() - tracker.mountTime;

    console.debug(`[MemoryManager] Untracked component: ${tracker.componentName}`, {
      lifeTime: `${lifeTime.toFixed(2)}ms`,
      memoryDiff: `${(memoryDiff / 1024 / 1024).toFixed(2)}MB`,
      trackerId
    });

    this.trackedComponents.delete(trackerId);

    // メモリ警告チェック
    this.checkMemoryWarning();
  }

  /**
   * 現在のメモリ使用量を取得
   */
  getCurrentMemoryUsage(): number {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory as MemoryInfo;
      return memory.usedJSHeapSize;
    }
    return 0;
  }

  /**
   * メモリ情報を取得
   */
  getMemoryInfo(): MemoryInfo | null {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      return (performance as any).memory as MemoryInfo;
    }
    return null;
  }

  /**
   * メモリ使用率を取得
   */
  getMemoryUsageRatio(): number {
    const memory = this.getMemoryInfo();
    if (!memory) return 0;
    return memory.usedJSHeapSize / memory.jsHeapSizeLimit;
  }

  /**
   * メモリ警告チェック
   */
  private checkMemoryWarning(): void {
    const usageRatio = this.getMemoryUsageRatio();
    
    if (usageRatio > this.memoryWarningThreshold) {
      console.warn('[MemoryManager] High memory usage detected:', {
        usageRatio: `${(usageRatio * 100).toFixed(1)}%`,
        trackedComponents: this.trackedComponents.size,
        recommendation: 'Consider force garbage collection'
      });

      // 緊急時の自動ガベージコレクション（開発環境のみ）
      if (process.env.NODE_ENV === 'development') {
        this.forceGarbageCollection();
      }
    }
  }

  /**
   * ガベージコレクションを強制実行
   */
  forceGarbageCollection(): void {
    if (typeof window !== 'undefined' && 'gc' in window) {
      console.debug('[MemoryManager] Forcing garbage collection...');
      (window as any).gc();
    }
  }

  /**
   * パフォーマンス監視開始
   */
  private startMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Performance Observer for memory measurements
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'measure' && entry.name.includes('component-memory')) {
            console.debug('[MemoryManager] Component performance:', entry);
          }
        });
      });

      try {
        this.performanceObserver.observe({ entryTypes: ['measure'] });
      } catch (error) {
        console.debug('[MemoryManager] PerformanceObserver not supported:', error);
      }
    }
  }

  /**
   * 定期クリーンアップスケジューラー
   */
  private setupCleanupScheduler(): void {
    if (typeof window === 'undefined') return;

    // 5分ごとにメモリチェック
    this.cleanupInterval = setInterval(() => {
      this.checkMemoryWarning();
      this.cleanupStaleComponents();
    }, 5 * 60 * 1000);

    // ページアンロード時のクリーンアップ
    window.addEventListener('beforeunload', () => {
      this.destroy();
    });
  }

  /**
   * 古いコンポーネントのクリーンアップ
   */
  private cleanupStaleComponents(): void {
    const now = performance.now();
    const staleThreshold = 10 * 60 * 1000; // 10分

    for (const [trackerId, tracker] of this.trackedComponents.entries()) {
      if (now - tracker.mountTime > staleThreshold) {
        console.warn(`[MemoryManager] Cleaning up stale component: ${tracker.componentName}`);
        this.untrackComponent(trackerId);
      }
    }
  }

  /**
   * メモリマネージャーの破棄
   */
  destroy(): void {
    // 全てのコンポーネントをクリーンアップ
    for (const trackerId of this.trackedComponents.keys()) {
      this.untrackComponent(trackerId);
    }

    // インターバルをクリア
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }

    // Performance Observerをクリーンアップ
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }

    console.debug('[MemoryManager] Destroyed');
  }

  /**
   * デバッグ情報を取得
   */
  getDebugInfo() {
    const memory = this.getMemoryInfo();
    return {
      trackedComponents: Array.from(this.trackedComponents.entries()).map(([id, tracker]) => ({
        id,
        componentName: tracker.componentName,
        lifeTime: performance.now() - tracker.mountTime,
        memoryAtMount: tracker.memoryAtMount
      })),
      memoryInfo: memory ? {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`,
        usageRatio: `${(this.getMemoryUsageRatio() * 100).toFixed(1)}%`
      } : null
    };
  }
}

// シングルトンインスタンス
export const memoryManager = new MemoryManager();

/**
 * React Hook for component memory tracking
 */
import { useEffect, useRef } from 'react';

export function useMemoryTracking(componentName: string, cleanupFunctions: Array<() => void> = []) {
  const trackerIdRef = useRef<string | null>(null);

  useEffect(() => {
    // マウント時に追跡開始
    trackerIdRef.current = memoryManager.trackComponent(componentName, cleanupFunctions);

    return () => {
      // アンマウント時に追跡終了
      if (trackerIdRef.current) {
        memoryManager.untrackComponent(trackerIdRef.current);
        trackerIdRef.current = null;
      }
    };
  }, [componentName]);

  return {
    trackerId: trackerIdRef.current,
    getMemoryInfo: () => memoryManager.getMemoryInfo(),
    forceGC: () => memoryManager.forceGarbageCollection()
  };
}

/**
 * React Hook for performance-optimized event listeners
 */
export function useOptimizedEventListener<T extends keyof WindowEventMap>(
  event: T,
  handler: (event: WindowEventMap[T]) => void,
  options: AddEventListenerOptions = { passive: true }
) {
  const handlerRef = useRef(handler);
  const listenerRef = useRef<(event: WindowEventMap[T]) => void>();

  // ハンドラーを最新に保つ
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // スロットル機能付きハンドラー
    let timeoutId: NodeJS.Timeout;
    const throttledHandler = (event: WindowEventMap[T]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handlerRef.current(event);
      }, 16); // 60fps target
    };

    listenerRef.current = throttledHandler;
    window.addEventListener(event, throttledHandler, options);

    return () => {
      window.removeEventListener(event, throttledHandler, options);
      clearTimeout(timeoutId);
    };
  }, [event, options]);
}

/**
 * Image lazy loading with memory optimization
 */
export class OptimizedImageLoader {
  private loadedImages = new Set<string>();
  private imageCache = new Map<string, HTMLImageElement>();
  private maxCacheSize = 50; // 最大キャッシュ数

  loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      // キャッシュから取得
      if (this.imageCache.has(src)) {
        resolve(this.imageCache.get(src)!);
        return;
      }

      const img = new Image();
      
      img.onload = () => {
        this.cacheImage(src, img);
        resolve(img);
      };

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.src = src;
    });
  }

  private cacheImage(src: string, img: HTMLImageElement): void {
    // キャッシュサイズ制限
    if (this.imageCache.size >= this.maxCacheSize) {
      const firstKey = this.imageCache.keys().next().value;
      this.imageCache.delete(firstKey);
    }

    this.imageCache.set(src, img);
  }

  clearCache(): void {
    this.imageCache.clear();
    console.debug('[OptimizedImageLoader] Cache cleared');
  }

  getCacheSize(): number {
    return this.imageCache.size;
  }
}

export const imageLoader = new OptimizedImageLoader();

/**
 * Development-only memory debugging tools
 */
export const memoryDebugTools = {
  logMemoryInfo: () => {
    if (process.env.NODE_ENV !== 'development') return;
    console.table(memoryManager.getDebugInfo());
  },

  startMemoryProfiling: () => {
    if (process.env.NODE_ENV !== 'development') return;
    const interval = setInterval(() => {
      const info = memoryManager.getDebugInfo();
      console.log('[Memory Profile]', info.memoryInfo);
    }, 1000);

    return () => clearInterval(interval);
  },

  measureComponentRender: (componentName: string, renderFn: () => void) => {
    if (process.env.NODE_ENV !== 'development') return renderFn();

    const startMemory = memoryManager.getCurrentMemoryUsage();
    const startTime = performance.now();

    renderFn();

    const endTime = performance.now();
    const endMemory = memoryManager.getCurrentMemoryUsage();

    console.debug(`[Component Render] ${componentName}`, {
      renderTime: `${(endTime - startTime).toFixed(2)}ms`,
      memoryDelta: `${((endMemory - startMemory) / 1024).toFixed(2)}KB`
    });
  }
};