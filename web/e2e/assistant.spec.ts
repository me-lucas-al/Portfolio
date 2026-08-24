import { test, expect } from '@playwright/test';

test.describe('Assistant UI', () => {
  test('should load assistant and allow playing speech', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('request', req => console.log('REQUEST:', req.method(), req.url()));
    page.on('response', res => console.log('RESPONSE:', res.status(), res.url()));

    // Mock the chat API
    await page.route('**/api/chat', async route => {
      console.log('INTERCEPTED /api/chat');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ text: 'Olá! Sou o assistente do Lucas. Como posso ajudar?' })
      });
    });

    // Mock the speech API
    await page.route('**/api/speech', async route => {
      console.log('INTERCEPTED /api/speech');
      // Return 1 second of silence (24000 samples of 16-bit PCM = 48000 bytes)
      await route.fulfill({
        status: 200,
        contentType: 'audio/mpeg',
        body: Buffer.alloc(48000),
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find the widget trigger button
    const trigger = page.locator('button[aria-expanded="false"]').last();
    await trigger.waitFor({ state: 'visible' });
    await trigger.evaluate(n => (n as HTMLElement).click());
    
    // Wait for panel to animate in (300ms transition)
    await page.waitForTimeout(500);

    const suggestionButton = page.locator('button.text-left').first();
    await suggestionButton.waitFor({ state: 'visible' });
    await suggestionButton.evaluate(n => (n as HTMLElement).click());
    
    // Wait for "Ouvir" button to appear on the model's response.
    const ouvirButton = page.locator('button', { hasText: 'Ouvir' }).first();
    await ouvirButton.waitFor({ state: 'visible', timeout: 15000 });
    
    // Click "Ouvir"
    await ouvirButton.evaluate(n => (n as HTMLElement).click());
    
    // Check if it changes to "Parar"
    const pararButton = page.locator('button', { hasText: 'Parar' }).first();
    await expect(pararButton).toBeVisible();
  });
});
