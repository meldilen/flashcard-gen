import './Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      <p>© {new Date().getFullYear()} Flashcards App</p>
    </footer>
  );
}