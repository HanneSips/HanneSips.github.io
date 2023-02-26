import React, { useState } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { Controlled } from "react-codemirror2";


class Observer {
  constructor() {
    this.code = "//Observer";
  }

  setCode(newCode) {
    this.code = newCode;
  }
}

function ObserverEditor({ observer }) {
  const [code, setCode] = useState(observer.code);

  return (
    <div>
      <Controlled
        value={observer.code}
        onBeforeChange={(editor, data, value) => {
          observer.setCode(value);
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