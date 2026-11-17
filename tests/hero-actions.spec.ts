import { expect, test } from '@playwright/test';

const url = process.env.STUDIO_TEST_URL || 'http://127.0.0.1:3000/';

test('标题在手机、平板和桌面都保持一行，且落在标题栏内', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(url);
  const title = page.getByRole('heading', { level: 1, name: '行知具身工作室' });
  for (const width of [320, 390, 700, 701, 950, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
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

test('首页按钮与伙伴链接上浮并从中间展开下划线，点击区域保持稳定', async ({ page }) => {
  await page.goto(url);
  const browse = page.getByRole('link', { name: '浏览社团' });
  const contact = page.getByRole('button', { name: '联系我们' });
  const partner = page.locator('#partners a').first();
  const firstBox = (await browse.boundingBox())!;
  const secondBox = (await contact.boundingBox())!;
  expect(firstBox.width).toEqual(secondBox.width);
  expect(firstBox.height).toEqual(secondBox.height);

  for (const action of [browse, contact, partner]) {
    await action.scrollIntoViewIfNeeded();
    const resting = (await action.boundingBox())!;
    const label = action.locator('.action-label');
    const scale = () => label.evaluate(el =>
      new DOMMatrix(getComputedStyle(el, '::after').transform).a,
    );
    expect(await scale()).toBe(0);
    await action.hover();
    await expect.poll(scale).toBe(1);
    await expect(label).toHaveCSS('translate', '0px -3px');
    const origin = await label.evaluate(el => parseFloat(getComputedStyle(el, '::after').transformOrigin));
    expect(origin).toBeCloseTo((await label.boundingBox())!.width / 2, 1);
    expect(await action.boundingBox()).toEqual(resting);
    if (action !== contact) {
      await expect.poll(() => action.locator('svg g').first().evaluate(
        el => new DOMMatrix(getComputedStyle(el).transform).e,
      )).toBeGreaterThan(1);
    }
    await page.mouse.move(0, 0);
    await expect.poll(scale).toBe(0);
  }
});

test('首页三个入口无边框，工作室简介在按钮下展开并原位收起', async ({ page }) => {
  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(url);
    const intro = page.getByRole('button', { name: '工作室简介' });
    const body = page.locator('.studio-intro');
    for (const action of await page.locator('.hero-actions .hero-action').all()) {
      await expect(action).toHaveCSS('border-width', '0px');
      await action.hover();
      expect(await action.evaluate(el => getComputedStyle(el, '::before').content)).toBe('none');
    }
    await expect(intro).toHaveAttribute('aria-expanded', 'false');
    await expect(body).toBeHidden();
    const resting = (await intro.boundingBox())!;
    await intro.press('Enter');
    await expect(intro).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('.hero-copy').getByRole('region', { name: '工作室简介' })).toBeVisible();
    const copy = (await page.locator('.hero-copy').boundingBox())!;
    const text = (await body.boundingBox())!;
    expect(text.y).toBeGreaterThanOrEqual(resting.y + resting.height - 1);
    expect(text.x + text.width).toBeLessThanOrEqual(copy.x + copy.width + 1);
    expect(await intro.boundingBox()).toEqual(resting);
    await intro.press('Space');
    await expect(intro).toHaveAttribute('aria-expanded', 'false');
    await expect(body).toBeHidden();
  }
});

test('三家合作伙伴的标识均已加载，图文链接指向官方页面', async ({ page }) => {
  await page.goto(url);
  const partners = page.locator('#partners');
  const mentors = page.locator('#mentors');
  const partnerBox = (await partners.boundingBox())!;
  const mentorBox = (await mentors.boundingBox())!;
  expect(mentorBox.y).toBeGreaterThanOrEqual(partnerBox.y + partnerBox.height - 1);
  expect(mentorBox.width).toEqual(partnerBox.width);
  await expect(page.getByText(/合作伙伴待补充|教师姓名待填写/)).toHaveCount(0);
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
