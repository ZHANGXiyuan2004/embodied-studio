import { expect, test, type Page } from '@playwright/test';

const url = process.env.STUDIO_TEST_URL || 'http://127.0.0.1:3000/';

async function observeTransitions(page: Page) {
  await page.addInitScript(() => {
    addEventListener('pageswap', () => {
      delete document.documentElement.dataset.finishedCover;
    });
    addEventListener('pagereveal', async (event) => {
      const transition = event.viewTransition;
      if (!transition) return;
      await transition.ready;
      const cover = [...document.querySelectorAll<HTMLElement>('[data-cover-peer]')]
        .find(el => getComputedStyle(el).viewTransitionName === 'project-cover');
      const animations = document.getAnimations();
      const paired = animations.some(animation =>
        (animation.effect as KeyframeEffect)?.pseudoElement === '::view-transition-group(project-cover)',
      );
      const entered = animations.some(animation =>
        animation instanceof CSSAnimation && animation.animationName === 'project-page-enter',
      );
      if (!cover || !paired || !entered) return;
      const top = cover.getBoundingClientRect().top;
      await transition.finished;
      if (Math.abs(cover.getBoundingClientRect().top - top) < 2) {
        document.documentElement.dataset.finishedCover = cover.dataset.coverPeer;
      }
    });
  });
}

test('三个项目的封面往返都能衔接，并停在手机可见范围内', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 572 });
  await observeTransitions(page);
  await page.goto(url + '#projects');
  test.skip(!await page.evaluate(() => 'onpagereveal' in window));
  for (const card of await page.locator('.project-card').all()) {
    const path = await card.getAttribute('href');
    await card.click();
    await expect(page.locator('html')).toHaveAttribute('data-finished-cover', new URL(url).pathname);
    await page.getByRole('link', { name: '返回项目展示' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-finished-cover', path!);
    const visible = await card.locator('[data-cover-peer]').evaluate(cover => {
      const rect = cover.getBoundingClientRect();
      return rect.top >= document.querySelector('header')!.getBoundingClientRect().bottom - 1
        && rect.bottom <= innerHeight + 1;
    });
    expect(visible).toBe(true);
  }
});

test('浏览器后退与前进也能衔接刚打开的项目', async ({ page }) => {
  await observeTransitions(page);
  await page.goto(url + '#projects');
  test.skip(!await page.evaluate(() => 'onpagereveal' in window));
  const card = page.locator('.project-card').nth(1);
  const path = await card.getAttribute('href');
  await card.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-finished-cover', new URL(url).pathname);
  await page.goBack();
  await expect(page.locator('html')).toHaveAttribute('data-finished-cover', path!);
  await page.goForward();
  await expect(page.locator('html')).toHaveAttribute('data-finished-cover', new URL(url).pathname);
});

test('减少动态效果时仍可用键盘直接打开和返回', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    addEventListener('pagereveal', event => {
      if (event.viewTransition) document.documentElement.dataset.animated = 'yes';
    });
  });
  await page.goto(url + '#projects');
  await page.locator('.project-card').first().press('Enter');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('项目一');
  await expect(page.locator('html')).not.toHaveAttribute('data-animated', 'yes');
  await page.getByRole('link', { name: '返回项目展示' }).press('Enter');
  await expect(page).toHaveURL(url + '#projects');
  await expect(page.locator('html')).not.toHaveAttribute('data-animated', 'yes');
});
