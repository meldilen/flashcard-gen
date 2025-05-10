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
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("password", password);
        navigate("/generate");
      } else {
        const response = await axios.post("http://localhost:8000/register/", {
          username,
          email,
          password,
        });
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("password", password);
        navigate("/generate");
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
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              title="Username is required"
              onInvalid={(e) => {
                e.target.setCustomValidity("Please enter your name");
              }}
              onInput={(e) => e.target.setCustomValidity("")}
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            title="Please enter a valid email address (e.g., user@example.com)"
            onInvalid={(e) => {
              if (e.target.validity.valueMissing) {
                e.target.setCustomValidity("Please enter your email");
              } else if (e.target.validity.typeMismatch) {
                e.target.setCustomValidity(
                  "Please enter a valid email address"
                );
              }
            }}
            onInput={(e) => e.target.setCustomValidity("")}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            title="Password is required"
            onInvalid={(e) => {
              e.target.setCustomValidity("Please enter your password");
            }}
            onInput={(e) => e.target.setCustomValidity("")}
          />
        </div>
        {error && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <div className="error-text">{error}</div>
          </div>
        )}
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
