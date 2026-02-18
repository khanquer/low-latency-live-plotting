import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const FlowChart = ({ varName, varIndex, socket }) => {
  const [plotData, setPlotData] = useState([{
    x: [],
    y: [],
    type: 'scatter',
    mode: 'lines',
    name: varName,
    line: { color: '#ff6600', shape: 'spline', width: 3 }
  }]);

  const layout = {
    title: { text: varName, font: { color: '#ff6600', size: 14 } },
    height: 300,
    paper_bgcolor: '#ffffff',
    plot_bgcolor: '#ffffff',
    margin: { t: 40, b: 40, l: 60, r: 20 },
    xaxis: { title: 'Time (s)', color: '#333', gridcolor: '#eee', type: 'linear' },
    yaxis: { title: 'Value', color: '#333', gridcolor: '#eee', autorange: true }
  };

  useEffect(() => {
    const handleData = (msg) => {
      // Logic: msg is expected to be [time, val1, val2, ...]
      // We check if it's an array and if our specific index exists
      if (msg && Array.isArray(msg) && msg[varIndex] !== undefined) {
        setPlotData(prev => {
          const newX = [...prev[0].x, msg[0]].slice(-100); // msg[0] is Time
          const newY = [...prev[0].y, msg[varIndex]].slice(-100); // msg[varIndex] is the variable
          return [{ ...prev[0], x: newX, y: newY }];
        });
      }
    };

    socket.on('trajectory', handleData);
    return () => socket.off('trajectory', handleData);
  }, [varIndex, socket]);

  return (
    <div style={{ marginBottom: '20px', padding: '10px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <Plot data={plotData} layout={layout} useResizeHandler={true} style={{ width: "100%" }} config={{ displayModeBar: false }} />
    </div>
  );
};

export default FlowChart;