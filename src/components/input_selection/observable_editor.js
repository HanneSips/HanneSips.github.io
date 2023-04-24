import React, { useState, useEffect, useRef } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { Controlled } from "react-codemirror2";
import { render } from "@testing-library/react";

const SELECTEDFILL = "#EEEEFF"
const UNSELECTEDFILL = "#FFFFFF"
const NORMALBORDER = "#777777"
const ERRORBORDER = "#FF6666"
const HIGHLIGHTBORDER = "#FFDD77"

class Obsvable {
  constructor(number) {
    this.name = `#OBS${number}`
    this.code = `//Observable
    return rxjs.fromEvent(document, 'keydown')
      .pipe(
        rxjs.filter(event => event.code === 'ArrowUp')
        ) `
    this.emittedValues = 0
    this.errorMessage = ''
    this.category = 'observable'
    this.rowNumber = number
    this.columnNumber = 1
    this.observers = []
    this.fill = UNSELECTEDFILL
    this.border = NORMALBORDER
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

  emitNewValue() {
    this.emittedValues += 1
  }

  setErrorMessage(errorMessage) {
    this.errorMessage = errorMessage
  }
}

function ObservableEditor({ element, state }) {
  const [code, setCode] = useState(element.code);
  const [name, setName] = useState(element.name)
  const [borderColor, setBorderColor] = useState(''); // initialize with an empty string
  const [errorMessage, setErrorMessage] = useState('')

  const previousHighlight = useRef(element.highlight);

  function checkHighlight() {
    if (previousHighlight.current !== element.highlight) {
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
    <div style={{ width: "100%", height: "100%", background: "lightgray" }}>
      <div style={{ display: "block", width: "100%" }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`my-input ${borderColor}`}
        />
      </div>
      <div style={{ display: "block", width: "100%", height: "85%" }}>
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
      {errorMessage.length > 0 && (
        <div style={{ display: "block", width: "100%" }}>
          <input type="text" value={errorMessage} className={`error-message`} />
        </div>
      )}
    </div>

  );
}


export { ObservableEditor, Obsvable, SELECTEDFILL, UNSELECTEDFILL }