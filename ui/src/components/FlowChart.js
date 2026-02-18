import React, { useState, useEffect, useRef, useMemo } from 'react';
import Plot from 'react-plotly.js';

const FlowChart = ({ varName, varIndex, socket }) => {
  // Refs store the accumulating data without triggering a render for every row
  const xData = useRef([]);
  const yData = useRef([]);
  const [revision, setRevision] = useState(0);

  // Memoize layout to keep the UI snappy
  const layout = useMemo(() => ({
    title: { text: varName, font: { color: '#ff6600', size: 14 } },
    height: 300,
    margin: { t: 40, b: 40, l: 60, r: 20 },
    xaxis: { 
      title: 'Time (s)', 
      type: 'linear', 
      autorange: true, // Allows full expansion as data grows
      gridcolor: '#eee' 
    },
    yaxis: { title: 'Value', autorange: true, gridcolor: '#eee' },
    autosize: true,
    datarevision: revision, // Critical for efficient Plotly updates
  }), [varName, revision]);

  useEffect(() => {
    const handleData = (batch) => {
      // Backend now sends a batch: [[time, val1, val2...], [time, val1, val2...]]
      if (batch && Array.isArray(batch)) {
        
        batch.forEach(row => {
          if (row[varIndex] !== undefined) {
            xData.current.push(row[0]);        // First index is time
            yData.current.push(row[varIndex]); // Values follow in selected order
          }
        });

        // Trigger one single re-render for the entire batch of 50
        setRevision(r => r + 1);
      }
    };

    socket.on('trajectory', handleData);
    return () => socket.off('trajectory', handleData);
  }, [varIndex, socket]);

  return (
    <div style={{ 
      marginBottom: '20px', 
      padding: '10px', 
      background: '#fff', 
      borderRadius: '8px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
      border: '1px solid #eee' 
    }}>
      <Plot
        data={[{
          x: xData.current,
          y: yData.current,
          type: 'scatter',
          mode: 'lines',
          name: varName,
          line: { color: '#ff6600', width: 2, shape: 'linear' } // 'linear' is smoother for live plotting
        }]}
        layout={layout}
        useResizeHandler={true}
        style={{ width: "100%" }}
        config={{ displayModeBar: false }}
      />
    </div>
  );
};

export default FlowChart;