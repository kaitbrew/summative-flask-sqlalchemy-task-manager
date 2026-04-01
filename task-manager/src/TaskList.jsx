import TaskCard from "./TaskCard";
import "../tasklist.css";

function TaskSection({ title, tasks, onToggle, onEdit, onDelete }) {
  if (!tasks.length) return null;
  return (
    <div className="task-section">
      <p className="task-section-label">{title} ({tasks.length})</p>
      {tasks.map((t) => (
        <TaskCard key={t.id} task={t} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default function TaskList({ project, tasks, loadingTasks, onAddTask, onToggle, onEdit, onDelete }) {
  const allTasks = [...tasks.pending, ...tasks.complete];

  if (!project) {
    return (
      <div className="task-list-empty">
        <p className="empty-message">Select a project to view its tasks</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <div>
          <h2 className="task-list-heading">{project.title}</h2>
          {project.description && (
            <p className="task-list-description">{project.description}</p>
          )}
        </div>
        <button onClick={onAddTask}>+ Add task</button>
      </div>
      <div className="task-list-body">
        {loadingTasks ? (
          <p className="empty-message">Loading…</p>
        ) : allTasks.length === 0 ? (
          <p className="empty-message">No tasks yet — add one above.</p>
        ) : (
          <>
            <TaskSection title="Pending" tasks={tasks.pending} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
            <TaskSection title="Complete" tasks={tasks.complete} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
          </>
        )}
      </div>
    </div>
  );
}