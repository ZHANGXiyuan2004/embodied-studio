export const repository = 'ZHANGXiyuan2004/embodied-studio';
export const github = 'https://github.com/' + repository;
export const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const studioName = '行知具身工作室';
export const studioEnglishName = 'Xingzhi Embodied AI Studio';
export const associationUrl = 'https://uestc-ia.github.io/';
export const wechatId = 'DeepSeekv4flash0731';
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

export type Project = {
  slug: string;
  title: string;
  members: string;
  content: string;
  image?: { file: string; alt: string };
};

export const projects: Project[] = [
  {
    slug: 'project-1',
    title: '项目一',
    members: '成员 A、成员 B',
    content: '项目简介与研究目标待填写。',
  },
  {
    slug: 'project-2',
    title: '项目二',
    members: '成员 C、成员 D',
    content: '项目方法与实施过程待填写。',
  },
  {
    slug: 'project-3',
    title: '项目三',
    members: '成员 E、成员 F',
    content: '原型演示与阶段成果待填写。',
  },
];

export type StudioOutput = {
  id: string;
  kind: 'tutorial' | 'video' | 'keepsake';
  title: string;
  body: string;
};
export type DirectoryEntry = {
  id: string;
  name: string;
  link?: { href: string; logo: string };
};

export const outputs: StudioOutput[] = [
  {
    id: 'franka-guide',
    kind: 'tutorial',
    title: 'Franka 抓放入门',
    body: '教程预留位，可在这里放置抓取、选择落点和释放方块的步骤与配图。',
  },
  {
    id: 'demo-guide',
    kind: 'tutorial',
    title: '从仓库运行项目 Demo',
    body: '教程预留位，可在这里补充示例仓库、环境配置和启动方法。',
  },
  {
    id: 'studio-film',
    kind: 'video',
    title: '一分钟认识工作室',
    body: '视频预留位，可在这里放置工作室介绍短片、字幕和观看链接。',
  },
  {
    id: 'prototype-film',
    kind: 'video',
    title: '原型演示短片',
    body: '视频预留位，可在这里放置一次完整的机器人任务演示，并链接对应的项目。',
  },
  {
    id: 'studio-stickers',
    kind: 'keepsake',
    title: '工作室主题贴纸',
    body: '活动伴礼预留位，可在这里展示贴纸设计稿、成品图和印制文件。',
  },
  {
    id: 'open-day-card',
    kind: 'keepsake',
    title: '开放日纪念卡',
    body: '活动伴礼预留位，可在这里记录纪念卡的正反面设计和对应的活动。',
  },
];

export const partners: DirectoryEntry[] = [
  {
    id: 'agibot',
    name: '智元机器人',
    link: { href: 'https://www.agibot.com/', logo: '/partners/agibot.png' },
  },
  {
    id: 'aliyun',
    name: '阿里云',
    link: { href: 'https://www.aliyun.com/', logo: '/partners/aliyun.svg' },
  },
  {
    id: 'xbotics',
    name: 'Xbotics 社区',
    link: {
      href: 'https://github.com/Xbotics-Embodied-AI-club',
      logo: '/partners/xbotics.png',
    },
  },
];

export const mentors: DirectoryEntry[] = [];
