import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./TopicPage.css";

export default function TopicPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCardId, setExpandedCardId] = useState(null);

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
          axios.get(
            `http://localhost:8000/topics/${id}/?user_id=${storedUser.id}`,
            {
              headers: {
                Authorization: `Basic ${btoa(
                  `${storedUser.email}:${storedPassword}`
                )}`,
              },
            }
          ),
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
        <div className="header-content">
          <motion.button
            className="back-btn"
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="back-arrow">&larr;</span> Back to topics
          </motion.button>
          <h1 className="topic-title">{topic?.name}</h1>
          <div className="header-meta">
            <span className="flashcards-count">
              {flashcards.length}{" "}
              {flashcards.length === 1 ? "flashcard" : "flashcards"}
            </span>
          </div>
        </div>
      </div>

      <div className="flashcards-container">
        {flashcards.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>No flashcards in this topic</h3>
            <p>Try generating new flashcards</p>
          </div>
        ) : (
          <>
            <div className="flashcards-header">
              <h2 className="knowledge-title">
                <span className="knowledge-highlight">Test Your Knowledge</span>{" "}
                in {topic?.name}
              </h2>
            </div>
            <div className="flashcards-grid">
              <AnimatePresence>
                {flashcards.map((card) => (
                  <motion.div
                    key={card.id}
                    className={`flashcard-card ${
                      expandedCardId === card.id ? "is-flipped" : ""
                    }`}
                    onClick={() =>
                      setExpandedCardId(
                        card.id === expandedCardId ? null : card.id
                      )
                    }
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flashcard-inner">
                      <div className="flashcard-front">
                        <div className="flashcard-question">
                          <span className="question-mark">?</span>
                          {card.question}
                        </div>
                        <div className="flashcard-hint">Click to flip</div>
                      </div>

                      <div className="flashcard-back">
                        <div className="flashcard-answer">
                          <span className="answer-mark">!</span>
                          {card.answer}
                        </div>
                        <div className="ai-tag ai-tag-ribbon">
                          AI-generated, for reference only
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
