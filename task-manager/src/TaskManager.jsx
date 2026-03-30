import { useState, useEffect, useCallback } from "react";

const API = "http://127.0.0.1:5000";

const fetcher = async (path, options = {}) => {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Request failed");
  }
  if (res.status === 204) return null;
  return res.json();
};

const EMPTY_PROJECT = { title: "", description: "" };
const EMPTY_TASK = { title: "", description: "" };

function Modal({ onClose, children }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 50, padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-secondary)",
          borderRadius: "var(--border-radius-lg)",
          padding: "1.5rem",
          width: "100%", maxWidth: "420px",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, multiline, placeholder }) {
  const shared = {
    value,
    onChange: (e) => onChange(e.target.value),
    placeholder: placeholder || "",
    style: { width: "100%", boxSizing: "border-box", marginTop: "4px", display: "block" },
  };
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ fontSize: "13px", color: "var(--color-text-secondary)", fontWeight: 500 }}>
        {label}
      </label>
      {multiline
        ? <textarea {...shared} rows={3} />
        : <input type="text" {...shared} />}
    </div>
  );
}

function ProjectForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_PROJECT);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const submit = async () => {
    if (!form.title.trim()) { setError("Title is required."); return; }
    setLoading(true);
    try {
      const method = initial?.id ? "PATCH" : "POST";
      const path = initial?.id ? `/projects/${initial.id}` : "/projects";
      const result = await fetcher(path, { method, body: JSON.stringify(form) });
      onSave(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 style={{ margin: "0 0 1.25rem", fontSize: "16px", fontWeight: 500 }}>
        {initial?.id ? "Edit project" : "New project"}
      </h2>
      <FormField label="Title" value={form.title} onChange={set("title")} />
      <FormField label="Description" value={form.description || ""} onChange={set("description")} multiline />
      {error && <p style={{ color: "var(--color-text-danger)", fontSize: "13px", margin: "0 0 0.75rem" }}>{error}</p>}
      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        <button onClick={onClose}>Cancel</button>
        <button onClick={submit} disabled={loading}
          style={{ background: "var(--color-background-primary)", borderColor: "var(--color-border-primary)" }}>
          {loading ? "Saving…" : "Save"}
        </button>
      </div>
    </Modal>
  );
}

function TaskForm({ projectId, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_TASK);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const submit = async () => {
    if (!form.title.trim()) { setError("Title is required."); return; }
    setLoading(true);
    try {
      let result;
      if (initial?.id) {
        result = await fetcher(`/tasks/${initial.id}`, {
          method: "PATCH",
          body: JSON.stringify({ title: form.title, description: form.description }),
        });
      } else {
        result = await fetcher(`/projects/${projectId}/tasks`, {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      onSave(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 style={{ margin: "0 0 1.25rem", fontSize: "16px", fontWeight: 500 }}>
        {initial?.id ? "Edit task" : "New task"}
      </h2>
      <FormField label="Title" value={form.title} onChange={set("title")} />
      <FormField label="Description" value={form.description || ""} onChange={set("description")} multiline />
      {error && <p style={{ color: "var(--color-text-danger)", fontSize: "13px", margin: "0 0 0.75rem" }}>{error}</p>}
      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        <button onClick={onClose}>Cancel</button>
        <button onClick={submit} disabled={loading}
          style={{ background: "var(--color-background-primary)", borderColor: "var(--color-border-primary)" }}>
          {loading ? "Saving…" : "Save"}
        </button>
      </div>
    </Modal>
  );
}

function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const done = task.status === "complete";
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "10px",
      padding: "10px 12px",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: "var(--border-radius-md)",
      background: "var(--color-background-primary)",
      marginBottom: "6px",
    }}>
      <input
        type="checkbox"
        checked={done}
        onChange={() => onToggle(task.id)}
        style={{ marginTop: "3px", cursor: "pointer", flexShrink: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0, fontSize: "14px", fontWeight: 500,
          textDecoration: done ? "line-through" : "none",
          color: done ? "var(--color-text-tertiary)" : "var(--color-text-primary)",
        }}>{task.title}</p>
        {task.description && (
          <p style={{ margin: "2px 0 0", fontSize: "13px", color: "var(--color-text-secondary)" }}>
            {task.description}
          </p>
        )}
      </div>
      <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
        <button onClick={() => onEdit(task)} style={{ fontSize: "12px", padding: "2px 8px" }}>Edit</button>
        <button onClick={() => onDelete(task.id)} style={{ fontSize: "12px", padding: "2px 8px", color: "var(--color-text-danger)", borderColor: "var(--color-border-danger)" }}>Delete</button>
      </div>
    </div>
  );
}

function TaskSection({ title, tasks, onToggle, onEdit, onDelete }) {
  if (!tasks.length) return null;
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <p style={{
        margin: "0 0 8px",
        fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em",
        textTransform: "uppercase", color: "var(--color-text-secondary)",
      }}>{title} ({tasks.length})</p>
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState({ pending: [], complete: [] });
  const [modal, setModal] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const loadProjects = useCallback(async () => {
    const data = await fetcher("/projects");
    setProjects(data);
  }, []);

  const loadTasks = useCallback(async (projectId) => {
    setLoadingTasks(true);
    const data = await fetcher(`/projects/${projectId}/tasks`);
    setTasks(data);
    setLoadingTasks(false);
  }, []);

   useEffect(() => {
    let isActive = true;

    async function fetchProjects() {
      const data = await fetcher("/projects");
      if (!isActive) return;
      setProjects(data);
    }
    fetchProjects();
    return () => { isActive = false; };
  }, []);

useEffect(() => {
  let isActive = true;

  async function syncTasks() {
    if (!selectedProject) {
      if (isActive) setTasks({ pending: [], complete: [] });
      return;
    }

    setLoadingTasks(true);
    const data = await fetcher(`/projects/${selectedProject.id}/tasks`);
    if (!isActive) return;

    setTasks(data);
    setLoadingTasks(false);
  }

  syncTasks();

  return () => { isActive = false; };
}, [selectedProject]);

  const handleToggle = async (taskId) => {
    await fetcher(`/tasks/${taskId}/toggle`, { method: "PATCH" });
    loadTasks(selectedProject.id);
  };

  const handleDeleteTask = async (taskId) => {
    await fetcher(`/tasks/${taskId}`, { method: "DELETE" });
    loadTasks(selectedProject.id);
  };

  const handleDeleteProject = async (projectId) => {
    await fetcher(`/projects/${projectId}`, { method: "DELETE" });
    if (selectedProject?.id === projectId) setSelectedProject(null);
    loadProjects();
  };

  const closeModal = () => setModal(null);

  const onProjectSaved = (saved) => {
    closeModal();
    loadProjects();
    if (saved && (!selectedProject || saved.id === selectedProject?.id)) {
      setSelectedProject((prev) => prev ? { ...prev, ...saved } : null);
    }
  };

  const onTaskSaved = () => {
    closeModal();
    loadTasks(selectedProject.id);
  };

  const allTasks = [...tasks.pending, ...tasks.complete];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "var(--font-sans)", overflow: "hidden" }}>

      {/* Left column — projects */}
      <div style={{
        width: "300px", flexShrink: 0,
        borderRight: "0.5px solid var(--color-border-tertiary)",
        display: "flex", flexDirection: "column",
        background: "var(--color-background-secondary)",
      }}>
        <div style={{
          padding: "1rem 1.25rem",
          borderBottom: "0.5px solid var(--color-border-tertiary)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <h1 style={{ margin: 0, fontSize: "16px", fontWeight: 500 }}>Projects</h1>
          <button onClick={() => setModal({ type: "add-project" })} style={{ fontSize: "12px", padding: "4px 10px" }}>
            + New
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem" }}>
          {projects.length === 0 && (
            <p style={{ fontSize: "13px", color: "var(--color-text-tertiary)", textAlign: "center", marginTop: "2rem" }}>
              No projects yet
            </p>
          )}
          {projects.map((p) => {
            const isSelected = selectedProject?.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedProject(p)}
                style={{
                  padding: "10px 12px",
                  borderRadius: "var(--border-radius-md)",
                  border: isSelected
                    ? "0.5px solid var(--color-border-primary)"
                    : "0.5px solid transparent",
                  background: isSelected
                    ? "var(--color-background-primary)"
                    : "transparent",
                  cursor: "pointer",
                  marginBottom: "4px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, flex: 1, paddingRight: "8px" }}>{p.title}</p>
                  {isSelected && (
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setModal({ type: "edit-project", project: p }); }}
                        style={{ fontSize: "11px", padding: "2px 6px" }}
                      >Edit</button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteProject(p.id); }}
                        style={{ fontSize: "11px", padding: "2px 6px", color: "var(--color-text-danger)", borderColor: "var(--color-border-danger)" }}
                      >Delete</button>
                    </div>
                  )}
                </div>
                {p.description && (
                  <p style={{ margin: "3px 0 0", fontSize: "12px", color: "var(--color-text-secondary)" }}>
                    {p.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right column — tasks */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {selectedProject ? (
          <>
            <div style={{
              padding: "1rem 1.5rem",
              borderBottom: "0.5px solid var(--color-border-tertiary)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 500 }}>{selectedProject.title}</h2>
                {selectedProject.description && (
                  <p style={{ margin: "2px 0 0", fontSize: "13px", color: "var(--color-text-secondary)" }}>
                    {selectedProject.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => setModal({ type: "add-task" })}
                style={{ fontSize: "12px", padding: "4px 10px", flexShrink: 0 }}
              >
                + Add task
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.5rem" }}>
              {loadingTasks ? (
                <p style={{ fontSize: "13px", color: "var(--color-text-tertiary)" }}>Loading…</p>
              ) : allTasks.length === 0 ? (
                <p style={{ fontSize: "13px", color: "var(--color-text-tertiary)" }}>No tasks yet — add one above.</p>
              ) : (
                <>
                  <TaskSection
                    title="Pending"
                    tasks={tasks.pending}
                    onToggle={handleToggle}
                    onEdit={(t) => setModal({ type: "edit-task", task: t })}
                    onDelete={handleDeleteTask}
                  />
                  <TaskSection
                    title="Complete"
                    tasks={tasks.complete}
                    onToggle={handleToggle}
                    onEdit={(t) => setModal({ type: "edit-task", task: t })}
                    onDelete={handleDeleteTask}
                  />
                </>
              )}
            </div>
          </>
        ) : (
          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <p style={{ fontSize: "14px", color: "var(--color-text-tertiary)" }}>
              Select a project to view its tasks
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal?.type === "add-project" && (
        <ProjectForm onSave={onProjectSaved} onClose={closeModal} />
      )}
      {modal?.type === "edit-project" && (
        <ProjectForm initial={modal.project} onSave={onProjectSaved} onClose={closeModal} />
      )}
      {modal?.type === "add-task" && (
        <TaskForm projectId={selectedProject.id} onSave={onTaskSaved} onClose={closeModal} />
      )}
      {modal?.type === "edit-task" && (
        <TaskForm projectId={selectedProject.id} initial={modal.task} onSave={onTaskSaved} onClose={closeModal} />
      )}
    </div>
  );
}