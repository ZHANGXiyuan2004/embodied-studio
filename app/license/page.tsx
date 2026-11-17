import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { base, github, collaborate } from '@/lib/studio';

export const metadata = { title: '许可与署名' };

export default function LicensePage() {
  return (
    <main id="main" className="wrap inner-page license-page">
      <a className="back" href={base + '/'}>
        <ArrowLeft size={15} />
        返回工作室
      </a>
      <div className="detail-heading">
        <h1>许可与署名</h1>
        <p>欢迎分享工作室的公开链接、体验 Demo，并与作者讨论合作。</p>
      </div>
      <section className="next-step">
        <h2>复用工作室作品</h2>
        <p>
          工作室及相应贡献者对原创代码、交互 Demo 和原创文字保留权利。企业如需将
          Demo
          集成到产品、改编发布或商业使用，请说明项目、用途和分发方式，与权利人另行约定。复用工作室标识或首页的机械臂交互画面，也请先联系工作室。
        </p>
        <div className="actions">
          <a className="solid" href={collaborate('作品复用授权')}>
            洽谈授权 <ArrowUpRight size={15} />
          </a>
          <a className="text-link" href={github + '/blob/main/LICENSE'}>
            完整权利声明 <ArrowUpRight size={14} />
          </a>
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
        <h2>第三方组件与图标</h2>
        <p>
          Animate UI 组件采用 Elliot Sutton 的 MIT + Commons Clause
          条款，允许随网站或产品使用，对组件原样销售或再分发另有限制。Lucide
          及其中源自 Feather 的图标保留各自署名。完整文本随本站的静态文件提供。
        </p>
        <div className="actions">
          <a className="text-link" href={base + '/third-party-notices.txt'}>
            第三方署名与许可全文 <ArrowUpRight size={14} />
          </a>
        </div>
      </section>
    </main>
  );
}
