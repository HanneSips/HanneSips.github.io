import React, { useState } from "react";
import { Controlled } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import { ReactP5Wrapper as Sketch } from "react-p5-wrapper";

function VisualPlayground() {
  const [code, setCode] = useState(`background(220);
  ellipse(width / 2, height / 2, 50, 50);
  `);

  function handleCodeChange(editor, data, value) {
    setCode(value);
  }

  const sketch = (p) => {
    p.setup = () => {
      const canvas = p.createCanvas(400, 400);
      canvas.parent("output-canvas");
    };

    p.draw = () => {
      eval(code)(p);
    };
  };

  return (
    <div id="editor" style={{ height: "100%", width: "100%" }}>
      <Controlled
        value={code}
        onBeforeChange={handleCodeChange}
        options={{
          mode: "javascript",
          theme: "material",
          lineNumbers: true,
        }}
        style={{ height: "100%", width: "100%" }}
      />
      <div>
        <Sketch sketch={sketch} />
      </div>
    </div>
  );
}

export default VisualPlayground;
