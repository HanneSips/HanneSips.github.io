import React, { useState } from 'react';

class VisualParameter {
  constructor(number) {
    this.name = `#PARAM${number}`
    this.value = "";
  }

  changeName(newName) {
    this.name = newName
  }
  changeValue(newValue) {
    this.value = parseInt(newValue);
  }
}

function VisualParameterComp({ element, state }) {
  const [name, changeName] = useState(element.name)
  const [value, changeValue] = useState(element.value)

  return (
    <div>
        <div >
          <input
            type="text"
            name="nameField"
            id={element.name}
            value={name}
            onChange={(event) => {element.changeName(event.target.value); changeName(event.target.value)}}
          />
          <input key={state}
            type="text"
            name="initialValue"
            id={element.value}
            value={element.value}
            onChange={(event) => {element.changeValue(event.target.value); changeValue(event.target.value)}}
          />
        </div>
    </div>
  );
}


export { VisualParameterComp, VisualParameter};
