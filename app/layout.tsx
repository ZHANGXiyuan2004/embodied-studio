import type { Metadata } from 'next';
import { Shell } from '@/components/shell';
import { base, studioName, studioEnglishName } from '@/lib/studio';
import './globals.css';
export const metadata: Metadata = {
  title: {
    default: `${studioName} · ${studioEnglishName}`,
    template: `%s · ${studioName}`,
  },
  description: `${studioName}的项目展示、学习笔记、合作伙伴和指导教师。`,
  icons: { icon: base + '/icon.png?xingzhi' },
};
// Register before first paint so both cold loads and history restores can pair the two covers.
const projectTransitions = `
  (() => {
    function pair(transition, peerURL, destinationURL) {
      if (!transition || !peerURL || !destinationURL) return;
      const hash = new URL(destinationURL).hash;
      if (hash && hash !== '#projects') return;
      const peer = new URL(peerURL);
      if (peer.origin !== location.origin) return;
      const selector = '[data-cover-peer="' + CSS.escape(peer.pathname) + '"]';
      const cover = document.querySelector(selector);
      if (!cover) return;
      const bounds = cover.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= innerHeight) return;
      const style = new CSSStyleSheet();
      style.replaceSync(selector + '{ view-transition-name: project-cover }');
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, style];
      transition.finished.then(() => {
        document.adoptedStyleSheets = document.adoptedStyleSheets.filter(sheet => sheet !== style);
      });
    }
    addEventListener('pageswap', event => {
      const next = event.activation?.entry?.url;
      pair(event.viewTransition, next, next);
    });
    addEventListener('pagereveal', event => {
      pair(event.viewTransition, window.navigation?.activation?.from?.url, location.href);
    });
  })();
`;
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        {/* Cross-document transitions need the opt-in before the first paint, even on a cold CDN load. */}
        <style>
          {
            '@media (prefers-reduced-motion: no-preference) { @view-transition { navigation: auto; } }'
          }
        </style>
        <script dangerouslySetInnerHTML={{ __html: projectTransitions }} />
        <link rel="expect" href="#main" blocking="render" />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
