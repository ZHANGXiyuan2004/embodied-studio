import { expect, test } from '@playwright/test';

test('从项目展示点击内容产出，下划线在滚动期间不会折返', async ({ page }) => {
  await page.setViewportSize({ width: 1250, height: 740 });
  await page.goto(
    (process.env.STUDIO_TEST_URL || 'http://127.0.0.1:3000/') + '#projects',
  );
  const nav = page.locator('#nav-links');
  const projects = nav.getByRole('link', { name: '项目展示' });
  const outputs = nav.getByRole('link', { name: '内容产出' });
  const line = outputs.locator('.link-underline');
  await expect(projects).toHaveAttribute('aria-current', 'location');
  await outputs.hover();
  await expect.poll(() => line.evaluate(el =>
    new DOMMatrix(getComputedStyle(el, '::after').transform).a,
  )).toBe(1);
  // During the scroll the destination's underline must stay fully expanded.
  const [minimumScale] = await Promise.all([
    line.evaluate(el => new Promise<number>(resolve => {
      const start = performance.now();
      let minimum = 1;
      function sample(now: number) {
        minimum = Math.min(minimum, new DOMMatrix(getComputedStyle(el, '::after').transform).a);
        if (now - start < 900) requestAnimationFrame(sample);
        else resolve(minimum);
      }
      requestAnimationFrame(sample);
    })),
    outputs.click(),
  ]);
  expect(minimumScale).toBe(1);
  await expect(outputs).toHaveAttribute('aria-current', 'location');

  await nav.getByRole('link', { name: '合作伙伴' }).click();
  await nav.getByRole('link', { name: '指导教师' }).click();
  await expect(nav.getByRole('link', { name: '指导教师' })).toHaveAttribute(
    'aria-current',
    'location',
  );
  await page.mouse.move(500, 450);
  await page.mouse.wheel(0, -3000);
  await expect(nav.locator('[aria-current]')).toHaveCount(0);
  await expect(nav.locator('[data-highlighted]')).toHaveCount(0);
});
