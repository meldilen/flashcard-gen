import { useState } from "react";
import axios from "axios";
import DocumentUpload from "../components/DocumentUploader/DocumentUpload";
import UserSettings from "../components/UserSettings/UserSettings";
import FlashcardList from "../components/FlashcardList/FlashcardList";
import TopicFeedback from "../components/TopicFeedback/TopicFeedback";
import "./GeneratorPage.css";

export default function GeneratorPage() {
  const [userId, setUserId] = useState("");
  const [topic, setTopic] = useState("");
  const [cardCount, setCardCount] = useState(5);
  const [file, setFile] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [topicId, setTopicId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
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
    formData.append("user_id", userId);

    console.log('Отправляемые данные:');
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/process-document/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

    setFlashcards(response.data.flashcards);
    setTopicId(response.data.topic_id);
    } catch (err) {
      if (err.response) {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (topicId, rating) => {
    await axios.patch(`http://localhost:8000/topics/${topicId}/feedback`, {
      rating,
    });
  };

  return (
    <div className="generator-page">
      <h1>AI Flashcard Generator</h1>
      <DocumentUpload onUpload={setFile} disabled={isLoading} />
      <UserSettings
        userId={userId}
        topic={topic}
        cardCount={cardCount}
        onUserIdChange={setUserId}
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
