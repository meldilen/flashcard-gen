import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        const authString = btoa(`${email}:${password}`);
        const response = await axios.get("http://localhost:8000/login", {
          headers: {
            Authorization: `Basic ${authString}`,
          },
        });
        // const response = await axios.post(
        //   "http://localhost:8000/login",
        //   { username: email, password },
        //   { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        // );
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem('password', password);
        navigate("/generate"); //может здесь на профиль перенаправлять?
      } else {
        const response = await axios.post("http://localhost:8000/register/", {
          username,
          email,
          password,
        });
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem('password', password);
        navigate("/generate"); // и здесь тоже???
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setError("Invalid password");
        } else if (err.response.status === 404) {
          if (isLogin) {
            setError("Email not found");
          } else {
            setError("User with this email already exists");
          }
        } else {
          setError("Authorization error");
        }
      } else {
        setError("Failed to connect to the server");
      }
    }
  };

  return (
    <div className="auth-page">
      <h1>{isLogin ? "Log in" : "Sign Up"}</h1>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">{isLogin ? "Log in" : "Sign Up"}</button>
      </form>
      <button
        className="toggle-auth"
        onClick={() => {
          setIsLogin(!isLogin);
          setError(null);
        }}
      >
        {isLogin
          ? "No account? Sign up"
          : "Do you already have an account? Log in"}
      </button>
    </div>
  );
}
