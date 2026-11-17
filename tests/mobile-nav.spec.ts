import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });

test('手机菜单的键盘焦点跟随关闭和章节选择', async ({ page }) => {
  await page.goto(process.env.STUDIO_TEST_URL || 'http://127.0.0.1:3000/');
  const trigger = page.getByRole('button', { name: '展开菜单' });
  const panel = page.getByRole('dialog', { name: '网站导航' });

  await trigger.press('Enter');
  await expect(panel.getByRole('link', { name: '项目展示' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(panel).toHaveCount(0);
  await expect(trigger).toBeFocused();

  await trigger.press('Enter');
  await panel.getByRole('link', { name: '学习笔记' }).press('Enter');
  await expect(page).toHaveURL(/\/#notes$/);
  await expect(panel).toHaveCount(0);
  await expect(page.locator('#notes')).toBeFocused();
});
