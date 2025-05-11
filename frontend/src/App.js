import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import GeneratorPage from "./pages/GeneratorPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import TopicPage from "./pages/TopicPage";
import "./App.css";

export default function App() {
  const [globalError, setGlobalError] = useState(null);

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
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            <Route path="/login" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/generate" element={<GeneratorPage onError={setGlobalError}/>} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/topics/:id" element={<TopicPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}