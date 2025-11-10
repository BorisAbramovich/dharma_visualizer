import React, { useState } from 'react';
import './ExperienceControls.css';

function ExperienceControls({ onAddExperience, loading }) {
  const [value, setValue] = useState(0);
  const [sigma, setSigma] = useState(1.0);

  const handleSubmit = () => {
    onAddExperience(value, sigma);
  };

  return (
    <div className="experience-controls">
      <div className="control-group">
        <label>
          Experience Value
          <span className="value-display">{value.toFixed(1)}</span>
        </label>
        <input
          type="range"
          min="-10"
          max="10"
          step="0.1"
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          className="experience-slider"
        />
        <div className="slider-labels">
          <span>-10</span>
          <span>0</span>
          <span>+10</span>
        </div>
      </div>

      <div className="control-group">
        <label>
          Emotional Charge (σ)
          <span className="value-display">{sigma.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min="0.1"
          max="3.0"
          step="0.1"
          value={sigma}
          onChange={(e) => setSigma(parseFloat(e.target.value))}
          className="experience-slider"
        />
        <div className="slider-labels">
          <span>High (0.1)</span>
          <span>Medium (1.5)</span>
          <span>Low (3.0)</span>
        </div>
        <p className="slider-help">
          Low σ = high emotional charge (traumatic/intense)
        </p>
      </div>

      <button
        className="add-button"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Add Experience'}
      </button>

      <div className="info-box">
        <p className="info-text">
          📊 Experiences outside the 95% confidence interval of your posterior belief 
          will be <strong>squeezed</strong> to the nearest boundary. Those within will 
          be accepted as-is.
        </p>
      </div>
    </div>
  );
}

export default ExperienceControls;
