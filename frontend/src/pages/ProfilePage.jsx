import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    newPassword: "",
    optOutCommunications: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedPassword = localStorage.getItem("password");

        if (!storedUser || !storedPassword) {
          navigate("/login");
          return;
        }

        const [userResponse, topicsResponse] = await Promise.all([
          axios.get("http://localhost:8000/users/me", {
            headers: {
              Authorization: `Basic ${btoa(
                `${storedUser.email}:${storedPassword}`
              )}`,
            },
          }),
          axios.get("http://localhost:8000/topics/", {
            headers: {
              Authorization: `Basic ${btoa(
                `${storedUser.email}:${storedPassword}`
              )}`,
            },
          })
        ]);

        setUser(userResponse.data);
        setFormData({
          username: userResponse.data.username,
          email: userResponse.data.email,
          newPassword: "",
          optOutCommunications: userResponse.data.optOutCommunications || false
        });
        setTopics(topicsResponse.data);
      } catch (err) {
        console.error("Profile load error:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("user");
          localStorage.removeItem("password");
          navigate("/login");
        } else {
          setError("Failed to load profile data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const updateData = {
        username: formData.username,
        email: formData.email,
        optOutCommunications: formData.optOutCommunications,
        ...(formData.newPassword && { password: formData.newPassword }),
      };

      const response = await axios.patch(
        "http://localhost:8000/users/me",
        updateData,
        {
          headers: {
            Authorization: `Basic ${btoa(
              `${storedUser.email}:${localStorage.getItem("password")}`
            )}`,
          },
        }
      );

      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      if (formData.newPassword) {
        localStorage.setItem("password", formData.newPassword);
      }
      setEditMode(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed. Please try again.");
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;
    
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      await axios.delete(`http://localhost:8000/topics/${topicId}`, {
        headers: {
          Authorization: `Basic ${btoa(
            `${storedUser.email}:${localStorage.getItem("password")}`
          )}`,
        },
      });
      setTopics(topics.filter((topic) => topic.id !== topicId));
    } catch (err) {
      setError("Failed to delete topic. Please try again.");
    }
  };

  const toggleOptOut = () => {
    setFormData({
      ...formData,
      optOutCommunications: !formData.optOutCommunications
    });
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading your profile...</p>
    </div>
  );

  if (!user) return <div className="error-message">Please log in to view your profile</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="profile-card">
        {editMode ? (
          <>
            <h2>Edit Profile</h2>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Enter your username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password (optional)</label>
              <input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                placeholder="Enter new password"
              />
              <p className="form-hint">Leave blank to keep current password</p>
            </div>

            <div className="preference-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={formData.optOutCommunications}
                  onChange={toggleOptOut}
                />
                <span className="toggle-switch"></span>
                <span>Opt out of promotional emails</span>
              </label>
              <p className="form-hint">
                Uncheck this box if you want to receive occasional updates and offers
              </p>
            </div>

            <div className="form-actions">
              <button 
                className="primary-btn"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
              <button 
                className="secondary-btn"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Username</span>
                <span className="info-value">{user.username}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email Preferences</span>
                <span className="info-value">
                  {user.optOutCommunications ? "No promotional emails" : "Subscribed to updates"}
                </span>
              </div>
            </div>

            <button 
              className="primary-btn edit-btn"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          </>
        )}
      </div>

      <div className="topics-card">
        <div className="card-header">
          <h2>Your Topics</h2>
          <span className="topics-count">{topics.length}</span>
        </div>

        {topics.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No topics yet</h3>
            <p>Generate flashcards to see your topics here</p>
            <button 
              className="primary-btn"
              onClick={() => navigate("/generate")}
            >
              Create Flashcards
            </button>
          </div>
        ) : (
          <ul className="topics-list">
            {topics.map((topic) => (
              <li key={topic.id} className="topic-item">
                <div 
                  className="topic-content"
                  onClick={() => navigate(`/topics/${topic.id}`)}
                >
                  <h3>{topic.name}</h3>
                  <p className="topic-date">
                    Created: {new Date(topic.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteTopic(topic.id)}
                  aria-label="Delete topic"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}