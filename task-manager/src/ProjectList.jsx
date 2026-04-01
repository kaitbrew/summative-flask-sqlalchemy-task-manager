import ProjectCard from "./ProjectCard";
import "../projectlist.css";

export default function ProjectList({ projects, selectedProject, onSelect, onAdd, onEdit, onDelete }) {
  return (
    <div className="project-list">
      <div className="project-list-header">
        <h2 className="project-list-heading">Projects</h2>
        <button onClick={onAdd}>+ New</button>
      </div>
      <div className="project-list-body">
        {projects.length === 0 ? (
          <p className="empty-message">No projects yet</p>
        ) : (
          projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              isSelected={selectedProject?.id === p.id}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}