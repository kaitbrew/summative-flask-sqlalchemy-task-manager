export default function Header() {
  return (
    <div style={{
      height: "52px",
      borderBottom: "0.5px solid var(--color-border-tertiary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 1.5rem",
      background: "var(--color-background-primary)",
      flexShrink: 0,
    }}>
      <p style={{ margin: 0, fontSize: "15px", fontWeight: 500, color: "var(--color-text-primary)" }}>
        Project Manager
      </p>
      <nav style={{ display: "flex", gap: "1.25rem" }}>
        <a href="/" style={{ fontSize: "13px", color: "var(--color-text-secondary)", textDecoration: "none" }}>
          Projects
        </a>
        <a href="/tasks" style={{ fontSize: "13px", color: "var(--color-text-secondary)", textDecoration: "none" }}>
          Tasks
        </a>
      </nav>
    </div>
  );
}