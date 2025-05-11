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
      <div className="form-group">
        <label htmlFor="cardCount">Cards to generate (1-15):</label>
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
      >
        {isLoading ? 'Generating...' : 'Generate Flashcards'}
      </button>
    </div>
  );
}