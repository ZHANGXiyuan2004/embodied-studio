import { expect, test } from '@playwright/test';

const url = process.env.STUDIO_TEST_URL || 'http://127.0.0.1:3000/';

test('点击方块后跟随落点，放置完成后可从新位置再次抓取', async ({ page }) => {
  await page.goto(url);
  const cube = page.getByRole('button', { name: '抓取橙色方块' });
  const status = page.locator('#arm-help');
  await expect(cube).toBeVisible();
  const before = (await cube.boundingBox())!;
  await cube.click();
  await expect(status).toContainText('已抓取');
  const canvas = page.getByRole('group', { name: 'Franka 抓放工作台' });
  const box = (await canvas.boundingBox())!;
  const spot = { x: box.width * 0.75, y: box.height * 0.79 };
  await canvas.hover({ position: spot });
  await canvas.click({ position: spot });
  await expect(status).toContainText('方块已放置');
  expect(Math.abs((await cube.boundingBox())!.x - before.x)).toBeGreaterThan(
    10,
  );
  await cube.click();
  await canvas.click({
    position: { x: box.width * 0.55, y: box.height * 0.82 },
  });
  await expect(status).toContainText('方块已放置');
  await expect(cube).toBeVisible();
});

test('减少动态效果时仍可用键盘抓取和放置', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(url);
  const cube = page.getByRole('button', { name: '抓取橙色方块' });
  await cube.press('Enter');
  await expect(page.locator('#arm-help')).toContainText('已抓取');
  const canvas = page.getByRole('group', { name: 'Franka 抓放工作台' });
  await expect(canvas).toBeFocused();
  await canvas.press('ArrowRight');
  await canvas.press('Enter');
  await expect(page.locator('#arm-help')).toContainText('方块已放置');
  await expect(cube).toBeVisible();
});

test('手机可轻点方块再轻点台面放置', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  try {
    const page = await context.newPage();
    await page.goto(url);
    const cube = page.getByRole('button', { name: '抓取橙色方块' });
    await cube.tap();
    const table = page.getByRole('group', { name: 'Franka 抓放工作台' });
    const box = (await table.boundingBox())!;
    await table.tap({ position: { x: box.width * 0.75, y: box.height * 0.8 } });
    await expect(page.locator('#arm-help')).toContainText('方块已放置');
  } finally {
    await context.close();
  }
});
