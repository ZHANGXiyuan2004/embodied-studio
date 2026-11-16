import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react';
import { base, github, projects, collaborate } from '@/lib/studio';
import { TransferDemo } from '@/components/demos/transfer';
import { TimingDemo } from '@/components/demos/async-control';
import { ContactDemo } from '@/components/demos/contact';
export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
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
        项目与想法
      </a>
      <div className="detail-heading">
        <p className="kicker">{p.en}</p>
        <h1>{p.title}</h1>
        <p>{p.summary}</p>
      </div>
      {p.kind === 'demo' && (
        <>
          <div className="instrument-title">
            <h2>交互原型</h2>
            <span>浏览器概念演示 · 教学模型</span>
          </div>
          {slug === 'transfer' ? (
            <TransferDemo />
          ) : slug === 'async-control' ? (
            <TimingDemo />
          ) : (
            <ContactDemo />
          )}
        </>
      )}
      <section className="next-step">
        <h2>一起推进</h2>
        <p>{p.next}</p>
        <div className="actions">
          <a className="solid" href={collaborate(p.title)}>
            参与项目 <ArrowUpRight size={15} />
          </a>
          {p.source && (
            <a className="outline" href={github + '/blob/main/' + p.source}>
              <Github size={15} /> Demo 源码
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
