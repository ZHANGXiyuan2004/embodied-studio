'use client';
import { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Boxes,
  Lightbulb,
  Plus,
} from 'lucide-react';
import { SplittingText } from './animate-ui/primitives/texts/splitting';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContents,
  TabsContent,
} from './animate-ui/components/animate/tabs';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './animate-ui/components/radix/accordion';
import { Community } from './community';
import { Reveal, FlipLink, useStudioReducedMotion } from './shell';
import { TransferView } from './demos/transfer';
import { TimingView } from './demos/async-control';
import { ContactView } from './demos/contact';
import { base, projects, submitIdea, notes, type Project } from '@/lib/studio';

function ProjectCard({ p }: { p: Project }) {
  return (
    <a className="project-card" href={base + '/projects/' + p.slug + '/'}>
      {p.kind === 'demo' && (
        <div className="card-visual">
          {p.slug === 'transfer' ? (
            <TransferView />
          ) : p.slug === 'async-control' ? (
            <TimingView />
          ) : (
            <ContactView />
          )}
        </div>
      )}
      <div className="card-copy">
        <div className="card-meta">
          {p.kind === 'idea' && <Lightbulb size={14} />} {p.field}
        </div>
        <h3>{p.title}</h3>
        <p>{p.summary}</p>
        <span className="card-link">
          {p.kind === 'demo' ? '体验 Demo' : '查看想法'}{' '}
          <ArrowRight size={15} />
        </span>
      </div>
    </a>
  );
}
const groups = [
  { value: 'demo', title: '概念 Demo' },
  { value: 'idea', title: '开放想法' },
  { value: 'community', title: '社区投稿' },
];
function Gallery() {
  const [tab, setTab] = useState('demo');
  const reduced = useStudioReducedMotion();
  return (
    <section id="projects" className="section">
      <Reveal>
        <div className="section-head">
          <div>
            <p className="kicker">Project gallery</p>
            <h2>项目与想法</h2>
          </div>
          <a className="text-link" href={submitIdea}>
            <Plus size={15} /> 提交项目
          </a>
        </div>
      </Reveal>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList
          aria-label="项目类型"
          onKeyDown={(e) => {
            const index = groups.findIndex((g) => g.value === tab);
            const next =
              e.key === 'Home'
                ? 0
                : e.key === 'End'
                  ? groups.length - 1
                  : e.key === 'ArrowLeft'
                    ? (index + groups.length - 1) % groups.length
                    : e.key === 'ArrowRight'
                      ? (index + 1) % groups.length
                      : -1;
            if (next >= 0) {
              e.preventDefault();
              setTab(groups[next].value);
              document.getElementById('tab-' + groups[next].value)?.focus();
            }
          }}
        >
          {groups.map((g) => (
            <TabsTrigger
              key={g.value}
              id={'tab-' + g.value}
              value={g.value}
              aria-controls={'panel-' + g.value}
              aria-selected={tab === g.value}
              tabIndex={tab === g.value ? 0 : -1}
            >
              {g.title}{' '}
              {g.value !== 'community' && (
                <span className="count">
                  {projects.filter((p) => p.kind === g.value).length}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContents transition={reduced ? { duration: 0 } : undefined}>
          {groups.map((g) => (
            <TabsContent
              key={g.value}
              id={'panel-' + g.value}
              aria-labelledby={'tab-' + g.value}
              value={g.value}
            >
              {g.value === 'community' ? (
                <Community active={tab === 'community'} />
              ) : (
                <div className="card-grid">
                  {projects
                    .filter((p) => p.kind === g.value)
                    .map((p) => (
                      <ProjectCard key={p.slug} p={p} />
                    ))}
                </div>
              )}
            </TabsContent>
          ))}
        </TabsContents>
      </Tabs>
      <div className="contribute">
        <p>
          有想验证的问题，或已经做出了原型？把仓库、Demo 和需要的协作写在一起。
        </p>
        <a href={submitIdea}>
          <Plus size={15} /> 分享想法
        </a>
      </div>
    </section>
  );
}
export function Home() {
  const reduced = useStudioReducedMotion();
  return (
    <main className="wrap" id="main">
      <section className="hero" id="studio">
        <div className="hero-copy">
          <Reveal>
            <p className="kicker hero-kicker">Embodied Intelligence Studio</p>
          </Reveal>
          <h1 className="hero-title">
            <SplittingText
              text="叉社具身工作室"
              initial={{ opacity: 0, y: '55%', rotate: 3 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              stagger={0.07}
              delay={80}
              disableAnimation={!!reduced}
            />
          </h1>
          <Reveal delay={170}>
            <p className="hero-lead">把具身智能的想法做成原型。</p>
            <p className="hero-desc">
              在这里分享研究想法、体验交互
              Demo，找到愿意一起做实验的同学与企业伙伴。
            </p>
            <div className="hero-actions">
              <FlipLink href="#projects" back="进入项目库">
                探索项目
              </FlipLink>
              <a className="text-link" href={submitIdea}>
                分享想法 <ArrowUpRight size={16} />
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal delay={130} className="hero-media">
          <figure>
            <div className="photo-frame">
              <img
                src={base + '/workbench.webp'}
                width="1200"
                height="800"
                alt="蓝色桌面机械臂的夹爪悬停在红色方块上方，AI 生成的操作场景示意"
                fetchPriority="high"
              />
            </div>
            <figcaption>
              <span className="caption-line" />
              桌面机械臂 · AI 场景示意
            </figcaption>
          </figure>
        </Reveal>
      </section>
      <Gallery />
      <section id="equipment" className="section equipment-strip">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="kicker">Equipment</p>
              <h2>器材管理</h2>
            </div>
            <Boxes size={32} strokeWidth={1.2} />
          </div>
          <div className="strip-body">
            <p>查看机械臂、深度相机和制作工具的状态，登记借用、归还与维修。</p>
            <a className="outline" href={base + '/equipment/'}>
              进入器材台账 <ArrowRight size={15} />
            </a>
          </div>
        </Reveal>
      </section>
      <section id="notes" className="section">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="kicker">Field notes</p>
              <h2>学习笔记</h2>
            </div>
            <BookOpen size={29} strokeWidth={1.2} />
          </div>
        </Reveal>
        <Accordion type="single" collapsible>
          {notes.map((n) => (
            <AccordionItem value={n.id} key={n.id}>
              <AccordionTrigger className="note-trigger">
                <span>
                  <small>{n.topic}</small>
                  {n.title}
                </span>
              </AccordionTrigger>
              <AccordionContent
                transition={reduced ? { duration: 0 } : undefined}
              >
                <p className="note-body">{n.text}</p>
                <a href={n.href} className="text-link note-source">
                  {n.link} <ArrowUpRight size={14} />
                </a>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
}
