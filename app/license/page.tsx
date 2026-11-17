import { ActionLink } from '@/components/action-link';
import { ArrowRight } from '@/components/animate-ui/icons/arrow-right';
import { ArrowLeft } from '@/components/animate-ui/icons/arrow-left';
import { ExternalLink } from '@/components/animate-ui/icons/external-link';
import { base, github, collaborate } from '@/lib/studio';

export const metadata = { title: '许可与署名' };

export default function LicensePage() {
  return (
    <main id="main" className="wrap inner-page license-page">
      <ActionLink className="back" href={base + '/'}>
        <ArrowLeft size={16} aria-hidden="true" />
        <span className="link-underline">返回工作室</span>
      </ActionLink>
      <div className="detail-heading">
        <h1>许可与署名</h1>
        <p>欢迎分享工作室的公开链接、体验 Demo，并与作者讨论合作。</p>
      </div>
      <section className="next-step">
        <h2>复用工作室作品</h2>
        <p>
          工作室及相应贡献者对原创代码、交互 Demo 和原创文字保留权利。企业如需将
          Demo
          集成到产品、改编发布或商业使用，请说明项目、用途和分发方式，与权利人另行约定。复用工作室标识，请先联系工作室。
        </p>
        <div className="actions">
          <ActionLink className="solid" href={collaborate('作品复用授权')}>
            <span className="link-underline">洽谈授权</span> <ExternalLink size={15} aria-hidden="true" />
          </ActionLink>
          <ActionLink
            className="text-link link-underline"
            href={github + '/blob/main/LICENSE'}
          >
            完整权利声明 <ExternalLink size={15} aria-hidden="true" />
          </ActionLink>
        </div>
      </section>
      <section className="next-step">
        <h2>同学投稿与研究资料</h2>
        <p>
          投稿项目的仓库、Demo、论文和数据集沿用原作者或发布方的条款。请从项目链接查看许可。如用途超出许可范围，或项目尚未声明许可，可以在投稿
          Issue 中直接联系作者。
        </p>
      </section>
      <section className="next-step">
        <h2>第三方组件、图标与模型</h2>
        <p>合作伙伴栏的品牌名称和标识归各自权利人所有。各标识的来源见下方第三方署名。</p>
        <p>
          本站使用 Animate UI 官方组件和动画图标，采用 Elliot Sutton 的 MIT +
          Commons Clause
          条款，允许随网站或产品使用，对组件原样销售或再分发另有限制。Lucide
          及其中源自 Feather 的图标保留各自署名。三维演示采用 Three.js。Franka
          Panda 模型源自 MuJoCo Menagerie 和 Franka
          Robotics，本站将网格简化并转为 GLB。模型与预览图适用 Apache-2.0 许可。
        </p>
        <div className="actions">
          <ActionLink
            className="text-link link-underline"
            href={base + '/third-party-notices.txt'}
          >
            第三方署名与许可全文 <ArrowRight size={15} aria-hidden="true" />
          </ActionLink>
        </div>
      </section>
    </main>
  );
}
