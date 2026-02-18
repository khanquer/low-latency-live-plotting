import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const FlowChart = ({ varName, varIndex, socket }) => {
  const [plotData, setPlotData] = useState([{
    x: [],
    y: [],
    type: 'scatter',
    mode: 'lines',
    name: varName,
    line: { color: '#ff6600', width: 2.5, shape: 'spline' }
  }]);

  useEffect(() => {
    const handleData = (msg) => {
      if (msg && Array.isArray(msg) && msg[varIndex] !== undefined) {
        setPlotData(prev => {
          // REMOVED .slice(-100) to allow the chart to expand fully
          const newX = [...prev[0].x, msg[0]];
          const newY = [...prev[0].y, msg[varIndex]];
          return [{ ...prev[0], x: newX, y: newY }];
        });
      }
    };

    socket.on('trajectory', handleData);
    return () => socket.off('trajectory', handleData);
  }, [varIndex, socket]);

  return (
    <div style={{ marginBottom: '20px', padding: '10px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
      <Plot
        data={plotData}
        layout={{
          title: { text: varName, font: { color: '#ff6600', size: 14 } },
          height: 300,
          margin: { t: 40, b: 40, l: 60, r: 20 },
          xaxis: { 
            title: 'Time (s)', 
            type: 'linear',
            autorange: true // Ensures the full simulation duration is visible
          },
          yaxis: { title: 'Value', autorange: true },
          autosize: true
        }}
        useResizeHandler={true}
        style={{ width: "100%" }}
        config={{ displayModeBar: false }}
      />
    </div>
  );
};

export default FlowChart;