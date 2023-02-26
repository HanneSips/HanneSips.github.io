import React, { useState } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { Controlled } from "react-codemirror2";

class Observable {
  constructor() {
    this.code = "//Observable";
  }

  setCode(newCode) {
    this.code = newCode;
  }
}

function ObservableEditor({ observable }) {
  const [code, setCode] = useState(observable.code);

  // nu geen state code, maar indien nodig kan ik dat nog toevoegen
  return (
    <div>
      <Controlled
        value={observable.code} // hier geen state nodig zodat de Controlled zich aanpast? Ik denk het wel
        onBeforeChange={(editor, data, value) => {
          observable.setCode(value);
          setCode(observable.code)
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


export { ObservableEditor, Observable }