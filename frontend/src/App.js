import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import GeneratorPage from "./pages/GeneratorPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import "./App.css";

export default function App() {
  const [globalError, setGlobalError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="app-content">
          {globalError && (
            <div className="global-error" role="alert">
              {globalError}
              <button 
                onClick={() => setGlobalError(null)} 
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          )}
          <Routes>
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  <GeneratorPage onError={setGlobalError} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route
              path="/generate"
              element={
                isAuthenticated ? (
                  <GeneratorPage onError={setGlobalError} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}