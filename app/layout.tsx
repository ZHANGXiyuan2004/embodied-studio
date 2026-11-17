import type { Metadata } from 'next';
import { Shell } from '@/components/shell';
import { base, studioName, studioEnglishName } from '@/lib/studio';
import './globals.css';
export const metadata: Metadata = {
  title: {
    default: `${studioName} · ${studioEnglishName}`,
    template: `%s · ${studioName}`,
  },
  description: `${studioName}的项目展示、内容产出、合作伙伴和指导教师。`,
  icons: { icon: base + '/icon.png?xingzhi' },
};
// Register before first paint so both cold loads and history restores can pair the two covers.
const projectTransitions = `
  (() => {
    function pair(transition, activation, incoming) {
      const destination = activation?.entry?.url;
      const peerURL = incoming ? activation?.from?.url : destination;
      if (!transition || !destination || !peerURL) return;
      const peer = new URL(peerURL);
      if (peer.origin !== location.origin) return;
      const selector = '[data-cover-peer="' + CSS.escape(peer.pathname) + '"]';
      const cover = document.querySelector(selector);
      if (!cover) return;
      const onGallery = !!cover.closest('.project-card');
      const returning = incoming ? onGallery : !onGallery;
      const traversing = activation.navigationType === 'traverse';
      if (!traversing && new URL(destination).hash !== (returning ? '#projects' : '')) return;
      if (incoming) {
        transition.types?.add('project');
        if (returning) transition.types?.add('project-return');
        // Explicit returns reveal the selected card. History restores its own scroll position.
        if (onGallery && !traversing) {
          const rect = cover.getBoundingClientRect();
          const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0;
          if (rect.bottom > innerHeight || rect.top < headerBottom) {
            cover.scrollIntoView({ block: 'center', behavior: 'instant' });
          }
        }
      }
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
      pair(event.viewTransition, event.activation, false);
    });
    addEventListener('pagereveal', event => {
      pair(event.viewTransition, window.navigation?.activation, true);
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
        <script type="speculationrules" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          prefetch: [{ where: { selector_matches: '.project-card, .project-return' }, eagerness: 'moderate' }],
        }) }} />
        <link rel="expect" href="#main" blocking="render" />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
