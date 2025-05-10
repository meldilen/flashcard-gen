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
    password: "",
    newPassword: "",
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

        const userResponse = await axios.get("http://localhost:8000/users/me", {
          headers: {
            Authorization: `Basic ${btoa(
              `${storedUser.email}:${storedPassword}`
            )}`,
          },
        });

        setUser(userResponse.data);
        setFormData({
          username: userResponse.data.username,
          email: userResponse.data.email,
          password: "",
          newPassword: "",
        });

        const topicsResponse = await axios.get(
          "http://localhost:8000/topics/",
          {
            headers: {
              Authorization: `Basic ${btoa(
                `${storedUser.email}:${storedPassword}`
              )}`,
            },
          }
        );
        setTopics(topicsResponse.data);
      } catch (err) {
        console.error("Profile load error:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("user");
          localStorage.removeItem("password");
          navigate("/login");
        } else {
          setError("Data upload error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleUpdate = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const updateData = {
        username: formData.username,
        email: formData.email,
        ...(formData.newPassword && { password: formData.newPassword }),
      };

      const response = await axios.patch(
        "http://localhost:8000/users/me",
        updateData,
        {
          headers: {
            Authorization: `Basic ${btoa(
              `${storedUser.email}:${formData.password}`
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
    } catch (err) {
      setError("Data update error. Check existing password");
    }
  };

  const handleDeleteTopic = async (topicId) => {
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
      setError("Topic deletion error");
    }
  };

  if (!user & loading) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <h1>User profile</h1>

      {editMode ? (
        <div className="profile-edit">
          <div className="form-group">
            <label>Username:</label>
            <input
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>
              New password (leave it blank if you don't want to change it):
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
            />
          </div>
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div className="profile-info">
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      )}

      <div className="user-topics">
        <h2>Your Topics</h2>
        {topics.length === 0 ? (
          <p>You don't have any topics created yet</p>
        ) : (
          <ul>
            {topics.map((topic) => (
              <li key={topic.id}>
                <span onClick={() => navigate(`/topics/${topic.id}`)}>
                  {topic.name}
                </span>
                <button onClick={() => handleDeleteTopic(topic.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <div className="error">{error}</div>}
    </div>
  );
}
