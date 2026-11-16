import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
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
    <main id="main" className="wrap inner-page project-page">
      <a className="back" href={base + '/#projects'}>
        <ArrowLeft size={15} />
        返回项目展示
      </a>
      <div className="detail-heading">
        <p className="kicker">Project demo</p>
        <h1>{p.title}</h1>
      </div>
      <div className="project-detail-grid">
        <ProjectImage project={p} />
        <div>
          <dl className="project-fields">
            <dt>项目人员</dt>
            <dd>{p.members}</dd>
            <dt>项目内容</dt>
            <dd>{p.content}</dd>
          </dl>
          <a className="text-link" href={collaborate(p.title)}>
            交流想法 <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </main>
  );
}
