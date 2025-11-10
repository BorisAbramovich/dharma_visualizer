import React, { useState } from 'react';
import './MeditationControls.css';

function MeditationControls({ experiences, onMeditate, brahmaViharasLevel, onSetBrahmaViharas }) {
  const [meditationLevel, setMeditationLevel] = useState(100);

  const handleMeditate = () => {
    onMeditate(meditationLevel / 100);
  };

  const handleBrahmaViharasChange = (value) => {
    onSetBrahmaViharas(value / 100);
  };

  const latestExperience = experiences.length > 0 ? experiences[experiences.length - 1] : null;
  const latestMeditation = latestExperience ? latestExperience.meditation_level * 100 : 0;

  return (
    <div className="meditation-controls">
      <div className="section">
        <h3>🧘 Meditate on Latest Experience</h3>

        {experiences.length === 0 ? (
          <p className="no-experiences">No experiences yet. Add some experiences first!</p>
        ) : (
          <>
            {latestExperience && (
              <div className="latest-experience-info">
                <div className="info-row">
                  <span className="label">Latest Experience:</span>
                  <span className="value">Exp #{latestExperience.id} ({latestExperience.objective_mean > 0 ? '+' : ''}{latestExperience.objective_mean.toFixed(1)})</span>
                </div>
                <div className="info-row">
                  <span className="label">Current Meditation:</span>
                  <span className="value">{latestMeditation.toFixed(0)}%</span>
                </div>
                {latestExperience.was_squeezed && (
                  <div className="info-row squeezed">
                    <span className="label">⚠️ Was Squeezed</span>
                    <span className="value">Distance: {Math.abs(latestExperience.objective_mean - latestExperience.stored_mean).toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            <div className="meditation-slider">
              <div className="slider-header">
                <label>Meditation Intensity</label>
                <span className="meditation-value">{meditationLevel}%</span>
              </div>
              <input
                type="range"
                min={latestMeditation}
                max="100"
                step="1"
                value={meditationLevel}
                onChange={(e) => setMeditationLevel(parseFloat(e.target.value))}
                className="slider"
              />
              <div className="slider-labels">
                <span>Current ({latestMeditation.toFixed(0)}%)</span>
                <span>100%</span>
              </div>
            </div>

            <button
              className="meditate-button"
              onClick={handleMeditate}
              disabled={meditationLevel <= latestMeditation}
            >
              Meditate
            </button>

            <div className="info-box">
              <p className="info-text">
                🧘 Meditation releases the rigidity of ALL past experiences,
                allowing the model to expand and accommodate the full range of reality.
              </p>
            </div>
          </>
        )}
      </div>

      <div className="section brahma-viharas">
        <h3>❤️ Brahma Viharas Cultivation</h3>
        <p className="section-description">
          Set your cultivation level manually. Meditation practice can only increase it from here.
        </p>

        <div className="cultivation-slider">
          <div className="slider-header">
            <label>Cultivation Level</label>
            <span className="cultivation-value">{(brahmaViharasLevel * 100).toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={brahmaViharasLevel * 100}
            onChange={(e) => handleBrahmaViharasChange(parseFloat(e.target.value))}
            className="slider brahma-slider"
          />
          <div className="slider-labels">
            <span>Reactive (0%)</span>
            <span>Equanimous (100%)</span>
          </div>
        </div>

        <div className="info-box brahma-info">
          <p className="info-text">
            💡 Manual cultivation sets a baseline. Meditation practice will only increase it from this level.
          </p>
          <p className="info-text">
            Higher cultivation automatically releases charge on new experiences (shown with color fading over time).
          </p>
        </div>
      </div>
    </div>
  );
}

export default MeditationControls;
