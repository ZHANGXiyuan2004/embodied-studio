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
