export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <div style={{
      height: "40px",
      borderTop: "0.5px solid var(--color-border-tertiary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--color-background-primary)",
      flexShrink: 0,
    }}>
      <p style={{ margin: 0, fontSize: "12px", color: "var(--color-text-tertiary)" }}>
        Built by KB &copy; {year}
      </p>
    </div>
  );
}