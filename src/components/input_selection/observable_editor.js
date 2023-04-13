import React, { useState, useEffect, useRef } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { Controlled } from "react-codemirror2";
import { render } from "@testing-library/react";

class Obsvable {
  constructor(number) {
    this.name = `#OBS${number}`
    this.code = `//Observable
    return rxjs.fromEvent(document, 'keydown')
      .pipe(
        rxjs.filter(event => event.code === 'ArrowUp')
        ) `
    this.highlight = 0
    this.errorMessage = ''
    this.category = 'observable'
    this.coreCategory = this.category
  }


  changeCode(newCode) {
    this.code = newCode;
  }

  changeName(newName) {
    this.name = newName
  }

  changeCategory(newCategory) {
    this.category = newCategory
  }

  newHighlight() {
    this.highlight += 1
  }

  setErrorMessage(errorMessage) {
    this.errorMessage = errorMessage
  }
}

function ObservableEditor({ element, state, highlightNodeFunction }) {
  const [code, setCode] = useState(element.code);
  const [name, setName] = useState(element.name)
  const [borderColor, setBorderColor] = useState(''); // initialize with an empty string
  const [errorMessage, setErrorMessage] = useState('')

  const previousHighlight = useRef(element.highlight);

  function checkHighlight() {
    if (previousHighlight.current !== element.highlight) {
      highlightNodeFunction(element)
      previousHighlight.current = element.highlight;
    }
  }

  function checkErrorMessage() {
    setErrorMessage(element.errorMessage)
  }

  useEffect(() => {
    checkHighlight()
    checkErrorMessage()
  }, [state]);

  return (
    <div style={{ maxWidth: "90%" }}>
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
      {(errorMessage.length > 0) && (
        <input
          type="text"
          value={errorMessage}
          className={`error-message`}
        />
      )}
    </div>
  );
}


export { ObservableEditor, Obsvable }