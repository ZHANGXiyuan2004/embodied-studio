# 行知具身工作室 · Xingzhi Embodied AI Studio

行知具身工作室由在读本科生、硕士生和博士生自发组建，依托英才科协具身部开展校内活动。我们研究具身智能体和机器人软硬件，希望让同学们有机会自己提出问题、动手搭建原型，再找到愿意一起把原型用起来的人。[工作室官网](https://xingzhi-embodied-studio.pages.dev/)

## 我们在做什么

核心团队已组建，项目由同学自主选题。我们已与智元机器人（AgiBot）达成初步合作意向，正在商谈真机支持和每一至两周一次的项目交流。当前主要合作伙伴还有阿里云和 Xbotics 社区。[合作伙伴](https://xingzhi-embodied-studio.pages.dev/#partners)

我们希望分两步培养成员、推进项目。

1. **人才特区 · 选拔与培养**　计划由研究生和高年级本科生担任助教，在指导教师支持下带新成员做课题。成员从选题、原型验证走到阶段验收，再通过成果路演对接企业或课题组的实习机会。
2. **孵化器 · 产品与创业**　对已有原型、也找到实际使用场景的项目，计划邀请企业和经管方向的伙伴一起验证需求、打磨产品、准备商业计划。我们也欢迎研究技术商业化与开放创新的教师，和团队一起讨论成果归属、成员激励以及校企合作方式。

## 如何参与

- **同学分享想法或 Demo**　描述一个具体问题、已经试过什么，以及下一步需要哪类帮助。有原型时附上仓库、演示链接和项目许可，方便其他同学接手一项具体任务。[分享想法或 Demo](https://github.com/ZHANGXiyuan2004/embodied-studio/issues/new?template=idea.yml)
- **企业、教师和社区伙伴**　可以从项目详情的「交流想法」联系团队，也可以直接提出测试场景、技术指导或合作课题。需要私下沟通时，官网首页的「联系我们」可复制工作室微信号。[参与项目](https://github.com/ZHANGXiyuan2004/embodied-studio/issues/new?template=collaborate.yml)

这个仓库维护工作室的展示网站。首页可以操作 Franka Panda 抓放方块，项目展示和内容产出使用示例条目。成员可以把 Demo 保存在自己的仓库，在公开的 GitHub Issues 中分享演示链接，让感兴趣的同学和企业找到项目作者。[项目展示](https://xingzhi-embodied-studio.pages.dev/#projects) · [内容产出](https://xingzhi-embodied-studio.pages.dev/#outputs) · [浏览社区投稿](https://github.com/ZHANGXiyuan2004/embodied-studio/issues?q=is%3Aissue+label%3Aidea)

## 本地预览

使用 Node.js 22 或更新版本。

```sh
npm ci
npm run dev
```

开发预览地址为 <http://127.0.0.1:3000>。运行 `npm test` 校验器材状态流转，`npm run build` 生成静态网站到 `out/`。

开发服务器启动后，运行 `npx playwright test tests/hero-actions.spec.ts` 可复查首页标题排版、按钮交互和合作伙伴链接。首次使用可运行 `npx playwright install chromium` 安装测试浏览器。

## 更新示例

- 在 `lib/studio.ts` 编辑项目标题、项目人员和项目内容。将图片放入 `public/`，在项目条目增加 `image: { file: '/文件名.webp', alt: '画面描述' }`，列表和详情页会同时使用该图。
- 在同一文件的 `outputs` 添加 `{ id, kind, title, body }`。类型 `tutorial`（使用教程）、`video`（宣传视频）和 `keepsake`（活动伴礼）会自动匹配图标和分类名称。每条内容都可独立展开。
- 在 `partners` 或 `mentors` 添加 `{ id, name }`。展示伙伴标识时，将图片放入 `public/partners/`，在条目添加 `link: { href: '官网地址', logo: '/partners/文件名' }`，并在第三方署名中记录图片来源。名单为空时仅显示栏目标题。同一列表内的 `id` 和项目 `slug` 分别保持唯一且稳定，可直接调整条目顺序。
- 重新构建后，项目会生成各自的详情页。项目卡片、章节布局和翻页动效都共用模板。投稿入口通向仓库的 GitHub Issues。

## Cloudflare Pages

使用 Next.js 静态导出，网站从独立地址的根路径提供服务。使用已登录的 Wrangler 部署：

```sh
npm ci
npm run build
npx wrangler@4 pages deploy out --project-name xingzhi-embodied-studio --branch main
```

## 许可与署名

工作室及相应贡献者对各自的原创站点代码、Demo、教程和影音作品保留权利。欢迎体验在线演示、分享链接。企业希望把工作室原创 Demo 集成到产品中，或使用原创教程、视频开展培训，请先与相应权利人约定授权范围。附上作品链接、预期用途和分发方式即可发起洽谈。[完整权利声明](LICENSE) · [洽谈授权](https://xingzhi-embodied-studio.pages.dev/license/)

成员投稿和外链项目沿用各自的许可，作者保留其享有的权利。项目未标许可、或许可未涵盖拟议用途时，请先联系权利人。Franka Panda 模型及预览图遵循 Apache-2.0。工作室及合作伙伴标识的复用请与相应权利人联系。

本站的交互组件与动画图标取自 Animate UI 官方 registry。Animate UI 保留 Elliot Sutton 的 MIT + Commons Clause 条款。Lucide 图标沿用发行包的 ISC 声明，其中源自 Feather 的图标适用 MIT。参考主页的构建配置和工具保留来源说明。更新运行依赖或复制组件时，请同步核对随网页分发的版权及许可全文。[第三方许可汇编](public/third-party-notices.txt) · [Animate UI 来源](docs/ANIMATE_UI.md)
