# 叉社具身工作室

[工作室主页](https://zhangxiyuan2004.github.io/embodied-studio/) · [提交想法](https://github.com/ZHANGXiyuan2004/embodied-studio/issues/new?template=idea.yml) · [共享器材台账](https://zhangxiyuan2004.github.io/embodied-studio/equipment/)

## 本地运行

使用 Node.js 22 和 npm。

```sh
npm ci
npm run dev
```

打开 <http://127.0.0.1:3000>。运行 `npm test` 检查台账状态流转，`npm run typecheck` 检查类型。运行 `npm run build && npm run preview` 可在 <http://127.0.0.1:8765> 检查静态导出。

## 分享与收录

1. 在自己的 GitHub 仓库维护原型，准备一个访客能打开的 Demo 链接。
2. 从主页的「分享想法」提交 Issue，写明问题、仓库、在线演示与协作需求。只有想法也可以提交。开放且带有 `idea` 标签的 Issue 自动显示在「社区投稿」，页面读取最近 12 项，完整列表在 GitHub。
3. 同学与企业可以从项目卡进入体验或讨论。工作室精选项目由维护者更新 `lib/studio.ts`，站内演示组件位于 `components/demos/`，每个概念 Demo 有独立静态页面和源码入口。学习笔记也在 `lib/studio.ts` 维护。

首版三个互动示例用于讲解搬箱流程、动作调度和摩擦阈值。它们是为此站编写的简化模型。工作室原研究项目的代码、未发布数据与个人联系方式由项目成员自行决定是否提供。

## 管理器材

台账在 `public/inventory.json`，每台设备有独立编号和版本号。访客可查询状态与历史。GitHub 用户可从网页生成申请，在 GitHub 确认提交。网页通过 GitHub 公共 API 同步最新数据。网络或限流异常时会提示当前显示已载入的版本。

- 维护者盘点设备后，在对应的「盘点入库」申请上添加 `approved-equipment` 标签，设备就会从「待盘点」进入「可借」。
- 借用、归还、送修、维修完成和新增器材共用这套流程。批准前核对实物、申请账号与归还日期。申请和历史是公开的，只填写适合公开的内容。
- GitHub Actions 校验状态和版本，使用文件 SHA 写入新状态与历史。并发变更遇到冲突时会重新读取和校验，重复运行同一申请不会重复记账。失败申请留在 Issues 中并显示原因。
- 「新增器材」登记后需进行首次盘点。维护者可通过经审阅的提交修订名称、配件说明。实时台账更新无需重新部署网页。

## 构建与发布

基于[参考主页](https://github.com/ZHANGXiyuan2004/ZHANGXiyuan2004.github.io)的 Next.js 16 App Router、React 19、TypeScript、Tailwind CSS 4、Motion 和 [Animate UI 组件](docs/ANIMATE_UI.md)。推送到 main 后，GitHub Actions 安装锁文件依赖，运行台账测试，静态导出到 `out/`，再发布 GitHub Pages。构建从 Pages 配置读取实际发布路径并注入 `NEXT_PUBLIC_BASE_PATH`。绑定工作室域名后从域名根路径提供服务。仓库的 Pages 发布源为 GitHub Actions。

首页工作台图片位于 `public/workbench.webp`，由内置图像生成工具制作。画面设定为灰色光学平台上的钴蓝色桌面机械臂与朱红色方块，采用自然侧光和工业设计产品摄影构图。

## 许可与署名

工作室对享有权利的原创站点代码、交互 Demo 和文字保留权利。欢迎分享演示链接。企业希望把 Demo 集成进产品时，请在对应项目页选择「参与项目」，说明用途和分发方式，与权利人另行约定。[完整权利声明](LICENSE)

社区投稿按作者在原项目中给出的许可使用。投稿仅供本站展示公开摘要和链接。工作室 AI 生成的机械臂配图用于场景示意，复用图片或工作室标识请单独联系。引用的论文、数据集与外部项目请查阅原发布方条款。

Animate UI 保留 Elliot Sutton 的 MIT + Commons Clause 条款。Lucide 图标沿用发行包的 ISC 声明，其中源自 Feather 的图标适用 MIT。参考主页的构建配置和工具保留来源说明。更新运行依赖或复制组件时，请同步核对随网页分发的版权及许可全文。[第三方许可汇编](public/third-party-notices.txt) · [Animate UI 来源](docs/ANIMATE_UI.md)
