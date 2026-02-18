import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import Sidebar from './components/Sidebar';
import FlowChart from './components/FlowChart';

function App() {
  const [selectedFMU, setSelectedFMU] = useState('');
  const [variables, setVariables] = useState([]); 
  const [config, setConfig] = useState({ start: 0, stop: 10, step: 0.1 });
  const [isSimulating, setIsSimulating] = useState(false);
  const [finalResults, setFinalResults] = useState(null);

  useEffect(() => {
    socket.connect();
    socket.on('simulation_finished', (data) => {
      setIsSimulating(false);
      setFinalResults(data.summary || data);
    });
    return () => {
      socket.disconnect();
      socket.off('simulation_finished');
    };
  }, []);

  const startSimulation = () => {
    if (!selectedFMU || variables.length === 0) {
      alert("Please select an FMU and variables.");
      return;
    }
    setIsSimulating(true);
    setFinalResults(null);

    // Exact JSON for backend processing
    const payload = {
      "fmu_id": selectedFMU,
      "config": {
          "start_time": parseFloat(0.0),
          "final_time": parseFloat(config.stop),
          "step_size": parseFloat(config.step)
      },
      "variables": variables 
    };
    console.log(payload)

    socket.emit('trajectory', payload);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#ffffff', color: '#333' }}>
      <div style={{ background: '#ff6600', color: 'white', minWidth: '320px' }}>
        <Sidebar onFMUSelect={setSelectedFMU} onConfigChange={setConfig} onStart={startSimulation} selectedVars={variables} setVariables={setVariables} isSimulating={isSimulating} />
      </div>
      <main style={{ flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', gap: '20px' }}>
        <div style={{ flex: 2 }}>
          <h2 style={{ color: '#ff6600', borderBottom: '2px solid #ff6600' }}>Live Simulation Feed</h2>
          {variables.map((v, index) => (
            <FlowChart key={v} varName={v} varIndex={index + 1} socket={socket} />
          ))}
        </div>
        <div style={{ flex: 1, borderLeft: '1px solid #ddd', paddingLeft: '20px' }}>
          <h3 style={{ color: '#ff6600' }}>Result Viewer</h3>
          {finalResults && <pre style={{ fontSize: '11px' }}>{JSON.stringify(finalResults, null, 2)}</pre>}
        </div>
      </main>
    </div>
  );
}

export default App;