import React, { useState } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { Controlled } from "react-codemirror2";
import { ObservableEditor, Observable } from "./observable_editor";
import { ObserverEditor, Observer} from "./observer_editor";

class InputSelector {
  constructor(name) {
    this.observable = new Observable()
    this.observer = new Observer()
    this.name = name
  }

  setName(newName) {
    this.name = newName
  }
}

function InputSelectorComp({ inputSelector }) {
  const [name, setName] = useState(inputSelector.name);

  return (
    <div style={{ marginBottom: '10px' }}>
      <div>
        <input 
        type="text" 
        value={inputSelector.name} 
        onChange={
          (event) => {
            inputSelector.setName(event.target.value)
            setName(event.target.value)
          }
          } style={{ width: '100%' }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ flex: 1, marginRight: "10px" }}>
          <ObservableEditor observable={inputSelector.observable} />
        </div>
        <div style={{ flex: 1, marginLeft: "10px" }}>
          <ObserverEditor observer={inputSelector.observer} />
        </div>
      </div>
    </div>
  );
}

export { InputSelector, InputSelectorComp }

/* 
document.addEventListener("keydown", handleKeyDown);
function handleKeyDown(event) {
	if (event.key === "Enter") {
        return (input1 + 1)
    }
	else return input1
} 
*/