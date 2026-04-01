import { useState } from "react";
import { fetcher } from "../api/fetcher";
import Modal from "./Modal";

const EMPTY = { title: "", description: "" };

function FormField({ label, value, onChange, multiline }) {
  const shared = {
    value,
    onChange: (e) => onChange(e.target.value),
    style: { width: "100%", boxSizing: "border-box", marginTop: "4px", display: "block" },
  };
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ fontSize: "13px", color: "var(--color-text-secondary)", fontWeight: 500 }}>
        {label}
      </label>
      {multiline ? <textarea {...shared} rows={3} /> : <input type="text" {...shared} />}
    </div>
  );
}

export default function FormModal({ type, projectId, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isProject = type === "project";
  const isEditing = !!initial?.id;

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
    <Modal onClose={onClose}>
      <h2 style={{ margin: "0 0 1.25rem", fontSize: "16px", fontWeight: 500 }}>
        {isEditing ? `Edit ${type}` : `New ${type}`}
      </h2>
      <FormField label="Title" value={form.title} onChange={set("title")} />
      <FormField label="Description" value={form.description || ""} onChange={set("description")} multiline />
      {error && (
        <p style={{ color: "var(--color-text-danger)", fontSize: "13px", margin: "0 0 0.75rem" }}>
          {error}
        </p>
      )}
      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        <button onClick={onClose}>Cancel</button>
        <button
          onClick={submit}
          disabled={loading}
          style={{ background: "var(--color-background-primary)", borderColor: "var(--color-border-primary)" }}
        >
          {loading ? "Saving…" : "Save"}
        </button>
      </div>
    </Modal>
  );
}