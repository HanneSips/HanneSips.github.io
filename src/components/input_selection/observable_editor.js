import React, { useState } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { Controlled } from "react-codemirror2";

class Obsvable {
  constructor() {
    this.code = `//Observable
    rxjs.fromEvent(document, 'keydown')`
      //.pipe(
       // filter(event => event.code === 'Space')
       // ) `
  }

  changeCode(newCode) {
    this.code = newCode;
  }
}

function ObservableEditor({ element }) {
  const [code, setCode] = useState(element.code);
  return (
    <div>
      <Controlled
        value={code} 
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


export { ObservableEditor, Obsvable }