import { useState } from 'react';
import './TopicFeedback.css';

const EMOJI_RATINGS = [
  { emoji: '😠', label: 'Poor', color: '#ff4d4f', bgColor: '#fff2f0' },
  { emoji: '😕', label: 'Fair', color: '#faad14', bgColor: '#fffbe6' },
  { emoji: '😐', label: 'Okay', color: '#a0a0a0', bgColor: '#f5f5f5' },
  { emoji: '🙂', label: 'Good', color: '#1890ff', bgColor: '#e6f7ff' },
  { emoji: '😍', label: 'Amazing', color: '#52c41a', bgColor: '#f6ffed' }
];

export default function TopicFeedback({ topicId, onSubmit }) {
  const [rating, setRating] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === null) return;
    await onSubmit(topicId, rating + 1);
    setIsSubmitted(true);
  };

  return (
    <div className="feedback-card">
      {!isSubmitted ? (
        <>
          <div className="feedback-header">
            <h3 className="feedback-title">Rate these flashcards</h3>
            <p className="feedback-subtitle">Your feedback helps us improve</p>
          </div>
          
          <div className="emoji-rating-container">
            {EMOJI_RATINGS.map((item, index) => (
              <div 
                key={index}
                className={`emoji-rating-item ${rating === index ? 'active' : ''}`}
                onClick={() => setRating(index)}
              >
                <div className="emoji-wrapper" style={{ 
                  backgroundColor: rating === index ? item.bgColor : '#f8f9fa',
                }}>
                  <span className="emoji">{item.emoji}</span>
                </div>
                <span className="emoji-label" style={{ 
                  color: rating === index ? item.color : '#6c757d'
                }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          
          <button
            className={`submit-feedback-btn ${rating !== null ? 'active' : ''}`}
            onClick={handleSubmit}
            disabled={rating === null}
          >
            Submit Feedback
          </button>
        </>
      ) : (
        <div className="feedback-success">
          <div className="success-icon-wrapper">
            <span className="success-icon">✓</span>
          </div>
          <h3 className="success-title">Thank You!</h3>
          <p className="success-message">Your feedback has been recorded</p>
        </div>
      )}
    </div>
  );
}