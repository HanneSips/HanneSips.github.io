import React, { useState, useEffect, useRef } from 'react';

class VisualParameter {
  constructor(number) {
    this.name = `#PARAM${number}`
    this.value = 0;
    this.category = 'parameter'
    this.prevCategory = this.coreCategory
    this.rowNumber = number
    this.columnNumber = 1
  }

  changeName(newName) {
    this.name = newName
  }
  changeValue(newValue) {
    this.value = parseInt(newValue);
  }
  changeCategory(newCategory) {
    this.category = newCategory
  }
}

function VisualParameterComp({ element, state, highlightNodeFunction }) {
  const [name, changeName] = useState(element.name)
  const [value, changeValue] = useState(element.value)
  const [borderColor, setBorderColor] = useState(''); // initialize with an empty string
  const prevValueRef = useRef(element.value);

  useEffect(() => {
    if (prevValueRef.current !== element.value) {
      setBorderColor('temp-border'); // set temporary border color
      setTimeout(() => {
        setBorderColor(''); // reset border color after 1 second
      }, 500);
      prevValueRef.current = element.value
    }
  }, [state]);

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
          onChange={(event) => { element.changeName(event.target.value); changeName(event.target.value) }}
        />
        <input
          key={state}
          type="text"
          name="initialValue"
          id={element.value}
          value={element.value}
          onChange={(event) => { handleValueChange(event) }}
          className={`my-input ${borderColor}`}
        />
      </div>
    </div>
  );
}


export { VisualParameterComp, VisualParameter };
