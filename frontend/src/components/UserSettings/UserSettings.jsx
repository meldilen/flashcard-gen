import { useState, useEffect, useRef } from 'react';
import './UserSettings.css';

export default function UserSettings({
  topic,
  cardCount,
  onTopicChange,
  onCardCountChange,
  onGenerate,
  isLoading,
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTooltip && 
          !tooltipRef.current?.contains(event.target) && 
          !buttonRef.current?.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTooltip]);

  return (
    <div className="user-settings">
      <div className="form-group">
        <div className="label-with-hint">
          <label htmlFor="topic">Topic name:</label>
          <button 
            className="hint-button"
            onClick={() => setShowTooltip(!showTooltip)}
            type="button"
            aria-label="How to name your topic"
            aria-expanded={showTooltip}
          >
            ?
          </button>
          
          {showTooltip && (
            <div className="topic-tooltip" role="tooltip">
              <div className="tooltip-content">
                <h4>How to name your topic for best results</h4>
                <p>
                  AI uses your topic name as context for generation. 
                  Be specific to get more relevant flashcards.
                </p>
                <div className="tooltip-example">
                  <p><strong>Good examples:</strong></p>
                  <ul>
                    <li>"Rice cooking techniques in Asian cuisine"</li>
                    <li>"Molecular biology: DNA replication steps"</li>
                    <li>"Spanish verbs for restaurant conversations"</li>
                  </ul>
                  <p><strong>Avoid:</strong> "Biology", "Recipes", "Spanish"</p>
                </div>
              </div>
              <div className="tooltip-arrow"></div>
            </div>
          )}
        </div>
        
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="Example: 'French Revolution causes'"
          disabled={isLoading}
          aria-describedby="topic-hint"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="cardCount">Number of flashcards (1-15):</label>
        <input
          id="cardCount"
          type="number"
          min="1"
          max="15"
          value={cardCount}
          onChange={(e) => onCardCountChange(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <button 
        className="generate-btn"
        onClick={onGenerate}
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner" aria-hidden="true"></span>
            Generating...
          </>
        ) : 'Generate Flashcards'}
      </button>
    </div>
  );
}