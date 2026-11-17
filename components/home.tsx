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
import { ArmScene } from './arm-scene';
import { ProjectImage } from './project-image';
import { controlTransition, revealTransition } from '@/lib/motion';
import {
  base,
  projects,
  notes,
  partners,
  mentors,
  submitIdea,
  ideasFeed,
  type DirectoryEntry,
} from '@/lib/studio';

function Gallery() {
  return (
    <section id="projects" className="section">
      <Reveal className="section-head">
        <div>
          <p className="kicker">Project gallery</p>
          <h2>项目展示</h2>
        </div>
        <a className="text-link" href={ideasFeed}>
          浏览社区投稿 <ArrowUpRight size={15} />
        </a>
      </Reveal>
      <div className="card-grid">
        {projects.map((project) => (
          <a
            className="project-card"
            href={base + '/projects/' + project.slug + '/'}
            key={project.slug}
          >
            <div className="card-visual">
              <ProjectImage project={project} />
            </div>
            <div className="card-copy">
              <h3>{project.title}</h3>
              <dl className="project-fields">
                <dt>项目人员</dt>
                <dd>{project.members}</dd>
                <dt>项目内容</dt>
                <dd>{project.content}</dd>
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

function Directory({
  id,
  label,
  title,
  entries,
}: {
  id: string;
  label: string;
  title: string;
  entries: DirectoryEntry[];
}) {
  return (
    <section id={id} className="section">
      <Reveal className="section-head">
        <div>
          <p className="kicker">{label}</p>
          <h2>{title}</h2>
        </div>
      </Reveal>
      <ul className="people-grid">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className={entry.placeholder ? 'open-slot' : undefined}
          >
            {entry.name}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Home() {
  const reduced = useStudioReducedMotion();
  return (
    <main className="wrap" id="main">
      <section className="hero" id="studio">
        <div className="hero-copy">
          <p className="kicker hero-kicker">Embodied Intelligence Studio</p>
          <h1 className="hero-title" aria-label="叉社具身工作室">
            <SplittingText
              type="lines"
              text={['叉社具身', '工作室']}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={revealTransition}
              stagger={0.06}
              disableAnimation={reduced}
            />
          </h1>
          <p className="hero-lead">把具身智能的想法做成原型。</p>
          <p className="hero-desc">浏览工作室的项目 Demo，或分享一个想法。</p>
          <div className="hero-actions">
            <FlipLink href="#projects" back="进入项目库">
              探索项目
            </FlipLink>
            <a className="text-link" href={submitIdea}>
              分享想法 <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <ArmScene />
      </section>
      <Gallery />
      <section id="notes" className="section">
        <Reveal className="section-head">
          <div>
            <p className="kicker">Field notes</p>
            <h2>学习笔记</h2>
          </div>
        </Reveal>
        <Accordion type="single" collapsible>
          {notes.map((note) => (
            <AccordionItem key={note.id} value={note.id}>
              <AccordionTrigger className="note-trigger">
                <span className="note-label">
                  <BookOpen size={17} />
                  {note.title}
                </span>
              </AccordionTrigger>
              <AccordionContent
                transition={reduced ? { duration: 0 } : controlTransition}
              >
                <p className="note-body">{note.body}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
      <Directory
        id="partners"
        label="Partners"
        title="合作伙伴"
        entries={partners}
      />
      <Directory
        id="mentors"
        label="Faculty advisors"
        title="指导教师"
        entries={mentors}
      />
    </main>
  );
}
