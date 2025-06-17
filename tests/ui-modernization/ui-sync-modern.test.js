/**
 * UI同期・モダンデザイン改善TDDテストファイル
 * 
 * 対象問題:
 * 1. UI成功/失敗表示同期問題（成功レスポンスなのに"失敗"メッセージ表示）
 * 2. モダンバリデーションエラーポップアップデザイン（現在のデザインが十分にスタイリッシュでない）
 * 3. モダンメールテンプレートデザイン（メールデザインがページスタイルと一致しない）
 * 
 * 作成日: 2025年6月16日
 * TDD実装: 日本語コメント付き包括的テスト
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ========================================
// 1. UI成功/失敗表示同期問題テスト
// ========================================

describe('UI成功/失敗表示同期問題の解決', () => {
  
  describe('HeroSection コンタクトフォーム同期問題', () => {
    let mockFetch;
    
    beforeEach(() => {
      // フェッチのモック設定
      mockFetch = vi.fn();
      global.fetch = mockFetch;
    });
    
    afterEach(() => {
      vi.restoreAllMocks();
    });
    
    it('HTTPステータス200 + response.ok=true の場合、成功メッセージを表示すること', async () => {
      // 成功レスポンスのモック（実際のAPI動作を模倣）
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          emailId: 'test-email-id-123',
          message: 'メール送信成功'
        }),
        text: async () => JSON.stringify({
          success: true,
          emailId: 'test-email-id-123',
          message: 'メール送信成功'
        })
      });
      
      // HeroSectionをレンダリング
      const { getByTestId } = render(<HeroSection />);
      
      // フォーム送信
      const form = getByTestId('contact-form');
      const nameInput = getByTestId('contact-name-input');
      const emailInput = getByTestId('contact-email-input');
      const messageInput = getByTestId('contact-message-input');
      const submitButton = getByTestId('contact-submit-button');
      
      await userEvent.type(nameInput, '田中太郎');
      await userEvent.type(emailInput, 'tanaka@example.com');
      await userEvent.type(messageInput, 'テストメッセージです。よろしくお願いします。');
      
      fireEvent.click(submitButton);
      
      // 成功メッセージが表示されることを確認
      await waitFor(() => {
        const successMessage = screen.getByTestId('contact-success-message');
        expect(successMessage).toBeInTheDocument();
        expect(successMessage).toHaveTextContent('お問い合わせを受け付けました');
      });
      
      // 失敗メッセージが表示されないことを確認
      expect(screen.queryByTestId('contact-error-message')).not.toBeInTheDocument();
    });
    
    it('HTTPステータス200だが result.success=false の場合、バックエンドの判断に従い失敗メッセージを表示すること', async () => {
      // バックエンドが明示的に失敗を返す場合
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: false,
          error: 'バリデーションエラー',
          message: 'メールアドレスが無効です'
        }),
        text: async () => JSON.stringify({
          success: false,
          error: 'バリデーションエラー',
          message: 'メールアドレスが無効です'
        })
      });
      
      const { getByTestId } = render(<HeroSection />);
      
      // フォーム送信（不正なデータ）
      const nameInput = getByTestId('contact-name-input');
      const emailInput = getByTestId('contact-email-input');
      const messageInput = getByTestId('contact-message-input');
      const submitButton = getByTestId('contact-submit-button');
      
      await userEvent.type(nameInput, '田中太郎');
      await userEvent.type(emailInput, 'invalid-email');
      await userEvent.type(messageInput, 'テストメッセージ');
      
      fireEvent.click(submitButton);
      
      // 失敗メッセージが表示されることを確認
      await waitFor(() => {
        const errorMessage = screen.getByTestId('contact-error-message');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent('送信に失敗しました');
      });
    });
    
    it('HTTPエラー（4xx, 5xx）の場合、失敗メッセージを表示すること', async () => {
      // ネットワークエラーまたはサーバーエラー
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          error: 'サーバーエラー'
        }),
        text: async () => JSON.stringify({
          error: 'サーバーエラー'
        })
      });
      
      const { getByTestId } = render(<HeroSection />);
      
      // フォーム送信
      const nameInput = getByTestId('contact-name-input');
      const emailInput = getByTestId('contact-email-input');
      const messageInput = getByTestId('contact-message-input');
      const submitButton = getByTestId('contact-submit-button');
      
      await userEvent.type(nameInput, '田中太郎');
      await userEvent.type(emailInput, 'tanaka@example.com');
      await userEvent.type(messageInput, 'テストメッセージです。');
      
      fireEvent.click(submitButton);
      
      // 失敗メッセージが表示されることを確認
      await waitFor(() => {
        const errorMessage = screen.getByTestId('contact-error-message');
        expect(errorMessage).toBeInTheDocument();
      });
    });
    
    it('成功判定ロジックが複数条件を正しく評価すること', async () => {
      // emailIdが存在するが success フィールドが undefined の場合
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          emailId: 'email-id-456',
          message: 'メール送信完了',
          // success フィールドが存在しない
        }),
        text: async () => JSON.stringify({
          emailId: 'email-id-456',
          message: 'メール送信完了'
        })
      });
      
      const { getByTestId } = render(<HeroSection />);
      
      // フォーム送信
      const nameInput = getByTestId('contact-name-input');
      const emailInput = getByTestId('contact-email-input');
      const messageInput = getByTestId('contact-message-input');
      const submitButton = getByTestId('contact-submit-button');
      
      await userEvent.type(nameInput, '田中太郎');
      await userEvent.type(emailInput, 'tanaka@example.com');
      await userEvent.type(messageInput, 'テストメッセージです。');
      
      fireEvent.click(submitButton);
      
      // emailIdが存在するため成功と判定されることを確認
      await waitFor(() => {
        const successMessage = screen.getByTestId('contact-success-message');
        expect(successMessage).toBeInTheDocument();
      });
    });
  });
  
  describe('RequestDataPage データリクエストフォーム同期問題', () => {
    let mockFetch;
    
    beforeEach(() => {
      mockFetch = vi.fn();
      global.fetch = mockFetch;
    });
    
    afterEach(() => {
      vi.restoreAllMocks();
    });
    
    it('データリクエストフォームでも同様の成功判定ロジックが適用されること', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          requestId: 'data-request-789',
          message: 'データリクエスト受付完了'
        }),
        text: async () => JSON.stringify({
          success: true,
          requestId: 'data-request-789',
          message: 'データリクエスト受付完了'
        })
      });
      
      const { getByTestId } = render(<RequestDataPage />);
      
      // フォーム入力
      const step1NameInput = getByTestId('request-name-input');
      const step1EmailInput = getByTestId('request-email-input');
      const step1BackgroundInput = getByTestId('request-background-input');
      
      await userEvent.type(step1NameInput, '山田花子');
      await userEvent.type(step1EmailInput, 'yamada@example.com');
      await userEvent.type(step1BackgroundInput, '研究目的でデータを利用したい');
      
      // Step 2の入力
      const step2Button = getByTestId('next-to-step2-button');
      fireEvent.click(step2Button);
      
      const dataTypesCheckbox = getByTestId('data-types-checkbox-academic');
      fireEvent.click(dataTypesCheckbox);
      
      // Step 3での確認・送信
      const step3Button = getByTestId('next-to-step3-button');
      fireEvent.click(step3Button);
      
      const submitButton = getByTestId('request-submit-button');
      fireEvent.click(submitButton);
      
      // 成功メッセージが表示されることを確認
      await waitFor(() => {
        const successMessage = screen.getByTestId('request-success-message');
        expect(successMessage).toBeInTheDocument();
        expect(successMessage).toHaveTextContent('データリクエストを受け付けました');
      });
    });
  });
});

// ========================================
// 2. モダンバリデーションエラーポップアップデザインテスト
// ========================================

describe('モダンバリデーションエラーポップアップデザイン', () => {
  
  describe('バリデーションエラー表示の改善', () => {
    
    it('個別フィールドエラーがモダンなスタイルで表示されること', async () => {
      const { getByTestId } = render(<HeroSection />);
      
      // 無効なデータでフォーム送信
      const nameInput = getByTestId('contact-name-input');
      const emailInput = getByTestId('contact-email-input');
      const messageInput = getByTestId('contact-message-input');
      const submitButton = getByTestId('contact-submit-button');
      
      // 空の名前フィールド
      await userEvent.clear(nameInput);
      await userEvent.type(emailInput, 'invalid-email');
      await userEvent.type(messageInput, '短い');
      
      fireEvent.click(submitButton);
      
      // モダンなエラー表示の確認
      await waitFor(() => {
        const nameError = screen.getByTestId('name-validation-error');
        const emailError = screen.getByTestId('email-validation-error'); 
        const messageError = screen.getByTestId('message-validation-error');
        
        // エラーメッセージが表示される
        expect(nameError).toBeInTheDocument();
        expect(emailError).toBeInTheDocument();
        expect(messageError).toBeInTheDocument();
        
        // モダンなスタイルクラスが適用される
        expect(nameError).toHaveClass('validation-error-modern');
        expect(emailError).toHaveClass('validation-error-modern');
        expect(messageError).toHaveClass('validation-error-modern');
        
        // アニメーション効果が適用される
        expect(nameError).toHaveClass('animate-fade-in');
        expect(emailError).toHaveClass('animate-fade-in');
        expect(messageError).toHaveClass('animate-fade-in');
      });
    });
    
    it('バリデーションエラーポップアップがグラデーション背景を持つこと', async () => {
      const { getByTestId } = render(<HeroSection />);
      
      // 無効データで送信
      const submitButton = getByTestId('contact-submit-button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const errorPopup = screen.getByTestId('validation-error-popup');
        
        // モダンなグラデーション背景
        expect(errorPopup).toHaveClass('bg-gradient-to-br');
        expect(errorPopup).toHaveClass('from-red-50');
        expect(errorPopup).toHaveClass('to-pink-50');
        
        // ボーダーとシャドウ効果
        expect(errorPopup).toHaveClass('border-red-200');
        expect(errorPopup).toHaveClass('shadow-lg');
        expect(errorPopup).toHaveClass('backdrop-blur-sm');
      });
    });
    
    it('エラーアイコンがSVGアイコンでモダンに表示されること', async () => {
      const { getByTestId } = render(<HeroSection />);
      
      const submitButton = getByTestId('contact-submit-button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const errorIcon = screen.getByTestId('validation-error-icon');
        
        // SVGアイコンが表示される
        expect(errorIcon).toBeInTheDocument();
        expect(errorIcon.tagName).toBe('svg');
        
        // モダンなスタイリング
        expect(errorIcon).toHaveClass('text-red-500');
        expect(errorIcon).toHaveClass('animate-pulse');
      });
    });
    
    it('バリデーションエラーがトースト通知スタイルで表示されること', async () => {
      const { getByTestId } = render(<RequestDataPage />);
      
      // Step 1で無効データ送信
      const nextButton = getByTestId('next-to-step2-button');
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        const toastError = screen.getByTestId('validation-toast-error');
        
        // トースト位置とスタイル
        expect(toastError).toHaveClass('fixed');
        expect(toastError).toHaveClass('top-4');
        expect(toastError).toHaveClass('right-4');
        expect(toastError).toHaveClass('z-50');
        
        // モダンなデザイン
        expect(toastError).toHaveClass('bg-white');
        expect(toastError).toHaveClass('border-l-4');
        expect(toastError).toHaveClass('border-red-500');
        expect(toastError).toHaveClass('rounded-lg');
        expect(toastError).toHaveClass('shadow-xl');
        
        // アニメーション
        expect(toastError).toHaveClass('animate-slide-in-right');
      });
    });
    
    it('バリデーションエラーに閉じるボタンが付いてインタラクティブであること', async () => {
      const { getByTestId } = render(<HeroSection />);
      
      const submitButton = getByTestId('contact-submit-button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const errorPopup = screen.getByTestId('validation-error-popup');
        const closeButton = screen.getByTestId('validation-error-close');
        
        expect(errorPopup).toBeInTheDocument();
        expect(closeButton).toBeInTheDocument();
        
        // 閉じるボタンのスタイル
        expect(closeButton).toHaveClass('hover:bg-red-100');
        expect(closeButton).toHaveClass('transition-colors');
        expect(closeButton).toHaveClass('duration-200');
      });
      
      // 閉じるボタンをクリック
      const closeButton = screen.getByTestId('validation-error-close');
      fireEvent.click(closeButton);
      
      // エラーポップアップが消えることを確認
      await waitFor(() => {
        expect(screen.queryByTestId('validation-error-popup')).not.toBeInTheDocument();
      });
    });
    
    it('複数のバリデーションエラーがリスト形式で美しく表示されること', async () => {
      const { getByTestId } = render(<HeroSection />);
      
      // 複数のエラーを発生させる
      const nameInput = getByTestId('contact-name-input');
      const emailInput = getByTestId('contact-email-input');
      const messageInput = getByTestId('contact-message-input');
      const submitButton = getByTestId('contact-submit-button');
      
      await userEvent.clear(nameInput); // 空の名前
      await userEvent.type(emailInput, 'invalid'); // 無効なメール
      await userEvent.type(messageInput, '短'); // 短すぎるメッセージ
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const errorList = screen.getByTestId('validation-error-list');
        const errorItems = screen.getAllByTestId('validation-error-item');
        
        // エラーリストが表示される
        expect(errorList).toBeInTheDocument();
        expect(errorItems).toHaveLength(3);
        
        // リストスタイリング
        expect(errorList).toHaveClass('space-y-2');
        
        errorItems.forEach(item => {
          // 各エラーアイテムのスタイル
          expect(item).toHaveClass('flex');
          expect(item).toHaveClass('items-center');
          expect(item).toHaveClass('gap-2');
          expect(item).toHaveClass('text-red-600');
          expect(item).toHaveClass('text-sm');
          expect(item).toHaveClass('font-medium');
        });
      });
    });
  });
  
  describe('リアルタイムバリデーション表示', () => {
    
    it('フィールド入力中にリアルタイムでバリデーション結果が表示されること', async () => {
      const { getByTestId } = render(<HeroSection />);
      
      const emailInput = getByTestId('contact-email-input');
      
      // 無効なメールアドレスを入力
      await userEvent.type(emailInput, 'invalid');
      
      // フィールドからフォーカスを外す
      fireEvent.blur(emailInput);
      
      await waitFor(() => {
        const realtimeError = screen.getByTestId('email-realtime-validation');
        
        expect(realtimeError).toBeInTheDocument();
        expect(realtimeError).toHaveTextContent('有効なメールアドレスを入力してください');
        
        // リアルタイムエラーのスタイル
        expect(realtimeError).toHaveClass('text-red-500');
        expect(realtimeError).toHaveClass('text-xs');
        expect(realtimeError).toHaveClass('mt-1');
        expect(realtimeError).toHaveClass('animate-fade-in');
      });
      
      // 正しいメールアドレスに修正
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, 'valid@example.com');
      fireEvent.blur(emailInput);
      
      // エラーが消えることを確認
      await waitFor(() => {
        expect(screen.queryByTestId('email-realtime-validation')).not.toBeInTheDocument();
      });
    });
  });
});

// ========================================
// 3. モダンメールテンプレートデザインテスト
// ========================================

describe('モダンメールテンプレートデザイン', () => {
  
  describe('コンタクトフォームメールテンプレート', () => {
    
    it('管理者向けメールテンプレートがモダンなデザインを持つこと', () => {
      const testData = {
        name: '田中太郎',
        email: 'tanaka@example.com',
        organization: 'テスト株式会社',
        message: 'お問い合わせ内容のテストです。'
      };
      
      // テンプレート生成関数をインポート（実際の実装で置き換え）
      const { generateContactAdminEmailHtml } = require('../../src/lib/email/templates');
      const htmlTemplate = generateContactAdminEmailHtml(testData);
      
      // モダンなデザイン要素の確認
      expect(htmlTemplate).toContain('background: linear-gradient'); // グラデーション背景
      expect(htmlTemplate).toContain('border-radius: 12px'); // 角丸
      expect(htmlTemplate).toContain('box-shadow:'); // シャドウ効果
      expect(htmlTemplate).toContain('font-family: -apple-system'); // モダンフォント
      
      // ブランドカラーの使用
      expect(htmlTemplate).toContain('#234ad9'); // プライマリブルー
      expect(htmlTemplate).toContain('#1e3eb8'); // ダークブルー
      
      // レスポンシブデザイン
      expect(htmlTemplate).toContain('max-width: 600px');
      expect(htmlTemplate).toContain('width="100%"');
      
      // アクセシビリティ
      expect(htmlTemplate).toContain('alt="');
      expect(htmlTemplate).toContain('role="');
    });
    
    it('確認メールテンプレートがページデザインと一致したスタイルを持つこと', () => {
      const testData = {
        name: '田中太郎',
        email: 'tanaka@example.com',
        organization: 'テスト株式会社',
        message: 'お問い合わせ内容のテストです。'
      };
      
      const { generateContactConfirmationEmailHtml } = require('../../src/lib/email/templates');
      const htmlTemplate = generateContactConfirmationEmailHtml(testData);
      
      // ページと同じデザインシステム
      expect(htmlTemplate).toContain('DeepHand'); // ブランド名
      expect(htmlTemplate).toContain('font-weight: 300'); // ライトフォント
      expect(htmlTemplate).toContain('letter-spacing: -0.5px'); // フォント調整
      
      // Tailwind風のカラーシステム
      expect(htmlTemplate).toContain('#f8fafc'); // slate-50相当
      expect(htmlTemplate).toContain('#1e293b'); // slate-800相当
      expect(htmlTemplate).toContain('#475569'); // slate-600相当
      
      // アイコンとビジュアル要素
      expect(htmlTemplate).toContain('✓'); // チェックマークアイコン
      expect(htmlTemplate).toContain('rgba(255, 255, 255, 0.15)'); // 透明度活用
    });
    
    it('メールテンプレートがダークモード対応を考慮していること', () => {
      const testData = {
        name: '田中太郎',
        email: 'tanaka@example.com',
        organization: 'テスト株式会社',
        message: 'お問い合わせ内容のテストです。'
      };
      
      const { generateContactAdminEmailHtml } = require('../../src/lib/email/templates');
      const htmlTemplate = generateContactAdminEmailHtml(testData);
      
      // メディアクエリでダークモード対応
      expect(htmlTemplate).toContain('@media (prefers-color-scheme: dark)');
      
      // または明示的なダークモード用スタイル
      expect(htmlTemplate).toContain('[data-theme="dark"]');
      
      // コントラスト比の確保
      expect(htmlTemplate).not.toContain('color: #999'); // 低コントラストの避ける
      expect(htmlTemplate).not.toContain('background: #ddd'); // 低コントラスト背景を避ける
    });
    
    it('メールテンプレートにインタラクティブ要素が含まれていること', () => {
      const testData = {
        name: '田中太郎',
        email: 'tanaka@example.com', 
        organization: 'テスト株式会社',
        message: 'お問い合わせ内容のテストです。'
      };
      
      const { generateContactConfirmationEmailHtml } = require('../../src/lib/email/templates');
      const htmlTemplate = generateContactConfirmationEmailHtml(testData);
      
      // ホバー効果
      expect(htmlTemplate).toContain(':hover');
      expect(htmlTemplate).toContain('transition');
      
      // クリック可能な要素
      expect(htmlTemplate).toContain('href="mailto:');
      expect(htmlTemplate).toContain('href="https://');
      
      // ボタン風スタイリング
      expect(htmlTemplate).toContain('background: #234ad9');
      expect(htmlTemplate).toContain('padding: 12px 24px');
      expect(htmlTemplate).toContain('border-radius: 6px');
    });
  });
  
  describe('データリクエストメールテンプレート', () => {
    
    it('データリクエスト管理者向けメールがページデザインと統一されていること', () => {
      const testData = {
        personalInfo: {
          name: '山田花子',
          email: 'yamada@example.com',
          organization: '研究機関A'
        },
        requestDetails: {
          backgroundPurpose: '学術研究目的',
          dataTypes: ['academic', 'commercial'],
          specificRequirements: '手の動作データが必要'
        }
      };
      
      const { generateDataRequestAdminEmailHtml } = require('../../src/lib/email/templates');
      const htmlTemplate = generateDataRequestAdminEmailHtml(testData);
      
      // ページと同じメタボール背景
      expect(htmlTemplate).toContain('meta-balls-background');
      expect(htmlTemplate).toContain('animation: float');
      
      // ページと同じグラデーション
      expect(htmlTemplate).toContain('linear-gradient(135deg, #234ad9 0%, #1e3eb8 100%)');
      
      // ページと同じタイポグラフィ
      expect(htmlTemplate).toContain('font-family: Alliance'); // Alliance No.1フォント
      expect(htmlTemplate).toContain('font-weight: 300'); // ライト
      expect(htmlTemplate).toContain('font-weight: 600'); // セミボールド
    });
    
    it('データリクエスト確認メールにプログレスバー要素が含まれていること', () => {
      const testData = {
        personalInfo: {
          name: '山田花子',
          email: 'yamada@example.com'
        },
        requestDetails: {
          backgroundPurpose: '学術研究目的'
        }
      };
      
      const { generateDataRequestConfirmationEmailHtml } = require('../../src/lib/email/templates');
      const htmlTemplate = generateDataRequestConfirmationEmailHtml(testData);
      
      // プログレスバーのHTML構造
      expect(htmlTemplate).toContain('progress-bar');
      expect(htmlTemplate).toContain('progress-step');
      expect(htmlTemplate).toContain('progress-indicator');
      
      // 段階的なプロセス表示
      expect(htmlTemplate).toContain('Step 1: リクエスト受付');
      expect(htmlTemplate).toContain('Step 2: 審査中');
      expect(htmlTemplate).toContain('Step 3: 承認・データ提供');
      
      // CSS アニメーション
      expect(htmlTemplate).toContain('@keyframes progress');
      expect(htmlTemplate).toContain('animation: progress');
    });
    
    it('メールテンプレートがモバイル最適化されていること', () => {
      const testData = {
        name: '田中太郎',
        email: 'tanaka@example.com'
      };
      
      const { generateContactConfirmationEmailHtml } = require('../../src/lib/email/templates');
      const htmlTemplate = generateContactConfirmationEmailHtml(testData);
      
      // モバイル用メディアクエリ
      expect(htmlTemplate).toContain('@media only screen and (max-width: 600px)');
      
      // モバイル最適化スタイル
      expect(htmlTemplate).toContain('width: 100% !important');
      expect(htmlTemplate).toContain('padding: 15px !important');
      expect(htmlTemplate).toContain('font-size: 14px !important');
      
      // タッチフレンドリーなボタンサイズ
      expect(htmlTemplate).toContain('min-height: 44px');
      expect(htmlTemplate).toContain('padding: 12px 16px');
    });
  });
  
  describe('メールテンプレートの国際化対応', () => {
    
    it('日本語メールテンプレートが適切なフォント設定を持つこと', () => {
      const testData = {
        name: '田中太郎',
        email: 'tanaka@example.com',
        message: 'お問い合わせ内容です。'
      };
      
      const { generateContactConfirmationEmailHtml } = require('../../src/lib/email/templates');
      const htmlTemplate = generateContactConfirmationEmailHtml(testData);
      
      // 日本語フォントスタック
      expect(htmlTemplate).toContain('Hiragino Sans');
      expect(htmlTemplate).toContain('Yu Gothic');
      expect(htmlTemplate).toContain('Meiryo');
      expect(htmlTemplate).toContain('Noto Sans JP');
      
      // 文字エンコーディング
      expect(htmlTemplate).toContain('charset="UTF-8"');
      expect(htmlTemplate).toContain('lang="ja"');
    });
    
    it('英語メールテンプレートが生成できること', () => {
      const testData = {
        name: 'John Smith',
        email: 'john@example.com',
        message: 'Test inquiry message.'
      };
      
      // 英語版テンプレート関数（実装予定）
      const { generateContactConfirmationEmailHtmlEn } = require('../../src/lib/email/templates');
      const htmlTemplate = generateContactConfirmationEmailHtmlEn(testData);
      
      // 英語コンテンツ
      expect(htmlTemplate).toContain('Thank you for your inquiry');
      expect(htmlTemplate).toContain('We will respond within 1-2 business days');
      
      // 英語フォントスタック
      expect(htmlTemplate).toContain('font-family: -apple-system');
      expect(htmlTemplate).toContain('BlinkMacSystemFont');
      expect(htmlTemplate).toContain('Segoe UI');
      
      // 言語設定
      expect(htmlTemplate).toContain('lang="en"');
    });
  });
});

// ========================================
// 4. ビジュアル一貫性テスト
// ========================================

describe('ページデザインとの視覚的一貫性', () => {
  
  describe('カラーパレット一貫性', () => {
    
    it('UIコンポーネントがページと同じカラーパレットを使用すること', () => {
      const { getByTestId } = render(<HeroSection />);
      
      // プライマリカラー
      const submitButton = getByTestId('contact-submit-button');
      expect(submitButton).toHaveClass('bg-[#234ad9]');
      expect(submitButton).toHaveClass('hover:bg-[#1e3eb8]');
      
      // セカンダリカラー
      const nameInput = getByTestId('contact-name-input');
      expect(nameInput).toHaveClass('border-slate-300');
      expect(nameInput).toHaveClass('focus:border-[#234ad9]');
      
      // エラーカラー
      const errorText = getByTestId('contact-error-message');
      expect(errorText).toHaveClass('text-red-500');
    });
    
    it('メールテンプレートがページと同じカラーパレットを使用すること', () => {
      const testData = {
        name: '田中太郎',
        email: 'tanaka@example.com'
      };
      
      const { generateContactConfirmationEmailHtml } = require('../../src/lib/email/templates');
      const htmlTemplate = generateContactConfirmationEmailHtml(testData);
      
      // 同じカラーコードの使用確認
      expect(htmlTemplate).toContain('#234ad9'); // プライマリブルー
      expect(htmlTemplate).toContain('#1e3eb8'); // ダークブルー
      expect(htmlTemplate).toContain('#f8fafc'); // 背景色
      expect(htmlTemplate).toContain('#1e293b'); // テキスト色
    });
  });
  
  describe('タイポグラフィ一貫性', () => {
    
    it('フォントファミリーがページ全体で統一されていること', () => {
      const { getByTestId } = render(<HeroSection />);
      
      // 各要素のフォント確認
      const title = getByTestId('hero-title');
      const description = getByTestId('hero-description');
      const button = getByTestId('contact-submit-button');
      
      expect(title).toHaveClass('font-alliance');
      expect(description).toHaveClass('font-alliance');
      expect(button).toHaveClass('font-alliance');
    });
    
    it('フォントウェイトの階層が適切に設定されていること', () => {
      const { getByTestId } = render(<HeroSection />);
      
      const title = getByTestId('hero-title');
      const subtitle = getByTestId('hero-subtitle');
      const bodyText = getByTestId('hero-body-text');
      
      // 階層的なフォントウェイト
      expect(title).toHaveClass('font-bold'); // 700
      expect(subtitle).toHaveClass('font-semibold'); // 600
      expect(bodyText).toHaveClass('font-light'); // 300
    });
  });
  
  describe('レイアウト一貫性', () => {
    
    it('コンポーネント間の余白が統一されていること', () => {
      const { getByTestId } = render(<HeroSection />);
      
      // 統一されたスペーシング
      const section = getByTestId('hero-section');
      const container = getByTestId('hero-container');
      
      expect(section).toHaveClass('py-16'); // または py-20
      expect(container).toHaveClass('px-4'); // または px-6
      
      // グリッドシステムの使用
      expect(container).toHaveClass('max-w-7xl');
      expect(container).toHaveClass('mx-auto');
    });
    
    it('ボタンサイズとパディングが統一されていること', () => {
      const { getByTestId } = render(<HeroSection />);
      
      const primaryButton = getByTestId('contact-submit-button');
      const secondaryButton = getByTestId('contact-reset-button');
      
      // 統一されたボタンスタイル
      expect(primaryButton).toHaveClass('px-6');
      expect(primaryButton).toHaveClass('py-3');
      expect(primaryButton).toHaveClass('rounded-lg');
      
      expect(secondaryButton).toHaveClass('px-6');
      expect(secondaryButton).toHaveClass('py-3');
      expect(secondaryButton).toHaveClass('rounded-lg');
    });
  });
});

// ========================================
// 5. ユーザーエクスペリエンス向上テスト
// ========================================

describe('ユーザーエクスペリエンス向上', () => {
  
  describe('フィードバック表示の改善', () => {
    
    it('送信中にローディング状態が表示されること', async () => {
      const mockFetch = vi.fn(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            status: 200,
            json: async () => ({ success: true, emailId: 'test-123' })
          }), 2000)
        )
      );
      global.fetch = mockFetch;
      
      const { getByTestId } = render(<HeroSection />);
      
      // フォーム入力
      const nameInput = getByTestId('contact-name-input');
      const emailInput = getByTestId('contact-email-input');
      const messageInput = getByTestId('contact-message-input');
      const submitButton = getByTestId('contact-submit-button');
      
      await userEvent.type(nameInput, '田中太郎');
      await userEvent.type(emailInput, 'tanaka@example.com');
      await userEvent.type(messageInput, 'テストメッセージです。');
      
      fireEvent.click(submitButton);
      
      // ローディング状態の確認
      await waitFor(() => {
        const loadingSpinner = screen.getByTestId('contact-loading-spinner');
        const loadingText = screen.getByTestId('contact-loading-text');
        
        expect(loadingSpinner).toBeInTheDocument();
        expect(loadingText).toBeInTheDocument();
        expect(loadingText).toHaveTextContent('送信中...');
        
        // ボタンが無効化される
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveClass('opacity-50');
      });
    });
    
    it('成功時にアニメーション付き成功メッセージが表示されること', async () => {
      const mockFetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true, emailId: 'test-123' }),
        text: async () => JSON.stringify({ success: true, emailId: 'test-123' })
      });
      global.fetch = mockFetch;
      
      const { getByTestId } = render(<HeroSection />);
      
      // フォーム送信
      const nameInput = getByTestId('contact-name-input');
      const emailInput = getByTestId('contact-email-input');
      const messageInput = getByTestId('contact-message-input');
      const submitButton = getByTestId('contact-submit-button');
      
      await userEvent.type(nameInput, '田中太郎');
      await userEvent.type(emailInput, 'tanaka@example.com');
      await userEvent.type(messageInput, 'テストメッセージです。');
      
      fireEvent.click(submitButton);
      
      // 成功メッセージのアニメーション確認
      await waitFor(() => {
        const successMessage = screen.getByTestId('contact-success-message');
        const successIcon = screen.getByTestId('contact-success-icon');
        
        expect(successMessage).toBeInTheDocument();
        expect(successIcon).toBeInTheDocument();
        
        // アニメーション効果
        expect(successMessage).toHaveClass('animate-fade-in-up');
        expect(successIcon).toHaveClass('animate-bounce');
        
        // 成功スタイル
        expect(successMessage).toHaveClass('bg-green-50');
        expect(successMessage).toHaveClass('border-green-200');
        expect(successMessage).toHaveClass('text-green-800');
      });
    });
  });
  
  describe('アクセシビリティ向上', () => {
    
    it('エラーメッセージにaria-live属性が設定されていること', async () => {
      const { getByTestId } = render(<HeroSection />);
      
      const submitButton = getByTestId('contact-submit-button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const errorRegion = screen.getByTestId('validation-error-region');
        
        expect(errorRegion).toHaveAttribute('aria-live', 'polite');
        expect(errorRegion).toHaveAttribute('aria-atomic', 'true');
        expect(errorRegion).toHaveAttribute('role', 'alert');
      });
    });
    
    it('フォームにproper labelsとdescriptionsが設定されていること', () => {
      const { getByTestId } = render(<HeroSection />);
      
      const nameInput = getByTestId('contact-name-input');
      const emailInput = getByTestId('contact-email-input');
      const messageInput = getByTestId('contact-message-input');
      
      // ラベル関連付け
      expect(nameInput).toHaveAttribute('aria-labelledby');
      expect(emailInput).toHaveAttribute('aria-labelledby');
      expect(messageInput).toHaveAttribute('aria-labelledby');
      
      // 説明文の関連付け
      expect(nameInput).toHaveAttribute('aria-describedby');
      expect(emailInput).toHaveAttribute('aria-describedby');
      expect(messageInput).toHaveAttribute('aria-describedby');
    });
    
    it('キーボードナビゲーションが適切に動作すること', async () => {
      const { getByTestId } = render(<HeroSection />);
      
      const nameInput = getByTestId('contact-name-input');
      const emailInput = getByTestId('contact-email-input');
      const messageInput = getByTestId('contact-message-input');
      const submitButton = getByTestId('contact-submit-button');
      
      // Tab順序の確認
      nameInput.focus();
      expect(nameInput).toHaveFocus();
      
      await userEvent.tab();
      expect(emailInput).toHaveFocus();
      
      await userEvent.tab();
      expect(messageInput).toHaveFocus();
      
      await userEvent.tab();
      expect(submitButton).toHaveFocus();
      
      // エンターキーでの送信
      await userEvent.keyboard('{Enter}');
      
      // フォーム送信が実行されることを確認
      await waitFor(() => {
        expect(screen.getByTestId('validation-error-popup')).toBeInTheDocument();
      });
    });
  });
});

// ========================================
// テストヘルパー関数
// ========================================

/**
 * フォームデータを入力するヘルパー関数
 */
async function fillContactForm(getByTestId, data) {
  const nameInput = getByTestId('contact-name-input');
  const emailInput = getByTestId('contact-email-input');
  const messageInput = getByTestId('contact-message-input');
  const organizationInput = getByTestId('contact-organization-input');
  
  if (data.name) await userEvent.type(nameInput, data.name);
  if (data.email) await userEvent.type(emailInput, data.email);
  if (data.message) await userEvent.type(messageInput, data.message);
  if (data.organization) await userEvent.type(organizationInput, data.organization);
}

/**
 * データリクエストフォームを入力するヘルパー関数
 */
async function fillDataRequestForm(getByTestId, data) {
  // Step 1
  const nameInput = getByTestId('request-name-input');
  const emailInput = getByTestId('request-email-input');
  const backgroundInput = getByTestId('request-background-input');
  
  await userEvent.type(nameInput, data.name);
  await userEvent.type(emailInput, data.email);
  await userEvent.type(backgroundInput, data.backgroundPurpose);
  
  // Step 2への遷移
  const nextButton = getByTestId('next-to-step2-button');
  fireEvent.click(nextButton);
  
  // Step 2のデータタイプ選択
  if (data.dataTypes) {
    data.dataTypes.forEach(type => {
      const checkbox = getByTestId(`data-types-checkbox-${type}`);
      fireEvent.click(checkbox);
    });
  }
}

/**
 * CSSカスタムプロパティの値を取得するヘルパー関数
 */
function getCSSCustomProperty(element, property) {
  return getComputedStyle(element).getPropertyValue(property).trim();
}

/**
 * メールテンプレートHTMLを解析するヘルパー関数
 */
function parseEmailTemplate(htmlString) {
  const parser = new DOMParser();
  return parser.parseFromString(htmlString, 'text/html');
}