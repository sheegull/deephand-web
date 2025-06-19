import { test, expect } from '@playwright/test';

/**
 * 新しいページのナビゲーションテスト（TDDアプローチ）
 * このテストは最初は失敗することを期待している（ページが存在しないため）
 */

test.describe('新しいページのナビゲーションテスト', () => {
  test.beforeEach(async ({ page }) => {
    // ホームページにアクセス
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('日本語版 - Solutionsページへのナビゲーション', async ({ page }) => {
    // ヘッダーのSolutionsリンクを探す
    const solutionsLink = page.locator('nav').getByText('ソリューション');
    await expect(solutionsLink).toBeVisible();
    
    // Solutionsリンクをクリック
    await solutionsLink.click();
    
    // URLが正しいことを確認
    await expect(page).toHaveURL('/solutions');
    
    // ページタイトルが正しいことを確認
    await expect(page).toHaveTitle(/ソリューション.*DeepHand/);
    
    // メインヘッダーが表示されることを確認
    await expect(page.getByRole('heading', { name: 'ソリューション' })).toBeVisible();
  });

  test('日本語版 - Resourcesページへのナビゲーション', async ({ page }) => {
    const resourcesLink = page.locator('nav').getByText('リソース');
    await expect(resourcesLink).toBeVisible();
    
    await resourcesLink.click();
    await expect(page).toHaveURL('/resources');
    await expect(page).toHaveTitle(/リソース.*DeepHand/);
    await expect(page.getByRole('heading', { name: 'リソース' })).toBeVisible();
  });

  test('日本語版 - Pricingページへのナビゲーション', async ({ page }) => {
    const pricingLink = page.locator('nav').getByText('料金');
    await expect(pricingLink).toBeVisible();
    
    await pricingLink.click();
    await expect(page).toHaveURL('/pricing');
    await expect(page).toHaveTitle(/料金.*DeepHand/);
    await expect(page.getByRole('heading', { name: '料金' })).toBeVisible();
  });

  test('日本語版 - About usページへのナビゲーション', async ({ page }) => {
    const aboutLink = page.locator('nav').getByText('会社概要');
    await expect(aboutLink).toBeVisible();
    
    await aboutLink.click();
    await expect(page).toHaveURL('/about');
    await expect(page).toHaveTitle(/会社概要.*DeepHand/);
    await expect(page.getByRole('heading', { name: '会社概要' })).toBeVisible();
  });
});

test.describe('英語版新しいページのナビゲーションテスト', () => {
  test.beforeEach(async ({ page }) => {
    // 英語版ホームページにアクセス
    await page.goto('/en/');
    await page.waitForLoadState('networkidle');
  });

  test('英語版 - Solutionsページへのナビゲーション', async ({ page }) => {
    const solutionsLink = page.locator('nav').getByText('Solutions');
    await expect(solutionsLink).toBeVisible();
    
    await solutionsLink.click();
    await expect(page).toHaveURL('/en/solutions');
    await expect(page).toHaveTitle(/Solutions.*DeepHand/);
    await expect(page.getByRole('heading', { name: 'Solutions' })).toBeVisible();
  });

  test('英語版 - Resourcesページへのナビゲーション', async ({ page }) => {
    const resourcesLink = page.locator('nav').getByText('Resources');
    await expect(resourcesLink).toBeVisible();
    
    await resourcesLink.click();
    await expect(page).toHaveURL('/en/resources');
    await expect(page).toHaveTitle(/Resources.*DeepHand/);
    await expect(page.getByRole('heading', { name: 'Resources' })).toBeVisible();
  });

  test('英語版 - Pricingページへのナビゲーション', async ({ page }) => {
    const pricingLink = page.locator('nav').getByText('Pricing');
    await expect(pricingLink).toBeVisible();
    
    await pricingLink.click();
    await expect(page).toHaveURL('/en/pricing');
    await expect(page).toHaveTitle(/Pricing.*DeepHand/);
    await expect(page.getByRole('heading', { name: 'Pricing' })).toBeVisible();
  });

  test('英語版 - About usページへのナビゲーション', async ({ page }) => {
    const aboutLink = page.locator('nav').getByText('About us');
    await expect(aboutLink).toBeVisible();
    
    await aboutLink.click();
    await expect(page).toHaveURL('/en/about');
    await expect(page).toHaveTitle(/About Us.*DeepHand/);
    await expect(page.getByRole('heading', { name: 'About Us' })).toBeVisible();
  });
});

test.describe('ページコンテンツテスト', () => {
  test('Solutionsページのコンテンツ確認（日本語）', async ({ page }) => {
    await page.goto('/solutions');
    
    // サービス項目が表示されることを確認
    await expect(page.getByText('画像アノテーション')).toBeVisible();
    await expect(page.getByText('動画アノテーション')).toBeVisible();
    await expect(page.getByText('3Dアノテーション')).toBeVisible();
    await expect(page.getByText('ロボティクスデータ')).toBeVisible();
  });

  test('Resourcesページのコンテンツ確認（日本語）', async ({ page }) => {
    await page.goto('/resources');
    
    // リソースカテゴリが表示されることを確認
    await expect(page.getByText('ホワイトペーパー')).toBeVisible();
    await expect(page.getByText('ケーススタディ')).toBeVisible();
    await expect(page.getByText('技術資料')).toBeVisible();
    await expect(page.getByText('ツール')).toBeVisible();
  });

  test('Pricingページのコンテンツ確認（日本語）', async ({ page }) => {
    await page.goto('/pricing');
    
    // 料金プランが表示されることを確認
    await expect(page.getByText('スタータープラン')).toBeVisible();
    await expect(page.getByText('プロフェッショナルプラン')).toBeVisible();
    await expect(page.getByText('エンタープライズプラン')).toBeVisible();
  });

  test('About usページのコンテンツ確認（日本語）', async ({ page }) => {
    await page.goto('/about');
    
    // About内容が表示されることを確認
    await expect(page.getByText('ミッション')).toBeVisible();
    await expect(page.getByText('ビジョン')).toBeVisible();
    await expect(page.getByText('価値観')).toBeVisible();
    await expect(page.getByText('チーム')).toBeVisible();
  });
});