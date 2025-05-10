import './Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Flashcards AI</p>
        <div className="footer-links">
          <a href="/privacy">Confidentiality</a>
          <a href="/terms">Terms</a>
        </div>
      </div>
    </footer>
  );
}