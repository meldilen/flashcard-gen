import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GeneratorPage from './pages/GeneratorPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.css';

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
            <Route path="/login" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/generate" element={<GeneratorPage onError={setGlobalError} />} />
            <Route path="/" element={<GeneratorPage onError={setGlobalError} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}