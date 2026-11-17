'use client';

import { ActionLink } from './action-link';
import { ArrowRight } from './animate-ui/icons/arrow-right';
import { ExternalLink } from './animate-ui/icons/external-link';
import { ClipboardList } from './animate-ui/icons/clipboard-list';
import { useStudioReducedMotion } from '@/lib/use-reduced-motion';
import { SplittingText } from './animate-ui/primitives/texts/splitting';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './animate-ui/components/radix/accordion';
import { Reveal } from './shell';
import { ContactButton } from './contact-button';
import { ArmScene } from './arm-scene';
import { ProjectImage } from './project-image';
import { controlTransition, revealTransition } from '@/lib/motion';
import {
  base,
  projects,
  notes,
  partners,
  mentors,
  associationUrl,
  studioName,
  ideasFeed,
  type DirectoryEntry,
} from '@/lib/studio';

function Gallery() {
  return (
    <section id="projects" tabIndex={-1} className="section">
      <Reveal className="section-head">
        <div>
          <p className="kicker">Project gallery</p>
          <h2>项目展示</h2>
        </div>
        <ActionLink className="text-link" href={ideasFeed}>
          浏览社区投稿 <ExternalLink size={15} aria-hidden="true" />
        </ActionLink>
      </Reveal>
      <div className="card-grid">
        {projects.map((project) => (
          <ActionLink
            className="project-card"
            href={base + '/projects/' + project.slug + '/'}
            key={project.slug}
          >
            <div
              className="card-visual"
              data-cover-peer={base + '/projects/' + project.slug + '/'}
            >
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
                查看项目 <ArrowRight size={16} aria-hidden="true" />
              </span>
            </div>
          </ActionLink>
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
    <section id={id} tabIndex={-1} className="section directory">
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
            {entry.link ? (
              <a className="partner-link" href={entry.link.href}>
                <img
                  src={base + entry.link.logo}
                  alt=""
                  width={112}
                  height={36}
                />
                <span>
                  {entry.name} <ExternalLink size={13} aria-hidden="true" />
                </span>
              </a>
            ) : (
              entry.name
            )}
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
          <h1 className="hero-title" aria-label={studioName}>
            <SplittingText
              type="lines"
              text={[studioName]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={revealTransition}
              disableAnimation={reduced}
            />
          </h1>
          <div className="hero-actions">
            <a className="hero-action" href={associationUrl}>
              浏览社团 <ExternalLink size={16} aria-hidden="true" />
            </a>
            <ContactButton />
          </div>
        </div>
        <ArmScene />
      </section>
      <Gallery />
      <section id="notes" tabIndex={-1} className="section">
        <Reveal className="section-head">
          <div>
            <p className="kicker">Field notes</p>
            <h2>学习笔记</h2>
          </div>
        </Reveal>
        <Accordion className="notes-list" type="single" collapsible>
          {notes.map((note) => (
            <AccordionItem key={note.id} value={note.id}>
              <AccordionTrigger className="note-trigger">
                <span className="note-label">
                  <ClipboardList size={17} aria-hidden="true" />
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
      <div className="directories">
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
      </div>
    </main>
  );
}
