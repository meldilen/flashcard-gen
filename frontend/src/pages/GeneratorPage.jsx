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

  const handleGenerate = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    if (!file || !topic.trim()) {
      setError("Please upload a file and set a topic");
      return;
    }

    setIsLoading(true);
    setError("");

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
      <h1>AI Flashcard Generator</h1>
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
        <div className="error">
          {typeof error === "string" ? error : JSON.stringify(error)}
        </div>
      )}
      <FlashcardList flashcards={flashcards} topicName={topic} />
      {topicId && <TopicFeedback topicId={topicId} onSubmit={handleFeedback} />}
    </div>
  );
}
