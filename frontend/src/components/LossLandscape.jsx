import React from 'react';
import Plot from 'react-plotly.js';
import './LossLandscape.css';

function LossLandscape({ landscape }) {
  if (!landscape || !landscape.loss) {
    return <div className="no-data">No landscape data available</div>;
  }

  const { belief_range, equanimity_range, loss, current_belief, current_equanimity } = landscape;

  // 3D surface plot
  const surfaceTrace = {
    type: 'surface',
    x: belief_range,
    y: equanimity_range,
    z: loss,
    colorscale: [
      [0, '#1a1a2e'],
      [0.2, '#16213e'],
      [0.4, '#0f3460'],
      [0.6, '#533483'],
      [0.8, '#e94560'],
      [1, '#ff6b6b']
    ],
    contours: {
      z: {
        show: true,
        usecolormap: true,
        highlightcolor: "#42f462",
        project: {z: true}
      }
    },
    hovertemplate: 'Belief: %{x:.2f}<br>Equanimity: %{y:.2f}<br>Loss: %{z:.2f}<extra></extra>'
  };

  // Current position marker
  // Find z value at current position
  const beliefIdx = belief_range.findIndex(b => b >= current_belief);
  const equanimityIdx = equanimity_range.findIndex(e => e >= current_equanimity);
  const currentZ = loss[equanimityIdx]?.[beliefIdx] || 0;

  const currentPosTrace = {
    type: 'scatter3d',
    mode: 'markers',
    x: [current_belief],
    y: [current_equanimity],
    z: [currentZ * 1.1], // Slightly above surface for visibility
    marker: {
      size: 10,
      color: '#f39c12',
      symbol: 'diamond',
      line: {
        color: 'white',
        width: 2
      }
    },
    name: 'Current Position',
    hovertemplate: 'You are here!<br>Belief: %{x:.2f}<br>Equanimity: %{y:.2f}<extra></extra>'
  };

  const layout = {
    title: {
      text: 'Loss Landscape: Local vs Global Minima',
      font: { color: '#e0e0e0', size: 14 }
    },
    scene: {
      xaxis: {
        title: 'Belief (μ)',
        gridcolor: 'rgba(255, 255, 255, 0.1)',
        color: '#a0a0a0',
        backgroundcolor: 'rgba(0, 0, 0, 0.5)'
      },
      yaxis: {
        title: 'Equanimity',
        gridcolor: 'rgba(255, 255, 255, 0.1)',
        color: '#a0a0a0',
        backgroundcolor: 'rgba(0, 0, 0, 0.5)'
      },
      zaxis: {
        title: 'Loss',
        gridcolor: 'rgba(255, 255, 255, 0.1)',
        color: '#a0a0a0',
        backgroundcolor: 'rgba(0, 0, 0, 0.5)'
      },
      bgcolor: 'rgba(10, 10, 10, 0.9)',
      camera: {
        eye: {x: 1.5, y: 1.5, z: 1.3}
      }
    },
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    font: { color: '#e0e0e0' },
    showlegend: true,
    legend: {
      x: 0.7,
      y: 0.9,
      bgcolor: 'rgba(26, 26, 46, 0.8)',
      bordercolor: 'rgba(102, 126, 234, 0.3)',
      borderwidth: 1
    },
    margin: { t: 50, r: 0, b: 0, l: 0 }
  };

  const config = {
    responsive: true,
    displayModeBar: true,
    displaylogo: false
  };

  return (
    <div className="loss-landscape">
      <Plot
        data={[surfaceTrace, currentPosTrace]}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '600px' }}
      />
      
      <div className="landscape-explanation">
        <h4>🗻 Understanding the Landscape</h4>
        <div className="explanation-grid">
          <div className="explanation-item">
            <span className="explanation-icon">🔴</span>
            <div>
              <strong>Valleys (Low Loss)</strong>
              <p>Stable beliefs where experiences align well</p>
            </div>
          </div>
          <div className="explanation-item">
            <span className="explanation-icon">🔵</span>
            <div>
              <strong>Peaks (High Loss)</strong>
              <p>Unstable beliefs with high prediction error</p>
            </div>
          </div>
          <div className="explanation-item">
            <span className="explanation-icon">💎</span>
            <div>
              <strong>Current Position</strong>
              <p>Your current belief state (yellow diamond)</p>
            </div>
          </div>
          <div className="explanation-item">
            <span className="explanation-icon">🧘</span>
            <div>
              <strong>Equanimity Effect</strong>
              <p>Higher equanimity flattens the landscape, making it easier to escape local minima</p>
            </div>
          </div>
        </div>
        <p className="landscape-insight">
          💡 <strong>Key Insight:</strong> Without equanimity (meditation), you stay stuck in local 
          minima. With equanimity, the landscape becomes flatter, allowing you to reach the global 
          minimum more easily - representing liberation from rigid beliefs.
        </p>
      </div>
    </div>
  );
}

export default LossLandscape;
