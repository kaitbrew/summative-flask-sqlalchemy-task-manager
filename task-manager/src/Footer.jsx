import "./footer.css";
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <p className="footer-text">Built by KB &copy; {year}</p>
    </footer>
  );
}