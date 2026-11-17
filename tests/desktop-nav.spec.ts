import { expect, test } from '@playwright/test';

test('从项目展示点击学习笔记，下划线在滚动期间不会折返', async ({ page }) => {
  await page.setViewportSize({ width: 1250, height: 740 });
  await page.goto(
    (process.env.STUDIO_TEST_URL || 'http://127.0.0.1:3000/') + '#projects',
  );
  const nav = page.locator('#nav-links');
  const projects = nav.getByRole('link', { name: '项目展示' });
  const notes = nav.getByRole('link', { name: '学习笔记' });
  const line = nav.locator('.nav-highlight');
  await expect(projects).toHaveAttribute('aria-current', 'location');
  await notes.hover();
  const target = (await notes.boundingBox())!.x;
  await expect
    .poll(async () => Math.abs((await line.boundingBox())!.x - target))
    .toBeLessThan(1);
  // Sample the rendered line each frame: checking only its final position misses the flash.
  const [distance] = await Promise.all([
    line.evaluate(
      (el, x) =>
        new Promise<number>((resolve) => {
          let deviation = 0;
          const start = performance.now();
          function sample(now: number) {
            deviation = Math.max(
              deviation,
              Math.abs(el.getBoundingClientRect().x - x),
            );
            if (now - start < 900) requestAnimationFrame(sample);
            else resolve(deviation);
          }
          requestAnimationFrame(sample);
        }),
      target,
    ),
    notes.click(),
  ]);
  expect(distance).toBeLessThan(2);
  await expect(notes).toHaveAttribute('aria-current', 'location');

  await nav.getByRole('link', { name: '合作伙伴' }).click();
  await nav.getByRole('link', { name: '指导教师' }).click();
  await expect(nav.getByRole('link', { name: '指导教师' })).toHaveAttribute(
    'aria-current',
    'location',
  );
  await page.mouse.move(500, 450);
  await page.mouse.wheel(0, -3000);
  await expect(nav.locator('[aria-current]')).toHaveCount(0);
  await expect(line).toHaveCount(0);
});
