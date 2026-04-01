import "./formmodal.css";
import { useState, useEffect } from "react";
import { fetcher } from "./api/fetcher";

const EMPTY = { title: "", description: "" };

function FormField({ label, value, onChange, multiline }) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      {multiline
        ? <textarea className="form-input" rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
        : <input className="form-input" type="text" value={value} onChange={(e) => onChange(e.target.value)} />}
    </div>
  );
}

export default function FormModal({ type, projectId, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isProject = type === "project";
  const isEditing = !!initial?.id;

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const getPath = () => {
    if (isEditing) return isProject ? `/projects/${initial.id}` : `/tasks/${initial.id}`;
    return isProject ? "/projects" : `/projects/${projectId}/tasks`;
  };

  const submit = async () => {
    if (!form.title.trim()) { setError("Title is required."); return; }
    setLoading(true);
    try {
      const result = await fetcher(getPath(), {
        method: isEditing ? "PATCH" : "POST",
        body: JSON.stringify({ title: form.title, description: form.description }),
      });
      onSave(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{isEditing ? `Edit ${type}` : `New ${type}`}</h2>
        <FormField label="Title" value={form.title} onChange={set("title")} />
        <FormField label="Description" value={form.description || ""} onChange={set("description")} multiline />
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={submit} disabled={loading}>{loading ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}