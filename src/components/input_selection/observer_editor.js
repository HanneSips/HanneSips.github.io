import React, { useState, useEffect, useRef } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { Controlled } from "react-codemirror2";
import * as rxjs_lib from 'rxjs';

class Observer {
  constructor(number) {
    this.name = `#OBVR${number}`
    this.code = `//Observer
    return  obs["#OBS0"].subscribe(
      () => {params["#PARAM0"] = params["#PARAM0"] + 10; }  
    )    `;
    this.highlight = 0
    this.errorMessage = ''
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
    console.log("new errorrrr: ", errorMessage)
    this.errorMessage = errorMessage
  }
}


function ObserverEditor({ element, state }) {
  console.log("state", state)
  const [code, setCode] = useState(element.code);
  const [name, setName] = useState(element.name)
  const [borderColor, setBorderColor] = useState(''); // initialize with an empty string
  const [errorMessage, setErrorMessage] = useState('')

  const previousHighlight = useRef(element.highlight);

  function checkErrorMessage() {
    console.log("check updated error observer: ", element.errorMessage)
    setErrorMessage(element.errorMessage)
    console.log(errorMessage.length)
  }

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

  useEffect(() => {
    console.log("effect observer, state: ", state)
    checkHighlight()
    checkErrorMessage()
  }, [state]);

  return (
    <div style={{maxWidth: "90%"}}>
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

export { ObserverEditor, Observer }