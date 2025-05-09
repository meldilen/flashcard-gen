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
            <div className="global-error">
              {globalError}
              <button onClick={() => setGlobalError(null)}>Close</button>
            </div>
          )}

          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route 
              path="/generate" 
              element={<GeneratorPage onError={(message) => setGlobalError(message)} />} 
            />
            <Route 
              path="/" 
              element={<GeneratorPage onError={(message) => setGlobalError(message)} />} 
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}