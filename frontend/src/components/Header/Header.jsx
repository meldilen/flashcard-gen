import "./Header.css";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="app-header">
      <div className="logo" onClick={() => navigate("/")}>
        <span className="logo-icon">🦖</span>
        <span className="header">Flashcard Generator</span>
      </div>
      <nav>
        {user ? (
          <>
            <button onClick={() => navigate("/generate")}>
              Generator
            </button>
            <button onClick={() => navigate("/profile")}>Profile</button>
            <button
              onClick={() => {
                localStorage.removeItem("user");
                navigate("/login");
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <button onClick={() => navigate("/login")} className="login-btn">Log in</button>
        )}
      </nav>
    </header>
  );
}
