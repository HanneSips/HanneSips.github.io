import React, { useState, useEffect } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { Controlled } from "react-codemirror2";
import * as rxjs_lib from 'rxjs';

class Observer {
  constructor(number) {
    this.name = `#OBVR${number}`
    this.code = `//Observer
    return  obs["#OBS0"].subscribe(
      () => {params["#PARAM0"] = params["#PARAM0"] + 10; }  
    )    `;
    this.highlight = 0
  }

  setCode(newCode) {
    this.code = newCode;
  }

  changeCode(newCode) {
    this.code = newCode;
  }

  increaseHighlight() {
    this.highlight += 1
  }
}


function ObserverEditor({ element }) {
  const [code, setCode] = useState(element.code);
  const [name, setName] = useState(element.name)
  const [borderColor, setBorderColor] = useState(''); // initialize with an empty string

  useEffect(() => {
    setBorderColor('temp-border'); // set temporary border color
    setTimeout(() => {
      setBorderColor(''); // reset border color after 1 second
    }, 1000);
  }, [element.highlight]);

  return (
    <div style={{maxWidth: "90%"}}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={`my-input ${borderColor}`}
 />
      <Controlled
        id="oberver"
        className="Observ"
        value={element.code}
        onBeforeChange={(editor, data, value) => {
          element.changeCode(value);
          setCode(value)
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

export { ObserverEditor, Observer }