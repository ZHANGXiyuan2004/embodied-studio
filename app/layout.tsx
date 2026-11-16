import type { Metadata } from 'next';
import { Shell } from '@/components/shell';
import { base } from '@/lib/studio';
import './globals.css';
export const metadata: Metadata = {
  title: {
    default: '叉社具身工作室 · Embodied Studio',
    template: '%s · 叉社具身工作室',
  },
  description:
    '体验具身智能研究原型，分享想法，寻找合作伙伴，查看工作室共享器材。',
  icons: { icon: base + '/icon.png' },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
