import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FlashcardList.css';

export default function FlashcardList({ flashcards, topicName }) {
  const [expandedCardId, setExpandedCardId] = useState(null);

  return (
    <div className="flashcard-list">
      {topicName && <h3>Topic: {topicName}</h3>}
      <AnimatePresence>
        {flashcards.map((card) => (
          <motion.div
            key={card.id}
            className={`flashcard ${expandedCardId === card.id ? 'expanded' : ''}`}
            onClick={() => setExpandedCardId(card.id === expandedCardId ? null : card.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            layout
          >
            <div className="flashcard-content">
              <div className="front">{card.question}</div>
              {expandedCardId === card.id && (
                <motion.div
                  className="back"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {card.answer}
                </motion.div>
              )}
            </div>
            <div className="flashcard-topic">Topic: {card.topic_id}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}