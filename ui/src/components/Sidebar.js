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
      vars: ['T_tank', 'level', 'p_pump', 'valve_pos', 'flow_rate'] 
    }
  ];

  const [localFMU, setLocalFMU] = useState(null);

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{ borderBottom: '2px solid white', paddingBottom: '10px' }}>Sim Config</h2>
      <select onChange={(e) => {
        const fmu = fmuList.find(f => f.id === e.target.value);
        setLocalFMU(fmu);
        onFMUSelect(fmu?.id || '');
        setVariables([]);
      }} style={{ width: '100%', padding: '10px', marginBottom: '20px' }}>
        <option value="">-- Select FMU --</option>
        {fmuList.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
      </select>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <VariableList vars={localFMU?.vars || []} selectedVars={selectedVars} setVariables={setVariables} />
      </div>

      <div style={{ marginTop: '20px' }}>
        <label style={{ fontSize: '11px', display: 'block' }}>STOP TIME (s)</label>
        <input type="number" defaultValue={10} onChange={(e) => onConfigChange(p => ({...p, stop: e.target.value}))} style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
        <label style={{ fontSize: '11px', display: 'block' }}>STEP SIZE</label>
        <input type="number" step="0.01" defaultValue={0.1} onChange={(e) => onConfigChange(p => ({...p, step: e.target.value}))} style={{ width: '100%', padding: '8px' }} />
      </div>

      <button onClick={onStart} disabled={isSimulating} style={{ marginTop: '20px', padding: '15px', background: 'white', color: '#ff6600', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
        {isSimulating ? 'RUNNING...' : '▶ START'}
      </button>
    </div>
  );
};

export default Sidebar;