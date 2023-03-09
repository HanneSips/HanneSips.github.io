import React, { useState } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { Controlled } from "react-codemirror2";
import * as rxjs_lib from 'rxjs';

class Observer {
  constructor(number) {
    this.name = `observer_${number}`
    this.code = `//Observer
    return  obsvbls["observable_0"].subscribe(
      () => {inputs["parameter_0"] = inputs["parameter_0"] + 1; }  
    )    `;
  }

  setCode(newCode) {
    this.code = newCode;
  }

  changeCode(newCode) {
    this.code = newCode;
  }
}


function ObserverEditor({ element }) {
  const [code, setCode] = useState(element.code);
  const [name, setName] = useState(element.name)

  return (
    <div style={{maxWidth: "90%"}}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
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