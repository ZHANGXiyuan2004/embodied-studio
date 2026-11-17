'use client';
import {
  useEffect,
  useState,
  useRef,
  type ReactNode,
  type MouseEvent,
} from 'react';
import { MotionConfig } from 'motion/react';
import { ActionLink } from './action-link';
import { ExternalLink } from './animate-ui/icons/external-link';
import { Layers } from './animate-ui/icons/layers';
import { ClipboardList } from './animate-ui/icons/clipboard-list';
import { Link2 } from './animate-ui/icons/link-2';
import { UsersRound } from './animate-ui/icons/users-round';
import { ChevronRight } from './animate-ui/icons/chevron-right';
import { Menu } from './animate-ui/icons/menu';
import { X } from './animate-ui/icons/x';
import { Button } from './animate-ui/primitives/buttons/button';
import {
  Highlight,
  HighlightItem,
} from './animate-ui/primitives/effects/highlight';
import {
  Popover,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
} from './animate-ui/primitives/radix/popover';
import { motionQuery, useStudioReducedMotion } from '@/lib/use-reduced-motion';
import { Fade } from './animate-ui/primitives/effects/fade';
import { base, github, studioName } from '@/lib/studio';
import { controlTransition, revealTransition } from '@/lib/motion';

// Keep native URLs and history while limiting smooth scrolling to intentional section jumps.
function followSection(
  event: MouseEvent<HTMLAnchorElement>,
  onSelect: (id: string) => void,
) {
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
  onSelect(section.id);
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
const nav = [
  { id: 'projects', title: '项目展示', icon: Layers },
  { id: 'notes', title: '学习笔记', icon: ClipboardList },
  { id: 'partners', title: '合作伙伴', icon: Link2 },
  { id: 'mentors', title: '指导教师', icon: UsersRound },
];

function MobileNav({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const reduced = useStudioReducedMotion();
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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            hoverScale={1}
            tapScale={reduced ? 1 : 0.97}
            type="button"
            className="menu-button"
            aria-label={open ? '收起菜单' : '展开菜单'}
          >
            {reduced && open ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" animate={open && !reduced} />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent
            transition={reduced ? { duration: 0 } : controlTransition}
            initial={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
            exit={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
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
                    followSection(event, onSelect);
                    setOpen(false);
                  }}
                >
                  <Icon size={17} aria-hidden="true" />
                  {title}
                  <ChevronRight size={14} aria-hidden="true" />
                </a>
              ))}
            </nav>
          </PopoverContent>
        </PopoverPortal>
      </Popover>
    </div>
  );
}
export function Shell({ children }: { children: ReactNode }) {
  const [active, setActive] = useState('');
  const [hovered, setHovered] = useState('');
  const [focused, setFocused] = useState('');
  const reduced = useStudioReducedMotion();
  const highlighted = hovered || focused || active;
  const scrollingTo = useRef<string | null>(null);
  function selectSection(id: string) {
    scrollingTo.current = id;
    setActive(id);
    setFocused('');
    setHovered('');
  }
  useEffect(() => {
    const main = document.querySelector('main');
    const sections = nav
      .map(({ id }) => document.getElementById(id))
      .filter((section) => section !== null);
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
      // Ignore intervening sections during a link-initiated smooth scroll.
      if (scrollingTo.current && scrollingTo.current !== current) return;
      scrollingTo.current = null;
      setActive(current);
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    function resumeScrollTracking() {
      scrollingTo.current = null;
      schedule();
    }
    function onScrollKey(event: KeyboardEvent) {
      if (
        [
          'ArrowUp',
          'ArrowDown',
          'PageUp',
          'PageDown',
          'Home',
          'End',
          ' ',
        ].includes(event.key)
      )
        resumeScrollTracking();
    }
    function onScrollbarPointer(event: PointerEvent) {
      if (event.clientX >= document.documentElement.clientWidth)
        resumeScrollTracking();
    }
    update();
    const resize = new ResizeObserver(schedule);
    resize.observe(main);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', resumeScrollTracking);
    window.addEventListener('popstate', resumeScrollTracking);
    window.addEventListener('wheel', resumeScrollTracking, { passive: true });
    window.addEventListener('touchstart', resumeScrollTracking, {
      passive: true,
    });
    window.addEventListener('keydown', onScrollKey);
    window.addEventListener('pointerdown', onScrollbarPointer);
    main.addEventListener('focusin', schedule);
    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', resumeScrollTracking);
      window.removeEventListener('popstate', resumeScrollTracking);
      window.removeEventListener('wheel', resumeScrollTracking);
      window.removeEventListener('touchstart', resumeScrollTracking);
      window.removeEventListener('keydown', onScrollKey);
      window.removeEventListener('pointerdown', onScrollbarPointer);
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
            aria-label={studioName + '首页'}
          >
            <img
              className="brand-mark"
              src={base + '/icon.png?xingzhi'}
              alt=""
              width={36}
              height={36}
            />
            <span>
              {studioName}
              <span className="brand-en">Embodied Studio</span>
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
              <Highlight
                mode="parent"
                controlledItems
                value={highlighted || null}
                click={false}
                transition={reduced ? { duration: 0 } : controlTransition}
                exitDelay={0}
                boundsOffset={{ top: 3, height: -6 }}
                containerClassName="nav-items"
                className="nav-highlight"
              >
                {nav.map(({ id, title, icon: Icon }) => (
                  <HighlightItem key={id} asChild value={id}>
                    <a
                      href={base + '/#' + id}
                      aria-current={active === id ? 'location' : undefined}
                      onPointerEnter={(event) => {
                        if (event.pointerType !== 'touch') setHovered(id);
                      }}
                      onFocus={(event) => {
                        if (event.currentTarget.matches(':focus-visible'))
                          setFocused(id);
                      }}
                      onClick={(event) => followSection(event, selectSection)}
                    >
                      <Icon size={15} aria-hidden="true" />
                      {title}
                    </a>
                  </HighlightItem>
                ))}
              </Highlight>
            </nav>
            <ActionLink
              className="github-link"
              href={github}
              aria-label="工作室 GitHub 仓库"
            >
              <span>GitHub</span>
              <ExternalLink size={14} aria-hidden="true" />
            </ActionLink>
            <MobileNav active={active} onSelect={selectSection} />
          </div>
        </div>
      </header>
      {children}
      <footer className="footer wrap">
        <span>© 2026 {studioName}</span>
        <nav aria-label="页脚导航">
          <a href={base + '/license/'}>许可与署名</a>
          <ActionLink href={github}>
            GitHub 仓库 <ExternalLink size={14} aria-hidden="true" />
          </ActionLink>
        </nav>
      </footer>
      <noscript>
        <style>
          {
            '.hero-actions .contact-button{display:none}@media(max-width:700px){.mobile-navigation{display:none}.site-header .nav{display:flex;flex-wrap:wrap}.header-inner{height:auto;flex-wrap:wrap;padding-block:8px}.header-right,.nav-items{flex-wrap:wrap;max-width:100%}}.reveal,.hero-title span{opacity:1!important;transform:none!important}[data-slot="tabs-contents"]{height:auto!important}[data-slot="tabs-contents"]>div{display:block!important;transform:none!important}[data-slot="tabs-list"]{display:none!important}'
          }
        </style>
      </noscript>
    </MotionConfig>
  );
}
