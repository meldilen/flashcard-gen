import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./TopicPage.css";

export default function TopicPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const storedPassword = localStorage.getItem("password");

        if (!storedUser || !storedPassword) {
          navigate("/login");
          return;
        }

        const [topicResponse, flashcardsResponse] = await Promise.all([
          axios.get(`http://localhost:8000/topics/${id}`, {
            headers: {
              Authorization: `Basic ${btoa(
                `${storedUser.email}:${storedPassword}`
              )}`,
            },
          }),
          axios.get(`http://localhost:8000/flashcards/?topic_id=${id}`, {
            headers: {
              Authorization: `Basic ${btoa(
                `${storedUser.email}:${storedPassword}`
              )}`,
            },
          }),
        ]);

        setTopic(topicResponse.data);
        setFlashcards(flashcardsResponse.data);
      } catch (err) {
        console.error("Error loading topic:", err);
        setError("Failed to load topic data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading topic...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <span className="error-icon">⚠️</span>
        {error}
      </div>
    );
  }

  return (
    <div className="topic-container">
      <div className="topic-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
        <h1>{topic?.name}</h1>
      </div>

      <div className="flashcards-container">
        {flashcards.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>No flashcards in this topic</h3>
            <p>Try generating new flashcards</p>
          </div>
        ) : (
          <div className="flashcards-grid">
            {flashcards.map((card) => (
              <div key={card.id} className="flashcard">
                <div className="flashcard-front">{card.question}</div>
                <div className="flashcard-back">{card.answer}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}