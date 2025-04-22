import { useState } from 'react';
import './TopicFeedback.css';

export default function TopicFeedback({ topicId, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    await onSubmit(topicId, rating);
    setIsSubmitted(true);
  };

  return (
    <div className="topic-feedback">
      {!isSubmitted ? (
        <>
          <p>Rate this topic's flashcards:</p>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star ${rating >= star ? 'active' : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
          <button onClick={handleSubmit} disabled={rating === 0}>
            Submit
          </button>
        </>
      ) : (
        <p>Thanks for your feedback!</p>
      )}
    </div>
  );
}