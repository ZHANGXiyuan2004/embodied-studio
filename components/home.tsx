'use client';
import { ArrowRight, ArrowUpRight, BookOpen } from 'lucide-react';
import { SplittingText } from './animate-ui/primitives/texts/splitting';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './animate-ui/components/radix/accordion';
import { Reveal, FlipLink, useStudioReducedMotion } from './shell';
import { ProjectImage } from './project-image';
import { base, projects, submitIdea, ideasFeed } from '@/lib/studio';

function Gallery() {
  return (
    <section id="projects" className="section">
      <Reveal>
        <div className="section-head">
          <div>
            <p className="kicker">Project gallery</p>
            <h2>项目展示</h2>
          </div>
          <a className="text-link" href={ideasFeed}>
            浏览社区投稿 <ArrowUpRight size={15} />
          </a>
        </div>
      </Reveal>
      <div className="card-grid">
        {projects.map((p) => (
          <a
            className="project-card"
            href={base + '/projects/' + p.slug + '/'}
            key={p.slug}
          >
            <div className="card-visual">
              <ProjectImage project={p} />
            </div>
            <div className="card-copy">
              <h3>{p.title}</h3>
              <dl className="project-fields">
                <dt>项目人员</dt>
                <dd>{p.members}</dd>
                <dt>项目内容</dt>
                <dd>{p.content}</dd>
              </dl>
              <span className="card-link">
                查看项目 <ArrowRight size={15} />
              </span>
            </div>
          </a>
        ))}
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
              工作室展示样站。浏览项目与成员的示例版式，或分享一个想法。
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
          <AccordionItem value="sample">
            <AccordionTrigger className="note-trigger">笔记一</AccordionTrigger>
            <AccordionContent
              transition={reduced ? { duration: 0 } : undefined}
            >
              <p className="note-body">学习主题、实验记录和参考资料待填写。</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      <section id="partners" className="section">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="kicker">Partners</p>
              <h2>合作伙伴</h2>
            </div>
          </div>
          <ul className="people-grid">
            <li>智源机器人</li>
            <li className="open-slot">合作伙伴待补充</li>
          </ul>
        </Reveal>
      </section>
      <section id="mentors" className="section">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="kicker">Faculty advisors</p>
              <h2>指导教师</h2>
            </div>
          </div>
          <div className="people-grid">
            <div className="open-slot">教师姓名待填写</div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
