import React from 'react';

const VariableList = ({ vars, selectedVars, setVariables }) => {
  
  const handleToggle = (varName) => {
    if (selectedVars.includes(varName)) {
      // Remove variable from plotting list
      setVariables(selectedVars.filter((v) => v !== varName));
    } else {
      // Add variable to plotting list
      setVariables([...selectedVars, varName]);
    }
  };

  return (
    <div style={containerStyle}>
      <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '10px' }}>
        Select variables to plot:
      </p>
      <div style={listStyle}>
        {vars.length === 0 ? (
          <span style={{ color: '#555', fontStyle: 'italic' }}>No FMU selected</span>
        ) : (
          vars.map((v) => (
            <label key={v} style={itemStyle}>
              <input
                type="checkbox"
                checked={selectedVars.includes(v)}
                onChange={() => handleToggle(v)}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ marginLeft: '10px', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {v}
              </span>
            </label>
          ))
        )}
      </div>
    </div>
  );
};

// Styles to match the "dark mode" system dashboard look
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '10px'
};

const listStyle = {
  maxHeight: '250px',
  overflowY: 'auto',
  border: '1px solid #444',
  borderRadius: '4px',
  padding: '10px',
  background: '#1a1a1a'
};

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '5px 0',
  fontSize: '0.85rem',
  cursor: 'pointer',
  whiteSpace: 'nowrap'
};

export default VariableList;