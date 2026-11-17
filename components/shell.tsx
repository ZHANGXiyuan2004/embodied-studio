'use client';
import {
  useEffect,
  useState,
  useRef,
  useSyncExternalStore,
  type ReactNode,
  type MouseEvent,
} from 'react';
import { motion, MotionConfig } from 'motion/react';
import {
  Asterisk,
  ArrowUpRight,
  Github,
  Layers,
  BookOpen,
  Handshake,
  GraduationCap,
  ChevronRight,
} from 'lucide-react';
import { Popover } from 'radix-ui';
import { Fade } from './animate-ui/primitives/effects/fade';
import {
  FlipButton,
  FlipButtonFront,
  FlipButtonBack,
} from './animate-ui/components/buttons/flip';
import { base, github } from '@/lib/studio';
import { controlTransition, revealTransition } from '@/lib/motion';

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

// Keep native URLs and history while limiting smooth scrolling to intentional section jumps.
function followSection(event: MouseEvent<HTMLAnchorElement>) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  const link = event.currentTarget;
  if (
    !link.hash ||
    link.pathname !== location.pathname ||
    link.search !== location.search ||
    link.origin !== location.origin
  )
    return;
  const section = document.getElementById(link.hash.slice(1));
  if (!section) return;
  event.preventDefault();
  if (link.hash !== location.hash)
    history.pushState(history.state, '', link.href);
  section.focus({ preventScroll: true });
  // A second selection can arrive while the browser is scrolling to the first.
  // Cancel that command before targeting the next section, including siblings on the same row.
  window.scrollTo({ top: window.scrollY, behavior: 'instant' });
  requestAnimationFrame(() => {
    if (location.hash === link.hash)
      section.scrollIntoView({
        block: 'start',
        behavior: matchMedia(motionQuery).matches ? 'instant' : 'smooth',
      });
  });
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
      transition={reduced ? { duration: 0 } : revealTransition}
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
  return (
    <FlipButton asChild whileFocus="hover" tapScale={1} aria-label={children}>
      <a href={href} className="flip-link" onClick={followSection}>
        <FlipButtonFront
          transition={reduced ? { duration: 0 } : controlTransition}
        >
          {children}
          <ArrowUpRight size={16} />
        </FlipButtonFront>
        <FlipButtonBack
          aria-hidden="true"
          transition={reduced ? { duration: 0 } : controlTransition}
        >
          {back}
          <ArrowUpRight size={16} />
        </FlipButtonBack>
      </a>
    </FlipButton>
  );
}
const nav = [
  { id: 'projects', title: '项目展示', icon: Layers },
  { id: 'notes', title: '学习笔记', icon: BookOpen },
  { id: 'partners', title: '合作伙伴', icon: Handshake },
  { id: 'mentors', title: '指导教师', icon: GraduationCap },
];

function MobileNav({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  const destination = useRef<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 700px)');
    const closeOnDesktop = () => {
      if (!mobile.matches) setOpen(false);
    };
    mobile.addEventListener('change', closeOnDesktop);
    return () => mobile.removeEventListener('change', closeOnDesktop);
  }, []);
  return (
    <div className="mobile-navigation">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="menu-button"
            aria-label={open ? '收起菜单' : '展开菜单'}
          >
            <span aria-hidden="true" className="menu-glyph" />
          </button>
        </Popover.Trigger>
        <Popover.Content
          align="end"
          sideOffset={9}
          collisionPadding={12}
          className="mobile-nav-panel"
          ref={panel}
          aria-label="网站导航"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            panel.current?.querySelector('a')?.focus({ preventScroll: true });
          }}
          onCloseAutoFocus={(event) => {
            if (!destination.current) return;
            event.preventDefault();
            document
              .getElementById(destination.current)
              ?.focus({ preventScroll: true });
            destination.current = null;
          }}
        >
          <nav aria-label="主导航">
            {nav.map(({ id, title, icon: Icon }) => (
              <a
                key={id}
                href={base + '/#' + id}
                aria-current={active === id ? 'location' : undefined}
                onClick={(event) => {
                  if (
                    event.metaKey ||
                    event.ctrlKey ||
                    event.shiftKey ||
                    event.altKey
                  )
                    return;
                  destination.current = id;
                  followSection(event);
                  setOpen(false);
                }}
              >
                <Icon size={17} aria-hidden="true" />
                {title}
                <ChevronRight size={14} aria-hidden="true" />
              </a>
            ))}
          </nav>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
export function Shell({ children }: { children: ReactNode }) {
  const [active, setActive] = useState('');
  const [hovered, setHovered] = useState('');
  const [focused, setFocused] = useState('');
  const reduced = useStudioReducedMotion();
  const highlighted = hovered || focused || active;
  useEffect(() => {
    const main = document.querySelector('main');
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    if (!main || !sections.length) {
      if (location.pathname.includes('/projects/')) setActive('projects');
      return;
    }
    let frame = 0;
    function update() {
      frame = 0;
      const line = Math.min(innerHeight * 0.3, 220);
      const atBottom =
        scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
      const target = location.hash.slice(1);
      let latestTop = -Infinity;
      let current = '';
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top >= innerHeight || rect.bottom <= 0) continue;
        if (
          section.id === target &&
          (atBottom || (rect.top <= line && rect.bottom > line))
        ) {
          current = section.id;
          break;
        }
        // Desktop directory columns can share exactly the same reading position.
        if ((rect.top <= line || atBottom) && rect.top > latestTop + 1) {
          current = section.id;
          latestTop = rect.top;
        }
      }
      setActive(current);
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    const resize = new ResizeObserver(schedule);
    resize.observe(main);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    main.addEventListener('focusin', schedule);
    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', schedule);
      main.removeEventListener('focusin', schedule);
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
              onPointerLeave={() => setHovered('')}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget))
                  setFocused('');
              }}
              className="nav"
            >
              {nav.map(({ id, title }) => (
                <a
                  key={id}
                  href={base + '/#' + id}
                  aria-current={active === id ? 'location' : undefined}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== 'touch') setHovered(id);
                  }}
                  onFocus={(event) => {
                    if (event.currentTarget.matches(':focus-visible'))
                      setFocused(id);
                  }}
                  onClick={(event) => {
                    followSection(event);
                    setFocused('');
                    setHovered('');
                  }}
                >
                  {highlighted === id && (
                    <motion.span
                      aria-hidden="true"
                      className="nav-highlight"
                      layoutId="studio-nav-highlight"
                      initial={false}
                      transition={reduced ? { duration: 0 } : controlTransition}
                    />
                  )}
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
            <MobileNav active={active} />
          </div>
        </div>
      </header>
      {children}
      <footer className="footer wrap">
        <span>© 2026 叉社具身工作室</span>
        <nav aria-label="页脚导航">
          <a href={base + '/license/'}>许可与署名</a>
          <a href={github}>
            GitHub 仓库 <ArrowUpRight size={13} />
          </a>
        </nav>
      </footer>
      <noscript>
        <style>
          {
            '@media(max-width:700px){.mobile-navigation{display:none}.site-header .nav{display:flex;flex-wrap:wrap}.header-inner{height:auto;flex-wrap:wrap;padding-block:8px}.header-right{flex-wrap:wrap}.header-right .github-link{width:32px}}.reveal,.hero-title span{opacity:1!important;transform:none!important}[data-slot="tabs-contents"]{height:auto!important}[data-slot="tabs-contents"]>div{display:block!important;transform:none!important}[data-slot="tabs-list"]{display:none!important}'
          }
        </style>
      </noscript>
    </MotionConfig>
  );
}
