# Animate UI

本站采用 Next.js、React 和 Motion 12。交互组件与动画图标固定在同一份 [Animate UI 官方 registry](https://github.com/imskyleen/animate-ui/tree/efeb96ffd7a3b7a4868667e4ac3c346620fb3044/apps/www/registry)，许可证随[本地源码](../components/animate-ui/LICENSE.md)提供。原有组件目录和构建方式源自[个人主页](https://github.com/ZHANGXiyuan2004/ZHANGXiyuan2004.github.io/tree/e0cab6988f5c1828354b324742975f6898f1dd69)。

| 站内交互 | 官方实现 |
| --- | --- |
| 桌面章节导航；手机菜单 | Highlight / HighlightItem；Radix Popover、Button 和 Menu |
| 首页标题与章节出现 | SplittingText、Fade |
| 首页按钮和伙伴链接 | ActionLink 驱动 ExternalLink，微信复制使用 Button、Copy、Check。文字下划线从中心展开 |
| 内页返回、项目卡片和外链反馈 | AnimateIcon 驱动 ArrowLeft、ArrowRight、ExternalLink |
| 学习笔记、抓放演示按钮 | Radix Accordion、Button、Play、LoaderCircle |

新增项目、笔记、合作伙伴或指导教师时，在 [lib/studio.ts](../lib/studio.ts) 添加具有稳定 slug 或 id 的条目即可，同一列表内的条目共用组件和过渡。增加图标时，从上述版本的 `icons/<name>/index.tsx` 取对应文件放入 `components/animate-ui/icons/<name>/`，将 registry 导入指向同目录下的本地组件。图标路径与动画变体沿用上游。普通链接通过 ActionLink 将整块链接的悬停、键盘焦点传给 AnimateIcon，减少动态效果模式保留静态图形和焦点提示。

首页通过 Three.js 加载 [MuJoCo Menagerie 的 Franka Emika Panda 模型](https://github.com/google-deepmind/mujoco_menagerie/tree/370c43965323c0944b433b202aac5058b5f907a9/franka_emika_panda)。模型保留七轴关节和双指夹爪，网格经过简化与合并，采用 meshoptimizer 压缩为 GLB。预览图从相同姿态、相机和灯光渲染。鼠标或触屏先选中橙色方块，再点台面放置。键盘使用回车抓放、方向键定位。项目详情进退参考 [Isle & Thorne Collective](https://github.com/codrops/isle-thorne-collective)，支持跨文档 View Transitions 的浏览器会连接列表封面与详情封面。
