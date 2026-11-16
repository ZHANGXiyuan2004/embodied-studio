# 叉社具身工作室 · 演示站

[工作室演示站](https://chashe-embodied-studio.pages.dev/) · [器材演示台账](https://chashe-embodied-studio.pages.dev/equipment/)

项目、成员、指导教师及器材采用占位资料。合作伙伴栏展示智源机器人，并预留其他伙伴位置。首页机械臂配图为 AI 场景示意。

## 本地预览

使用 Node.js 22 或更新版本。

```sh
npm ci
npm run dev
```

开发预览地址为 <http://127.0.0.1:3000>。运行 `npm test` 校验器材状态流转，`npm run build` 生成静态网站到 `out/`。

## 更新示例

- 在 `lib/studio.ts` 编辑项目标题、项目人员和项目内容。将图片放入 `public/`，在项目条目增加 `image: { file: '/文件名.webp', alt: '画面描述' }`，列表和详情页会同时使用该图。
- 在 `components/home.tsx` 编辑合作伙伴、指导教师和学习笔记。投稿入口通向仓库的 GitHub Issues。
- 在 `public/inventory.json` 更新演示器材。借还、维修和新增操作在当前页面内试用，刷新或重置即可恢复示例。

## Cloudflare Pages

使用 Next.js 静态导出，网站从独立地址的根路径提供服务。使用已登录的 Wrangler 部署：

```sh
npm ci
npm run build
npx wrangler@4 pages deploy out --project-name chashe-embodied-studio --branch main
```

## 许可与署名

工作室对享有权利的原创站点代码、交互 Demo 和文字保留权利。欢迎分享演示链接。企业希望把 Demo 集成进产品时，请在网站页脚打开「许可与署名」，选择「洽谈授权」，说明用途和分发方式，与权利人另行约定。[完整权利声明](LICENSE)

社区投稿按作者在原项目中给出的许可使用。投稿在 GitHub Issues 中公开。工作室 AI 生成的机械臂配图用于场景示意，复用图片或工作室标识请单独联系。引用的论文、数据集与外部项目请查阅原发布方条款。

Animate UI 保留 Elliot Sutton 的 MIT + Commons Clause 条款。Lucide 图标沿用发行包的 ISC 声明，其中源自 Feather 的图标适用 MIT。参考主页的构建配置和工具保留来源说明。更新运行依赖或复制组件时，请同步核对随网页分发的版权及许可全文。[第三方许可汇编](public/third-party-notices.txt) · [Animate UI 来源](docs/ANIMATE_UI.md)
