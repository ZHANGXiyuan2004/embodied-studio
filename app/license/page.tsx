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
        <p>欢迎体验在线 Demo、分享作品链接，也欢迎同学和企业联系作者，一起做下一轮验证。</p>
      </div>
      <section className="next-step">
        <h2>复用工作室作品</h2>
        <p>
          工作室及相应贡献者对各自的原创代码、Demo、教程和影音作品保留权利。你可以把抓放演示的链接发给同事体验。如果想把工作室编写的交互代码集成进产品，或将原创视频用于商业培训，请先与相应权利人约定授权。
        </p>
        <p>
          洽谈时请附上作品链接，写明打算怎样使用、是否对外分发。下方入口通向公开的 GitHub Issue，需私下沟通时可使用首页的「联系我们」。
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
        <h2>成员投稿与合作项目</h2>
        <p>
          成员保留自己对作品享有的权利。复用投稿的 Demo、论文或数据集，请先查看原项目的许可。项目未标许可、或拟议用途超出许可时，可在投稿 Issue 中联系作者。项目进入联合开发或孵化阶段时，由参与方另行约定成果归属、署名和使用范围。
        </p>
      </section>
      <section className="next-step">
        <h2>第三方组件、图标与模型</h2>
        <p>工作室与合作伙伴的标识归各自权利人所有。若要在自己的产品或宣传材料中使用，请联系相应权利人。</p>
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
