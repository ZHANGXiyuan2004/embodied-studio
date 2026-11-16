import { Image as ImageIcon } from 'lucide-react';
import { base, type Project } from '@/lib/studio';

export function ProjectImage({ project }: { project: Project }) {
  return project.image ? (
    <img
      className="project-photo"
      src={base + project.image.file}
      alt={project.image.alt}
    />
  ) : (
    <div
      className="image-placeholder"
      role="img"
      aria-label={project.title + '的图片预留位'}
    >
      <ImageIcon size={25} strokeWidth={1.2} aria-hidden="true" />
      <span>项目图片预留位</span>
    </div>
  );
}
