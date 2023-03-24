import React, { useState, useEffect, useRef } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { Controlled } from "react-codemirror2";

class Obsvable {
  constructor(number) {
    this.name = `#OBS${number}`
    this.code = `//Observable
    return rxjs.fromEvent(document, 'keydown')
      .pipe(
        rxjs.filter(event => event.code === 'ArrowUp')
        ) `
    this.highlight = 0
  }

  changeCode(newCode) {
    this.code = newCode;
  }

  changeName(newName) {
    this.name = newName
  }
}

function ObservableEditor({ element, state }) {
  const [code, setCode] = useState(element.code);
  const [name, setName] = useState(element.name)
  const [borderColor, setBorderColor] = useState(''); // initialize with an empty string

  const prevValueRef = useRef(state);

  useEffect(() => {
    if (prevValueRef.current !== state) {
      console.log("new state: ", state)
      setBorderColor('temp-border'); // set temporary border color
      setTimeout(() => {
        setBorderColor(''); // reset border color after 1 second
      }, 500); 
      prevValueRef.current = state;
    }
  }, [state]);

  return (
    <div style={{maxWidth: "90%"}}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={`my-input ${borderColor}`} />
      <Controlled
        className="Observ"
        value={code}
        onBeforeChange={(editor, data, value) => {
          element.changeCode(value);
          setCode(value);
        }}
        options={{
          mode: "javascript",
          theme: "material",
          lineNumbers: true,
        }}
      />
    </div>
  );
}


export { ObservableEditor, Obsvable }