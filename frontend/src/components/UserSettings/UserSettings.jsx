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
      <div className="input-group">
        <label>
          Topic:
          <input
            type="text"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="Enter topic name"
          />
        </label>
      </div>
      <div className="generate-controls">
        <label>
          Cards to generate:
          <input
            type="number"
            min="1"
            max="20"
            value={cardCount}
            onChange={(e) => onCardCountChange(e.target.value)}
          />
        </label>
        <button onClick={onGenerate} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Flashcards'}
        </button>
      </div>
    </div>
  );
}