# 行知具身工作室 · 演示站

[工作室演示站](https://chashe-embodied-studio.pages.dev/)

项目和成员采用示例资料。合作伙伴栏链接至智元机器人、阿里云和 Xbotics 社区。指导教师有独立栏目，可在确认名单后添加姓名。首页使用 Franka Panda 三维模型，可点击方块抓取、再次点击台面放置，也支持触屏和键盘。

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
npx wrangler@4 pages deploy out --project-name chashe-embodied-studio --branch main
```

## 许可与署名

工作室对享有权利的原创站点代码、交互 Demo 和文字保留权利。欢迎分享演示链接。企业希望把 Demo 集成进产品时，请在网站页脚打开「许可与署名」，选择「洽谈授权」，说明用途和分发方式，与权利人另行约定。[完整权利声明](LICENSE)

社区投稿按作者在原项目中给出的许可使用。投稿在 GitHub Issues 中公开。首页 Franka Panda 模型与其预览图遵循 Apache-2.0 许可。工作室标识的复用请单独联系。引用的论文、数据集与外部项目请查阅原发布方条款。

本站的交互组件与动画图标取自 Animate UI 官方 registry。Animate UI 保留 Elliot Sutton 的 MIT + Commons Clause 条款。Lucide 图标沿用发行包的 ISC 声明，其中源自 Feather 的图标适用 MIT。参考主页的构建配置和工具保留来源说明。更新运行依赖或复制组件时，请同步核对随网页分发的版权及许可全文。[第三方许可汇编](public/third-party-notices.txt) · [Animate UI 来源](docs/ANIMATE_UI.md)
