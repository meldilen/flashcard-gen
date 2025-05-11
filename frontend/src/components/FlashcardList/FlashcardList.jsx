import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopicFeedback from "../TopicFeedback/TopicFeedback";
import "./FlashcardList.css";

export default function FlashcardList({
  flashcards,
  topicName,
  topicId,
  onSubmitFeedback,
}) {
  const [expandedCardId, setExpandedCardId] = useState(null);

  return (
    <div className="flashcards-container">
      <div className="flashcards-header">
        <h2>Test Your {topicName} Knowledge</h2>
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
                setExpandedCardId(card.id === expandedCardId ? null : card.id)
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
                  <div className="ai-confidence-badge">
                    {card.confidence * 100}% confidence
                  </div>
                  <div className="flashcard-answer">
                    <span className="answer-mark">!</span>
                    {card.answer}
                  </div>
                  <div className="ai-tag-ribbon">
                    AI-generated, for reference only
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="regeneration-notice">
        <div className="notice-icon">🔄</div>
        <div className="notice-content">
          <h4>Not satisfied with the results?</h4>
          <p>
            Delete these cards in your profile and try generating again. 
            A more specific topic name often improves quality!
          </p>
        </div>
      </div>

      {topicId && (
        <div className="feedback-section">
          <TopicFeedback topicId={topicId} onSubmit={onSubmitFeedback} />
        </div>
      )}
    </div>
  );
}
