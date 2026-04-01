const formatDate = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const done = task.status === "complete";

  return (
    <div className={`task-card ${done ? "task-card--done" : ""}`}>
      <input
        type="checkbox"
        className="task-card-checkbox"
        checked={done}
        onChange={() => onToggle(task.id)}
      />
      <div className="task-card-body">
        <p className="task-card-title">{task.title}</p>
        {task.description && (
          <p className="task-card-description">{task.description}</p>
        )}
        <div className="task-card-timestamps">
          <span>Created {formatDate(task.created_at)}</span>
          <span>Updated {formatDate(task.updated_at)}</span>
        </div>
      </div>
      <div className="task-card-actions">
        <button onClick={() => onEdit(task)}>Edit</button>
        <button className="btn-danger" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
  );
}