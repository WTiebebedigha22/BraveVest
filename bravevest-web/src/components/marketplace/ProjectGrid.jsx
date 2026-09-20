import ProjectCard from './ProjectCard';

export default function ProjectGrid({ projects = [] }) {
  if (!projects.length) return null;
  return (
    <div className="grid grid-3">
      {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
    </div>
  );
}
