import { expect, test } from '@playwright/test';

test('项目入口翻面时保留两面的尺寸与相邻链接的位置', async ({ page }) => {
  await page.goto(process.env.STUDIO_TEST_URL || 'http://127.0.0.1:3000/');
  const link = page.getByRole('link', { name: '探索项目' });
  const front = link.locator('[data-slot="flip-button-front"]');
  const back = link.locator('[data-slot="flip-button-back"]');
  const neighbor = page.getByRole('link', { name: '分享想法' });

  await expect(front).toHaveCSS('opacity', '1');
  await expect(front).toHaveCSS('transform', 'none');
  const resting = await front.boundingBox();
  const adjacent = await neighbor.boundingBox();
  expect(adjacent?.width).toEqual(resting?.width);
  expect(adjacent?.height).toEqual(resting?.height);
  await link.hover();
  await expect(back).toHaveCSS('opacity', '1');
  await expect(front).toHaveCSS('opacity', '0');
  await expect(back).toHaveCSS('transform', 'none');
  expect(await back.boundingBox()).toEqual(resting);
  expect(await neighbor.boundingBox()).toEqual(adjacent);
});
