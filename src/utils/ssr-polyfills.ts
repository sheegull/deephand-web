/**
 * SSR Polyfills Entry Point
 * 
 * Astro SSRの開始時に必要なポリフィルを適用
 * Cloudflare Workers環境でのReact 19互換性を確保
 */

import { initializeReact19CloudflareCompatibility, getCloudflareCompatibilityInfo } from './cloudflare-polyfills';

/**
 * SSR開始時のポリフィル初期化
 * 
 * この関数はAstroのSSRプロセス開始時に呼び出される
 */
export function initializeSSRPolyfills(): void {
  try {
    // Cloudflare Workers環境での互換性確保
    initializeReact19CloudflareCompatibility();
    
    // デバッグ情報の出力（開発環境のみ）
    if (process.env.NODE_ENV === 'development') {
      const info = getCloudflareCompatibilityInfo();
      console.log('[SSR Polyfills] Compatibility info:', info);
    }
  } catch (error) {
    console.warn('[SSR Polyfills] Failed to initialize polyfills:', error);
    // エラーが発生してもSSRプロセスを継続
  }
}

/**
 * Astro middleware compatible function
 * 
 * Astroのmiddleware APIで使用可能な形式
 */
export function createSSRPolyfillMiddleware() {
  return {
    onRequest: ({ locals }: { locals: any }) => {
      // SSRリクエスト開始時にポリフィルを初期化
      initializeSSRPolyfills();
      
      // デバッグ情報をlocalsに追加
      locals.polyfillInfo = getCloudflareCompatibilityInfo();
    }
  };
}

// モジュール読み込み時に即座に実行
// これによりReactがrequireされる前にポリフィルが適用される
initializeSSRPolyfills();