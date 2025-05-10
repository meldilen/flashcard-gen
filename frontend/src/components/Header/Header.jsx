import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("user");
      setUser(userData ? JSON.parse(userData) : null);
    };

    checkAuth();
    
    window.addEventListener('storage', checkAuth);
    
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("password");
    window.dispatchEvent(new Event('storage'));
    navigate("/login");
  };

  const isLoginPage = location.pathname === "/login";
  const isProfilePage = location.pathname === "/profile";
  const isGeneratorPage = location.pathname === "/generate";

  const handleLogoClick = () => {
    if (location.pathname === "/generate") {
      window.location.reload();
    } else {
      navigate("/generate");
    }
  };

  return (
    <header className="app-header">
      <div className="logo" onClick={handleLogoClick}>
        <span className="logo-icon">🦖</span>
        <span className="header">Flashcard Generator</span>
      </div>
      <nav>
        {user && !isLoginPage ? (
          <>
            {!isGeneratorPage && (
              <button 
                onClick={() => navigate("/generate")} 
                className="nav-btn generator-btn"
              >
                Generator
              </button>
            )}
            {!isProfilePage && (
              <button 
                onClick={() => navigate("/profile")} 
                className="nav-btn profile-btn"
              >
                Profile
              </button>
            )}
            <button 
              onClick={handleLogout} 
              className="nav-btn logout-btn"
            >
              Log out
            </button>
          </>
        ) : isLoginPage ? (
          <button onClick={() => navigate("/login")} className="nav-btn login-btn">
            Log in
          </button>
        ) : null}
      </nav>
    </header>
  );
}