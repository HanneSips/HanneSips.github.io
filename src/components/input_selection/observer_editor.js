import React, { useState, useEffect, useRef } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { Controlled } from "react-codemirror2";
import * as rxjs_lib from 'rxjs';

const SELECTEDFILL = "#EEEEFF"
const UNSELECTEDFILL = "#FFFFFF"
const NORMALBORDER = "#777777"
const ERRORBORDER = "#FF6666"
const HIGHLIGHTBORDER = "#FFDD77"

class Observer {
  constructor(number) {
    this.name = `#OBVR${number}`
    this.code = `//Observer
    return  obs["#OBS0"].subscribe(
      () => {params["#PARAM0"] = params["#PARAM0"] + 10; }  
    )    `;
    this.highlight = 0
    this.errorMessage = ''
    this.category = 'observer'
    this.rowNumber = number
    this.columnNumber = 1
    this.parameters = []
    this.fill = UNSELECTEDFILL
    this.border = NORMALBORDER
  }

  changeCategory(newCategory) {
    this.category = newCategory
  }

  setCode(newCode) {
    this.code = newCode;
  }

  changeCode(newCode) {
    this.code = newCode;
  }

  newHighlight() {
    this.highlight += 1
  }

  setErrorMessage(errorMessage) {
    this.errorMessage = errorMessage
  }
}


function ObserverEditor({ element, state, highlightNodeFunction }) {
  const [code, setCode] = useState(element.code);
  const [name, setName] = useState(element.name)
  const [borderColor, setBorderColor] = useState(''); // initialize with an empty string
  const [errorMessage, setErrorMessage] = useState('')

  const previousHighlight = useRef(element.highlight);

  function checkErrorMessage() {
    setErrorMessage(element.errorMessage)
  }

  function checkHighlight() {
    if (previousHighlight.current !== element.highlight) {
      setBorderColor('temp-border'); // set temporary border color
      setTimeout(() => {
        setBorderColor(''); // reset border color after 1 second
      }, 500);
      previousHighlight.current = element.highlight;
    }
  }

  useEffect(() => {
    checkHighlight()
    checkErrorMessage()
  }, [state]);

  return (
    <div style={{ maxWidth: "90%" }}>
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

export { ObserverEditor, Observer, SELECTEDFILL, UNSELECTEDFILL, ERRORBORDER, NORMALBORDER, HIGHLIGHTBORDER }