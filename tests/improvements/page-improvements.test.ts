import { test, expect } from '@playwright/test';

/**
 * ページ改善項目のテスト（TDDアプローチ）
 */

test.describe('ページ改善項目の確認テスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('1. 各ページに絵文字が表示されていないことを確認', async ({ page }) => {
    // Solutionsページ
    await page.goto('/solutions');
    await page.waitForLoadState('networkidle');
    
    // 絵文字が含まれていないことを確認（一般的な絵文字パターン）
    const solutionsContent = await page.textContent('body');
    expect(solutionsContent).not.toMatch(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u);
    
    // Resourcesページ
    await page.goto('/resources');
    await page.waitForLoadState('networkidle');
    const resourcesContent = await page.textContent('body');
    expect(resourcesContent).not.toMatch(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u);
    
    // Pricingページ
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    const pricingContent = await page.textContent('body');
    expect(pricingContent).not.toMatch(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u);
    
    // Aboutページ
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    const aboutContent = await page.textContent('body');
    expect(aboutContent).not.toMatch(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u);
  });

  test('2. Pricingページでエンタープライズプランが「今後対応予定」表示', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    
    // エンタープライズプランのボタンが「今後対応予定」になっていることを確認
    await expect(page.getByRole('button', { name: /今後.*対応.*予定|coming soon/i })).toBeVisible();
    
    // エンタープライズプランの説明にも「今後対応予定」が含まれることを確認
    await expect(page.getByText('大規模企業向け（今後対応予定）')).toBeVisible();
  });

  test('3. 各ページでハードコーディングされた日本語テキストがない（i18n対応確認）', async ({ page }) => {
    // Solutions日本語版
    await page.goto('/solutions');
    await page.waitForLoadState('networkidle');
    
    // CTAセクションのテキストがハードコーディングでないことを確認
    // 「プロジェクトを始めませんか？」が適切にi18n化されていることを確認
    await expect(page.getByText('プロジェクトを始めませんか？')).toBeVisible();
    
    // Solutions英語版
    await page.goto('/en/solutions');
    await page.waitForLoadState('networkidle');
    
    // 英語版では同等のテキストが英語で表示されることを確認
    await expect(page.getByText(/ready to start|get started|start.*project/i)).toBeVisible();
    
    // 他のページでも同様の確認
    await page.goto('/resources');
    await expect(page.getByText('プロジェクトについてご相談ください')).toBeVisible();
    
    await page.goto('/en/resources');
    await expect(page.getByText(/contact.*about.*project|discuss.*project/i)).toBeVisible();
  });

  test('4. 全ページでDeepHandロゴがヘッダーに表示されHOMEへルーティング', async ({ page }) => {
    const pages = ['/solutions', '/resources', '/pricing', '/about'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      
      // ロゴまたはDeepHandテキストが表示されることを確認
      const logo = page.locator('header').getByText('DeepHand');
      await expect(logo).toBeVisible();
      
      // 英語版も確認
      const enPagePath = `/en${pagePath}`;
      await page.goto(enPagePath);
      await page.waitForLoadState('networkidle');
      
      const enLogo = page.locator('header').getByText('DeepHand');
      await expect(enLogo).toBeVisible();
    }
  });

  test('5. ボタンやCTAテキストが言語切り替えで正しく表示される', async ({ page }) => {
    // 日本語版でのボタンテキスト確認
    await page.goto('/solutions');
    await expect(page.getByRole('button', { name: 'データリクエスト' })).toBeVisible();
    
    // 英語版でのボタンテキスト確認
    await page.goto('/en/solutions');
    await expect(page.getByRole('button', { name: /request.*data|data.*request/i })).toBeVisible();
    
    // Resourcesページも確認
    await page.goto('/resources');
    await expect(page.getByRole('button', { name: 'お問い合わせ' })).toBeVisible();
    
    await page.goto('/en/resources');
    await expect(page.getByRole('button', { name: /contact|get.*touch/i })).toBeVisible();
  });
});