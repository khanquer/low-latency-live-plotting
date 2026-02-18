import React, { useState } from 'react';
import VariableList from './VariableList';

const Sidebar = ({ onFMUSelect, onConfigChange, onStart, selectedVars, setVariables, isSimulating }) => {
  const fmuList = [
    { 
      id: 'Modelica_Blocks_Examples_PID_Controller.fmu', 
      name: 'PID Controller Example',
      vars: ['PI.y', 'PI.I.y', 'PI.P.y', 'driveAngle', 'spring.tau', 'torque.tau'] 
    },
    { 
      id: 'Modelica_Fluid_Examples_AST_BatchPlant_BatchPlant_StandardWater.fmu', 
      name: 'Batch Plant Standard Water',
      vars: ['B1.level', 'B2.level', 'B3.ports[2].m_flow'] 
    },
    { 
      id: 'Modelica_Mechanics_Translational_Examples_Oscillator.fmu', 
      name: 'Translational Oscillator',
      vars: ['mass1.s', 'mass2.s', 'mass1.v', 'mass2.v'] 
    }
  ];

  const [localFMU, setLocalFMU] = useState(null);

  return (
    <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', height: '100%', background: '#f1c470', color: 'white' }}>
      <h2 style={{ borderBottom: '2px solid white', paddingBottom: '10px' }}>Simulation Setup</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Select FMU File</label>
        <select 
          onChange={(e) => {
            const fmu = fmuList.find(f => f.id === e.target.value);
            setLocalFMU(fmu);
            onFMUSelect(fmu?.id || '');
            setVariables([]); 
          }} 
          style={inputStyle}
        >
          <option value="">-- Choose FMU --</option>
          {fmuList.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </div>

      {/* Main Container for Variables and Inputs */}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', paddingRight: '5px' }}>
        <VariableList vars={localFMU?.vars || []} selectedVars={selectedVars} setVariables={setVariables} />

        {/* Configuration inputs moved UP directly under the VariableList */}
        <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Start (s)</label>
              <input type="number" defaultValue={0} onChange={(e) => onConfigChange(p => ({...p, start: e.target.value}))} style={numStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Stop (s)</label>
              <input type="number" defaultValue={10} onChange={(e) => onConfigChange(p => ({...p, stop: e.target.value}))} style={numStyle} />
            </div>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Step Size</label>
            <input type="number" step="0.01" defaultValue={0.1} onChange={(e) => onConfigChange(p => ({...p, step: e.target.value}))} style={numStyle} />
          </div>

          <button onClick={onStart} disabled={isSimulating} style={btnStyle}>
            {isSimulating ? 'SIMULATING...' : '▶ START SIMULATION'}
          </button>
        </div>
      </div>
    </div>
  );
};

const labelStyle = { display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '5px', textTransform: 'uppercase' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '4px', border: 'none', color: '#ff6600', fontWeight: 'bold' };
const numStyle = { width: '100%', padding: '10px', borderRadius: '4px', border: 'none', boxSizing: 'border-box', color: '#333' };
const btnStyle = { width: '100%', padding: '15px', border: 'none', borderRadius: '4px', color: '#ff6600', fontWeight: 'bold', background: 'white', cursor: 'pointer' };

export default Sidebar;