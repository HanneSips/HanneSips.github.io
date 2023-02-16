import React, { useState } from 'react';
import VisualPlayground from './components/visual_playground'
import InputSelection from './components/input_selection/input_selection'
import Output from './components/output'

function App() {
  const [selected, setSelected] = useState(null);

  const handleClick = (index) => {
    setSelected(index);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'row', padding: '5px' }}>
      <Column 
        isSelected={selected === 0} 
        onClick={() => handleClick(0)} 
        content={<InputSelection />}
        colour='lightgray'
      />
      <Column 
        isSelected={selected === 1} 
        onClick={() => handleClick(1)} 
        content={<VisualPlayground />}
        colour='gray'
      />
      <Column 
        isSelected={selected === 2} 
        onClick={() => handleClick(2)} 
        content={<Output />}
        colour='lightgray'
      />
    </div>
  );
};


const Column = ({ isSelected, onClick, content, colour}) => (
  <div style={{ flex: isSelected ? 4 : 1, background: colour, height: '100%', padding: '5px' }} onClick={onClick}>
    {content}
  </div>
);

export default App;