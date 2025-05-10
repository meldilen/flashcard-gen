import './UserSettings.css';

export default function UserSettings({
  topic,
  cardCount,
  onTopicChange,
  onCardCountChange,
  onGenerate,
  isLoading,
}) {
  return (
    <div className="user-settings">
      <div className="form-group">
        <label htmlFor="topic">Topic:</label>
        <input
          id="topic"
          type="text"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="Enter topic name"
          disabled={isLoading}
        />
      </div>
      <div className="generate-controls">
        <div className="form-group">
          <label htmlFor="cardCount">Cards to generate:</label>
          <input
            id="cardCount"
            type="number"
            min="1"
            max="20"
            value={cardCount}
            onChange={(e) => onCardCountChange(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button 
          type="button" 
          onClick={onGenerate} 
          disabled={isLoading || !topic.trim()}
          className="generate-btn"
        >
          {isLoading ? 'Generating...' : 'Generate Flashcards'}
        </button>
      </div>
    </div>
  );
}