export default function Header() {
  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">KP</div>
        <span className="header-title">KB's Project Manager</span>
      </div>
      <nav className="header-nav">
        <a href="/" className="header-nav-link">Projects</a>
        <a href="/tasks" className="header-nav-link">Tasks</a>
      </nav>
    </header>
  );
}