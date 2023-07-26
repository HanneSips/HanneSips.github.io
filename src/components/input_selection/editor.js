import { Controlled } from "react-codemirror2";
import { render } from "@testing-library/react";
import React, { useState, useEffect, useRef } from "react";
import { codeMirrorConfig } from '../visual_playground'

function Editor({ element, state, renameElement }) {
  const [code, setCode] = useState(element.code);
  const [name, setName] = useState(element.name)
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
          style={{ display: "block", width: "100%" }}
          type="text"
          value={element.name}
          onChange={(e) => { console.log("rename!!"); element.changeName(e.target.value); setName(e.target.value); renameElement([element, element.name]) }}
        />
      </div>
      <div style={{ display: "block", width: "100%", height: "85%" }}>
        <Controlled
          className="Observ"
          value={element.code}
          onBeforeChange={(editor, data, value) => {
            element.changeCode(value);
            setCode(value);
          }}
          options={codeMirrorConfig}
        />
      </div>
      {errorMessage.length > 0 && (
        <div style={{ display: "block", width: "100%" }}>
          <input type="text" value={errorMessage} className={`error-message`} style={{ width: "100%" }} />
        </div>
      )}
    </div>

  );
}

export default Editor