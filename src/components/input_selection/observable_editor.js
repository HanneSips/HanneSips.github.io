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
  }

  changeCode(newCode) {
    this.code = newCode;
  }

  changeName(newName) {
    this.name = newName
  }

  newHighlight() {
    this.highlight += 1
  }

  setErrorMessage(errorMessage) {
    console.log("new errorrrr: ", errorMessage)
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
      console.log("new state: ", state)
      setBorderColor('temp-border'); // set temporary border color
      setTimeout(() => {
        setBorderColor(''); // reset border color after 1 second
      }, 500); 
      previousHighlight.current = element.highlight;
    }
  }

  function checkErrorMessage() {
    console.log("check updated error: ", element.errorMessage)
    setErrorMessage(element.errorMessage)
    console.log(errorMessage.length)
  }

  useEffect(() => {
    checkHighlight()
    checkErrorMessage()
  }, [state]);

  return (
    <div style={{maxWidth: "90%"}}>
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