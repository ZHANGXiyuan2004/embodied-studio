import { expect, test } from '@playwright/test';

test('社团入口翻面时保留两面的尺寸与相邻链接的位置', async ({ page }) => {
  await page.goto(process.env.STUDIO_TEST_URL || 'http://127.0.0.1:3000/');
  const link = page.getByRole('link', { name: '浏览社团' });
  const front = link.locator('[data-slot="flip-button-front"]');
  const back = link.locator('[data-slot="flip-button-back"]');
  const neighbor = page.getByRole('button', { name: '联系我们' });

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

test('浏览社团打开协会官网，联系我们复制工作室微信号', async ({
  page,
  context,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', '通过浏览器剪贴板权限验证复制结果');
  const url = process.env.STUDIO_TEST_URL || 'http://127.0.0.1:3000/';
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], {
    origin: new URL(url).origin,
  });
  await page.goto(url);
  await expect(page.getByRole('link', { name: '浏览社团' })).toHaveAttribute(
    'href',
    'https://uestc-ia.github.io/',
  );
  const contact = page.getByRole('button', { name: '联系我们' });
  await contact.click();
  await expect(contact).toHaveText('已复制');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'DeepSeekv4flash0731',
  );
});
