import { notFound } from 'next/navigation';
import { ActionLink } from '@/components/action-link';
import { ArrowLeft } from '@/components/animate-ui/icons/arrow-left';
import { ExternalLink } from '@/components/animate-ui/icons/external-link';
import { base, projects, collaborate } from '@/lib/studio';
import { ProjectImage } from '@/components/project-image';

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: projects.find((p) => p.slug === slug)?.title };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  if (!p) notFound();
  return (
    <main id="main" className="wrap inner-page">
      <ActionLink className="back project-return" href={base + '/#projects'}>
        <ArrowLeft size={16} aria-hidden="true" />
        <span className="link-underline">返回项目展示</span>
      </ActionLink>
      <div className="project-detail-grid">
        <div className="detail-cover" data-cover-peer={base + '/'}>
          <ProjectImage project={p} />
        </div>
        <div className="detail-info">
          <div className="detail-heading">
            <p className="kicker">Project demo</p>
            <h1>{p.title}</h1>
          </div>
          <dl className="project-fields">
            <dt>项目人员</dt>
            <dd>{p.members}</dd>
            <dt>项目内容</dt>
            <dd>{p.content}</dd>
          </dl>
          <ActionLink className="solid" href={collaborate(p.title)}>
            <span className="link-underline">交流想法</span> <ExternalLink size={15} aria-hidden="true" />
          </ActionLink>
        </div>
      </div>
    </main>
  );
}
