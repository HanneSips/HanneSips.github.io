import React, { useState } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { InputSelector, InputSelectorComp } from "./input_selector";


function InputSelection() {
  const [inputSelectors, setInputSelectors] = useState([]);

  function configureNewInput() {
    const newInputSelectors = [...inputSelectors];
    newInputSelectors.push(new InputSelector(`Input ${newInputSelectors.length + 1}`));
    setInputSelectors(newInputSelectors);
  }

  return (
    <div>
      <h3>Input Selection</h3>
      <button onClick={configureNewInput}>+</button>
      {inputSelectors.map((InputSelector) => (
        <InputSelectorComp inputSelector={InputSelector}></InputSelectorComp>
      ))}
    </div>
  );
}

export default InputSelection;
