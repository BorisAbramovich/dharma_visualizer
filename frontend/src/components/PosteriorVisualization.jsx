import React from 'react';
import Plot from 'react-plotly.js';
import './PosteriorVisualization.css';

function PosteriorVisualization({ posterior, experienceDistributions, experiences }) {
  if (!posterior || !experienceDistributions) {
    return <div className="no-data">No data to display</div>;
  }

  // Calculate fixed y-axis range based on BASE distributions (equanimity=0)
  // This prevents the scale from changing when equanimity slider moves
  const maxPdfValue = Math.max(
    ...(posterior.pdf_base || posterior.pdf),
    ...experienceDistributions.flatMap(d => [
      ...(d.pdf_stored_base || d.pdf_stored),
      ...(d.pdf_objective_base || d.pdf_objective)
    ])
  );
  const yAxisRange = [0, maxPdfValue * 1.2];  // 20% headroom

  // Create traces for all experience distributions
  const experienceTraces = experienceDistributions.map((dist, idx) => {
    const experience = experiences.find(e => e.id === dist.id);
    // Use currently_squeezed if available, fallback to was_squeezed
    const isSqueezed = dist.currently_squeezed !== undefined ? dist.currently_squeezed : dist.was_squeezed;

    // Get time and squeeze info
    const timeElapsed = experience?.time_elapsed || 0;
    const squeezeDistance = experience?.squeeze_distance || 0;
    const wasSqueezed = experience?.was_squeezed || false;

    // Fade based on meditation level (stronger fading now)
    const meditationLevel = dist.meditation_level || 0;
    const baseOpacity = 1.0 - (meditationLevel * 0.9); // 1.0 at med=0, 0.1 at med=1
    const fillOpacity = 0.4 - (meditationLevel * 0.35); // 0.4 at med=0, 0.05 at med=1

    // Calculate color based on squeeze distance and time
    let r, g, b;

    if (wasSqueezed && meditationLevel < 0.8) {
      // Red gradient for squeezed experiences (0-9+ squeeze distance)
      // More red = more squeezed (max at 9+)
      const squeezeIntensity = Math.min(1.0, squeezeDistance / 9.0);
      r = 150 + Math.round(105 * squeezeIntensity); // 150 -> 255
      g = 150 - Math.round(50 * squeezeIntensity);  // 150 -> 100
      b = 200 - Math.round(100 * squeezeIntensity); // 200 -> 100
    } else if (!wasSqueezed && timeElapsed >= 5 && timeElapsed < 10) {
      // Yellow/orange gradient for experiences starting to decay (5-10s)
      const decayProgress = (timeElapsed - 5) / 5; // 0 to 1
      r = 150 + Math.round(85 * decayProgress); // 150 -> 235
      g = 150 + Math.round(65 * decayProgress); // 150 -> 215
      b = 200 - Math.round(100 * decayProgress); // 200 -> 100
    } else {
      // Default blue-ish color
      r = 150;
      g = 150;
      b = 200;
    }

    const lineColor = `rgba(${r}, ${g}, ${b}, ${baseOpacity})`;
    const fillColor = `rgba(${r}, ${g}, ${b}, ${fillOpacity})`;

    const traces = [];
    
    // Stored value (solid)
    traces.push({
      x: dist.x,
      y: dist.pdf_stored,
      type: 'scatter',
      mode: 'lines',
      name: `Exp ${dist.id}`,
      line: {
        color: lineColor,
        width: 1.5
      },
      fill: 'tozeroy',
      fillcolor: fillColor,
      showlegend: true,
      hovertemplate: `Mean: ${dist.stored_mean.toFixed(2)}<br>` +
                     `Meditation: ${(meditationLevel * 100).toFixed(0)}%<br>` +
                     (wasSqueezed ? `Squeeze: ${squeezeDistance.toFixed(2)}<br>` : '') +
                     `<extra></extra>`
    });
    
    // Objective value (dashed) - only if currently being squeezed
    if (isSqueezed && Math.abs(dist.stored_mean - dist.objective_mean) > 0.01) {
      traces.push({
        x: dist.x,
        y: dist.pdf_objective,
        type: 'scatter',
        mode: 'lines',
        name: `Exp ${dist.id} (objective)`,
        line: {
          color: 'rgba(255, 200, 100, 0.5)',
          width: 1,
          dash: 'dash'
        },
        showlegend: false,
        hovertemplate: `Objective Mean: ${dist.objective_mean.toFixed(2)}<extra></extra>`
      });
      
      // Arrow showing squeezing
      const maxY = Math.max(...dist.pdf_stored);
      traces.push({
        x: [dist.objective_mean, dist.stored_mean],
        y: [maxY * 0.5, maxY * 0.5],
        type: 'scatter',
        mode: 'lines+markers',
        name: `Squeeze ${dist.id}`,
        line: {
          color: 'rgba(255, 150, 100, 0.8)',
          width: 2
        },
        marker: {
          size: 8,
          symbol: ['circle', 'arrow-right']
        },
        showlegend: false,
        hovertemplate: `Squeezing: ${(dist.objective_mean - dist.stored_mean).toFixed(2)}<extra></extra>`
      });
    }
    
    return traces;
  }).flat();

  // Main posterior distribution
  const posteriorTrace = {
    x: posterior.x,
    y: posterior.pdf,
    type: 'scatter',
    mode: 'lines',
    name: 'Posterior Belief',
    line: {
      color: 'rgba(102, 126, 234, 1)',
      width: 3
    },
    fill: 'tozeroy',
    fillcolor: 'rgba(102, 126, 234, 0.2)',
    hovertemplate: `Belief Value: %{x:.2f}<br>Probability Density: %{y:.3f}<extra></extra>`
  };

  // 95% Confidence Interval shaded region
  const ciTrace = {
    x: [posterior.ci_lower, posterior.ci_lower, posterior.ci_upper, posterior.ci_upper, posterior.ci_lower],
    y: [0, yAxisRange[1], yAxisRange[1], 0, 0],
    fill: 'toself',
    fillcolor: 'rgba(102, 126, 234, 0.08)',
    line: { width: 0 },
    type: 'scatter',
    mode: 'lines',
    name: '95% CI',
    showlegend: true,
    hovertemplate: `95% CI: [${posterior.ci_lower.toFixed(2)}, ${posterior.ci_upper.toFixed(2)}]<extra></extra>`
  };

  // Vertical lines at CI boundaries
  const ciLowerLine = {
    x: [posterior.ci_lower, posterior.ci_lower],
    y: [0, yAxisRange[1]],
    type: 'scatter',
    mode: 'lines',
    line: {
      color: 'rgba(102, 126, 234, 0.4)',
      width: 1,
      dash: 'dash'
    },
    showlegend: false,
    hoverinfo: 'skip'
  };

  const ciUpperLine = {
    x: [posterior.ci_upper, posterior.ci_upper],
    y: [0, yAxisRange[1]],
    type: 'scatter',
    mode: 'lines',
    line: {
      color: 'rgba(102, 126, 234, 0.4)',
      width: 1,
      dash: 'dash'
    },
    showlegend: false,
    hoverinfo: 'skip'
  };

  // Vertical line at posterior mean
  const meanLine = {
    x: [posterior.mu, posterior.mu],
    y: [0, Math.max(...posterior.pdf)],
    type: 'scatter',
    mode: 'lines',
    name: 'Posterior Mean',
    line: {
      color: 'rgba(102, 126, 234, 1)',
      width: 2,
      dash: 'dot'
    },
    showlegend: false,
    hovertemplate: `Mean: ${posterior.mu.toFixed(2)}<extra></extra>`
  };

  const layout = {
    title: {
      text: `Belief Distribution (μ=${posterior.mu.toFixed(2)}, σ=${posterior.sigma.toFixed(2)}, τ=${posterior.tau.toFixed(2)})`,
      font: { color: '#e0e0e0', size: 14 }
    },
    xaxis: {
      title: 'Belief Value',
      gridcolor: 'rgba(255, 255, 255, 0.1)',
      color: '#a0a0a0',
      range: [-10, 10],  // Fixed range - never changes
      fixedrange: false
    },
    yaxis: {
      title: 'Probability Density',
      gridcolor: 'rgba(255, 255, 255, 0.1)',
      color: '#a0a0a0',
      fixedrange: false,
      range: yAxisRange  // Fixed range so equanimity slider doesn't change scale
    },
    plot_bgcolor: 'rgba(0, 0, 0, 0.3)',
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    font: { color: '#e0e0e0' },
    showlegend: true,
    legend: {
      x: 1.05,
      y: 1,
      bgcolor: 'rgba(26, 26, 46, 0.8)',
      bordercolor: 'rgba(102, 126, 234, 0.3)',
      borderwidth: 1
    },
    margin: { t: 50, r: 200, b: 50, l: 60 }
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false
  };

  return (
    <div className="posterior-visualization">
      <Plot
        data={[ciTrace, ciLowerLine, ciUpperLine, ...experienceTraces, posteriorTrace, meanLine]}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '500px' }}
      />
      
      <div className="legend-info">
        <div className="legend-item">
          <span className="legend-color" style={{background: 'rgba(102, 126, 234, 0.08)'}}></span>
          <span>95% Confidence Interval</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{background: 'rgba(150, 150, 200, 0.6)'}}></span>
          <span>Experience Distribution</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{background: 'rgba(255, 200, 100, 0.5)', borderStyle: 'dashed'}}></span>
          <span>Objective Value (when squeezed)</span>
        </div>
      </div>
    </div>
  );
}

export default PosteriorVisualization;
