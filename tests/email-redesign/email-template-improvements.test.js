/**
 * Email Template Redesign TDD Test Suite
 * 
 * 1. メールテンプレートのデザイン崩れ修正（レスポンシブ対応）
 * 2. カラーをスタイリッシュなモノクロ（白テキスト・#202123背景）に変更
 * 3. メール本文のハードコーディング削除と英語対応（en.json適用）
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Email Template Redesign - TDD Tests', () => {
  
  describe('1. Email Template Layout and Responsive Design', () => {
    it('should have responsive email templates with proper table structure', () => {
      const templatesPath = join(process.cwd(), 'src/lib/email/templates.ts');
      
      if (existsSync(templatesPath)) {
        const templatesContent = readFileSync(templatesPath, 'utf8');
        
        // レスポンシブデザインの要素確認
        expect(templatesContent).toContain('@media only screen and (max-width: 600px)');
        expect(templatesContent).toContain('width: 100% !important');
        expect(templatesContent).toContain('max-width: 100% !important');
        
        // テーブル構造の確認
        expect(templatesContent).toContain('<table cellpadding="0" cellspacing="0" border="0"');
        expect(templatesContent).toContain('style="width: 100%');
        
        // モバイル用クラスの確認
        expect(templatesContent).toContain('class="container"');
        expect(templatesContent).toContain('class="mobile-padding"');
      }
    });

    it('should not contain broken HTML structures or unclosed tags', () => {
      const templatesPath = join(process.cwd(), 'src/lib/email/templates.ts');
      
      if (existsSync(templatesPath)) {
        const templatesContent = readFileSync(templatesPath, 'utf8');
        
        // HTMLの開始・終了タグの数が一致しているかチェック
        const htmlOpenTags = (templatesContent.match(/<html[^>]*>/g) || []).length;
        const htmlCloseTags = (templatesContent.match(/<\/html>/g) || []).length;
        expect(htmlOpenTags).toBe(htmlCloseTags);
        
        const bodyOpenTags = (templatesContent.match(/<body[^>]*>/g) || []).length;
        const bodyCloseTags = (templatesContent.match(/<\/body>/g) || []).length;
        expect(bodyOpenTags).toBe(bodyCloseTags);
        
        const tableOpenTags = (templatesContent.match(/<table[^>]*>/g) || []).length;
        const tableCloseTags = (templatesContent.match(/<\/table>/g) || []).length;
        expect(tableOpenTags).toBe(tableCloseTags);
      }
    });
  });

  describe('2. Monochrome Color Scheme Implementation', () => {
    it('should use white text (#ffffff or white) for content', () => {
      const templatesPath = join(process.cwd(), 'src/lib/email/templates.ts');
      
      if (existsSync(templatesPath)) {
        const templatesContent = readFileSync(templatesPath, 'utf8');
        
        // 白いテキストカラーの使用確認
        expect(templatesContent).toContain('color: #ffffff');
        expect(templatesContent).toContain('color: white');
        
        // 古いカラーコードが残っていないこと
        expect(templatesContent).not.toContain('color: #1A1A1A');
        expect(templatesContent).not.toContain('color: #64748B');
      }
    });

    it('should use dark background (#202123) for main containers', () => {
      const templatesPath = join(process.cwd(), 'src/lib/email/templates.ts');
      
      if (existsSync(templatesPath)) {
        const templatesContent = readFileSync(templatesPath, 'utf8');
        
        // ダークな背景色の使用確認
        expect(templatesContent).toContain('#202123');
        expect(templatesContent).toContain('background: #202123');
        
        // 明るい背景色が使われていないこと
        expect(templatesContent).not.toContain('background: #ffffff');
        expect(templatesContent).not.toContain('background: linear-gradient(135deg, #f8fafc');
      }
    });

    it('should have minimal and stylish icon usage', () => {
      const templatesPath = join(process.cwd(), 'src/lib/email/templates.ts');
      
      if (existsSync(templatesPath)) {
        const templatesContent = readFileSync(templatesPath, 'utf8');
        
        // 必要最小限のSVGアイコン使用確認
        const svgCount = (templatesContent.match(/<svg[^>]*>/g) || []).length;
        expect(svgCount).toBeLessThanOrEqual(4); // 最大4つまでのアイコン
        
        // アイコンカラーが白であること
        expect(templatesContent).toContain('stroke="white"');
      }
    });
  });

  describe('3. Internationalization (i18n) Implementation', () => {
    it('should have email template translation keys in en.json', () => {
      const enJsonPath = join(process.cwd(), 'src/i18n/locales/en.json');
      
      if (existsSync(enJsonPath)) {
        const enContent = JSON.parse(readFileSync(enJsonPath, 'utf8'));
        
        // メールテンプレート用の翻訳キーの存在確認
        expect(enContent).toHaveProperty('email');
        expect(enContent.email).toHaveProperty('admin');
        expect(enContent.email).toHaveProperty('user');
        
        // 管理者メール用翻訳
        expect(enContent.email.admin).toHaveProperty('subject');
        expect(enContent.email.admin).toHaveProperty('title');
        expect(enContent.email.admin).toHaveProperty('contactDetails');
        expect(enContent.email.admin).toHaveProperty('name');
        expect(enContent.email.admin).toHaveProperty('email');
        expect(enContent.email.admin).toHaveProperty('organization');
        expect(enContent.email.admin).toHaveProperty('timestamp');
        expect(enContent.email.admin).toHaveProperty('messageContent');
        expect(enContent.email.admin).toHaveProperty('actionRequired');
        
        // ユーザー確認メール用翻訳
        expect(enContent.email.user).toHaveProperty('subject');
        expect(enContent.email.user).toHaveProperty('title');
        expect(enContent.email.user).toHaveProperty('thankYou');
        expect(enContent.email.user).toHaveProperty('responseTime');
      }
    });

    it('should have email template translation keys in ja.json', () => {
      const jaJsonPath = join(process.cwd(), 'src/i18n/locales/ja.json');
      
      if (existsSync(jaJsonPath)) {
        const jaContent = JSON.parse(readFileSync(jaJsonPath, 'utf8'));
        
        // メールテンプレート用の翻訳キーの存在確認
        expect(jaContent).toHaveProperty('email');
        expect(jaContent.email).toHaveProperty('admin');
        expect(jaContent.email).toHaveProperty('user');
        
        // 日本語翻訳の内容確認
        expect(jaContent.email.admin.contactDetails).toBe('お問い合わせ詳細');
        expect(jaContent.email.admin.messageContent).toBe('お問い合わせ内容');
        expect(jaContent.email.admin.actionRequired).toBe('対応アクション');
      }
    });

    it('should not contain hardcoded Japanese text in email templates', () => {
      const templatesPath = join(process.cwd(), 'src/lib/email/templates.ts');
      
      if (existsSync(templatesPath)) {
        const templatesContent = readFileSync(templatesPath, 'utf8');
        
        // ハードコーディングされた日本語テキストが残っていないこと
        expect(templatesContent).not.toContain('お問い合わせ詳細');
        expect(templatesContent).not.toContain('お問い合わせ内容');
        expect(templatesContent).not.toContain('対応アクション');
        expect(templatesContent).not.toContain('ご所属');
        expect(templatesContent).not.toContain('送信日時');
        expect(templatesContent).not.toContain('新しいお問い合わせ');
        
        // 翻訳関数の使用確認
        expect(templatesContent).toContain('t(');
        expect(templatesContent).toContain('email.admin');
        expect(templatesContent).toContain('email.user');
      }
    });

    it('should accept language parameter in email template functions', () => {
      const templatesPath = join(process.cwd(), 'src/lib/email/templates.ts');
      
      if (existsSync(templatesPath)) {
        const templatesContent = readFileSync(templatesPath, 'utf8');
        
        // 言語パラメータを受け取る関数定義
        expect(templatesContent).toContain('language: string');
        expect(templatesContent).toContain('generateContactAdminEmailHtml(data: ContactFormData, language: string');
        expect(templatesContent).toContain('generateContactConfirmationEmailHtml(data: ContactFormData, language: string');
      }
    });
  });

  describe('4. Email Template Function Integration', () => {
    it('should have updated email sender to pass language parameter', () => {
      const senderPath = join(process.cwd(), 'src/lib/email/sender.ts');
      
      if (existsSync(senderPath)) {
        const senderContent = readFileSync(senderPath, 'utf8');
        
        // 言語パラメータを渡していることを確認
        expect(senderContent).toContain('generateContactAdminEmailHtml(data, language');
        expect(senderContent).toContain('generateContactConfirmationEmailHtml(data, language');
        
        // 旧バージョンの呼び出しが残っていないこと
        expect(senderContent).not.toContain('generateContactAdminEmailHtml(data)');
      }
    });

    it('should properly handle both English and Japanese email generation', () => {
      const senderPath = join(process.cwd(), 'src/lib/email/sender.ts');
      
      if (existsSync(senderPath)) {
        const senderContent = readFileSync(senderPath, 'utf8');
        
        // 言語による分岐処理の確認
        expect(senderContent).toContain('language');
        expect(senderContent).toContain('isJapanese');
        
        // 英語と日本語両方のメール件名
        expect(senderContent).toContain('Contact Inquiry - DeepHand');
        expect(senderContent).toContain('お問い合わせ - DeepHand');
      }
    });
  });

  describe('5. Email Template Content Quality', () => {
    it('should maintain proper email accessibility standards', () => {
      const templatesPath = join(process.cwd(), 'src/lib/email/templates.ts');
      
      if (existsSync(templatesPath)) {
        const templatesContent = readFileSync(templatesPath, 'utf8');
        
        // アクセシビリティ要素の確認
        expect(templatesContent).toContain('alt="');
        expect(templatesContent).toContain('lang="');
        
        // 適切なコントラスト比（白文字 + 黒背景）
        expect(templatesContent).toContain('color: #ffffff');
        expect(templatesContent).toContain('color: white');
      }
    });

    it('should have clean and minimal design elements', () => {
      const templatesPath = join(process.cwd(), 'src/lib/email/templates.ts');
      
      if (existsSync(templatesPath)) {
        const templatesContent = readFileSync(templatesPath, 'utf8');
        
        // 過度な装飾が削除されていること
        expect(templatesContent).not.toContain('box-shadow: 0 20px 40px');
        expect(templatesContent).not.toContain('background: linear-gradient(135deg, rgba(35, 74, 217');
        
        // シンプルな構造
        expect(templatesContent).toContain('border-radius');
        expect(templatesContent).toContain('padding');
      }
    });
  });
});