/**
 * Vite Plugin for MessageChannel Polyfill Injection
 * 
 * React 19 + Cloudflare Workers間の互換性を確保するため
 * ビルド時にポリフィルを最優先で注入する
 */

/**
 * Cloudflare Workers MessageChannel Polyfill
 * React DOMサーバーが使用する前に必ずグローバルに適用される
 */
const POLYFILL_CODE = `
// Cloudflare Workers MessageChannel Polyfill (Injected by Vite)
(function() {
  'use strict';
  
  // 既にポリフィルが適用されている場合はスキップ
  if (typeof globalThis !== 'undefined' && globalThis.__REACT_19_CLOUDFLARE_POLYFILL__) {
    return;
  }
  
  // MessageChannelが存在しない場合のみ適用
  if (typeof MessageChannel === 'undefined') {
    class MessagePortPolyfill {
      constructor() {
        this._counterpart = null;
        this._listeners = new Map([['message', []], ['messageerror', []]]);
        this.onmessage = null;
        this.onmessageerror = null;
      }
      
      _setCounterpart(port) {
        this._counterpart = port;
      }
      
      postMessage(data) {
        if (!this._counterpart) return;
        
        setTimeout(() => {
          if (!this._counterpart) return;
          
          const event = { data, ports: [], source: this };
          
          if (this._counterpart.onmessage) {
            try {
              this._counterpart.onmessage(event);
            } catch (error) {
              if (this._counterpart.onmessageerror) {
                this._counterpart.onmessageerror({ data: error, source: this });
              }
            }
          }
          
          const listeners = this._counterpart._listeners.get('message') || [];
          listeners.forEach(listener => {
            try {
              listener(event);
            } catch (error) {
              const errorListeners = this._counterpart._listeners.get('messageerror') || [];
              errorListeners.forEach(errorListener => 
                errorListener({ data: error, source: this })
              );
            }
          });
        }, 0);
      }
      
      addEventListener(type, listener) {
        if (!this._listeners.has(type)) {
          this._listeners.set(type, []);
        }
        const listeners = this._listeners.get(type);
        if (!listeners.includes(listener)) {
          listeners.push(listener);
        }
      }
      
      removeEventListener(type, listener) {
        const listeners = this._listeners.get(type);
        if (listeners) {
          const index = listeners.indexOf(listener);
          if (index >= 0) {
            listeners.splice(index, 1);
          }
        }
      }
      
      start() {}
      close() {
        this._counterpart = null;
        this._listeners.clear();
        this.onmessage = null;
        this.onmessageerror = null;
      }
    }
    
    class MessageChannelPolyfill {
      constructor() {
        this.port1 = new MessagePortPolyfill();
        this.port2 = new MessagePortPolyfill();
        this.port1._setCounterpart(this.port2);
        this.port2._setCounterpart(this.port1);
      }
    }
    
    // グローバルオブジェクトに注入
    if (typeof globalThis !== 'undefined') {
      globalThis.MessageChannel = MessageChannelPolyfill;
      globalThis.MessagePort = MessagePortPolyfill;
      globalThis.__REACT_19_CLOUDFLARE_POLYFILL__ = true;
    } else if (typeof global !== 'undefined') {
      global.MessageChannel = MessageChannelPolyfill;
      global.MessagePort = MessagePortPolyfill;
      global.__REACT_19_CLOUDFLARE_POLYFILL__ = true;
    } else if (typeof self !== 'undefined') {
      self.MessageChannel = MessageChannelPolyfill;
      self.MessagePort = MessagePortPolyfill;
      self.__REACT_19_CLOUDFLARE_POLYFILL__ = true;
    }
  }
})();
`;

/**
 * Vite Plugin: MessageChannel Polyfill Injector
 */
export function messageChannelPolyfillPlugin() {
  return {
    name: 'message-channel-polyfill',
    
    // SSRビルド時の前処理
    config(config, { command, isSsrBuild }) {
      if (isSsrBuild || command === 'build') {
        // SSRまたはビルド時にポリフィルを最優先で適用
        config.define = config.define || {};
        config.define.__POLYFILL_INJECTED__ = true;
      }
    },
    
    // チャンクの生成時にポリフィルを注入
    generateBundle(options, bundle) {
      // SSRバンドルの各チャンクの先頭にポリフィルを注入
      Object.values(bundle).forEach(chunk => {
        if (chunk.type === 'chunk' && chunk.isEntry) {
          // エントリーポイントの先頭にポリフィルを追加
          chunk.code = POLYFILL_CODE + '\\n' + chunk.code;
        }
      });
    },
    
    // モジュール変換時の処理
    transform(code, id) {
      // React DOMサーバー関連のファイルを変換前にポリフィルを適用
      if (id.includes('react-dom/server') || 
          id.includes('@astro/react') ||
          id.includes('astro-renderers')) {
        return POLYFILL_CODE + '\\n' + code;
      }
      return null;
    }
  };
}

export default messageChannelPolyfillPlugin;