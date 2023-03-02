import React, { useState } from 'react';

class VisualParameter {
  constructor(name="", changeFunction = `change${name}`, initialValue = "") {
    console.log("new par")
    this.name = name;
    this.changeFunction = changeFunction;
    this.initialValue = initialValue;
  }

  changeName(newName) {
    console.log("change name")
    this.name = newName
  }
  changeChangeFunction(newChangeFunction) {
    this.changeFunction = newChangeFunction
  }
  changeInitialValue(newInitialValue) {
    this.initialValue = newInitialValue;
  }
}

function VisualParameterComp({ element }) {
  const [name, changeName] = useState(element.name)
  const [changeFuntion, changeChangeFunction] = useState(element.changeFunction)
  const [initialValue, changeInitialValue] = useState(element.initialValue)


  return (
    <div>
        <div key={element.name}>
          <input
            type="text"
            name="name"
            id={element.name}
            value={name}
            onChange={(event) => {element.changeName(event.target.value); changeName(event.target.value)}}
          />
          <input
            type="text"
            name="changeFunction"
            id={element.changeFunction}
            value={changeFuntion}
            onChange={(event) => {element.changeChangeFunction(event.target.value); changeChangeFunction(event.target.value)}}
          />
          <input
            type="text"
            name="initialValue"
            id={element.initialValue}
            value={initialValue}
            onChange={(event) => {element.changeInitialValue(event.target.value); changeInitialValue(event.target.value)}}
          />
        </div>
    </div>
  );
}


export { VisualParameterComp, VisualParameter};
