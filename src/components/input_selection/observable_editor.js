import React, { useState } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { Controlled } from "react-codemirror2";

class Observable {
  constructor() {
    this.code = "//Observable";

    /* fromEvent(document, 'keydown')
      .pipe(
        filter(event => event.code === 'Space') */
  }

  setCode(newCode) {
    this.code = newCode;
  }
}

function ObservableEditor({ element }) {
  const [code, setCode] = useState(element.code);

  // nu geen state code, maar indien nodig kan ik dat nog toevoegen
  return (
    <div>
      <Controlled
        value={element.code} // hier geen state nodig zodat de Controlled zich aanpast? Ik denk het wel
        onBeforeChange={(editor, data, value) => {
          element.setCode(value);
          setCode(element.code)
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