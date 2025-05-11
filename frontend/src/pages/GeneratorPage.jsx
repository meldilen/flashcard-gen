import { useState, useEffect } from "react";
import axios from "axios";
import DocumentUpload from "../components/DocumentUploader/DocumentUpload";
import UserSettings from "../components/UserSettings/UserSettings";
import FlashcardList from "../components/FlashcardList/FlashcardList";
import TopicFeedback from "../components/TopicFeedback/TopicFeedback";
import { useNavigate } from "react-router-dom";
import "./GeneratorPage.css";

export default function GeneratorPage({ onError }) {
  const [topic, setTopic] = useState("");
  const [cardCount, setCardCount] = useState(5);
  const [file, setFile] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [topicId, setTopicId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  const validateInputs = () => {
    if (!file) {
      setError("Please upload a document first");
      return false;
    }
    if (!topic.trim()) {
      setError("Please enter a topic name");
      return false;
    }
    if (cardCount < 1 || cardCount > 15) {
      setError("Please select between 1 and 15 flashcards");
      return false;
    }
    setError("");
    return true;
  };

  const handleGenerate = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("topic_name", topic);
    formData.append("card_count", cardCount);

    try {
      const response = await axios.post(
        "http://localhost:8000/process-document/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Basic ${btoa(
              `${user.email}:${localStorage.getItem("password")}`
            )}`,
          },
        }
      );

      setFlashcards(response.data.flashcards);
      setTopicId(response.data.topic_id);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else if (err.response) {
        setError(
          err.response.data?.detail ||
            err.response.data?.message ||
            "Server error"
        );
      } else if (err.request) {
        setError("No response from server");
      } else {
        setError(err.message || "Request error");
      }
      onError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (topicId, rating) => {
    const user = JSON.parse(localStorage.getItem("user"));
    await axios.patch(
      `http://localhost:8000/topics/${topicId}/feedback`,
      {
        rating,
      },
      {
        headers: {
          Authorization: `Basic ${btoa(
            `${user.email}:${localStorage.getItem("password")}`
          )}`,
        },
      }
    );
  };

  return (
    <div className="generator-page">
      <div className="generator-header">
        <h1>AI Flashcard Generator</h1>
        <p className="subtitle">Upload your document and get flashcards</p>

        <div className="ai-disclaimer">
          <div className="ai-disclaimer-icon">🤖</div>
          <div className="ai-disclaimer-content">
            <p>
              This service analyzes your documents using AI to automatically
              create flashcards. While we strive for accuracy, please review the
              generated content as AI may occasionally produce imperfect
              results.
            </p>
          </div>
        </div>
      </div>

      <div className="generator-container">
        <div className="input-section">
          <DocumentUpload onUpload={setFile} disabled={isLoading} />

          <UserSettings
            topic={topic}
            cardCount={cardCount}
            onTopicChange={setTopic}
            onCardCountChange={setCardCount}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />

          {error && (
            <div className="error-message">
              <div className="error-icon">⚠️</div>
              <div className="error-text">{error}</div>
            </div>
          )}
        </div>

        <div className="output-section">
          {flashcards.length > 0 ? (
            <FlashcardList
              flashcards={flashcards}
              topicName={topic}
              topicId={topicId}
              onSubmitFeedback={handleFeedback}
            />
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h3>No flashcards yet</h3>
              <p>
                Upload a document and click "Generate Flashcards" to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
