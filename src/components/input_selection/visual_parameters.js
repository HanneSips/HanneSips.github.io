import React, { useState, useEffect } from 'react';

class VisualParameter {
  constructor(number) {
    this.name = `#PARAM${number}`
    this.value = 0;
  }

  changeName(newName) {
    this.name = newName
  }
  changeValue(newValue) {
    this.value = parseInt(newValue);
  }
}

function VisualParameterComp({ element, state}) {
  const [name, changeName] = useState(element.name)
  const [value, changeValue] = useState(element.value)
  const [borderColor, setBorderColor] = useState(''); // initialize with an empty string

  useEffect(() => {
    // Execute your function here
    setBorderColor('temp-border'); // set temporary border color
    setTimeout(() => {
      setBorderColor(''); // reset border color after 1 second
    }, 500);
  }, [state]) ;

  function handleValueChange(event) {
    element.changeValue(event.target.value); 
    changeValue(event.target.value);
  }

  return (
    <div>
        <div >
          <input
            type="text"
            name="nameField"
            id={element.name}
            value={element.name}
            onChange={(event) => {element.changeName(event.target.value); changeName(event.target.value)}}
          />
          <input 
            key={state}
            type="text"
            name="initialValue"
            id={element.value}
            value={element.value}
            onChange={(event) => {handleValueChange(event)}}
            className={`my-input ${borderColor}`}
          />
        </div>
    </div>
  );
}


export { VisualParameterComp, VisualParameter};
