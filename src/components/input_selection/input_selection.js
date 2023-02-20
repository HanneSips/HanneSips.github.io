import React, { useState } from "react";
import { Controlled } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";

function InputSelection() {
  const [dataStreams, setDataStreams] = useState([]);

  function configureNewInput() {
    setDataStreams((prevDataStreams) => [...prevDataStreams, { name: "", code: "" }]);
  }

  function updateName(index, name) {
    console.log("test name")
    setDataStreams((prevDataStreams) => {
      const newDataStreams = [...prevDataStreams];
      newDataStreams[index].name = name;
      return newDataStreams;
    });
  }

  function updateCode(index, code) {
    console.log("test code")
    setDataStreams((prevDataStreams) => {
      const newDataStreams = [...prevDataStreams];
      newDataStreams[index].code = code;
      return newDataStreams;
    });
  }

  return (
    <div>
      <h3>Input Selection</h3>
      <button onClick={configureNewInput}>+</button>
      {dataStreams.map((dataStream, index) => (
        <div key={index}>
          <input
            type="text"
            value={dataStream.name}
            onChange={(event) => updateName(index, event.target.value)}
          />
          <Controlled
            value={dataStream.code}
            options={{
              mode: "javascript",
              theme: "material",
              lineNumbers: true,
            }}
            onBeforeChange={(editor, data, value) => {console.log("code updated") ; updateCode(index, value); }}
          />
        </div>
      ))}
    </div>
  );
}

export default InputSelection;
