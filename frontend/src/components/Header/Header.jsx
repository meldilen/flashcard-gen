import './Header.css';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <header className="app-header">
      <h1 onClick={() => navigate('/')}>Flashcard Generator</h1>
      <nav>
        {user ? (
          <>
            <button onClick={() => navigate('/generate')}>Card generation</button>
            <button onClick={() => navigate('/profile')}>Profile</button>
            <button onClick={() => {
              localStorage.removeItem('user');
              navigate('/login');
            }}>Log out</button>
          </>
        ) : (
          <button onClick={() => navigate('/login')}>Log in</button>
        )}
      </nav>
    </header>
  );
}