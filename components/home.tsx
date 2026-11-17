'use client';

import { ActionLink } from './action-link';
import { ArrowRight } from './animate-ui/icons/arrow-right';
import { ExternalLink } from './animate-ui/icons/external-link';
import { ClipboardList } from './animate-ui/icons/clipboard-list';
import { ChevronDown } from './animate-ui/icons/chevron-down';
import { useStudioReducedMotion } from '@/lib/use-reduced-motion';
import { SplittingText } from './animate-ui/primitives/texts/splitting';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './animate-ui/components/radix/accordion';
import {
  AccordionHeader,
  AccordionTrigger as DisclosureTrigger,
} from './animate-ui/primitives/radix/accordion';
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
  studioEnglishName,
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
    <section
      id={id}
      tabIndex={-1}
      className="section directory"
      aria-labelledby={id + '-title'}
    >
      <Reveal className="section-head">
        <div>
          <p className="kicker">{label}</p>
          <h2 id={id + '-title'}>{title}</h2>
        </div>
      </Reveal>
      {entries.length > 0 && (
        <ul className="people-grid">
          {entries.map((entry) => (
            <li key={entry.id}>
              {entry.link ? (
                <ActionLink className="lift-action partner-link" href={entry.link.href}>
                  <img
                    src={base + entry.link.logo}
                    alt=""
                    width={128}
                    height={40}
                  />
                  <span className="action-label">
                    {entry.name} <ExternalLink size={13} aria-hidden="true" />
                  </span>
                </ActionLink>
              ) : (
                entry.name
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function Home() {
  const reduced = useStudioReducedMotion();
  return (
    <main className="wrap" id="main">
      <section className="hero" id="studio">
        <div className="hero-copy">
          <p className="kicker hero-kicker" lang="en">
            {studioEnglishName}
          </p>
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
          <Accordion type="single" collapsible>
            <AccordionItem value="studio-intro">
              <div className="hero-actions">
                <AccordionHeader>
                  <DisclosureTrigger className="hero-action lift-action intro-trigger">
                    <span className="action-label">
                      工作室简介 <ChevronDown size={16} aria-hidden="true" />
                    </span>
                  </DisclosureTrigger>
                </AccordionHeader>
                <ActionLink className="hero-action lift-action" href={associationUrl}>
                  <span className="action-label">
                    浏览社团 <ExternalLink size={16} aria-hidden="true" />
                  </span>
                </ActionLink>
                <ContactButton />
              </div>
              <AccordionContent transition={reduced ? { duration: 0 } : controlTransition}>
                <p className="studio-intro">
                  我们是由本科生和研究生自发组建的具身智能团队。我们一起设计机器人软硬件，在真机上验证想法，也和合作伙伴探索如何把原型做成产品。
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
      <Directory id="partners" label="Partners" title="合作伙伴" entries={partners} />
      <Directory id="mentors" label="Faculty advisors" title="指导教师" entries={mentors} />
    </main>
  );
}
