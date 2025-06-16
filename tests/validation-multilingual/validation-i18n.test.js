/**
 * TDD Test: バリデーションエラーメッセージの多言語化テスト
 * 
 * 目的:
 * 1. 現在のハードコーディングされたエラーメッセージを特定
 * 2. 多言語対応のバリデーションメッセージ実装を検証
 * 3. エラー表示デザインの改善を確認
 * 4. messageフィールドの入力範囲改善を検証
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('バリデーションエラーメッセージ多言語化テスト', () => {
  let testResults = [];

  afterAll(() => {
    console.log('\n🔍 バリデーション多言語化テスト結果:');
    testResults.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${status} ${result.name}: ${result.message}`);
    });
  });

  test('現在のハードコーディングされたエラーメッセージの検出', () => {
    const heroSectionPath = '/Users/shee/dev/yogo/deephand/deephand-web/src/components/HeroSection.tsx';
    const requestDataPagePath = '/Users/shee/dev/yogo/deephand/deephand-web/src/components/RequestDataPage.tsx';
    
    let passed = true;
    let issues = [];

    // HeroSection.tsxのハードコーディング検出
    if (fs.existsSync(heroSectionPath)) {
      const heroContent = fs.readFileSync(heroSectionPath, 'utf8');
      const hardcodedMessages = [
        'お名前を入力してください',
        'メールアドレスを入力してください',
        '有効なメールアドレスを入力してください',
        'メッセージを入力してください'
      ];
      
      hardcodedMessages.forEach(msg => {
        if (heroContent.includes(msg)) {
          issues.push(`HeroSection: "${msg}" がハードコーディングされています`);
          passed = false;
        }
      });
    }

    // RequestDataPage.tsxのハードコーディング検出
    if (fs.existsSync(requestDataPagePath)) {
      const requestContent = fs.readFileSync(requestDataPagePath, 'utf8');
      const hardcodedMessages = [
        'お名前を入力してください',
        'メールアドレスを入力してください',
        '背景・目的を入力してください',
        'データタイプを選択してください'
      ];
      
      hardcodedMessages.forEach(msg => {
        if (requestContent.includes(msg)) {
          issues.push(`RequestDataPage: "${msg}" がハードコーディングされています`);
          passed = false;
        }
      });
    }

    testResults.push({
      name: 'ハードコーディング検出',
      passed,
      message: passed ? 'ハードコーディングなし' : `発見: ${issues.join(', ')}`
    });

    expect(passed).toBe(false); // Red フェーズ: 現在はハードコーディングがあることを確認
  });

  test('翻訳キーの存在確認', () => {
    const jaTranslationsPath = '/Users/shee/dev/yogo/deephand/deephand-web/src/i18n/locales/ja.json';
    const enTranslationsPath = '/Users/shee/dev/yogo/deephand/deephand-web/src/i18n/locales/en.json';
    
    let passed = true;
    let messages = [];

    const requiredValidationKeys = [
      'validation.required',
      'validation.email',
      'validation.dataTypeRequired'
    ];

    // 日本語翻訳の確認
    if (fs.existsSync(jaTranslationsPath)) {
      const jaContent = JSON.parse(fs.readFileSync(jaTranslationsPath, 'utf8'));
      requiredValidationKeys.forEach(key => {
        const keys = key.split('.');
        let value = jaContent;
        for (const k of keys) {
          value = value?.[k];
        }
        if (!value) {
          passed = false;
          messages.push(`日本語: ${key} が見つかりません`);
        }
      });
    }

    // 英語翻訳の確認
    if (fs.existsSync(enTranslationsPath)) {
      const enContent = JSON.parse(fs.readFileSync(enTranslationsPath, 'utf8'));
      requiredValidationKeys.forEach(key => {
        const keys = key.split('.');
        let value = enContent;
        for (const k of keys) {
          value = value?.[k];
        }
        if (!value) {
          passed = false;
          messages.push(`英語: ${key} が見つかりません`);
        }
      });
    }

    testResults.push({
      name: '翻訳キー存在確認',
      passed,
      message: passed ? '必要な翻訳キーが存在' : messages.join(', ')
    });

    expect(passed).toBe(true); // Green フェーズ: 翻訳キーは既に存在するはず
  });

  test('多言語バリデーション実装の検証（実装後）', () => {
    const heroSectionPath = '/Users/shee/dev/yogo/deephand/deephand-web/src/components/HeroSection.tsx';
    
    let passed = false;
    let message = '';

    if (fs.existsSync(heroSectionPath)) {
      const content = fs.readFileSync(heroSectionPath, 'utf8');
      
      // t() 関数の使用を確認
      const usesTranslationFunction = content.includes("t('validation.") || content.includes('t("validation.');
      // interpolation の使用を確認
      const usesInterpolation = content.includes('{{field}}') || content.includes(', {');
      
      if (usesTranslationFunction) {
        passed = true;
        message = usesInterpolation ? 
          '多言語バリデーション + interpolation実装済み' : 
          '多言語バリデーション実装済み（interpolation未使用）';
      } else {
        message = '多言語バリデーション未実装';
      }
    }

    testResults.push({
      name: '多言語バリデーション実装',
      passed,
      message
    });

    // この段階では実装前なので false を期待
    expect(passed).toBe(false);
  });

  test('エラー表示デザインの改善確認', () => {
    const heroSectionPath = '/Users/shee/dev/yogo/deephand/deephand-web/src/components/HeroSection.tsx';
    
    let passed = false;
    let features = [];

    if (fs.existsSync(heroSectionPath)) {
      const content = fs.readFileSync(heroSectionPath, 'utf8');
      
      // インラインエラー表示（フィールドレベル）の確認
      if (content.includes('border-red-') || content.includes('ring-red-')) {
        features.push('フィールド枠線エラー表示');
        passed = true;
      }
      
      // リッチエラーアイコンの確認
      if (content.includes('AlertCircle') || content.includes('ExclamationTriangle')) {
        features.push('エラーアイコン');
        passed = true;
      }
      
      // グラデーションやダークテーマ適合デザイン
      if (content.includes('bg-red-950') || content.includes('border-red-800')) {
        features.push('ダークテーマ適合デザイン');
        passed = true;
      }
    }

    testResults.push({
      name: 'エラーデザイン改善',
      passed,
      message: passed ? `実装機能: ${features.join(', ')}` : 'エラーデザイン改善未実装'
    });

    expect(passed).toBe(false); // Red フェーズ: 現在は未実装
  });

  test('messageフィールド入力範囲改善の確認', () => {
    const heroSectionPath = '/Users/shee/dev/yogo/deephand/deephand-web/src/components/HeroSection.tsx';
    
    let passed = false;
    let improvements = [];

    if (fs.existsSync(heroSectionPath)) {
      const content = fs.readFileSync(heroSectionPath, 'utf8');
      
      // 高さの改善確認
      if (content.includes('h-[120px]') || content.includes('h-[150px]') || content.includes('min-h-')) {
        improvements.push('高さ改善');
        passed = true;
      }
      
      // 文字数カウンター
      if (content.includes('字数') || content.includes('characters') || content.includes('length')) {
        improvements.push('文字数表示');
        passed = true;
      }
      
      // リサイズ対応
      if (content.includes('resize-y') || content.includes('resize-vertical')) {
        improvements.push('リサイズ対応');
        passed = true;
      }
    }

    testResults.push({
      name: 'messageフィールド改善',
      passed,
      message: passed ? `改善内容: ${improvements.join(', ')}` : 'messageフィールド改善未実装'
    });

    expect(passed).toBe(false); // Red フェーズ: 現在は未実装
  });
});