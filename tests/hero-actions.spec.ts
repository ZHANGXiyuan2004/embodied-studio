import { expect, test } from '@playwright/test';

const url = process.env.STUDIO_TEST_URL || 'http://127.0.0.1:3000/';

test('标题在手机、平板和桌面都保持一行，且落在标题栏内', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(url);
  const title = page.getByRole('heading', { level: 1, name: '行知具身工作室' });
  for (const width of [320, 390, 700, 701, 950, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    const fits = await title.evaluate((h1) => {
      const range = document.createRange();
      const walker = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
      const box = h1.parentElement!.getBoundingClientRect();
      const lines = new Set<number>();
      for (let text = walker.nextNode(); text; text = walker.nextNode()) {
        if (!text.textContent?.trim()) continue;
        range.selectNodeContents(text);
        for (const rect of range.getClientRects()) {
          if (rect.right > box.right + 1 || rect.left < box.left - 4) return false;
          lines.add(Math.round(rect.top));
        }
      }
      return lines.size === 1;
    });
    expect(fits, String(width)).toBe(true);
  }
});

test('首页两个入口等大且无边框，社团链接悬停时保持静止', async ({ page }) => {
  await page.goto(url);
  const link = page.getByRole('link', { name: '浏览社团' });
  const contact = page.getByRole('button', { name: '联系我们' });
  const resting = await link.boundingBox();
  const neighbor = await contact.boundingBox();
  expect(neighbor?.width).toEqual(resting?.width);
  expect(neighbor?.height).toEqual(resting?.height);
  for (const action of [link, contact]) {
    await expect(action).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(action).toHaveCSS('border-top-width', '0px');
    await action.hover();
    await expect(action).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  }
  await link.hover();
  await expect(link.locator('[data-slot^="flip-button"]')).toHaveCount(0);
  await expect(link).toHaveCSS('transform', 'none');
  expect(await link.boundingBox()).toEqual(resting);
});

test('三家合作伙伴的标识均已加载，图文链接指向官方页面', async ({ page }) => {
  await page.goto(url);
  const partners = page.locator('#partners');
  for (const [name, href] of [
    ['智元机器人', 'https://www.agibot.com/'],
    ['阿里云', 'https://www.aliyun.com/'],
    ['Xbotics 社区', 'https://github.com/Xbotics-Embodied-AI-club'],
  ]) {
    const link = partners.getByRole('link', { name });
    await expect(link).toHaveAttribute('href', href);
    await expect.poll(() => link.locator('img').evaluate(
      (img: HTMLImageElement) => img.naturalWidth,
    )).toBeGreaterThan(0);
  }
});

test('浏览社团打开协会官网，联系我们复制工作室微信号', async ({
  page,
  context,
  browserName,
}) => {
  test.skip(browserName !== 'chromium', '通过浏览器剪贴板权限验证复制结果');
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
