import { GalleryHorizontal } from './animate-ui/icons/gallery-horizontal';
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
      <GalleryHorizontal
        animate={false}
        size={26}
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <span>项目图片预留位</span>
    </div>
  );
}
