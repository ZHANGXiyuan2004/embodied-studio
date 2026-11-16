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
    '叉社具身工作室展示样站：项目示例、学习笔记、合作伙伴和指导教师。',
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
