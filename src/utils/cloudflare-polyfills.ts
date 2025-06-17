/**
 * Cloudflare Workers Runtime Polyfills
 * 
 * React 19とCloudflare Workers間の互換性を確保するためのポリフィル
 * TDD方式で実装された高性能なポリフィルコレクション
 */

/**
 * MessageChannel Polyfill for Cloudflare Workers
 * 
 * React 19のServer Componentsが要求するMessageChannel APIを提供
 * Cloudflare Workers環境で不足しているAPIを補完
 */
export class MessageChannelPolyfill {
  public port1: MessagePortPolyfill;
  public port2: MessagePortPolyfill;

  constructor() {
    // 相互に接続されたポートペアを作成
    this.port1 = new MessagePortPolyfill();
    this.port2 = new MessagePortPolyfill();

    // ポート間の双方向通信を設定
    this.port1._setCounterpart(this.port2);
    this.port2._setCounterpart(this.port1);
  }
}

/**
 * MessagePort Polyfill for Cloudflare Workers
 * 
 * 必要最小限の実装でReact 19の要求を満たす
 */
export class MessagePortPolyfill {
  private _counterpart: MessagePortPolyfill | null = null;
  private _listeners: Map<string, ((event: MessageEvent) => void)[]> = new Map();
  private _started = false;
  
  // Event handler properties (React 19が使用)
  public onmessage: ((event: MessageEvent) => void) | null = null;
  public onmessageerror: ((event: MessageEvent) => void) | null = null;

  constructor() {
    this._listeners.set('message', []);
    this._listeners.set('messageerror', []);
  }

  /**
   * カウンターパートポートを設定（内部使用）
   */
  _setCounterpart(port: MessagePortPolyfill): void {
    this._counterpart = port;
  }

  /**
   * メッセージを送信
   */
  postMessage(data: any, transfer?: Transferable[]): void {
    if (!this._counterpart) return;

    // 非同期でメッセージを配信（Cloudflare Workers環境に配慮）
    setTimeout(() => {
      if (!this._counterpart) return;

      const event = new CustomEvent('message', {
        detail: { data, ports: [], source: this }
      }) as MessageEvent;

      // onmessageハンドラーの実行
      if (this._counterpart.onmessage) {
        try {
          this._counterpart.onmessage(event);
        } catch (error) {
          const errorEvent = new CustomEvent('messageerror', {
            detail: { data: error, source: this }
          }) as MessageEvent;
          
          if (this._counterpart.onmessageerror) {
            this._counterpart.onmessageerror(errorEvent);
          }
        }
      }

      // addEventListenerで登録されたリスナーの実行
      const messageListeners = this._counterpart._listeners.get('message') || [];
      messageListeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          const errorEvent = new CustomEvent('messageerror', {
            detail: { data: error, source: this }
          }) as MessageEvent;
          
          const errorListeners = this._counterpart!._listeners.get('messageerror') || [];
          errorListeners.forEach(errorListener => errorListener(errorEvent));
        }
      });
    }, 0);
  }

  /**
   * イベントリスナーを追加
   */
  addEventListener(type: string, listener: (event: MessageEvent) => void): void {
    if (!this._listeners.has(type)) {
      this._listeners.set(type, []);
    }
    
    const listeners = this._listeners.get(type)!;
    if (!listeners.includes(listener)) {
      listeners.push(listener);
    }
  }

  /**
   * イベントリスナーを削除
   */
  removeEventListener(type: string, listener: (event: MessageEvent) => void): void {
    const listeners = this._listeners.get(type);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index >= 0) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * ポートを開始（互換性のため）
   */
  start(): void {
    this._started = true;
  }

  /**
   * ポートを閉じる
   */
  close(): void {
    this._counterpart = null;
    this._listeners.clear();
    this.onmessage = null;
    this.onmessageerror = null;
  }
}

/**
 * Cloudflare Workers環境検出
 */
export function isCloudflareWorkers(): boolean {
  return (
    typeof globalThis !== 'undefined' &&
    // @ts-ignore
    typeof globalThis.caches !== 'undefined' &&
    // @ts-ignore
    typeof globalThis.Request !== 'undefined' &&
    typeof MessageChannel === 'undefined'
  );
}

/**
 * 必要に応じてポリフィルを適用
 */
export function applyCloudflarePolyfills(): void {
  // MessageChannelのポリフィル
  if (typeof MessageChannel === 'undefined') {
    // @ts-ignore
    globalThis.MessageChannel = MessageChannelPolyfill;
  }

  // MessagePortのポリフィル（通常はMessageChannelと一緒に提供される）
  if (typeof MessagePort === 'undefined') {
    // @ts-ignore
    globalThis.MessagePort = MessagePortPolyfill;
  }

  // その他のCloudflare Workers互換性ポリフィル
  applyAdditionalCloudflarePolyfills();
}

/**
 * その他の必要なポリフィル
 */
function applyAdditionalCloudflarePolyfills(): void {
  // BroadcastChannelのポリフィル（必要に応じて）
  if (typeof BroadcastChannel === 'undefined') {
    // @ts-ignore
    globalThis.BroadcastChannel = class BroadcastChannelPolyfill {
      constructor(public name: string) {}
      postMessage(data: any): void {
        // No-op implementation for compatibility
      }
      close(): void {}
      addEventListener(): void {}
      removeEventListener(): void {}
    };
  }

  // Performance APIの拡張（Cloudflare Workersで制限される場合）
  if (typeof performance !== 'undefined' && !performance.timeOrigin) {
    // @ts-ignore
    performance.timeOrigin = Date.now();
  }
}

/**
 * React 19専用の初期化
 * 
 * Reactのサーバーサイドレンダリング開始前に呼び出す
 */
export function initializeReact19CloudflareCompatibility(): void {
  // 環境検出
  if (!isCloudflareWorkers()) {
    // ブラウザまたはNode.js環境では何もしない
    return;
  }

  // ポリフィルを適用
  applyCloudflarePolyfills();

  // React 19の特定の要求に対する追加設定
  if (typeof globalThis !== 'undefined') {
    // React 19のasync rendering用の追加プロパティ
    // @ts-ignore
    globalThis.__REACT_19_CLOUDFLARE_POLYFILL__ = true;
  }
}

/**
 * デバッグ情報の提供
 */
export function getCloudflareCompatibilityInfo(): {
  isCloudflareWorkers: boolean;
  hasMessageChannel: boolean;
  hasNativeMessageChannel: boolean;
  polyfillsApplied: string[];
} {
  return {
    isCloudflareWorkers: isCloudflareWorkers(),
    hasMessageChannel: typeof MessageChannel !== 'undefined',
    hasNativeMessageChannel: typeof MessageChannel !== 'undefined' && 
      MessageChannel.toString().includes('[native code]'),
    polyfillsApplied: [
      ...(typeof MessageChannel !== 'undefined' && 
          !MessageChannel.toString().includes('[native code]') ? ['MessageChannel'] : []),
      ...(typeof MessagePort !== 'undefined' && 
          !MessagePort.toString().includes('[native code]') ? ['MessagePort'] : []),
      ...(typeof BroadcastChannel !== 'undefined' && 
          !BroadcastChannel.toString().includes('[native code]') ? ['BroadcastChannel'] : [])
    ]
  };
}