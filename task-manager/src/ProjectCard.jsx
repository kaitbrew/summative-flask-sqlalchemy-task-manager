import "../projectcard.css";

const formatDate = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function ProjectCard({ project, isSelected, onSelect, onEdit, onDelete }) {
  return (
    <div
      className={`project-card ${isSelected ? "project-card--selected" : ""}`}
      onClick={() => onSelect(project)}
    >
      <div className="project-card-header">
        <p className="project-card-title">{project.title}</p>
        {isSelected && (
          <div className="project-card-actions">
            <button onClick={(e) => { e.stopPropagation(); onEdit(project); }}>Edit</button>
            <button className="btn-danger" onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}>Delete</button>
          </div>
        )}
      </div>
      {project.description && (
        <p className="project-card-description">{project.description}</p>
      )}
      <div className="project-card-timestamps">
        <span>Created {formatDate(project.created_at)}</span>
        <span>Updated {formatDate(project.updated_at)}</span>
      </div>
    </div>
  );
}