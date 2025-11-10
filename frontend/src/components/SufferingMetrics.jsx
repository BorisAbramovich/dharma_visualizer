import React from 'react';
import Plot from 'react-plotly.js';
import './SufferingMetrics.css';

function SufferingMetrics({ metrics }) {
  if (!metrics) {
    return <div className="no-data">No metrics available</div>;
  }

  const { individual_costs, cumulative_suffering, total_squeezing_cost } = metrics;

  // Cumulative suffering chart
  const cumulativeTrace = {
    x: cumulative_suffering.map(d => d.timestamp),
    y: cumulative_suffering.map(d => d.suffering),
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Cumulative Suffering',
    line: {
      color: '#e74c3c',
      width: 3
    },
    marker: {
      size: 6,
      color: '#e74c3c'
    },
    fill: 'tozeroy',
    fillcolor: 'rgba(231, 76, 60, 0.2)'
  };

  const cumulativeLayout = {
    title: {
      text: 'Cumulative Suffering Over Time',
      font: { color: '#e0e0e0', size: 13 }
    },
    xaxis: {
      title: 'Experience #',
      gridcolor: 'rgba(255, 255, 255, 0.1)',
      color: '#a0a0a0'
    },
    yaxis: {
      title: 'Total Suffering',
      gridcolor: 'rgba(255, 255, 255, 0.1)',
      color: '#a0a0a0'
    },
    plot_bgcolor: 'rgba(0, 0, 0, 0.3)',
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    font: { color: '#e0e0e0' },
    margin: { t: 40, r: 20, b: 40, l: 50 },
    height: 200
  };

  // Individual costs chart
  const individualTrace = {
    x: individual_costs.map(d => `Exp ${d.id}`),
    y: individual_costs.map(d => d.cost),
    type: 'bar',
    marker: {
      color: individual_costs.map(d => 
        d.cost > 0 ? '#e74c3c' : '#27ae60'
      ),
      line: {
        color: 'rgba(255, 255, 255, 0.2)',
        width: 1
      }
    },
    hovertemplate: 'Cost: %{y:.2f}<extra></extra>'
  };

  const individualLayout = {
    title: {
      text: 'Current Squeezing Costs',
      font: { color: '#e0e0e0', size: 13 }
    },
    xaxis: {
      title: 'Experience',
      gridcolor: 'rgba(255, 255, 255, 0.1)',
      color: '#a0a0a0'
    },
    yaxis: {
      title: 'Cost',
      gridcolor: 'rgba(255, 255, 255, 0.1)',
      color: '#a0a0a0'
    },
    plot_bgcolor: 'rgba(0, 0, 0, 0.3)',
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    font: { color: '#e0e0e0' },
    margin: { t: 40, r: 20, b: 40, l: 50 },
    height: 200
  };

  const config = {
    responsive: true,
    displayModeBar: false,
    displaylogo: false
  };

  return (
    <div className="suffering-metrics">
      {cumulative_suffering.length > 1 && (
        <div className="chart-container">
          <Plot
            data={[cumulativeTrace]}
            layout={cumulativeLayout}
            config={config}
            style={{ width: '100%' }}
          />
        </div>
      )}

      {individual_costs.length > 0 && (
        <div className="chart-container">
          <Plot
            data={[individualTrace]}
            layout={individualLayout}
            config={config}
            style={{ width: '100%' }}
          />
        </div>
      )}

      <div className="suffering-summary">
        <div className="summary-metric">
          <span className="metric-label">Total Squeezing Cost:</span>
          <span className="metric-value suffering-cost">{total_squeezing_cost.toFixed(2)}</span>
        </div>
        <p className="explanation-text">
          💭 Squeezing cost represents the suffering from forcing experiences to fit your current beliefs.
          Meditate on experiences to reduce their emotional charge and return to a more neutral state.
        </p>
      </div>

      {cumulative_suffering.length === 1 && individual_costs.length === 0 && (
        <div className="empty-state">
          <p>📊 No experiences yet. Add experiences to see suffering metrics.</p>
        </div>
      )}
    </div>
  );
}

export default SufferingMetrics;
