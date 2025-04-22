import { useState } from 'react';
import GeneratorPage from './pages/GeneratorPage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.css';

export default function App() {
  const [globalError, setGlobalError] = useState(null);

  return (
    <div className="app">
      <Header />
      
      <main className="app-content">
        {/* Глобальные ошибки (например, проблемы с API) */}
        {globalError && (
          <div className="global-error">
            {globalError}
            <button onClick={() => setGlobalError(null)}>Закрыть</button>
          </div>
        )}

        <GeneratorPage 
          onError={(message) => setGlobalError(message)} 
        />
      </main>

      <Footer />
    </div>
  );
}