import React, { useState, useEffect } from "react";
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
  }

  changeCode(newCode) {
    this.code = newCode;
  }

  changeName(newName) {
    this.name = newName
  }
}

function ObservableEditor({ element }) {
  const [code, setCode] = useState(element.code);
  const [name, setName] = useState(element.name)
  useEffect(() => {
    element.changeName(name);
  }, [name]);

  return (
    <div style={{maxWidth: "90%"}}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
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