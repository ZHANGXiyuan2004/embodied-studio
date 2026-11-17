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

export type Note = { id: string; title: string; body: string };
export type DirectoryEntry = {
  id: string;
  name: string;
  link?: { href: string; logo: string };
};

export const notes: Note[] = [
  {
    id: 'note-1',
    title: '笔记一',
    body: '学习主题、实验记录和参考资料待填写。',
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
