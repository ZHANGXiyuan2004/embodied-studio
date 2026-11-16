'use client';
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { MotionConfig } from 'motion/react';
import { Asterisk, ArrowUpRight, Github, Menu, X } from 'lucide-react';
import { Fade } from './animate-ui/primitives/effects/fade';
import {
  FlipButton,
  FlipButtonFront,
  FlipButtonBack,
} from './animate-ui/components/buttons/flip';
import { base, github } from '@/lib/studio';

const motionQuery = '(prefers-reduced-motion: reduce)';
function subscribeToMotion(notify: () => void) {
  const preference = window.matchMedia(motionQuery);
  preference.addEventListener('change', notify);
  return () => preference.removeEventListener('change', notify);
}
export function useStudioReducedMotion() {
  return useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia(motionQuery).matches,
    () => false,
  );
}

export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useStudioReducedMotion();
  return (
    <Fade
      inView
      inViewOnce
      initialOpacity={reduced ? 1 : 0}
      delay={reduced ? 0 : delay}
      transition={{ duration: reduced ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={'reveal ' + className}
    >
      {children}
    </Fade>
  );
}
export function FlipLink({
  href,
  children,
  back,
}: {
  href: string;
  children: string;
  back: string;
}) {
  const reduced = useStudioReducedMotion();
  if (reduced)
    return (
      <a href={href} className="solid">
        {children}
        <ArrowUpRight size={15} />
      </a>
    );
  return (
    <FlipButton asChild whileFocus="hover" aria-label={children}>
      <a href={href} className="flip-link">
        <FlipButtonFront>
          {children}
          <ArrowUpRight size={15} />
        </FlipButtonFront>
        <FlipButtonBack aria-hidden="true">
          {back}
          <ArrowUpRight size={15} />
        </FlipButtonBack>
      </a>
    </FlipButton>
  );
}
const nav = [
  ['projects', '项目展示'],
  ['notes', '学习笔记'],
  ['partners', '合作伙伴'],
  ['mentors', '指导教师'],
];
export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false),
    [active, setActive] = useState('');
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-10% 0px -55% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    if (location.pathname.includes('/projects/')) setActive('projects');
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', escape);
    return () => {
      observer.disconnect();
      window.removeEventListener('keydown', escape);
    };
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip" href="#main">
        跳至正文
      </a>
      <header className="site-header">
        <div className="wrap header-inner">
          <a
            className="brand"
            href={base + '/'}
            aria-label="叉社具身工作室首页"
          >
            <span className="brand-mark">
              <Asterisk size={29} strokeWidth={2.5} />
            </span>
            <span>
              叉社<span className="brand-en">Embodied Studio</span>
            </span>
          </a>
          <div className="header-right">
            <nav
              id="nav-links"
              aria-label="主导航"
              className={open ? 'nav open' : 'nav'}
            >
              {nav.map(([id, title]) => (
                <a
                  key={id}
                  href={base + '/#' + id}
                  aria-current={active === id ? 'location' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {title}
                </a>
              ))}
            </nav>
            <a
              className="github-link"
              href={github}
              aria-label="工作室 GitHub 仓库"
            >
              <Github size={18} />
              <span>GitHub</span>
              <ArrowUpRight size={13} />
            </a>
            <button
              className="menu-button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="nav-links"
              aria-label={open ? '收起菜单' : '展开菜单'}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      {children}
      <footer className="footer wrap">
        <span>© 2026 叉社具身工作室</span>
        <a href={base + '/license/'}>许可与署名</a>
        <a href={github}>
          GitHub 仓库 <ArrowUpRight size={13} />
        </a>
      </footer>
      <noscript>
        <style>
          {
            '.reveal,.hero-title span{opacity:1!important;transform:none!important}[data-slot="tabs-contents"]{height:auto!important}[data-slot="tabs-contents"]>div{display:block!important;transform:none!important}[data-slot="tabs-list"]{display:none!important}'
          }
        </style>
      </noscript>
    </MotionConfig>
  );
}
