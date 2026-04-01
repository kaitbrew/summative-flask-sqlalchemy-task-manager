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
      </div>
      <div className="task-card-actions">
        <button onClick={() => onEdit(task)}>Edit</button>
        <button className="btn-danger" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
  );
}