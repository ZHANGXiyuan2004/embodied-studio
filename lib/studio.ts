export const repository = 'ZHANGXiyuan2004/embodied-studio';
export const github = 'https://github.com/' + repository;
export const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const submitIdea = github + '/issues/new?template=idea.yml';
export const ideasFeed = github + '/issues?q=is%3Aissue+label%3Aidea';
export function collaborate(title: string) {
  return (
    github +
    '/issues/new?' +
    new URLSearchParams({
      template: 'collaborate.yml',
      title: '[合作] ' + title,
      project: title,
    })
  );
}

export const projects = [
  {
    slug: 'transfer',
    title: '轮式机器人搬箱',
    en: 'Mobile manipulation',
    kind: 'demo',
    field: '移动操作',
    summary:
      '从货架取箱，再送到工位。用俯视路线图拆解导航、抓取和放置的交接时刻。',
    next: '寻找有物料取送场景的同学或企业，一起梳理货架高度、停靠误差与验收条件。',
    source: 'components/demos/transfer.tsx',
  },
  {
    slug: 'async-control',
    title: 'VLA 异步控制',
    en: 'Asynchronous control',
    kind: 'demo',
    field: '视觉语言动作模型',
    summary:
      '让推理与执行出现在同一条时间轴上，观察下一段动作提前计算能省下多少等待。',
    next: '欢迎带来动作日志或新的对照策略，一起比较推理延迟与连续执行之间的关系。',
    source: 'components/demos/async-control.tsx',
  },
  {
    slug: 'contact',
    title: '触觉接触事件',
    en: 'Contact events',
    kind: 'demo',
    field: '触觉感知',
    summary:
      '逐渐推一个方块，观察它何时从静止变成滑移，以及力信号在这一刻怎样变化。',
    next: '欢迎有力觉传感器或接触操作场景的伙伴，一起定义真实数据中的滑移起点。',
    source: 'components/demos/contact.tsx',
  },
  {
    slug: 'dexterity',
    title: '跨灵巧手的操作迁移',
    en: 'Dexterous manipulation',
    kind: 'idea',
    field: '灵巧操作',
    summary: '同一个掌内旋转动作，换一只结构不同的手，还能复用多少策略？',
    next: '从两种手的关节布局与抓取空间入手，先设计一个能重复评测的掌内转块任务。',
    source: '',
  },
  {
    slug: 'everyday',
    title: 'VLA 日常操作',
    en: 'Everyday manipulation',
    kind: 'idea',
    field: '日常操作',
    summary: '征集一个桌面上的日常操作任务，明确输入指令、所需物体与成功条件。',
    next: '可以带来一个明确场景，例如按自然语言指令整理桌面物品，和同学一起定义第一版 Demo。',
    source: '',
  },
] as const;
export type Project = (typeof projects)[number];

export const notes = [
  {
    id: 'timing',
    title: '如何读一条机器人动作时间线',
    topic: '控制',
    text: '先标出相机采样、模型推理开始、推理完成和机械臂开始执行的时刻。逐段计算等待时间，再比较相同任务在同步、异步调度下的空档。异步调度还要记录每段动作所用观测的时间，以检查观测是否已经过时。',
    href: 'https://arxiv.org/abs/2506.01844',
    link: '阅读 SmolVLA 论文',
  },
  {
    id: 'recording',
    title: '采集第一段示教轨迹前要记什么',
    topic: '数据采集',
    text: '为每段轨迹记录任务指令、初始物体位置、相机视角和结束条件。保存图像、关节状态与动作的时间戳。先回放一段抓取和放下，检查夹爪闭合是否与画面中的接触时刻对应，再开始批量采集。',
    href: 'https://github.com/huggingface/lerobot',
    link: '查看 LeRobot 工具',
  },
];
